import {
    ActionIcon,
    Badge,
    Button,
    Card,
    Center,
    Flex,
    Group,
    Indicator,
    Menu,
    Overlay,
    Text,
    Tooltip,
    Transition,
    useMantineTheme
} from "@mantine/core";
import { useHover, useLongPress } from "@mantine/hooks";
import { IconArrowCapsule, IconCalculator, IconChevronDown, IconExternalLink, IconFlag, IconLock } from "@tabler/icons-react";
import { useState } from "react";
import { BuyWrapperProps, LOCATION_TYPES } from "../modules/const.ts";
import { useCardStore } from "../modules/state/store.ts";

export function BuyWrapper({ children, bottomOffset, metaData, horizontal = false }: BuyWrapperProps) {
    const selectedSearchResult = useCardStore(state => state.searchState.selectedSearchResult);
    let sameLocation = selectedSearchResult?.location === metaData?.location;
    let sameAnte = selectedSearchResult?.ante === metaData?.ante;
    let sameIndex = selectedSearchResult?.index === metaData?.index;
    const lockCard = useCardStore(state => state.lockCard);
    const unlockCard = useCardStore(state => state.unlockCard);
    const lockedCards = useCardStore(state => state.lockState.lockedCards);
    const useCardPeek = useCardStore(state => state.applicationState.useCardPeek);
    const cardId = `ante_${metaData?.ante}_${metaData?.location?.toLowerCase()}_${metaData?.index}`
    const isLocked = cardId in lockedCards;
    const handlers = useLongPress(() => {
        if (!useCardPeek) return;
        if (isLocked) {
            unlockCard(cardId);
            analyzeSeed();
        } else {
            lockCard(cardId, metaData?.card);
            analyzeSeed();
        }
    });
    let isSelected = sameAnte && sameIndex && sameLocation;
    const analyzeSeed = useCardStore(state => state.analyzeSeed);
    const { hovered, ref } = useHover();
    const [menuOpen, setMenuOpen] = useState(false);
    const addBuy = useCardStore(state => state.addBuy);
    const removeBuy = useCardStore(state => state.removeBuy);
    const owned = useCardStore(state => state.isOwned);
    let key = `${metaData?.ante}-${metaData?.location}-${metaData?.index}${metaData?.locationType === LOCATION_TYPES.PACK ? `-${metaData?.blind}` : ''}`;
    const cardIsOwned = owned(key);
    const openRerollCalculatorModal = useCardStore(state => state.openRerollCalculatorModal);
    const hasUserAttention = hovered || menuOpen;
    const theme = useMantineTheme()






    const setRerollStartIndex = useCardStore(state => state.setRerollStartIndex);

    const rarityColorMap: { [key: number]: string } = {
        1: "#0093ff",
        2: "#35bd86",
        3: "#ff4c40",
        4: "#ab5bb5",
    }




    return (
        <Center
            pos={'relative'}
            ref={ref}
            h={'100%'}
            style={{ overflow: 'visible' }}
        >
            <Indicator disabled={!cardIsOwned} inline label="Owned" size={16} position={'top-center'}>
                <Tooltip
                    bg={'transparent'}
                    opened={hasUserAttention}
                    events={{ hover: true, focus: true, touch: true }}
                    label={
                        <Flex align={'center'} justify={'space-between'} gap={4}>
                            {/*// @ts-ignore*/}
                            <Badge autoContrast color={metaData?.card?.rarity ? rarityColorMap[metaData?.card?.rarity] : undefined}>
                                <Text span size={'sm'} fw={'bolder'}>{metaData?.index}</Text> {metaData?.name ?? metaData?.card?.name ?? 'Unknown'}
                            </Badge>
                            {
                                metaData?.card &&
                                metaData.card?.edition &&
                                metaData.card?.edition !== '' &&
                                metaData.card?.edition !== 'No Edition' &&
                                <Badge autoContrast color={theme.colors.gray[0]} variant="filled">
                                    {metaData?.card?.edition}
                                </Badge>
                            }
                        </Flex>
                    }
                    position="top"
                    withinPortal
                    transitionProps={{ transition: 'slide-up', duration: 300, enterDelay: 350, exitDelay: 150 }}
                >
                    <Card
                        {...handlers}
                        style={{
                            boxShadow: isSelected ? '0 0 12px 12px rgba(255,255,255,0.3)' : 'none',
                            transform: hasUserAttention ? 'scale(1.15)' : 'none',
                            transition: 'transform 0.4s ease',
                            zIndex: hasUserAttention ? 20 : 0
                        }}
                    >
                        <Card.Section>
                            {isLocked && (
                                <Tooltip label="Card is locked. Long-press to unlock">
                                    <ActionIcon
                                        variant="filled"
                                        color="yellow"
                                        size="xs"
                                        style={{
                                            position: 'absolute',
                                            top: '5px',
                                            right: '5px',
                                            zIndex: 10,
                                        }}
                                    >
                                        <IconLock size={10} />
                                    </ActionIcon>
                                </Tooltip>
                            )}
                            {cardIsOwned && <Overlay color="#000" backgroundOpacity={0.55} blur={1} />}
                            {children}
                        </Card.Section>
                    </Card>
                </Tooltip>
            </Indicator>
            <Transition
                mounted={hasUserAttention}
                transition={horizontal ? "slide-right" : "slide-down"}
                duration={200}
                enterDelay={350}
                exitDelay={150}
                timingFunction="ease"
            >
                {
                    (styles) => (
                        <Group
                            wrap="nowrap"
                            gap={0}
                            pos={'absolute'}
                            style={{ ...styles, zIndex: 1 }}
                            left={horizontal ? "200px" : 'unset'}
                            top={horizontal ? 'unset' : bottomOffset ? `calc(80% + ${bottomOffset}px)` : '80%'}
                        >
                            <Button
                                color={cardIsOwned ? 'red' : 'green'}
                                style={{
                                    borderTopRightRadius: 0,
                                    borderBottomRightRadius: 0,
                                }}
                                onClick={() => {
                                    if (!metaData) return;
                                    if (cardIsOwned) {
                                        removeBuy(metaData);
                                        analyzeSeed()
                                    } else {
                                        addBuy(metaData);
                                        analyzeSeed()
                                    }
                                }}
                            >
                                {cardIsOwned ? "Undo" : "Buy"}
                            </Button>
                            <Menu
                                trigger={'click-hover'}
                                transitionProps={{ transition: 'pop' }}
                                position="bottom-end"
                                withinPortal
                                onOpen={() => setMenuOpen(true)}
                                onClose={() => setMenuOpen(false)}
                                closeDelay={300}
                            >
                                <Menu.Target>
                                    <ActionIcon
                                        variant="filled"
                                        color={cardIsOwned ? 'red' : 'green'}
                                        size={36}
                                        style={{
                                            borderTopLeftRadius: 0,
                                            borderBottomLeftRadius: 0,
                                            border: 0,
                                            borderLeft: '1px solid var(--mantine-color-body)'
                                        }}
                                    >
                                        <IconChevronDown size={16} stroke={1.5} />
                                    </ActionIcon>
                                </Menu.Target>
                                <Menu.Dropdown >
                                    {
                                        metaData?.link &&
                                        <Menu.Item
                                            leftSection={<IconExternalLink size={16} stroke={1.5}
                                                color={theme.colors.blue[5]} />}
                                            component={'a'}
                                            href={metaData?.link}
                                            target={'_blank'}
                                        >
                                            Wiki Page
                                        </Menu.Item>
                                    }
                                    {
                                        <Menu.Item
                                            leftSection={<IconArrowCapsule
                                                size={16}
                                                stroke={1.5}
                                                color={theme.colors.blue[5]}
                                            />}
                                            onClick={
                                                () => {
                                                    if (isLocked) {
                                                        unlockCard(cardId);
                                                        analyzeSeed();
                                                    } else {
                                                        lockCard(cardId, metaData?.card);
                                                        analyzeSeed();
                                                    }
                                                }
                                            }
                                        >
                                            {!isLocked ? 'Re roll' : 'Undo'}
                                        </Menu.Item>
                                    }
                                    {
                                        metaData?.locationType === LOCATION_TYPES.SHOP &&
                                        <Menu.Item
                                            leftSection={<IconCalculator size={16} stroke={1.5} color={theme.colors.blue[5]} />}
                                            onClick={() => { openRerollCalculatorModal(metaData) }}
                                        >
                                            Calc Reroll
                                        </Menu.Item>
                                    }
                                    {
                                        metaData?.locationType === LOCATION_TYPES.SHOP &&
                                        <Menu.Item
                                            leftSection={<IconFlag size={16} stroke={1.5} color={theme.colors.orange[5]} />}
                                            onClick={() => setRerollStartIndex(metaData?.index ?? 0)}
                                        >
                                            Mark as Start
                                        </Menu.Item>
                                    }
                                </Menu.Dropdown>
                            </Menu>


                        </Group>


                    )
                }
            </Transition>
        </Center>
    )
}
