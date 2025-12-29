import { describe, it, expect, beforeEach } from 'vitest';
import { get } from 'svelte/store';
import { damage, currentHealth, normalHealth, damagePercentage, isInjured, isIncapacitated, effectiveMaxHealth } from './characterStore';

describe('Health Bar Logic', () => {
    beforeEach(() => {
        // Reset health stores to default values
        normalHealth.set(24);
        currentHealth.set(24);
        damage.set(0);
    });

    describe('effectiveMaxHealth', () => {
        // REGRESSION TEST: effectiveMaxHealth should use currentHealth as base, not normalHealth
        it('should be based on currentHealth, not normalHealth (REGRESSION)', () => {
            normalHealth.set(24);
            currentHealth.set(12); // Current health reduced from normal

            // effectiveMaxHealth should be based on currentHealth (12), not normalHealth (24)
            expect(get(effectiveMaxHealth)).toBe(12);
        });

        it('should equal currentHealth when no effects are active', () => {
            currentHealth.set(20);
            expect(get(effectiveMaxHealth)).toBe(20);
        });

        it('should update when currentHealth changes', () => {
            currentHealth.set(30);
            expect(get(effectiveMaxHealth)).toBe(30);

            currentHealth.set(15);
            expect(get(effectiveMaxHealth)).toBe(15);
        });
    });

    describe('damagePercentage', () => {
        it('should be 0% when damage is 0', () => {
            damage.set(0);
            currentHealth.set(24);
            expect(get(damagePercentage)).toBe(0);
        });

        it('should be 50% when damage is half of currentHealth', () => {
            currentHealth.set(20);
            damage.set(10);
            expect(get(damagePercentage)).toBe(50);
        });

        it('should be 100% when damage equals currentHealth', () => {
            currentHealth.set(20);
            damage.set(20);
            expect(get(damagePercentage)).toBe(100);
        });

        it('should cap at 100% even if damage exceeds currentHealth', () => {
            currentHealth.set(20);
            damage.set(30);
            expect(get(damagePercentage)).toBe(100);
        });

        // REGRESSION TEST: damagePercentage should use currentHealth, not normalHealth or effectiveMaxHealth
        it('should use currentHealth as the max, not normalHealth (REGRESSION)', () => {
            normalHealth.set(24);
            currentHealth.set(12); // Current health is lower than normal
            damage.set(6);
            
            // If using currentHealth as max: 6/12 = 50%
            // If using normalHealth as max (BUG): 6/24 = 25%
            expect(get(damagePercentage)).toBe(50);
        });

        it('should return 100% when currentHealth is 0 (avoid division by zero)', () => {
            currentHealth.set(0);
            damage.set(5);
            expect(get(damagePercentage)).toBe(100);
        });
    });

    describe('isInjured', () => {
        it('should be false when damage is 0', () => {
            currentHealth.set(20);
            damage.set(0);
            expect(get(isInjured)).toBe(false);
        });

        it('should be true when damage is >= 50% of currentHealth but not incapacitated', () => {
            currentHealth.set(20);
            damage.set(10);
            expect(get(isInjured)).toBe(true);
        });

        it('should be false when incapacitated (damage >= currentHealth)', () => {
            currentHealth.set(20);
            damage.set(20);
            expect(get(isInjured)).toBe(false);
        });
    });

    describe('isIncapacitated', () => {
        it('should be false when damage < currentHealth', () => {
            currentHealth.set(20);
            damage.set(19);
            expect(get(isIncapacitated)).toBe(false);
        });

        it('should be true when damage >= currentHealth', () => {
            currentHealth.set(20);
            damage.set(20);
            expect(get(isIncapacitated)).toBe(true);
        });
    });
});
