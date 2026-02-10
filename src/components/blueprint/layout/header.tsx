import React from "react";
import {useViewportSize} from "@mantine/hooks";
import {AppShell, Box, Burger, Button, Center, Container, CopyButton, Group, Title} from "@mantine/core";
import {useCardStore} from "../../../modules/state/store.ts";
import SearchSeedInput from "../../searchInput.tsx";
import {GaEvent} from "../../../modules/useGA.ts";

export default function Header() {
    const { width } = useViewportSize();
    const start = useCardStore(state => state.applicationState.start)
    const settingsOpened = useCardStore(state => state.applicationState.settingsOpen);
    const toggleSettings = useCardStore(state => state.toggleSettings);

    const outputOpened = useCardStore(state => state.applicationState.asideOpen);
    const toggleOutput = useCardStore(state => state.toggleOutput);
    // const { startNextStep, closeNextStep } = useNextStep();
    return (
        <AppShell.Header>
            <Container fluid h={'100%'}>
                <Group h={'100%'} justify={'space-between'}>
                    <Group flex={1}>
                        <Burger opened={settingsOpened} onClick={toggleSettings} hiddenFrom={'md'} size="sm" />
                        <Center h={'100%'}>
                            <Group grow>
                                <Box flex={1}>
                                    <Title > Blueprint </Title>
                                </Box>
                            </Group>
                        </Center>
                    </Group>

                    <Group align={'center'}>
                        {/*<ActionIcon onClick={() => startNextStep('onboarding-tour')}>*/}
                        {/*    <IconInfoCircle />*/}
                        {/*</ActionIcon>*/}
                        {width > 600 && start && <Box id="search-input-header"><SearchSeedInput /></Box>}
                        {width > 700 && start && (
                            <CopyButton value={new URL(window.location.href).toString()}>
                                {({ copied, copy }) => (
                                    <Button color={copied ? 'teal' : 'blue'} onClick={copy}>
                                        {copied ? 'Copied url' : 'Copy url'}
                                    </Button>
                                )}
                            </CopyButton>
                        )}
                        <Burger id="side-panel-toggle" opened={outputOpened} onClick={() => {
                            GaEvent('side_panel_toggled')
                            toggleOutput()
                        }} size="sm" />
                    </Group>
                </Group>
            </Container>
        </AppShell.Header>
    )
}
