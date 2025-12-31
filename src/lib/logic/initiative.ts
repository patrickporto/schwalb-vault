import type { InitiativeStyle } from '$lib/systems';

export function sortCombatants(style: InitiativeStyle, activePlayers: any[], activeEnemies: any[]): any[] {
    const enemies = activeEnemies.map(e => ({ ...e, type: 'enemy' }));

    // 1. STANDARD (Fast/Slow)
    if (style === 'standard') {
        // Logic: Fast PC -> Fast Enemy -> Slow PC -> Slow Enemy
        const fastPlayers = activePlayers.filter(c => c.initiative).map(c => ({ ...c, type: 'player', isFast: true }));
        const slowPlayers = activePlayers.filter(c => !c.initiative).map(c => ({ ...c, type: 'player', isFast: false }));

        const fastEnemies = enemies.filter(e => e.initiative).map(e => ({ ...e, isFast: true }));
        const slowEnemies = enemies.filter(e => !e.initiative).map(e => ({ ...e, isFast: false }));

        return [...fastPlayers, ...fastEnemies, ...slowPlayers, ...slowEnemies];
    }

    // 2. INDIVIDUAL (d20 + Agi)
    if (style === 'individual') {
        const all = [
            ...activePlayers.map(c => ({ ...c, type: 'player', totalInit: (c.initiativeRoll || 0) + (c.attributes?.agility || 10) - 10 })),
            ...enemies.map(e => ({ ...e, type: 'enemy', totalInit: (e.initiativeRoll || 0) + (e.attributes?.agility || 10) - 10 }))
        ];
        // Sort high to low
        return all.sort((a, b) => b.totalInit - a.totalInit);
    }

    // 3. TEAM and DLE (Default)
    // DLE: Players with Init -> Enemies -> Players without Init
    // Team: For now treating Team similar to DLE in sorting but visually different

    const playersWithInit = activePlayers.filter(c => c && c.initiative).map(c => ({ ...c, type: 'player' }));
    const playersNoInit = activePlayers.filter(c => c && !c.initiative).map(c => ({ ...c, type: 'player' }));

    const all = [...playersWithInit, ...enemies, ...playersNoInit];

    const seen = new Set();
    return all.filter(entity => {
        if (!entity) return false;
        const key = entity.type === 'player' ? entity.id : entity.instanceId;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });
}
