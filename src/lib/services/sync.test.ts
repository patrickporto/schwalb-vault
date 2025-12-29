import { describe, it, expect, vi, beforeEach } from 'vitest';
import { get } from 'svelte/store';
import * as syncLogic from '$lib/logic/sync';

// Mock Trystero
const { mockJoinRoom, mockRoom } = vi.hoisted(() => {
    const room = {
        makeAction: vi.fn(() => [vi.fn(), vi.fn()]),
        onPeerJoin: vi.fn(),
        onPeerLeave: vi.fn(),
        leave: vi.fn()
    };
    return {
        mockRoom: room,
        mockJoinRoom: vi.fn(() => room)
    };
});

vi.mock('trystero', () => ({
    joinRoom: mockJoinRoom,
    selfId: 'mock-self-id'
}));

// Mock Stores
vi.mock('$lib/stores/characterStore', () => ({
    character: { subscribe: vi.fn(), update: vi.fn() },
    characterActions: { addToHistory: vi.fn() },
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

    it('should join a lobby room on init', () => {
        // joinLobby is called internally or explicitly
        syncLogic.joinLobby();
        expect(mockJoinRoom).toHaveBeenCalledWith(
            expect.objectContaining({ appId: 'weird-wizard-vault-lobby' }),
            'public-discovery'
        );
    });

    it('should join a campaign room and setup actions', () => {
        const campaignId = 'test-campaign';
        const sendCombat = vi.fn();
        const getCombat = vi.fn();

        // Mock makeAction returns [send, get]
        mockRoom.makeAction.mockReturnValue([sendCombat, getCombat]);

        syncLogic.joinCampaignRoom(campaignId, true, 'gm-char-id');

        expect(mockJoinRoom).toHaveBeenCalledWith(
            expect.any(Object),
            `campaign-${campaignId}`
        );

        // Check if actions were created
        expect(mockRoom.makeAction).toHaveBeenCalledWith('combat');
        expect(mockRoom.makeAction).toHaveBeenCalledWith('history');
        expect(mockRoom.makeAction).toHaveBeenCalledWith('charUpdate');
        expect(mockRoom.makeAction).toHaveBeenCalledWith('campaign');

        // Check state update
        const state = get(syncLogic.syncState);
        expect(state.roomId).toBe(campaignId);
        expect(state.isGM).toBe(true);
        expect(state.isConnected).toBe(true);
    });

    it('should broadcast combat updates when syncCombat is called', () => {
        const sendCombat = vi.fn();
        mockRoom.makeAction.mockImplementation((name: string) => {
            if (name === 'combat') return [sendCombat, vi.fn()];
            return [vi.fn(), vi.fn()];
        });

        syncLogic.joinCampaignRoom('test-campaign');

        const combatData = { round: 1, active: true };
        syncLogic.syncCombat('test-campaign', combatData);

        expect(sendCombat).toHaveBeenCalledWith(combatData);
    });
});
