import {useCardStore} from "../modules/state/store.ts";
import {useHover} from "@mantine/hooks";
import {Button, Card, Center, Indicator, Overlay, Transition} from "@mantine/core";
import {BuyWrapperProps} from "../modules/const.ts";

export function BuyWrapper({children, bottomOffset, topOffset, metaData, horizontal = false}: BuyWrapperProps) {
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
            </Indicator>
            <Transition
                mounted={hasUserAttention}
                transition={horizontal ? "slide-left": "slide-up" }
                duration={200}
                enterDelay={350}
                exitDelay={150}
                timingFunction="ease"
            >
                {(styles) => (
                    <Button
                        pos={'absolute'}
                        style={styles}
                        right={horizontal ? "200px" : 'unset'}
                        bottom={horizontal ? "unset" : topOffset ? `calc(80% + ${topOffset}px)` : '80%'}
                        color={'blue'}
                    >
                        wiki
                    </Button>
                )}
            </Transition>
            <Transition
                mounted={hasUserAttention}
                transition={horizontal ? "slide-right": "slide-down" }
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
                            color={'red'}
                            onClick={() => {
                                if (!metaData) return;
                                if (cardIsOwned) {
                                    removeBuy(metaData);
                                } else {
                                    addBuy(metaData);
                                }
                            }}
                        >
                            {cardIsOwned ? "undo" : "Buy"}
                        </Button>
                    )
                }
            </Transition>
        </Center>
    )
}
