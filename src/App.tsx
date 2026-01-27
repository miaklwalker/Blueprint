import "@mantine/core/styles.css";
import '@mantine/code-highlight/styles.css';
import '@mantine/carousel/styles.css';
import '@mantine/spotlight/styles.css';


import { MantineProvider, Space, Stack, Text } from "@mantine/core";
import { Blueprint } from "./components/blueprint/standardView";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { SeedResultProvider } from "./modules/state/analysisResultProvider.tsx";
import { SeedOptionsProvider } from "./modules/state/optionsProvider.tsx";
import { DownloadSeedResultProvider } from "./modules/state/downloadProvider.tsx";
import { BlueprintThemeProvider, useBlueprintTheme } from "./modules/state/themeProvider.tsx";
import { NextStepProvider, NextStepReact, type Tour } from 'nextstepjs';
import { useCardStore } from "./modules/state/store.ts";
const queryClient = new QueryClient()

const steps: Array<Tour> = [
    {
        tour: 'onboarding-tour',
        steps: [
            {
                title: "Welcome to Blueprint! 👋",
                icon: "🚀",
                content: (
                    <Stack gap="xs">
                        <Text>The ultimate Balatro seed analyzer. Let's take a quick tour to get you started!</Text>
                    </Stack>
                ),
                showControls: true,
                showSkip: true,
                side: 'right'
            },
            {
                selector: '#view-mode',
                title: "View Modes",
                icon: "�️",
                content: (
                    <Stack gap="xs">
                        <Text>Switch between <b>Blueprint</b> (visual), <b>Efficiency</b> (compact), and <b>Text</b> modes to see your data however you prefer.</Text>
                    </Stack>
                ),
                showControls: true,
                showSkip: true,
                side: 'right'
            },
            {
                selector: '#seed-config',
                title: "Seed Configuration",
                icon: "⚙️",
                content: (
                    <Stack gap="xs">
                        <Text>Enter your seed and select your starting Deck, Stake, and Game Version here.</Text>
                    </Stack>
                ),
                showControls: true,
                showSkip: true,
                side: 'right'
            },
            {
                selector: '#setting-max-ante',
                title: "Granular Control",
                icon: "🎚️",
                content: (
                    <Stack gap="xs">
                        <Text>You can fine-tune exactly how many Antes and cards per source you want to analyze.</Text>
                    </Stack>
                ),
                showControls: true,
                showSkip: true,
                side: 'right'
            },
            {
                selector: '#analyze-button',
                title: "Run Analysis",
                icon: "🧪",
                content: (
                    <Stack gap="xs">
                        <Text>Click here to process the seed. Blueprint will calculate every possible outcome for your configuration!</Text>
                    </Stack>
                ),
                showControls: true,
                showSkip: true,
                side: 'right'
            },
            {
                selector: '#ante-navigation',
                title: "Navigate Antes",
                icon: "🔢",
                content: (
                    <Stack gap="xs">
                        <Text>Browse through each Ante. Blueprint shows you the progression of your run step-by-step.</Text>
                    </Stack>
                ),
                showControls: true,
                showSkip: true,
                side: 'bottom'
            },
            {
                selector: '#blind-navigation',
                title: "Blind Selection",
                icon: "🃏",
                content: (
                    <Stack gap="xs">
                        <Text>Switch between Small, Big, and Boss blinds to see what's waiting for you in each battle.</Text>
                    </Stack>
                ),
                showControls: true,
                showSkip: true,
                side: 'bottom'
            },
            {
                selector: '#shop-results',
                title: "Shop & Packs",
                icon: "🛍️",
                content: (
                    <Stack gap="xs">
                        <Text>See exactly what Jokers, Tarot cards, and Planet cards will appear in your shops and booster packs.</Text>
                    </Stack>
                ),
                showControls: true,
                showSkip: true,
                side: 'left'
            },
            {
                selector: '#aside-tab-sources',
                title: "Card Sources",
                icon: "🗂️",
                content: (
                    <Stack gap="xs">
                        <Text>The <b>Sources</b> tab shows a detailed breakdown of <i>every</i> card source: Vouchers, Tags, Bosses, and even Wheel of Fortune outcomes!</Text>
                    </Stack>
                ),
                showControls: true,
                showSkip: true,
                side: 'left'
            },
            {
                selector: '#aside-tab-purchases',
                title: "Purchase History",
                icon: "�",
                content: (
                    <Stack gap="xs">
                        <Text>Keep track of every card you've "purchased" during your analysis to see your build's evolution.</Text>
                    </Stack>
                ),
                showControls: true,
                showSkip: true,
                side: 'left'
            },
            {
                selector: '#aside-tab-deck',
                title: "Your Deck",
                icon: "🎴",
                content: (
                    <Stack gap="xs">
                        <Text>View your current deck state. You can even manually modify cards or clone them to simulate specific scenarios!</Text>
                    </Stack>
                ),
                showControls: true,
                showSkip: true,
                side: 'left'
            },
            {
                selector: '#simulate-draw-button',
                title: "Hand Simulator",
                icon: "🎲",
                content: (
                    <Stack gap="xs">
                        <Text>Ever wonder what your starting hands look like? Use the <b>Simulate Draw</b> tool to test your deck's consistency.</Text>
                    </Stack>
                ),
                showControls: true,
                showSkip: true,
                side: 'left'
            },
            {
                selector: '#aside-tab-events',
                title: "Event Tracking",
                icon: "📅",
                content: (
                    <Stack gap="xs">
                        <Text>Track specific unlock conditions or milestones across multiple Antes.</Text>
                    </Stack>
                ),
                showControls: true,
                showSkip: true,
                side: 'left'
            },
            {
                selector: '#features-button',
                title: "Visual Features",
                icon: "✨",
                content: (
                    <Stack gap="xs">
                        <Text>Check out <b>Features</b> to see a visual gallery of all cards and their properties found in this seed.</Text>
                    </Stack>
                ),
                showControls: true,
                showSkip: true,
                side: 'right'
            },
            {
                selector: '#snapshot-button',
                title: "Seed Summary",
                icon: "📊",
                content: (
                    <Stack gap="xs">
                        <Text>Get a bird's-eye view of your entire run with the <b>Seed Summary</b> snapshot.</Text>
                    </Stack>
                ),
                showControls: true,
                showSkip: true,
                side: 'top-right'
            },
            {
                title: "Reroll Calculator",
                icon: "🔄",
                content: (
                    <Stack gap="xs">
                        <Text>Blueprint includes a powerful reroll calculator. You can find it by clicking the dropdown arrow on any shop card to see if that elusive Joker is just one reroll away!</Text>
                    </Stack>
                ),
                showControls: true,
                showSkip: true,
                side: 'right'
            },
            {
                title: "Ready to go? 🃏",
                icon: "🏁",
                content: (
                    <Stack gap="xs">
                        <Text>You're all set! Blueprint is a deep tool, so don't be afraid to click around. Good luck on your run!</Text>
                    </Stack>
                ),
                showControls: true,
                showSkip: true,
                side: 'right'
            }
        ]
    }
]
function ProviderContainer({ children }: { children: React.ReactNode }) {
    const { theme, themes } = useBlueprintTheme()
    const settingsOpen = useCardStore(state => state.applicationState.settingsOpen);
    const toggleSettings = useCardStore(state => state.toggleSettings);
    const asideOpen = useCardStore(state => state.applicationState.asideOpen);
    const toggleOutput = useCardStore(state => state.toggleOutput);
    const setAsideTab = useCardStore(state => state.setAsideTab);
    const openSnapshotModal = useCardStore(state => state.openSnapshotModal);
    const closeSnapshotModal = useCardStore(state => state.closeSnapshotModal);

    const handleStepChange = (step: number) => {
        // Steps 1-4: Settings (Navbar) open
        if (step >= 1 && step <= 4) {
            if (!settingsOpen) toggleSettings();
            if (asideOpen) toggleOutput();
        }

        // Steps 5-7: Main View (No side panels needed)
        if (step >= 5 && step <= 7) {
            if (settingsOpen) toggleSettings();
            if (asideOpen) toggleOutput();
        }

        // Steps 8-12: Aside Panel features
        if (step >= 8 && step <= 12) {
            if (!asideOpen) toggleOutput();
            if (settingsOpen) toggleSettings();
        }

        // Steps 13-15: Extra Tools (Navbar)
        if (step >= 13 && step <= 15) {
            if (!settingsOpen) toggleSettings();
            if (asideOpen) toggleOutput();
        }

        // Specific Tab Switching
        if (step === 8) setAsideTab('sources');
        if (step === 9) setAsideTab('purchases');
        if (step === 10 || step === 11) setAsideTab('deck');
        if (step === 12) setAsideTab('events');

        // Modal Triggers
        if (step === 14) {
            openSnapshotModal();
        }
    }

    return (

        <MantineProvider defaultColorScheme={'dark'} theme={themes[theme]}>
            <QueryClientProvider client={queryClient}>
                <SeedOptionsProvider>
                    <SeedResultProvider>
                        <DownloadSeedResultProvider>
                            <NextStepProvider>
                                <NextStepReact steps={steps} onStepChange={handleStepChange}>
                                    {children}
                                </NextStepReact>
                            </NextStepProvider>
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
                <Blueprint />
                <Space my={'xl'} />
            </ProviderContainer>
        </BlueprintThemeProvider>
    );
}
