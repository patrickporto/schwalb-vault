import { render, screen } from '@testing-library/svelte';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import CampaignHeader from './CampaignHeader.svelte';
import { syncState } from '$lib/logic/sync';
import { get } from 'svelte/store';

// Mock svelte-i18n
vi.mock('svelte-i18n', () => ({
    t: {
        subscribe: (fn: (val: (key: string, props?: any) => string) => void) => {
            fn((key: string, props?: any) => {
                if (key === 'common.status.peers' && props && props.count !== undefined) {
                    return `Peers: ${props.count}`;
                }
                if (key === 'common.status.connected') return 'Connected';
                if (key === 'common.status.offline') return 'Offline';
                return key;
            });
            return () => { };
        }
    }
}));

// Mock stores
vi.mock('$lib/stores/characterStore', () => ({
    isHistoryOpen: {
        subscribe: (fn: any) => {
            fn(false);
            return () => { };
        },
        update: vi.fn(),
        set: vi.fn()
    },
    rollHistory: {
        subscribe: (fn: any) => {
            fn([]);
            return () => { };
        }
    }
}));

// Mock navigation
vi.mock('$app/navigation', () => ({
    goto: vi.fn()
}));

vi.mock('$lib/logic/sync', () => {
    const { writable } = require('svelte/store');
    return {
        syncState: writable({
            roomId: null,
            peers: [],
            currentCharacterId: null,
            lastGmUpdate: 0,
            isGM: false,
            isConnected: false
        })
    };
});

vi.mock('$app/paths', () => ({
    resolve: (path: string) => path
}));

describe('CampaignHeader', () => {
    beforeEach(() => {
        syncState.set({
            roomId: null,
            peers: [],
            currentCharacterId: null,
            lastGmUpdate: 0,
            isGM: false,
            isConnected: false
        });
    });

    it('renders offline status when not connected', () => {
        const { debug } = render(CampaignHeader, { campaignName: 'Test Campaign' });
        // debug();

        const status = screen.getByTitle('Offline');
        expect(status).toBeInTheDocument();
    });

    it('renders connected status when connected', async () => {
        syncState.update(s => ({ ...s, isConnected: true }));
        const { debug } = render(CampaignHeader, { campaignName: 'Test Campaign' });
        // debug();

        const status = screen.getByTitle('Connected');
        expect(status).toBeInTheDocument();
    });

    it('renders peer count when connected and peers exist', async () => {
        syncState.update(s => ({
            ...s,
            isConnected: true,
            peers: ['peer1', 'peer2']
        }));

        render(CampaignHeader, { campaignName: 'Test Campaign' });

        const status = screen.getByTitle('Connected');
        expect(status).toBeInTheDocument();

        const peers = screen.getByTitle('Peers: 2');
        expect(peers).toBeInTheDocument();
        expect(peers).toHaveTextContent('2');
    });
});
