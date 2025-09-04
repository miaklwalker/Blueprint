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
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {useEffect} from "react";


//TODO Add info to those pop overs
//TODO Allow tags to be included in the buys
//TODO Add a way to see the seed in the analyze page
//TODO VOUCHER PETROGLYPH HIERO GLYPH GENERATION.
//TODO SHow Pack Names and amounts
// Maybe make analyzation a tree ? Where we can remove branches that have changed, but keep the rest of the tree

const queryClient = new QueryClient()
export type KnownThemes = "Vivillan" |
    "Murkrow" |
    "Mantine" |
    "Sylveon";
const themes = {
    Mantine: MantineThemeFile,
    Vivillan: VivillanThemeFile,
    Murkrow: MurkrowThemeFile,
    Sylveon: SylveonThemeFile,
};
export const themeNames = Object.keys(themes) as KnownThemes[];

export default function App() {
    const SeedResults = useCardStore(state => state.applicationState.analyzedResults);
    const saveSeedDebug = useCardStore(state => state.downloadImmolateResults)

    const [theme, setTheme] = useToggle<KnownThemes>(
        Object.keys(themes) as KnownThemes[],
    );
    useEffect(() => {
        if(typeof window !== 'undefined'){
            // @ts-ignore
            if(!window.saveSeedDebug){
                // @ts-ignore
                window.saveSeedDebug = saveSeedDebug;
            }
        }
    }, []);


    return (
        <MantineProvider defaultColorScheme={'dark'} theme={themes[theme]}>
            <QueryClientProvider client={queryClient}>
                <Blueprint theme={theme} setTheme={setTheme} SeedResults={SeedResults || null}/>
                <Space my={'xl'}/>
            </QueryClientProvider>
        </MantineProvider>
    );
}
