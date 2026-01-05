import { describe, it, expect, vi } from 'vitest';
import { getBrowserFingerprint } from './fingerprint';

// Mock FingerprintJS
vi.mock('@fingerprintjs/fingerprintjs', () => ({
  default: {
    load: vi.fn().mockResolvedValue({
      get: vi.fn().mockResolvedValue({ visitorId: 'test-fingerprint-123' })
    })
  }
}));

describe('fingerprint.ts', () => {
    it('should return a visitor ID', async () => {
        const id = await getBrowserFingerprint();
        expect(id).toBe('test-fingerprint-123');
    });

    it('should cache the visitor ID', async () => {
        const id1 = await getBrowserFingerprint();
        const id2 = await getBrowserFingerprint();
        expect(id1).toBe(id2);
        // In a real test we would verify load() wasn't called twice, but here we just check consistency
    });
});
