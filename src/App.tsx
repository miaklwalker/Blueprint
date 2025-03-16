import "@mantine/core/styles.css";
import '@mantine/code-highlight/styles.css';
import '@mantine/carousel/styles.css';
import '@mantine/spotlight/styles.css';
import {MantineProvider, Space} from "@mantine/core";
import {theme} from "./theme.js";
import {ImmolateClassic} from "./modules/ImmolateWrapper/CardEngines/immolateClassic.ts";
import {CardEngineWrapper} from "./modules/ImmolateWrapper";

import {AnalyzeOptions} from "./modules/const.js"
import {useMemo} from "react";
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

    const start = useCardStore(state => state.applicationState.start);
    const buys = useCardStore(state => state.shoppingState.buys);
    const sells = useCardStore(state => state.shoppingState.sells);
    const showCardSpoilers = useCardStore(state => state.applicationState.showCardSpoilers);
    const unlocks: boolean[] = useCardStore(state => state.immolateState.selectedOptions);
    const SeedResults = useMemo(() => {
            if (seed.length < 6 || !start) return null;
            // @ts-ignore
            if( !window?.Immolate ){
                return null
            }
            else{
                // @ts-ignore
                console.log("Immolate loaded", window.Immolate);
            }
            try{
                // @ts-ignore
                new window.Immolate.Instance(seed);
            }catch (e){
                console.error("Immolate instance failed to load", e);
                return null;
            }
            try {
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
            }catch (e) {
                return null
            }
        },
        [analyzeState, start, buys, showCardSpoilers, unlocks]
    );


    return (
        <MantineProvider defaultColorScheme={'dark'} theme={theme}>
            <Blueprint SeedResults={SeedResults}/>
            <Space my={'xl'}/>
        </MantineProvider>
    );
}
