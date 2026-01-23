export const encodeCredential = (text) => {
    if (typeof text !== 'string') {
        text = String(text ?? '');
    }

    if (typeof btoa === 'function' && typeof TextEncoder === 'function') {
        const encoder = new TextEncoder();              // UTF-8
        const bytes = encoder.encode(text);             // Uint8Array
        let binary = '';
        for (let i = 0; i < bytes.length; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary); // Base64
    }

    if (typeof globalThis !== 'undefined' && globalThis.Buffer) {
        return globalThis.Buffer.from(text, 'utf-8').toString('base64');
    }

    throw new Error('Base64 encoding is not supported in this environment.');
};
