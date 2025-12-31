import { describe, it, expect } from 'vitest';
import { sortCombatants } from './initiative';
import type { InitiativeStyle } from '$lib/systems';

describe('Initiative Logic', () => {
    const players = [
        { id: 'p1', name: 'Player 1', initiative: true, initiativeRoll: 10, attributes: { agility: 12 } }, // Fast / Init 12
        { id: 'p2', name: 'Player 2', initiative: false, initiativeRoll: 15, attributes: { agility: 10 } } // Slow / Init 15
    ];

    const enemies = [
        { instanceId: 'e1', name: 'Enemy 1', initiative: true, initiativeRoll: 5, attributes: { agility: 8 } }, // Fast / Init 3
        { instanceId: 'e2', name: 'Enemy 2', initiative: false, initiativeRoll: 20, attributes: { agility: 10 } } // Slow / Init 20
    ];

    it('should sort STANDARD style correctly (Fast PC > Fast NPC > Slow PC > Slow NPC)', () => {
        const sorted = sortCombatants('standard', players, enemies);

        expect(sorted[0].id).toBe('p1'); // Fast Player
        expect(sorted[1].instanceId).toBe('e1'); // Fast Enemy
        expect(sorted[2].id).toBe('p2'); // Slow Player
        expect(sorted[3].instanceId).toBe('e2'); // Slow Enemy
        expect(sorted[0].isFast).toBe(true);
        expect(sorted[2].isFast).toBe(false);
    });

    it('should sort INDIVIDUAL style correctly (d20 + Agi)', () => {
        const sorted = sortCombatants('individual', players, enemies);

        // p1: 10 + 12 - 10 = 12
        // p2: 15 + 10 - 10 = 15
        // e1: 5 + 8 - 10 = 3
        // e2: 20 + 10 - 10 = 20

        // Expected: e2 (20) > p2 (15) > p1 (12) > e1 (3)
        expect(sorted[0].instanceId).toBe('e2');
        expect(sorted[1].id).toBe('p2');
        expect(sorted[2].id).toBe('p1');
        expect(sorted[3].instanceId).toBe('e1');
    });

    it('should sort DLE style correctly', () => {
         const sorted = sortCombatants('dle', players, enemies);
         // DLE/Team: Players w/ Init -> Enemies -> Players w/o Init
         // p1 (Init true) > All Enemies > p2 (Init false)

         const p1Index = sorted.findIndex(x => x.id === 'p1');
         const p2Index = sorted.findIndex(x => x.id === 'p2');
         const e1Index = sorted.findIndex(x => x.instanceId === 'e1');
         const e2Index = sorted.findIndex(x => x.instanceId === 'e2');

         expect(p1Index).toBeLessThan(e1Index);
         expect(p1Index).toBeLessThan(e2Index);
         expect(e1Index).toBeLessThan(p2Index);
         expect(e2Index).toBeLessThan(p2Index);
    });
});
