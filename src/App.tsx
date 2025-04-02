import "@mantine/core/styles.css";
import '@mantine/code-highlight/styles.css';
import '@mantine/carousel/styles.css';
import '@mantine/spotlight/styles.css';


import {MantineProvider, Space} from "@mantine/core";
import {theme} from "./theme.js";
import {useCardStore} from "./modules/state/store.ts";
import {Blueprint} from "./components/blueprint/standardView";


//TODO Add info to those pop overs
//TODO Allow tags to be included in the buys
//TODO Add a way to see the seed in the analyze page
//TODO VOUCHER PETROGLYPH HIERO GLYPH GENERATION.
//TODO SHow Pack Names and amounts
// Maybe make analyzation a tree ? Where we can remove branches that have changed, but keep the rest of the tree


export default function App() {
    const SeedResults = useCardStore(state => state.applicationState.analyzedResults);

    return (
        <MantineProvider defaultColorScheme={'dark'} theme={theme}>
            <Blueprint SeedResults={SeedResults || null}/>
            <Space my={'xl'}/>
        </MantineProvider>
    );
}
