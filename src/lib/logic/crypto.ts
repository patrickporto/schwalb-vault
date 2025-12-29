export async function hashPassword(password: string): Promise<string> {
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
        'raw', 
        encoder.encode(password), 
        { name: 'PBKDF2' }, 
        false, 
        ['deriveBits']
    );
    const derivedBits = await crypto.subtle.deriveBits(
        {
            name: 'PBKDF2',
            salt: salt,
            iterations: 100000,
            hash: 'SHA-256'
        },
        key,
        256
    );
    
    const saltHex = Array.from(salt).map(b => b.toString(16).padStart(2, '0')).join('');
    const hashHex = Array.from(new Uint8Array(derivedBits)).map(b => b.toString(16).padStart(2, '0')).join('');
    return `${saltHex}:${hashHex}`;
}

export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
    const parts = storedHash.split(':');
    if (parts.length !== 2) return false;
    
    const [saltHex, hashHex] = parts;
    const saltMatch = saltHex.match(/.{1,2}/g);
    if (!saltMatch) return false;
    
    const salt = new Uint8Array(saltMatch.map(byte => parseInt(byte, 16)));
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
        'raw', 
        encoder.encode(password), 
        { name: 'PBKDF2' }, 
        false, 
        ['deriveBits']
    );
    const derivedBits = await crypto.subtle.deriveBits(
        {
            name: 'PBKDF2',
            salt: salt,
            iterations: 100000,
            hash: 'SHA-256'
        },
        key,
        256
    );
    
    const computedHashHex = Array.from(new Uint8Array(derivedBits)).map(b => b.toString(16).padStart(2, '0')).join('');
    return computedHashHex === hashHex;
}
