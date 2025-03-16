import {Seed} from "../../../modules/ImmolateWrapper/CardEngines/Cards.ts";
import {useViewportSize} from "@mantine/hooks";
import {useCardStore} from "../../../modules/state/store.ts";
import {AppShell, Burger, Button, Center, Container, Group, Title} from "@mantine/core";
import SearchSeedInput from "../../searchInput.tsx";

export default function Header({SeedResults}: { SeedResults: Seed | null }) {
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
                    {width <= 348 && <Burger opened={settingsOpened} onClick={toggleSettings} size="sm"/>}
                    <Center h={'100%'}>
                        <Title> Blueprint </Title>
                    </Center>
                    <Group align={'center'}>
                        {width > 600 && start && <SearchSeedInput SeedResults={SeedResults}/>}
                        {width > 348 &&
                            <Button onClick={() => toggleSettings()} variant={'transparent'}> Settings </Button>}
                        {/*{width > 700 && seedIsOpen && (*/}
                        {/*    <CopyButton value={shareLink}>*/}
                        {/*        {({copied, copy}) => (*/}
                        {/*            <Button color={copied ? 'teal' : 'blue'} onClick={copy}>*/}
                        {/*                {copied ? 'Copied url' : 'Copy url'}*/}
                        {/*            </Button>*/}
                        {/*        )}*/}
                        {/*    </CopyButton>*/}
                        {/*)}*/}
                        <Burger opened={outputOpened} onClick={toggleOutput} size="sm"/>
                    </Group>
                </Group>
            </Container>
        </AppShell.Header>
    )
}