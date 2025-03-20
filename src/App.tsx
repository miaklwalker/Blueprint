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
import {Seed} from "./modules/ImmolateWrapper/CardEngines/Cards.ts";

//Todo HOME PAGE! WITH FEATURES
//TODO Add info to those pop overs
//TODO Allow tags to be included in the buys
//TODO Add a way to see the seed in the analyze page
//TODO ADD SELLS





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
            if(!ready) return null;
            if (seed.length < 6 || !start) {
                return null;
            }
            try {
                function makeAnalyzer( showman = false ){
                    const engine = new ImmolateClassic(seed);
                    engine.InstParams(deck, stake, showman, version);
                    engine.initLocks(1, false, true);
                    const analyzer: CardEngineWrapper = new CardEngineWrapper(engine);
                    return analyzer;
                }
                let analyzer = makeAnalyzer(false);
                const transactions = {buys, sells}


                const options: AnalyzeOptions = {
                    showCardSpoilers,
                    unlocks,
                    updates: [],
                    ...transactions
                };


                let result = new Seed();
                analyzer.engine.lockLevelTwoVouchers();
                if (options?.unlocks) {
                    analyzer.engine.handleSelectedUnlocks(options.unlocks);
                }
                for (let ante = 1; ante <= antes; ante++) {
                    if( analyzer.engine.isLocked("Showman") && !analyzer.engine.instance.params.showman){
                        console.log("Showman is locked")
                        analyzer = makeAnalyzer(true);
                    }
                    result.antes[ante] = analyzer.analyzeAnte(ante, cardsPerAnte, options);
                }

                analyzer.engine.delete();
                return result;
            } catch (e) {
                console.debug("Blueprint loaded before immolate. Listening for event")
                setReady(false);
                document.addEventListener('ImmolateReady', () => {
                    console.debug("Immolate loaded, reloading blueprint")
                    setStart(true);
                    setReady(true);
                })
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
