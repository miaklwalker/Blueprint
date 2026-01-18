import React,{createContext, useContext, useMemo} from "react";
import { useCardStore} from "./store.ts";
import type {InitialState} from "./store.ts";

type immolateState = InitialState['immolateState'];
type shoppingState = InitialState['shoppingState'];
type applicationState = InitialState['applicationState'];
type eventState = InitialState['eventState']["events"];
export interface OptionsProviderProps {
    maxMiscCardSource: applicationState['maxMiscCardSource'];
    showCardSpoilers: applicationState['showCardSpoilers'];
    unlocks: immolateState['selectedOptions'];
    events: eventState;
    updates: Array<never>
    buys: shoppingState['buys'];
    sells: shoppingState['sells'];
    lockedCards: InitialState['lockState']['lockedCards'];

}
export const SeedOptionsContext = createContext<OptionsProviderProps | undefined>(undefined);

export function useSeedOptionsContainer() {
    const context = useContext(SeedOptionsContext);
    if (!context) {
        throw new Error("useSeedOptionsContainer   must be used within a SeedResultProvider");
    }
    return context;
}

export function SeedOptionsProvider({children}: {children: React.ReactNode}) {
    const buys = useCardStore(state => state.shoppingState.buys);
    const sells = useCardStore(state => state.shoppingState.sells);
    const showCardSpoilers = useCardStore(state => state.applicationState.showCardSpoilers);
    const unlocks = useCardStore(state => state.immolateState.selectedOptions);
    const events = useCardStore(state=> state.eventState.events);
    const lockedCards = useCardStore(state => state.lockState.lockedCards);
    const maxMiscCardSource = useCardStore(state => state.applicationState.maxMiscCardSource);

    const options = useMemo<OptionsProviderProps>(()=>{
        return {
            maxMiscCardSource,
            showCardSpoilers,
            unlocks,
            events,
            updates: [],
            buys,
            sells,
            lockedCards
        }
    },[buys, events, lockedCards, maxMiscCardSource, sells, showCardSpoilers, unlocks])



    return (
        <SeedOptionsContext.Provider value={options}>
            {children}
        </SeedOptionsContext.Provider>
    )


}
