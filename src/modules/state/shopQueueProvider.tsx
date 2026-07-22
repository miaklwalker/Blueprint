import React, { createContext, useContext, useEffect, useState } from "react";
import { MAX_SHOP_QUEUE_DEPTH, analyzeSeed } from "../ImmolateWrapper";
import { useCardStore, useShopWindow } from "./store.ts";
import { useSeedResultsContainer } from "./analysisResultProvider.tsx";
import { useSeedOptionsContainer } from "./optionsProvider.tsx";

export interface ShopQueueContextValue {
    /** The selected ante's shop queue, deepened on demand when the window needs it. */
    queue: Array<any>;
    /** How many cards are available at the current depth. */
    total: number;
    /** A deeper run is in flight. */
    loading: boolean;
    /** The queue was generated past Search Depth, so it is not searchable. */
    isDeep: boolean;
}

const EMPTY: ShopQueueContextValue = { queue: [], total: 0, loading: false, isDeep: false };

export const ShopQueueContext = createContext<ShopQueueContextValue>(EMPTY);

export function useShopQueue() {
    return useContext(ShopQueueContext);
}

/**
 * Owns the shop queue for the selected ante. The analysis only generates
 * `Search Depth` cards per ante; when the shop window is moved past that, the
 * engine is re-run deep enough to cover it. Lives in a provider so the window
 * controls (settings panel) and the carousel (main view) share one source.
 */
export function ShopQueueProvider({ children }: { children: React.ReactNode }) {
    const seedResults = useSeedResultsContainer();
    const options = useSeedOptionsContainer();
    const immolateState = useCardStore(state => state.immolateState);
    const deckCards = useCardStore(state => state.deckState.cards);
    const selectedAnte = useCardStore(state => state.applicationState.selectedAnte);
    const { offset: windowOffset, size: windowSize } = useShopWindow();

    const baseQueue = seedResults?.antes?.[selectedAnte]?.queue ?? EMPTY.queue;
    const requiredDepth = Math.min(windowOffset + windowSize, MAX_SHOP_QUEUE_DEPTH);
    // Nothing to deepen until there is an analysis to deepen past.
    const needsDeepening = !!seedResults && requiredDepth > baseQueue.length;

    const [deepQueue, setDeepQueue] = useState<Array<any> | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!needsDeepening) {
            setDeepQueue(null);
            setLoading(false);
            return;
        }
        let cancelled = false;
        setLoading(true);
        // Yield a frame so the loading state paints before the synchronous
        // engine run blocks the main thread.
        const timer = setTimeout(() => {
            if (cancelled) return;
            try {
                const results = analyzeSeed(
                    {
                        ...immolateState,
                        cardsPerAnte: requiredDepth,
                        // Antes generate sequentially off a shared engine, so stopping
                        // at the selected ante gives the same cards for less work.
                        antes: Math.max(1, selectedAnte)
                    },
                    { ...options, customDeck: deckCards }
                );
                if (!cancelled) setDeepQueue(results?.antes?.[selectedAnte]?.queue ?? null);
            } catch (e) {
                console.error("Failed to deepen shop queue:", e);
                if (!cancelled) setDeepQueue(null);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }, 0);
        return () => {
            cancelled = true;
            clearTimeout(timer);
        };
    }, [needsDeepening, requiredDepth, selectedAnte, immolateState, options, deckCards]);

    // Fall back to the base queue while a deeper run is in flight.
    const queue = deepQueue && deepQueue.length >= baseQueue.length ? deepQueue : baseQueue;

    return (
        <ShopQueueContext.Provider value={{ queue, total: queue.length, loading, isDeep: queue !== baseQueue }}>
            {children}
        </ShopQueueContext.Provider>
    )
}
