
export const parseSSDPHeaders = (raw: string): Record<string, string> => {
    const lines = raw.split("\r\n");
    const headers: Record<string, string> = {};

    for (const line of lines) {
        const index = line.indexOf(":");
        if (index === -1) continue;

        const key = line.slice(0, index).trim();
        const value = line.slice(index + 1).trim();
        headers[key] = value;
    }

    return headers;
};
