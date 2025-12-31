import { describe, it, expect, beforeEach } from 'vitest';
import { get } from 'svelte/store';
import { sotdlCharacter, sotdlCharacterActions, sotdlModifiers, sotdlCurrentHealth, sotdlIsInjured, sotdlIsIncapacitated, defaultSotDLCharacter } from './characterStoreSotDL';

describe('SotDL Character Store', () => {
    beforeEach(() => {
        sotdlCharacter.set(JSON.parse(JSON.stringify(defaultSotDLCharacter)));
    });

    it('should calculate modifiers correctly', () => {
        // Default 10 = +0
        let mods = get(sotdlModifiers);
        expect(mods.strength).toBe(0);

        sotdlCharacterActions.updateAttribute('strength', 12); // +2
        sotdlCharacterActions.updateAttribute('agility', 9);   // -1

        mods = get(sotdlModifiers);
        expect(mods.strength).toBe(2);
        expect(mods.agility).toBe(-1);
    });

    it('should handle damage and health status', () => {
        // Max Health 10
        expect(get(sotdlCurrentHealth)).toBe(10);
        expect(get(sotdlIsInjured)).toBe(false);

        sotdlCharacterActions.takeDamage(4);
        expect(get(sotdlCharacter).damage).toBe(4);
        expect(get(sotdlCurrentHealth)).toBe(6);
        expect(get(sotdlIsInjured)).toBe(false); // < 5

        sotdlCharacterActions.takeDamage(1); // Total 5
        expect(get(sotdlIsInjured)).toBe(true); // >= 10/2

        sotdlCharacterActions.takeDamage(5); // Total 10
        expect(get(sotdlIsIncapacitated)).toBe(true); // >= Health

        sotdlCharacterActions.heal(5);
        expect(get(sotdlCharacter).damage).toBe(5);
        expect(get(sotdlIsIncapacitated)).toBe(false);
    });

    it('should overflow healing correctly', () => {
        sotdlCharacterActions.takeDamage(5);
        sotdlCharacterActions.heal(10); // Heal more than damage
        expect(get(sotdlCharacter).damage).toBe(0);
    });

    it('should cap damage at max health (optional rule but common)', () => {
         // Current implementation caps damage at health in takeDamage? checking...
         // "const newDamage = Math.max(0, Math.min(c.health, c.damage + amount));" -> YES.

         sotdlCharacterActions.takeDamage(20);
         expect(get(sotdlCharacter).damage).toBe(10);
         expect(get(sotdlIsIncapacitated)).toBe(true);
    });

    it('should update insanity and corruption', () => {
        sotdlCharacterActions.updateStat('insanity', 3);
        expect(get(sotdlCharacter).insanity).toBe(3);

        sotdlCharacterActions.updateStat('corruption', 1);
        expect(get(sotdlCharacter).corruption).toBe(1);
    });
});
