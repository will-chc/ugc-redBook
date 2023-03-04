export function throttle<T extends (...args: any[]) => void>(func: T, wait: number): T {
    let timer: ReturnType<typeof setTimeout> | null = null;
    return function (this: any, ...args: any[]) {
        if (!timer) {
            timer = setTimeout(() => {
                func.apply(this, args);
                timer = null;
            }, wait);
        }
    } as T;
}