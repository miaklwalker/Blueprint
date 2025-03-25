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
    const {seed, deck, stake, gameVersion: version, antes, cardsPerAnte} = analyzeState;
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
            if(!ready) return null;
            if (seed.length < 5 || !start) {
                return null;
            }
            try {
                const engine = new ImmolateClassic(seed);
                const transactions = {buys, sells}


                const options: AnalyzeOptions = {
                    showCardSpoilers,
                    unlocks,
                    events,
                    updates: [],
                    ...transactions
                };
                function makeAnalyzer( showman = false ){
                    engine.InstParams(deck, stake, showman, version);
                    engine.initLocks(1, false, true);
                    // Vouchers included in selected unlocks since players may not have those available
                    engine.handleSelectedUnlocks(options.unlocks);
                    engine.lockLevelTwoVouchers()
                    const analyzer: CardEngineWrapper = new CardEngineWrapper(engine);
                    return analyzer;
                }
                let analyzer = makeAnalyzer(false);
                function updateAnalyzer(showman = false) {
                    engine.InstParams(deck, stake, showman, version);
                }



                let result = new Seed();



                // console.log(sells)
                for (let ante = 1; ante <= antes; ante++) {
                    result.antes[ante] = analyzer.analyzeAnte(ante, cardsPerAnte, options, updateAnalyzer);
                }

                analyzer.engine.delete();
                return result;
            } catch (e) {
                console.error(e);
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
        [analyzeState, start, buys, showCardSpoilers, unlocks, ready,events]
    );


    return (
        <MantineProvider defaultColorScheme={'dark'} theme={theme}>
            <Blueprint SeedResults={SeedResults}/>
            <Space my={'xl'}/>
        </MantineProvider>
    );
}
