import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { get } from 'svelte/store';
import * as syncLogic from '$lib/logic/sync';

// Mock Trystero with proper return values
const { mockJoinRoom, mockRoom, mockSendCombat, mockSendHistory, mockSendCharUpdate, mockSendCampaign } = vi.hoisted(() => {
    const sendCombat = vi.fn();
    const getCombat = vi.fn();
    const sendHistory = vi.fn();
    const getHistory = vi.fn();
    const sendCharUpdate = vi.fn();
    const getCharUpdate = vi.fn();
    const sendCampaign = vi.fn();
    const getCampaign = vi.fn();

    const room = {
        makeAction: vi.fn((name?: string) => {
            switch (name) {
                case 'combat': return [sendCombat, getCombat];
                case 'history': return [sendHistory, getHistory];
                case 'charUpdate': return [sendCharUpdate, getCharUpdate];
                case 'campaign': return [sendCampaign, getCampaign];
                default: return [vi.fn(), vi.fn()];
            }
        }),
        onPeerJoin: vi.fn(),
        onPeerLeave: vi.fn(),
        leave: vi.fn()
    };
    return {
        mockRoom: room,
        mockJoinRoom: vi.fn(() => room),
        mockSendCombat: sendCombat,
        mockSendHistory: sendHistory,
        mockSendCharUpdate: sendCharUpdate,
        mockSendCampaign: sendCampaign
    };
});

vi.mock('trystero', () => ({
    joinRoom: mockJoinRoom,
    selfId: 'mock-self-id'
}));

// Mock Stores
vi.mock('$lib/stores/characterStore', () => ({
    character: { subscribe: vi.fn(), update: vi.fn(), set: vi.fn() },
    characterActions: { addToHistory: vi.fn() },
    isHistoryOpen: { subscribe: vi.fn() },
    damage: { set: vi.fn() },
    currentHealth: { set: vi.fn() },
    normalHealth: { set: vi.fn() }
}));

vi.mock('$lib/db', () => ({
    campaignsMap: new Map()
}));

describe('Sync Logic (Trystero Integration)', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        syncLogic.resetSyncStateForTesting();
    });

    describe('Lobby Management', () => {
        it('should join a lobby room on init', () => {
            syncLogic.joinLobby();
            expect(mockJoinRoom).toHaveBeenCalledWith(
                expect.objectContaining({ appId: 'weird-wizard-vault-lobby' }),
                'public-discovery'
            );
        });

        it('should not join lobby twice', () => {
            syncLogic.joinLobby();
            syncLogic.joinLobby();
            // joinRoom should only be called once for lobby
            const lobbyCalls = (mockJoinRoom.mock.calls as any[]).filter(
                (call: any) => call[1] === 'public-discovery'
            );
            expect(lobbyCalls.length).toBe(1);
        });
    });

    describe('Campaign Room Management', () => {
        it('should join a campaign room and setup actions', () => {
            const campaignId = 'test-campaign';

            syncLogic.joinCampaignRoom(campaignId, true, 'gm-char-id');

            expect(mockJoinRoom).toHaveBeenCalledWith(
                expect.any(Object),
                `campaign-${campaignId}`
            );

            // Check if all actions were created
            expect(mockRoom.makeAction).toHaveBeenCalledWith('combat');
            expect(mockRoom.makeAction).toHaveBeenCalledWith('history');
            expect(mockRoom.makeAction).toHaveBeenCalledWith('charUpdate');
            expect(mockRoom.makeAction).toHaveBeenCalledWith('campaign');
        });

        it('should update syncState when joining a campaign room', () => {
            const campaignId = 'test-campaign';

            syncLogic.joinCampaignRoom(campaignId, true, 'gm-char-id');

            const state = get(syncLogic.syncState);
            expect(state.roomId).toBe(campaignId);
            expect(state.isGM).toBe(true);
            expect(state.isConnected).toBe(true);
            expect(state.currentCharacterId).toBe('gm-char-id');
        });

        it('should leave old room when joining a new one', () => {
            syncLogic.joinCampaignRoom('campaign-1');
            syncLogic.joinCampaignRoom('campaign-2');

            expect(mockRoom.leave).toHaveBeenCalled();
        });

        it('should register peer join/leave handlers', () => {
            syncLogic.joinCampaignRoom('test-campaign');

            expect(mockRoom.onPeerJoin).toHaveBeenCalled();
            expect(mockRoom.onPeerLeave).toHaveBeenCalled();
        });
    });

    describe('Sync Functions', () => {
        beforeEach(() => {
            syncLogic.joinCampaignRoom('test-campaign');
        });

        it('should broadcast combat updates when syncCombat is called', () => {
            const combatData = { round: 1, active: true };
            syncLogic.syncCombat('test-campaign', combatData);

            expect(mockSendCombat).toHaveBeenCalledWith(combatData);
        });

        it('should broadcast campaign updates when syncCampaign is called', () => {
            const campaignData = { name: 'Test', gmName: 'GM', passwordHash: 'abc' };
            syncLogic.syncCampaign('test-campaign', campaignData);

            expect(mockSendCampaign).toHaveBeenCalledWith({
                name: 'Test',
                gmName: 'GM',
                passwordHash: 'abc'
            });
        });

        it('should broadcast roll data when syncRoll is called', () => {
            const rollData = { type: 'attack', result: 15 };
            syncLogic.syncRoll(rollData);

            expect(mockSendHistory).toHaveBeenCalledWith(rollData);
        });

        it('should broadcast character data when syncCharacter is called', () => {
            const charData = { id: 'char-1', name: 'Test Character' };
            syncLogic.syncCharacter(charData);

            expect(mockSendCharUpdate).toHaveBeenCalledWith(charData);
        });
    });

    describe('GM Online Status', () => {
        it('should derive isGmOnline from syncState', () => {
            // Initially no GM update
            expect(get(syncLogic.isGmOnline)).toBe(false);

            // Set a recent lastGmUpdate
            syncLogic.syncState.update(s => ({
                ...s,
                lastGmUpdate: Date.now()
            }));

            expect(get(syncLogic.isGmOnline)).toBe(true);
        });

        it('should return false if GM update is stale (> 60s)', () => {
            syncLogic.syncState.update(s => ({
                ...s,
                lastGmUpdate: Date.now() - 61000 // 61 seconds ago
            }));

            expect(get(syncLogic.isGmOnline)).toBe(false);
        });
    });

    describe('Public Campaigns', () => {
        it('should have a writable publicCampaigns store', () => {
            const initial = get(syncLogic.publicCampaigns);
            expect(Array.isArray(initial)).toBe(true);
        });
    });
});
