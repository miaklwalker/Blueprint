import "@mantine/core/styles.css";
import '@mantine/code-highlight/styles.css';
import '@mantine/carousel/styles.css';
import '@mantine/spotlight/styles.css';


import {MantineProvider, Space} from "@mantine/core";
import {Blueprint} from "./components/blueprint/standardView";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import React from "react";
import {SeedResultProvider} from "./modules/state/analysisResultProvider.tsx";
import {SeedOptionsProvider} from "./modules/state/optionsProvider.tsx";
import {DownloadSeedResultProvider} from "./modules/state/downloadProvider.tsx";
import {BlueprintThemeProvider, useBlueprintTheme} from "./modules/state/themeProvider.tsx";


//TODO Add info to those pop overs
//TODO Allow tags to be included in the buys
//TODO Add a way to see the seed in the analyze page
//TODO VOUCHER PETROGLYPH HIERO GLYPH GENERATION.
//TODO SHow Pack Names and amounts
// Maybe make analyzation a tree ? Where we can remove branches that have changed, but keep the rest of the tree

const queryClient = new QueryClient()


function ProviderContainer({children}: { children: React.ReactNode }) {
    const { theme, themes } = useBlueprintTheme()
    return (

        <MantineProvider defaultColorScheme={'dark'} theme={themes[theme]}>
            <QueryClientProvider client={queryClient}>
                <SeedOptionsProvider>
                    <SeedResultProvider>
                        <DownloadSeedResultProvider>
                            {children}
                        </DownloadSeedResultProvider>
                    </SeedResultProvider>
                </SeedOptionsProvider>
            </QueryClientProvider>
        </MantineProvider>
    );
}

export default function App() {
    return (
        <BlueprintThemeProvider>
            <ProviderContainer>
                <Blueprint/>
                <Space my={'xl'}/>
            </ProviderContainer>
        </BlueprintThemeProvider>
    );
}
