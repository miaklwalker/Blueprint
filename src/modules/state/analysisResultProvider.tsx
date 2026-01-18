import React, {createContext, useContext, useMemo} from "react";
import {analyzeSeed} from "../ImmolateWrapper";
import {useCardStore} from "./store.ts";
import {useSeedOptionsContainer} from "./optionsProvider.tsx";
import type {SeedResultsContainer} from "../ImmolateWrapper/CardEngines/Cards.ts";


export const SeedResultContext = createContext<SeedResultsContainer | null | undefined>(null);

export function useSeedResultsContainer() {
    const context = useContext(SeedResultContext);
    if (context === undefined) {
        throw new Error("useSeedResultsContainer must be used within a SeedResultProvider");
    }
    return context;
}

export function SeedResultProvider({children}: {children: React.ReactNode}) {
    const start = useCardStore(state => state.applicationState.start);
    const analyzeState = useCardStore(state =>state.immolateState);
    const options = useSeedOptionsContainer()

    const seedResult = useMemo(()=> {
        if (!start) {
            return null;
        }
        return analyzeSeed(analyzeState, options)
    }, [analyzeState, options, start]);

    return (
        <SeedResultContext.Provider value={seedResult}>
            {children}
        </SeedResultContext.Provider>
    )


}
