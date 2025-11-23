import { useCardStore } from "../modules/state/store.ts";
import { Button, Container, Group, Modal, SimpleGrid, Switch } from "@mantine/core";
import { options } from "../modules/const.ts";

export default function UnlocksModal() {
    const selectOptionsModalOpen = useCardStore(state => state.applicationState.selectOptionsModalOpen);
    const closeSelectOptionModal = useCardStore(state => state.closeSelectOptionModal);
    const selectedOptions = useCardStore(state => state.immolateState.selectedOptions);
    const setSelectedOptions = useCardStore(state => state.setSelectedOptions);
    if (!selectOptionsModalOpen) return null;
    return (
        <Modal size="auto" title={'Unlocks'} opened={selectOptionsModalOpen} onClose={() => closeSelectOptionModal()}>
            <Container fluid>
                <Switch.Group
                    defaultValue={options}
                    label="Unlocked Items "
                    description="Items that you have unlocked by playing the game"
                    withAsterisk
                    value={selectedOptions}
                    onChange={setSelectedOptions}
                >
                    <SimpleGrid cols={{ base: 2, md: 4, lg: 6 }} mb={'lg'} mt={'xs'}>
                        {
                            options.map((option: string, i: number) => (
                                <Switch key={i} value={option} label={option} />))
                        }
                    </SimpleGrid>
                </Switch.Group>
                <Group justify={'flex-end'}>
                    <Button onClick={() => setSelectedOptions(options)}> Select All </Button>
                    <Button onClick={() => setSelectedOptions([])}> Remove All </Button>
                </Group>
            </Container>
        </Modal>
    )
}
