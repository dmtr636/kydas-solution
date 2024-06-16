export function throttle<T extends (...args: any[]) => any>(
    func: T,
    delay: number,
): (...args: Parameters<T>) => void {
    let lastCall = 0;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    return function (...args: Parameters<T>): void {
        const now = new Date().getTime();

        if (lastCall && now < lastCall + delay) {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            timeoutId = setTimeout(
                () => {
                    lastCall = now;
                    func(...args);
                },
                delay - (now - lastCall),
            );
        } else {
            lastCall = now;
            func(...args);
        }
    };
}
