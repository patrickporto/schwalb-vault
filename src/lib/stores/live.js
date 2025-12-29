
import { writable } from 'svelte/store';
import { charactersMap, campaignsMap, enemiesMap, encountersMap, waitForSync } from '$lib/db';

function createLiveStore(yMap) {
    const store = writable([]);
    
    // Initial fetch
    store.set(Array.from(yMap.toJSON().values ? Object.values(yMap.toJSON()) : Array.from(yMap.values()))); 

    // Observer
    yMap.observe(() => {
        // toJSON returns an object for Map, we want an array of values usually? 
        // Or Array.from(yMap.values())
        store.set(Array.from(yMap.values()));
    });

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
    liveCharacters.set(Array.from(charactersMap.values()));
    liveCampaigns.set(Array.from(campaignsMap.values()));
    liveEnemies.set(Array.from(enemiesMap.values()));
    liveEncounters.set(Array.from(encountersMap.values()));
});
