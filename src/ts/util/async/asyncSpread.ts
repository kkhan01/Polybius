export const asyncSpread = async function<T>(delegate: AsyncIterable<T>): Promise<T[]> {
    const a: T[] = [];
    for await (const t of delegate) {
        a.push(t);
    }
    return a;
};