import FingerprintJS from '@fingerprintjs/fingerprintjs';

let fpPromise: Promise<any> | null = null;
let cachedVisitorId: string | null = null;

// Initialize the agent at application startup.
if (typeof window !== 'undefined') {
    fpPromise = FingerprintJS.load();
}

/**
 * Get the visitor identifier (fingerprint) for this browser.
 * Caches the result after the first call.
 */
export async function getBrowserFingerprint(): Promise<string> {
    if (cachedVisitorId) return cachedVisitorId;

    try {
        if (!fpPromise) {
             fpPromise = FingerprintJS.load();
        }
        const fp = await fpPromise;
        const result = await fp.get();
        cachedVisitorId = result.visitorId;
        return cachedVisitorId;
    } catch (e) {
        console.error('Failed to generate fingerprint:', e);
        // Fallback to a random ID if fingerprint fails, stored in session to be consistent per session at least
        const fallback = sessionStorage.getItem('fallback_device_id') || crypto.randomUUID();
        sessionStorage.setItem('fallback_device_id', fallback);
        return fallback;
    }
}
