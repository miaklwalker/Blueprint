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
import {preformFullAnalysis} from "./modules/ImmolateWrapper/index.js";


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


preformFullAnalysis()


export default function App() {
    return (
        <MantineProvider defaultColorScheme={'dark'} theme={theme}>
            <Title> Hello World!</Title>
            {/*<pre>*/}
            {/*    {JSON.stringify(seedAnalysis,null, 2)}*/}
            {/*</pre>*/}
            {/*<BluePrint/>*/}
        </MantineProvider>
    );
}
