import { describe, it, expect } from 'vitest';
import { Parser } from 'expr-eval';

// Mock logic to simulate characterStore behavior
function evaluateModifierValue(value, character) {
    if (typeof value === 'number') return value;
    if (!value || typeof value !== 'string') return 0;
    if (!isNaN(Number(value))) return Number(value);

    try {
        const parser = new Parser();

        // 1. Build context
        const context = {};
        if (character.attributes) {
            character.attributes.forEach(attr => {
                context[attr.key] = attr.value;
            });
        }
        // Additional useful values
        context['level'] = character.level || 0;

        // 2. Pre-process expression: replace @key with key
        // Limitation: might replace inside strings but simple enough for this use case
        const expression = value.replace(/@(\w+)/g, '$1');

        // 3. Evaluate
        return parser.evaluate(expression, context);
    } catch (e) {
        // console.error("Expression error:", e);
        return 0;
    }
}

describe('Active Effects Expression Evaluation', () => {
    const mockCharacter = {
        level: 5,
        attributes: [
            { key: 'str', value: 12 },
            { key: 'agi', value: 14 },
            { key: 'int', value: 10 },
            { key: 'wil', value: 8 }
        ]
    };

    it('should return number for numeric input', () => {
        expect(evaluateModifierValue(5, mockCharacter)).toBe(5);
        expect(evaluateModifierValue('5', mockCharacter)).toBe(5);
        expect(evaluateModifierValue('10.5', mockCharacter)).toBe(10.5);
    });

    it('should evaluate simple attribute reference with @', () => {
        expect(evaluateModifierValue('@str', mockCharacter)).toBe(12);
        expect(evaluateModifierValue('@agi', mockCharacter)).toBe(14);
    });

    it('should evaluate basic arithmetic', () => {
        expect(evaluateModifierValue('1 + 2', mockCharacter)).toBe(3);
        expect(evaluateModifierValue('@str + 2', mockCharacter)).toBe(14); // 12 + 2
        expect(evaluateModifierValue('@str + @agi', mockCharacter)).toBe(26); // 12 + 14
        expect(evaluateModifierValue('(@str - 10) * 2', mockCharacter)).toBe(4); // (12-10)*2 = 4
    });

    it('should handle level', () => {
        expect(evaluateModifierValue('@level', mockCharacter)).toBe(5);
    });

    it('should return 0 on invalid expression or missing attribute', () => {
        expect(evaluateModifierValue('@invalidAttr', mockCharacter)).toBe(0); // Undefined variable in expr-eval usually throws
        expect(evaluateModifierValue('invalid + 5', mockCharacter)).toBe(0);
    });

    it('should handle division and floor/ceil if supported or float results', () => {
        expect(evaluateModifierValue('@str / 2', mockCharacter)).toBe(6);
        expect(evaluateModifierValue('@agi / 4', mockCharacter)).toBe(3.5);
    });
});
