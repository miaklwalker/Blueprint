import {useCardStore} from "../modules/state/store.ts";
import {useHover} from "@mantine/hooks";
import {
    ActionIcon, Badge,
    Button,
    Card,
    Center,
    Flex,
    Group,
    Indicator,
    Menu,
    Overlay,
    Tooltip,
    Transition,
    useMantineTheme
} from "@mantine/core";
import {BuyWrapperProps} from "../modules/const.ts";
import {IconChevronDown, IconExternalLink} from "@tabler/icons-react";

export function BuyWrapper({children, bottomOffset, metaData, horizontal = false}: BuyWrapperProps) {
    const selectedSearchResult = useCardStore(state => state.searchState.selectedSearchResult);
    let sameLocation = selectedSearchResult?.location === metaData?.location;
    let sameAnte = selectedSearchResult?.ante === metaData?.ante;
    let sameIndex = selectedSearchResult?.index === metaData?.index;
    let isSelected = sameAnte && sameIndex && sameLocation;

    const {hovered, ref} = useHover();
    const {hovered: menuHovered, ref: menuRef} = useHover();
    const addBuy = useCardStore(state => state.addBuy);
    const removeBuy = useCardStore(state => state.removeBuy);
    const owned = useCardStore(state => state.isOwned);
    let key = `${metaData?.ante}-${metaData?.location}-${metaData?.index}`;
    const cardIsOwned = owned(key);
    const hasUserAttention = hovered || menuHovered;
    const theme = useMantineTheme()

    const rarityColorMap: { [key: number]: string } = {
        1: "#0093ff",
        2: "#35bd86",
        3: "#ff4c40",
        4: "#ab5bb5",
    }
    return (
        <Center pos={'relative'} ref={ref} h={'100%'} style={{overflow: 'visible'}}>
            <Indicator disabled={!cardIsOwned} inline label="Owned" size={16} position={'top-center'}>
                <Tooltip
                    opened={hasUserAttention}
                    events={{hover: true, focus: true, touch: true}}
                    label={
                        <Flex align={'center'} justify={'space-between'} gap={4}>
                            <Badge autoContrast color={metaData?.rarity ? rarityColorMap[metaData?.rarity] : undefined}>
                                {metaData?.name}
                            </Badge>
                        </Flex>
                    }
                    position="top"
                    withinPortal
                    transitionProps={{transition: 'slide-up', duration: 300, enterDelay: 350, exitDelay: 150}}
                >
                    <Card style={{
                        boxShadow: isSelected ? '0 0 12px 12px rgba(255,255,255,0.3)' : 'none',
                        transform: hasUserAttention ? 'scale(1.15)' : 'none',
                        transition: 'transform 0.4s ease',
                        zIndex: hasUserAttention ? 20 : 0
                    }}>
                        <Card.Section>
                            {cardIsOwned && <Overlay color="#000" backgroundOpacity={0.55} blur={1}/>}
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
                            style={{...styles, zIndex: 1}}
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
                                    } else {
                                        addBuy(metaData);
                                    }
                                }}
                            >
                                {cardIsOwned ? "Undo" : "Buy"}
                            </Button>
                            <Menu trigger={'click-hover'} transitionProps={{transition: 'pop'}} position="bottom-end"
                                  withinPortal closeDelay={300}>
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
                                        <IconChevronDown size={16} stroke={1.5}/>
                                    </ActionIcon>
                                </Menu.Target>
                                <Menu.Dropdown ref={menuRef}>
                                    {
                                        metaData?.link &&
                                        <Menu.Item
                                            leftSection={<IconExternalLink size={16} stroke={1.5}
                                                                           color={theme.colors.blue[5]}/>}
                                            component={'a'}
                                            href={metaData?.link}
                                            target={'_blank'}
                                        >
                                            Balatro Fandom Page
                                        </Menu.Item>
                                    }
                                    {/*<Menu.Item*/}
                                    {/*    leftSection={<IconBookmark size={16} stroke={1.5} color={theme.colors.blue[5]} />}*/}
                                    {/*>*/}
                                    {/*    Sell*/}
                                    {/*</Menu.Item>*/}
                                </Menu.Dropdown>
                            </Menu>

                        </Group>


                    )
                }
            </Transition>
        </Center>
    )
}
