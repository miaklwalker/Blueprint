import {useBlueprintStore} from "../../../modules/hooks.js";
import {AppShell, Box, Button, Container, Group, Modal, SimpleGrid, Switch, Text, TextInput} from "@mantine/core";
import {options} from "../../../modules/const.js";
import {SeedDisplay} from "../../seedDisplay/index.jsx";
import {useCallback, useMemo} from "react";
import {useDebouncedValue} from "@mantine/hooks";
import {analyzeSeed} from "../../../modules/utils.js";

export function AnalyzeSeedInput() {
    const setSeedIsOpen = useBlueprintStore(state => state.setSeedIsOpen)
    const seed = useBlueprintStore(state => state.seed)
    const setSeed = useBlueprintStore(state => state.setSeed)
    const deck = useBlueprintStore(state => state.deck)
    const cardsPerAnteString = useBlueprintStore(state => state.getCardsPerAnteString)
    const stake = useBlueprintStore(state => state.stake)
    const version = useBlueprintStore(state => state.version)
    const ante = useBlueprintStore(state => state.ante);
    const selectedOptions = useBlueprintStore(state => state.selectedOptions);
    const setResults = useBlueprintStore(state => state.setResults);

    const analyzeState = useMemo(() => ({
        seed,
        deck,
        cardsPerAnte: cardsPerAnteString(),
        stake,
        version,
        ante,
        selectedOptions
    }), [seed, deck, cardsPerAnteString, stake, version, ante, selectedOptions]);
    const [debounced] = useDebouncedValue(analyzeState, 500);
    const handleAnalyzeClick = useCallback(() => {
        const output = analyzeSeed(debounced)
        setSeedIsOpen(true)
        setResults(output)
    }, [debounced]);

    return (
        <Box>
            <Text>Enter Seed</Text>
            <Group>
                <TextInput
                    value={seed}
                    onChange={(e) => setSeed(e.currentTarget.value)}
                    flex={1}
                    placeholder={'Enter Seed'}
                />
                <Button onClick={handleAnalyzeClick}> Submit </Button>
            </Group>
        </Box>
    )
}

export function UI() {
    const seedIsOpen = useBlueprintStore(state => state.seedIsOpen);
    const selectOptionsModalOpen = useBlueprintStore(state => state.selectOptionsModalOpen);
    const closeSelectOptionModal = useBlueprintStore(state => state.closeSelectOptionModal);

    const selectedOptions = useBlueprintStore(state => state.selectedOptions);
    const setSelectedOptions = useBlueprintStore(state => state.setSelectedOptions);

    return (
        <AppShell.Main>
            <Container fluid px={'1rem'}>
                <Modal size="auto" title={'Unlocks'} opened={!!selectOptionsModalOpen} onClose={()=> closeSelectOptionModal()}>
                    <Container fluid>
                        <Switch.Group
                            defaultValue={options}
                            label="Unlocked Items "
                            description="Items that you have unlocked by playing the game"
                            withAsterisk
                            value={options.filter((option, i) => selectedOptions[i])}
                            onChange={setSelectedOptions}
                        >
                            <SimpleGrid cols={6} mb={'lg'} mt={'xs'}>
                                {
                                    options.map((option, i) => (<Switch key={i} value={option} label={option} />))
                                }
                            </SimpleGrid>
                        </Switch.Group>
                        <Group justify={'flex-end'}>
                            <Button onClick={()=>setSelectedOptions(options)}> Select All </Button>
                            <Button onClick={()=>setSelectedOptions([])}> Remove All </Button>
                        </Group>
                    </Container>
                </Modal>
                {!seedIsOpen && <AnalyzeSeedInput/>}
                {seedIsOpen && <SeedDisplay/>}
            </Container>
        </AppShell.Main>
    )
}