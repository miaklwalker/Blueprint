import React, { createContext, useContext, useMemo } from "react";
import { analyzeSeed } from "../ImmolateWrapper";
import { useCardStore } from "./store.ts";
import { useSeedOptionsContainer } from "./optionsProvider.tsx";
import type { SeedResultsContainer } from "../ImmolateWrapper/CardEngines/Cards.ts";


export const SeedResultContext = createContext<SeedResultsContainer | null | undefined>(null);

export function useSeedResultsContainer() {
    const context = useContext(SeedResultContext);
    console.log(context)
    if (context === null) {
        throw new Error("useSeedResultsContainer must be used within a SeedResultProvider");
    }
    return context;
}

export function SeedResultProvider({ children }: { children: React.ReactNode }) {
    const start = useCardStore(state => state.applicationState.start);
    const analyzeState = useCardStore(state => state.immolateState);
    const deckState = useCardStore(state => state.deckState);
    const options = useSeedOptionsContainer()

    const seedResult = useMemo(() => {
        if (!start) {
            return undefined;
        }
        return analyzeSeed(analyzeState, {
            ...options,
            customDeck: deckState.cards
        })
    }, [analyzeState, deckState.cards, options, start]);

    return (
        <SeedResultContext.Provider value={seedResult}>
            {children}
        </SeedResultContext.Provider>
    )


}
