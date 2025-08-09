import "@mantine/core/styles.css";
import '@mantine/code-highlight/styles.css';
import '@mantine/carousel/styles.css';
import '@mantine/spotlight/styles.css';


import {MantineProvider, Space} from "@mantine/core";
import MantineThemeFile from "./themes/Mantine.ts";
import MurkrowThemeFile from "./themes/Murkrow";
import SylveonThemeFile from "./themes/Sylveon";
import VivillanThemeFile from "./themes/Vivillan";

import {useCardStore} from "./modules/state/store.ts";
import {Blueprint} from "./components/blueprint/standardView";
import {useToggle} from "@mantine/hooks";
import {BalatroAnalyzer} from "./modules/balatrots/BalatroAnalyzer.ts";
import {Deck, DeckType} from "./modules/balatrots/enum/Deck.ts";
import {Stake, StakeType} from "./modules/balatrots/enum/Stake.ts";
import {Version} from "./modules/balatrots/enum/Version.ts";



//TODO Add info to those pop overs
//TODO Allow tags to be included in the buys
//TODO Add a way to see the seed in the analyze page
//TODO VOUCHER PETROGLYPH HIERO GLYPH GENERATION.
//TODO SHow Pack Names and amounts
// Maybe make analyzation a tree ? Where we can remove branches that have changed, but keep the rest of the tree


export type KnownThemes = "Vivillan" |
    "Murkrow" |
    // "Goomy" |
    "Mantine" |
    "Sylveon";
const themes = {
    Vivillan: VivillanThemeFile,
    Murkrow: MurkrowThemeFile,
    // Goomy: GoomyThemeFile,
    Mantine: MantineThemeFile,
    Sylveon: SylveonThemeFile,
};
export const themeNames = Object.keys(themes) as KnownThemes[];

export default function App() {
    const SeedResults = useCardStore(state => state.applicationState.analyzedResults);
    const [theme, setTheme] = useToggle<KnownThemes>(
        Object.keys(themes) as KnownThemes[],
    );

    const analyzer = new BalatroAnalyzer(
        // seed,
        8,
        [60, 50, 50, 50, 50, 50, 50, 50],
        new Deck(DeckType.GHOST_DECK),
        new Stake(StakeType.WHITE_STAKE), Version.v_101f,
        {
            analyzeArcana: true,
            analyzeBoss: true,
            analyzeCelestialPacks: true,
            analyzeJokers: true,
            analyzeShopQueue: true,
            analyzeSpectral: true,
            analyzeStandardPacks: true,
            analyzeTags: true,
        });

    const analysis = analyzer.performAnalysis({
        seed: "U8RJYV6N",
        ante: 8,
        cardsPerAnte: [60, 50, 50, 50, 50, 50, 50, 50],
        deck: new Deck(DeckType.GHOST_DECK),
        stake: new Stake(StakeType.WHITE_STAKE),
        version: Version.v_101f
    });
    console.log(analysis)
    console.log("Analysis Result:", JSON.parse(JSON.stringify(analyzer.result.getResult)));
    return (
        <MantineProvider defaultColorScheme={'dark'} theme={themes[theme]}>
            <Blueprint theme={theme} setTheme={setTheme} SeedResults={SeedResults || null}/>
            <Space my={'xl'}/>
        </MantineProvider>
    );
}
