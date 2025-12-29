
import SparkMD5 from 'spark-md5';
import { imagesMap } from '$lib/db';

const MAX_SIZE_MB = 5;

export async function saveImage(file: Blob): Promise<string> {
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        throw new Error(`Imagem muito grande. Máximo de ${MAX_SIZE_MB}MB.`);
    }

    const buffer = await file.arrayBuffer();
    const hash = SparkMD5.ArrayBuffer.hash(buffer);
    
    // Check if exists to avoid write
    if (imagesMap.has(hash)) {
        return hash;
    }

    // Convert to base64
    const reader = new FileReader();
    const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
    
    const base64 = await base64Promise;
    imagesMap.set(hash, base64);
    
    return hash;
}

export function getImage(hash: string): string | undefined {
    if (!hash) return undefined;
    return imagesMap.get(hash) as string | undefined;
}

export function subscribeToImage(hash: string, callback: (data: string | undefined) => void): () => void {
    if (!hash) {
        callback(undefined);
        return () => {};
    }
    
    // Initial value
    callback(imagesMap.get(hash) as string);
    
    // Observer
    const observer = (event: any) => {
        // We could optimize to check if the specific key changed, but for now simple get is fine
        // Yjs observe events are complex, filtering by key is better done by just checking value
        // But imagesMap usually doesn't update existing keys often (immutable by hash essentially)
        // So main case is "image arrived".
        const val = imagesMap.get(hash) as string;
        callback(val);
    };
    
    imagesMap.observe(observer);
    
    return () => {
        imagesMap.unobserve(observer);
    };
}
