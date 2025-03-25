import "@mantine/core/styles.css";
import '@mantine/code-highlight/styles.css';
import '@mantine/carousel/styles.css';
import '@mantine/spotlight/styles.css';


import {MantineProvider, Space} from "@mantine/core";
import {theme} from "./theme.js";
import {analyzeSeed} from "./modules/ImmolateWrapper";

import {AnalyzeOptions} from "./modules/const.js"
import {useMemo, useState} from "react";
import {useCardStore} from "./modules/state/store.ts";
import {Blueprint} from "./components/blueprint";
import {useDebouncedValue} from "@mantine/hooks";


//TODO Add info to those pop overs
//TODO Allow tags to be included in the buys
//TODO Add a way to see the seed in the analyze page
//TODO VOUCHER PETROGLYPH HIERO GLYPH GENERATION.
//TODO SHow Pack Names and amounts
// Maybe make analyzation a tree ? Where we can remove branches that have changed, but keep the rest of the tree
let retried = false;

export default function App() {
    const analyzeState = useCardStore(state => state.immolateState);
    const [debouncedAnalyzeState] = useDebouncedValue(analyzeState, 1000);
    const [ready, setReady] = useState(true);
    const start = useCardStore(state => state.applicationState.start);
    const setStart = useCardStore(state => state.setStart);

    // const setStart = useCardStore(state => state.setStart);
    const buys = useCardStore(state => state.shoppingState.buys);
    const sells = useCardStore(state => state.shoppingState.sells);
    const showCardSpoilers = useCardStore(state => state.applicationState.showCardSpoilers);
    const unlocks: string[] = useCardStore(state => state.immolateState.selectedOptions);
    const events = useCardStore(state => state.eventState.events);

    const SeedResults = useMemo(() => {
            if (!ready || !start) return null;
            try {
                const transactions = {buys, sells}
                const options: AnalyzeOptions = {
                    showCardSpoilers,
                    unlocks,
                    events,
                    updates: [],
                    ...transactions
                };
                return analyzeSeed(debouncedAnalyzeState, options)
            }
            catch (e: any) {
                console.log(e.message);
                let crashMessage = 'Aborted(OOM)';
                if(e.message.includes(crashMessage) && !retried){
                    retried = true
                    console.log("Immolate crashed, reloading blueprint")
                    console.log("Retrying...")

                    setTimeout(()=>{
                        window.location.reload();
                    }, 1000)

                }
                setReady(false);
                document.addEventListener('ImmolateReady', () => {
                    console.debug("Immolate loaded, reloading blueprint")
                    setStart(true);
                    setReady(true);
                })
                return null
            }
        },
        [debouncedAnalyzeState, start, buys, showCardSpoilers, unlocks, ready, events]
    );


    return (
        <MantineProvider defaultColorScheme={'dark'} theme={theme}>
            <Blueprint SeedResults={SeedResults || null}/>
            <Space my={'xl'}/>
        </MantineProvider>
    );
}
