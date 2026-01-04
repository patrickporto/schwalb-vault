// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { calculateDiceRoll, evaluateDiceFormula, buildVisualIconNotation } from './dice';

describe('Dice Logic', () => {
    it('should roll basic d20', () => {
        const result = calculateDiceRoll(20, 1, 0);
        expect(result.results.length).toBe(1);
        expect(result.results[0]).toBeGreaterThanOrEqual(1);
        expect(result.results[0]).toBeLessThanOrEqual(20);
        expect(result.total).toBe(result.results[0]);
    });

    it('should apply boons on d20', () => {
        // Mock math.random? Or check constraints.
        // modifier +1 means 1d6 boon.
        // total = d20 + d6.
        const result = calculateDiceRoll(20, 1, 1);
        expect(result.bonusRolls.length).toBe(1);
        expect(result.modifierTotal).toBeGreaterThanOrEqual(1);
        expect(result.modifierTotal).toBeLessThanOrEqual(6);
        expect(result.total).toBe(result.results[0] + result.modifierTotal);
        expect(result.formula).toContain('[Boon]');
    });

    it('should apply banes on d20', () => {
        const result = calculateDiceRoll(20, 1, -1);
        expect(result.bonusRolls.length).toBe(1);
        expect(result.modifierTotal).toBeLessThanOrEqual(-1);
        expect(result.modifierTotal).toBeGreaterThanOrEqual(-6);
        expect(result.total).toBe(result.results[0] + result.modifierTotal);
        expect(result.formula).toContain('[Bane]');
    });

    it('should apply flat modifier on non-d20', () => {
        const result = calculateDiceRoll(6, 2, 2);
        // 2d6 + 2
        expect(result.results.length).toBe(2);
        expect(result.modifierTotal).toBe(2);
        expect(result.total).toBe(result.results.reduce((a, b) => a + b, 0) + 2);
        expect(result.formula).not.toContain('Boon');
    });

    it('should handle multiple boons (take highest)', () => {
        // Use a loop to try to hit a case where rolls differ if possible, but statistically checks are fine for now.
        const result = calculateDiceRoll(20, 1, 3);
        expect(result.bonusRolls.length).toBe(3);
        const max = Math.max(...result.bonusRolls);
        expect(result.modifierTotal).toBe(max);
    });

    describe('Formula Evaluation', () => {
        it('should evaluate simple dice', () => {
            const result = evaluateDiceFormula('1d6');
            expect(result.results.length).toBe(1);
            expect(result.total).toBeGreaterThanOrEqual(1);
            expect(result.total).toBeLessThanOrEqual(6);
        });

        it('should evaluate addition', () => {
            const result = evaluateDiceFormula('1d4 + 2');
            expect(result.total).toBeGreaterThanOrEqual(3);
            expect(result.total).toBeLessThanOrEqual(6);
        });

        it('should evaluate mixed dice', () => {
            const result = evaluateDiceFormula('1d6 + 1d4');
            expect(result.results.length).toBe(2);
            expect(result.total).toBeGreaterThanOrEqual(2);
            expect(result.total).toBeLessThanOrEqual(10);
        });

        it('should evaluate subtraction', () => {
            const result = evaluateDiceFormula('1d1 - 5');
            expect(result.total).toBe(-4);
        });

        it('should handle demon lord 1d3', () => {
            const result = evaluateDiceFormula('1d3');
            expect(result.total).toBeGreaterThanOrEqual(1);
            expect(result.total).toBeLessThanOrEqual(3);
        });
    });
});

describe('Visual Notation Builder', () => {
    it('should build notation for d20 with boons', () => {
        const res: any = {
            total: 0, results: [15], bonusRolls: [6, 2], modifierTotal: 6, formula: "", crit: false,
            dice: [{ sides: 20, count: 1, results: [15] }]
        };
        const notation = buildVisualIconNotation(res, 2);
        // Format: 1d20+1d6[boon]+1d6[boon]@15,6,2
        expect(notation).toBe('1d20+1d6[boon]+1d6[boon]@15,6,2');
    });

    it('should fallback d3 to d6', () => {
        const res: any = {
            total: 0, results: [], bonusRolls: [], modifierTotal: 0, formula: "", crit: false,
            dice: [{ sides: 3, count: 2, results: [1, 3] }]
        };
        const notation = buildVisualIconNotation(res, 0);
        expect(notation).toBe('1d6+1d6@1,3');
    });

    it('should apply banes notation', () => {
        const res: any = {
            total: 0, results: [10], bonusRolls: [4], modifierTotal: -4, formula: "", crit: false,
            dice: [{ sides: 20, count: 1, results: [10] }]
        };
        const notation = buildVisualIconNotation(res, -1);
        expect(notation).toBe('1d20+1d6[bane]@10,4');
    });

    it('should return detailed dice structure from calculateDiceRoll', () => {
        const result = calculateDiceRoll(6, 2, 0);
        expect(result.dice).toBeDefined();
        expect(result.dice![0].sides).toBe(6);
        expect(result.dice![0].count).toBe(2);
        expect(result.dice![0].results.length).toBe(2);
    });
});
