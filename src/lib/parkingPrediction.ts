export function predictParkingAvailability(history: number[]): number {
    if (!history.length) return 0;
    const avg = history.reduce((sum, val) => sum + val, 0) / history.length;
    return Math.max(0, Math.floor(avg - Math.random() * 3));
}