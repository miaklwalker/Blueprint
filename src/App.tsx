import "@mantine/core/styles.css";
import '@mantine/code-highlight/styles.css';
import '@mantine/carousel/styles.css';
import '@mantine/spotlight/styles.css';


import {MantineProvider, Space} from "@mantine/core";
import {theme} from "./theme.js";
import {ImmolateClassic} from "./modules/ImmolateWrapper/CardEngines/immolateClassic.ts";
import {CardEngineWrapper} from "./modules/ImmolateWrapper";

import {AnalyzeOptions} from "./modules/const.js"
import {useMemo, useState} from "react";
import {useCardStore} from "./modules/state/store.ts";
import {Blueprint} from "./components/blueprint";

//Todo HOME PAGE! WITH FEATURES
//TODO URL SHARING
//TODO Add hover to tags and boss popover
//TODO Add info to those pop overs
//TODO Allow tags to be included in the buys


export default function App() {
    const analyzeState = useCardStore(state => state.immolateState);
    const {seed, deck, stake, showmanOwned, gameVersion: version, antes, cardsPerAnte} = analyzeState;
    const [ready, setReady] = useState(true);
    const start = useCardStore(state => state.applicationState.start);
    const setStart = useCardStore(state => state.setStart);

    // const setStart = useCardStore(state => state.setStart);
    const buys = useCardStore(state => state.shoppingState.buys);
    const sells = useCardStore(state => state.shoppingState.sells);
    const showCardSpoilers = useCardStore(state => state.applicationState.showCardSpoilers);
    const unlocks: boolean[] = useCardStore(state => state.immolateState.selectedOptions);


    const SeedResults = useMemo(() => {
        console.log("Running memo")
            if(!ready) return null;
            if (seed.length < 6 || !start) {
                console.log("Seed too short")
                return null;
            }
            try {
                console.log("Running memo")
                const engine = new ImmolateClassic(seed);
                engine.InstParams(deck, stake, showmanOwned, version);
                engine.initLocks(1, false, true);
                const analyzer: CardEngineWrapper = new CardEngineWrapper(engine);
                const transactions = {buys, sells}


                const options: AnalyzeOptions = {
                    showCardSpoilers,
                    unlocks,
                    updates: [],
                    ...transactions
                };

                let results = analyzer.analyzeSeed(antes, cardsPerAnte, options);
                engine.delete();
                return results;
            } catch (e) {
                console.debug('Setting Ready to false')
                setReady(false);
                document.addEventListener('ImmolateReady', () => {
                    console.log("Setting ready to true")
                    setStart(true);
                    setReady(true);
                })
                console.error(e);
                return null
            }
        },
        [analyzeState, start, buys, showCardSpoilers, unlocks, ready]
    );


    return (
        <MantineProvider defaultColorScheme={'dark'} theme={theme}>
            <Blueprint SeedResults={SeedResults}/>
            <Space my={'xl'}/>
        </MantineProvider>
    );
}
