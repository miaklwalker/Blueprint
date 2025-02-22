import {useViewportSize} from "@mantine/hooks";
import {useMemo} from "react";
import {buildShareableUrl} from "../../../modules/store.js";
import {AppShell, Burger, Button, Center, Container, CopyButton, Group, Title} from "@mantine/core";

import {SearchSeedInput} from "../../searchSeedInput/searchSeedInput.jsx";
import {useBlueprintStore} from "../../../modules/hooks.js";

export function Header() {
    const {width} = useViewportSize();
    const settingsOpened = useBlueprintStore(state => state.settingsOpen);
    const outputOpened = useBlueprintStore(state => state.outputOpen);
    const seedIsOpen = useBlueprintStore(state => state.seedIsOpen);
    const toggleSettings = useBlueprintStore(state => state.toggleSettingsOpen);
    const toggleOutput = useBlueprintStore(state => state.toggleOutputOpen);
    const state = useBlueprintStore(state => state)
    const shareLink = useMemo(() => buildShareableUrl(state, 0), [state])
    return (
        <AppShell.Header>
            <Container h={'100%'} fluid>
                <Group h={'100%'} justify="space-between">
                    {width <= 348 && <Burger opened={settingsOpened} onClick={toggleSettings} size="sm"/>}
                    <Center h={'100%'}>
                        <Title> Blueprint </Title>
                    </Center>

                    <Group align={'center'}>
                        {width > 600 && seedIsOpen && <SearchSeedInput/>}
                        {width > 348 && <Button onClick={() => toggleSettings()} variant={'transparent'}> Settings </Button>}
                        {width > 700 && seedIsOpen && (
                            <CopyButton value={shareLink}>
                                {({copied, copy}) => (
                                    <Button color={copied ? 'teal' : 'blue'} onClick={copy}>
                                        {copied ? 'Copied url' : 'Copy url'}
                                    </Button>
                                )}
                            </CopyButton>
                        )}
                        <Burger opened={outputOpened} onClick={toggleOutput} size="sm"/>
                    </Group>

                </Group>
            </Container>
        </AppShell.Header>
    )
}