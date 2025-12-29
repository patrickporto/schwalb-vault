
import { writable } from 'svelte/store';
import { charactersMap, campaignsMap, enemiesMap, encountersMap, waitForSync } from '$lib/db';

function createLiveStore(yMap) {
    const store = writable([]);
    
    const update = () => {
        // Ensure we only have objects with valid IDs and no duplicates
        const values = Array.from(yMap.values()).filter(v => v && v.id);
        const unique = Array.from(new Map(values.map(v => [v.id, v])).values());
        store.set(unique);
    };

    // Initial fetch
    update();

    // Observer
    yMap.observe(update);

    return store;
}

// We might need to wait for sync before the initial set is accurate, 
// but the observe will catch updates after sync.

export const liveCharacters = createLiveStore(charactersMap);
export const liveCampaigns = createLiveStore(campaignsMap);
export const liveEnemies = createLiveStore(enemiesMap);
export const liveEncounters = createLiveStore(encountersMap);

// Ensure we update once synced (just in case)
waitForSync().then(() => {
    // Re-trigger updates to catch synced data
    [charactersMap, campaignsMap, enemiesMap, encountersMap].forEach(m => {
        const values = Array.from(m.values()).filter(v => v && v.id);
        const unique = Array.from(new Map(values.map(v => [v.id, v])).values());
        // Find which store it belongs to (a bit hacky but works for the init)
        if (m === charactersMap) liveCharacters.set(unique);
        if (m === campaignsMap) liveCampaigns.set(unique);
        if (m === enemiesMap) liveEnemies.set(unique);
        if (m === encountersMap) liveEncounters.set(unique);
    });
});
