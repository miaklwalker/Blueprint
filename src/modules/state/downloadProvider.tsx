import React, {createContext, useCallback, useContext} from "react";
import {useCardStore} from "./store.ts";
import {useSeedOptionsContainer} from "./optionsProvider.tsx";
import {useSeedResultsContainer} from "./analysisResultProvider.tsx";

export type DownloadSeedResultFunction = () => void;
export const DownloadSeedResultContext = createContext<DownloadSeedResultFunction | undefined>(undefined);

export function useDownloadSeedResults() {
    const context = useContext(DownloadSeedResultContext);
    if (!context) {
        throw new Error("useDownloadSeedResults must be used within a SeedResultProvider");
    }
    return context;
}

export function DownloadSeedResultProvider({children}: { children: React.ReactNode }) {

    const analyzeState = useCardStore(state => state.immolateState);
    const options = useSeedOptionsContainer()
    const SeedResults = useSeedResultsContainer()

    const downloadImmolateResults = useCallback(() => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(
            JSON.stringify({
                analyzeState: analyzeState,
                options,
                immolateResults: SeedResults
            }, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        const fileName = `${analyzeState.seed}.json`;
        downloadAnchorNode.setAttribute("download", fileName);
        document.body.appendChild(downloadAnchorNode); // required for firefox
        downloadAnchorNode.click();
        downloadAnchorNode.remove();

    }, [SeedResults, analyzeState, options])

    return (
        <DownloadSeedResultContext.Provider value={downloadImmolateResults}>
            {children}
        </DownloadSeedResultContext.Provider>
    )


}
