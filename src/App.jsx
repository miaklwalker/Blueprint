import "@mantine/core/styles.css";
import '@mantine/code-highlight/styles.css';
import '@mantine/carousel/styles.css';
import '@mantine/spotlight/styles.css';
import {CodeHighlight} from "@mantine/code-highlight";
import {createContext, useCallback, useContext, useEffect, useMemo, useRef, useState} from "react";
import {
    ActionIcon,
    AppShell,
    Box,
    Burger,
    Button, Center,
    Container, CopyButton,
    Divider,
    Fieldset,
    Flex,
    Grid,
    Group,
    MantineProvider, Modal,
    NativeSelect,
    NumberInput,
    Paper,
    ScrollArea,
    SegmentedControl,
    SimpleGrid,
    Slider,
    Stack, Switch,
    Tabs,
    Text,
    TextInput,
    Title,
    Tooltip
} from "@mantine/core";
import {theme} from "./theme";
import {
    analyzeSeed,
    determineItemType,
    extractShopQueues,
    maskToCanvas,
    parseCardItem,
    parseStandardCardName,
    renderBoss,
    renderStandardCard,
    renderTag,
    renderVoucher
} from "./modules/utils.js";
import {buildShareableUrl, createBlueprintStore} from "./modules/store.js";
import {useStore} from "zustand";
import {Carousel} from "@mantine/carousel";
import {blinds, options} from "./modules/const.js";
import {IconSearch, IconShare} from "@tabler/icons-react";
import {openSpotlight, Spotlight,} from "@mantine/spotlight";
import {useDebouncedValue, useViewportSize} from "@mantine/hooks";
import {Header} from "./components/layout/header/header.jsx";
import {Settings} from "./components/layout/settingsDrawer/settingsDrawer.jsx";
import {Output} from "./components/layout/outputDrawer/outputDrawer.jsx";
import {Footer} from "./components/layout/footer/footer.jsx";
import {useBlueprintStore} from "./modules/hooks.js";
import {StoreProvider} from "./components/provider/provider.jsx";
import {SeedDisplay} from "./components/seedDisplay/index.jsx";
import {UI} from "./components/layout/ui/index.jsx";











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


export default function App() {
    return (
        <MantineProvider defaultColorScheme={'dark'} theme={theme}>
            <StoreProvider>
                <BluePrint/>
            </StoreProvider>
        </MantineProvider>
    );
}
