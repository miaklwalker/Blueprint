

export function useGA(eventName: string) {
    // @ts-ignore
    if (typeof window.gtag === 'function') {
        // @ts-ignore
        window.gtag('event', eventName)
    }

}
