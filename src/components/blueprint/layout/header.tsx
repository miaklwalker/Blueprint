import {SeedResultsContainer} from "../../../modules/ImmolateWrapper/CardEngines/Cards.ts";
import {useViewportSize} from "@mantine/hooks";
import {useCardStore} from "../../../modules/state/store.ts";
import {AppShell, Box, Burger, Button, Center, Container, CopyButton, Group, Title} from "@mantine/core";
import SearchSeedInput from "../../searchInput.tsx";
import {useGA} from "../../../modules/useGA.ts";



export default function Header({SeedResults}: {
    SeedResults: SeedResultsContainer | null,
    theme: string,
    setTheme: any
}) {
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
                            useGA('side_panel_toggled')
                            toggleOutput()
                        }} size="sm"/>
                    </Group>
                </Group>
            </Container>
        </AppShell.Header>
    )
}
