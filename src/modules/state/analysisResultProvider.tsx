import React, {createContext, useContext, useEffect, useState, useTransition} from "react";
import {analyzeSeed} from "../ImmolateWrapper";
import {useCardStore} from "./store.ts";
import {useSeedOptionsContainer} from "./optionsProvider.tsx";
import { SeedResultsContainer } from "../ImmolateWrapper/CardEngines/Cards.ts";


export const SeedResultContext = createContext<SeedResultsContainer | null | undefined>(null);
export const SeedResultLoadingContext = createContext<boolean>(false);

export function useSeedResultsContainer() {
    const context = useContext(SeedResultContext);
    if (context === undefined) {
        throw new Error("useSeedResultsContainer must be used within a SeedResultProvider");
    }
    return context;
}

export function useSeedResultsLoading() {
    return useContext(SeedResultLoadingContext);
}

export function SeedResultProvider({children}: {children: React.ReactNode}) {
    const start = useCardStore(state => state.applicationState.start);
    const analyzeState = useCardStore(state => state.immolateState);
    const options = useSeedOptionsContainer()

    const [seedResult, setSeedResult] = useState<SeedResultsContainer | null>(null);
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        if (!start || !analyzeState.seed) {
            setSeedResult(null);
            return;
        }

        startTransition(() => {
            try {
                const result = analyzeSeed(analyzeState, options);
                if (result) result.isLoading = false;
                setSeedResult(result ?? null);
            } catch (error) {
                console.error('Failed to analyze seed:', error);
                setSeedResult(null);
            }
        });
    }, [start, analyzeState, options]);

    return (
        <SeedResultContext.Provider value={seedResult}>
            <SeedResultLoadingContext.Provider value={isPending || false}>
                {children}
            </SeedResultLoadingContext.Provider>
        </SeedResultContext.Provider>
    )


}