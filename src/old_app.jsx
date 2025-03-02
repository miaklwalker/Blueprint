import "@mantine/core/styles.css";
import '@mantine/code-highlight/styles.css';
import '@mantine/carousel/styles.css';
import '@mantine/spotlight/styles.css';
import {AppShell, MantineProvider, Title} from "@mantine/core";
import {theme} from "./theme";
import {Header} from "./components/layout/header/header.jsx";
import {Settings} from "./components/layout/settingsDrawer/settingsDrawer.jsx";
import {Output} from "./components/layout/outputDrawer/outputDrawer.jsx";
import {Footer} from "./components/layout/footer/footer.jsx";
import {UI} from "./components/layout/ui/index.jsx";
import {useBlueprintStore} from "./modules/store.js";
import {CardEngineWrapper} from "./modules/ImmolateWrapper/index.js";
import {ImmolateClassic} from "./modules/ImmolateWrapper/CardEngines/immolateClassic.js";
import {create} from "zustand";
import {devtools} from "zustand/middleware";


function BluePrint() {
    const settingsOpened = useBlueprintStore(state => state.settingsOpen);
    const outputOpened = useBlueprintStore(state => state.outputOpen);
    return (
        <AppShell
            header={{height: {base: 60, md: 70, lg: 80}}}
            aside={{
                width: {base: 200, md: 300, lg: 550},
                breakpoint: 'md',
                collapsed: {desktop: !outputOpened, mobile: !outputOpened}
            }}
            navbar={{
                width: {base: 200, md: 300, lg: 400},
                breakpoint: 'sm',
                collapsed: {desktop: !settingsOpened, mobile: settingsOpened},
            }}
            padding="md"
        >
            <Header/>
            <Settings/>
            <UI/>
            <Output/>
            <Footer/>
        </AppShell>
    )
}


const seed = '5YVHAEP'
const antes = 3;
const cardsPerAnte = 50;
const engine = new ImmolateClassic(seed);
engine.InstParams('Ghost Deck', 'Gold Stake', false, '10106');
engine.initLocks(1, false, true);
const analyzer = new CardEngineWrapper(engine);
let seedAnalysis = analyzer.analyzeSeed(antes, cardsPerAnte);
console.log(seedAnalysis);
// console.log(CardEngineWrapper.printAnalysis(seedAnalysis))
const initialState = {
    seed: '',
    deck: '',
    cardsPerAnte: 50,
    antes: 8,
    deckType: 'Ghost Deck',
    stake: 'Gold Stake',
    showmanOwned: false,
    gameVersion: '10106',
}

const useStore = create(
    devtools(
        (set) => ({
            ...initialState,
            reset: () => {
                set(initialState, undefined, 'Global/Reset');
            },
        })
    )
)

function useSeedAnalyzer() {
    
}

export default function App() {
    return (
        <MantineProvider defaultColorScheme={'dark'} theme={theme}>


        </MantineProvider>
    );
}
