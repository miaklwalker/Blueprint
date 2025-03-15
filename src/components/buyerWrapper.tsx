import {useCardStore} from "../modules/state/store.ts";
import {useHover} from "@mantine/hooks";
import {Button, Card, Center, Indicator, Overlay, Tooltip, Transition, Text, ActionIcon} from "@mantine/core";
import {BuyWrapperProps} from "../modules/const.ts";
import {IconExternalLink} from "@tabler/icons-react";

export function BuyWrapper({children, bottomOffset, metaData, horizontal = false}: BuyWrapperProps) {
    const selectedSearchResult = useCardStore(state => state.searchState.selectedSearchResult);
    let sameLocation = selectedSearchResult?.location === metaData?.location;
    let sameAnte = selectedSearchResult?.ante === metaData?.ante;
    let sameIndex = selectedSearchResult?.index === metaData?.index;
    let isSelected = sameAnte && sameIndex && sameLocation;

    const {hovered, ref} = useHover();
    const addBuy = useCardStore(state => state.addBuy);
    const removeBuy = useCardStore(state => state.removeBuy);
    const owned = useCardStore(state => state.isOwned);
    let key = `${metaData?.ante}-${metaData?.location}-${metaData?.index}`;
    const cardIsOwned = owned(key);
    const hasUserAttention = hovered;


    return (
        <Center pos={'relative'} ref={ref} h={'100%'} style={{overflow: 'visible'}}>
            <Indicator disabled={!cardIsOwned} inline label="Owned" size={16} position={'top-center'}>
                <Tooltip
                    events={{hover: true, focus: true, touch: true}}
                    label={
                        <Text ta={'center'}>
                            {metaData?.name} <ActionIcon size={'xs'}> <IconExternalLink/> </ActionIcon>
                        </Text>
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

                        <Button
                            pos={'absolute'}
                            style={{...styles, zIndex: 1}}
                            left={horizontal ? "200px" : 'unset'}
                            top={horizontal ? 'unset' : bottomOffset ? `calc(80% + ${bottomOffset}px)` : '80%'}
                            color={cardIsOwned ? 'red' : 'green'}
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

                    )
                }
            </Transition>
        </Center>
    )
}
