

export function GaEvent(eventName: string) {
    // @ts-ignore gtag is injected in the header of the html file
    if (typeof window.gtag === 'function') {
        // @ts-ignore we know gtag exists
        window.gtag('event', eventName)
    }

}
