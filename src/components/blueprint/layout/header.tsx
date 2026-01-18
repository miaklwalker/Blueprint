import React from "react";
import {useViewportSize} from "@mantine/hooks";
import {AppShell, Box, Burger, Button, Center, Container, CopyButton, Group, Title} from "@mantine/core";
import {useCardStore} from "../../../modules/state/store.ts";
import SearchSeedInput from "../../searchInput.tsx";
import {GaEvent} from "../../../modules/useGA.ts";
import {useSeedResultsContainer} from "../../../modules/state/analysisResultProvider.tsx";


export default function Header() {
    const SeedResults = useSeedResultsContainer();
    const {width} = useViewportSize();
    const start = useCardStore(state => state.applicationState.start)
    const settingsOpened = useCardStore(state => state.applicationState.settingsOpen);
    const toggleSettings = useCardStore(state => state.toggleSettings);

    const outputOpened = useCardStore(state => state.applicationState.asideOpen);
    const toggleOutput = useCardStore(state => state.toggleOutput);
    return (
        <AppShell.Header>
            <Container fluid h={'100%'}>
                <Group h={'100%'} justify={'space-between'}>
                    <Group flex={1}>
                        <Burger opened={settingsOpened} onClick={toggleSettings} hiddenFrom={'md'} size="sm"/>
                        <Center h={'100%'}>
                            <Group grow>
                                <Box flex={1}>
                                    <Title > Blueprint </Title>
                                </Box>
                            </Group>
                        </Center>
                    </Group>

                    <Group align={'center'}>
                        {width > 600 && start && <SearchSeedInput SeedResults={SeedResults}/>}
                        {width > 700 && start && (
                            <CopyButton value={new URL(window.location.href).toString()}>
                                {({copied, copy}) => (
                                    <Button color={copied ? 'teal' : 'blue'} onClick={copy}>
                                        {copied ? 'Copied url' : 'Copy url'}
                                    </Button>
                                )}
                            </CopyButton>
                        )}
                        <Burger opened={outputOpened} onClick={()=>{
                            GaEvent('side_panel_toggled')
                            toggleOutput()
                        }} size="sm"/>
                    </Group>
                </Group>
            </Container>
        </AppShell.Header>
    )
}
