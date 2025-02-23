import {useViewportSize} from "@mantine/hooks";
import {Accordion, AppShell, ScrollArea, Timeline, Text, Paper, Badge, Stack, Group, Button} from "@mantine/core";
import {CodeHighlight} from "@mantine/code-highlight";
import {useBlueprintStore} from "../../../modules/store.js";
import {useMemo} from "react";
import {IconCurrency, IconCurrencyDollar} from "@tabler/icons-react";
import {blinds} from "../../../modules/const.js";


export function Output() {
    const results = useBlueprintStore(state => state.results)
    const asideSizes = {base: 180, md: 280, lg: 520}
    const maxRuns = useBlueprintStore(state => state.ante)
    const buys = useBlueprintStore(state => state.buys);
    const removeBuys = useBlueprintStore(state => state.removeCard)
    const sells = useBlueprintStore(state => state.sells);

    const transactionHistory = useMemo(() => {
        let mappedBuys = Object
            .values(buys)
            .map(buy => ({
                    ...buy,
                    original: buy,
                    ante: Number(buy.ante?.split('ANTE ')[1]),
                    blind: blinds.indexOf(buy.blind),
                    cardName: buy.cardName,
                })
            )
        let mappedSells = Object
            .values(sells)
            .map(sell => ({
                    ...sell,
                    original: sell,
                    ante: Number(sell.ante?.split('ANTE ')[1]),
                    blind: blinds.indexOf(sell.blind),
                    cardName: sell.cardName,
                })
            )

        let ante = 1;
        let blind = 0
        let purchaseHistory = []
        while ((mappedBuys.length + mappedSells.length)) {
            if (ante >= maxRuns) {
                console.log("maxRuns")
                break
            }
            for (let buy of mappedBuys) {
                if (buy.ante === ante && buy.blind === blind) {
                    buy.type = 'buy'
                    purchaseHistory.push(buy)
                }
            }
            for (let sell of mappedSells) {
                if (sell.ante === ante && sell.blind === blind) {
                    sell.type = 'sell'
                    purchaseHistory.push(sell)
                }
            }

            if (blind !== 0 && blind % 2 === 0) {
                ante++
                blind = 0
            } else {
                blind++;
            }
        }
        return purchaseHistory
    }, [maxRuns, buys, sells]);


    return (
        <AppShell.Aside>
            <Accordion variant="separated" defaultValue="Shopping List">
                <Accordion.Item value={'Seed Output'}>
                    <Accordion.Control> Generated Seed Output </Accordion.Control>
                    <Accordion.Panel>
                        <ScrollArea
                            type="scroll"
                            h={'50vh'}
                            w={asideSizes}
                        >
                            <CodeHighlight
                                w={{base: '100%', lg: asideSizes.lg}}
                                maw={'100%'}
                                code={results || ''}
                                language={'plaintext'}
                            />
                        </ScrollArea>
                    </Accordion.Panel>
                </Accordion.Item>
                <Accordion.Item value={'Shopping List'}>
                    <Accordion.Control> Shopping List </Accordion.Control>
                    <Accordion.Panel pt={'md'}>
                        <Paper>
                            <ScrollArea
                                type="auto"
                                h={'60vh'}
                                w={asideSizes}
                            >
                                <Timeline color={'blue'} active={transactionHistory?.length ?? 0} bulletSize={24}
                                          lineWidth={2}>
                                    {
                                        transactionHistory &&
                                        transactionHistory.map((transaction, i) => {
                                            return (
                                                <Timeline.Item
                                                    color={transaction.type === 'buy' ? 'green' : 'red'}
                                                    key={i} bullet={<IconCurrencyDollar/>}
                                                    title={`Ante: ${transaction.ante} Blind: ${transaction.blind}`}
                                                >
                                                    <Group justify={'space-between'}>
                                                        <Stack>
                                                            <Text c="dimmed" size="sm">
                                                                {transaction.cardName}
                                                            </Text>
                                                            <Badge size="xs"
                                                                   mt={4}>{transaction.type.toUpperCase()} </Badge>
                                                        </Stack>
                                                        <Button color={'red'}
                                                                onClick={() => removeBuys({...transaction, selectedAnte: transaction.original.ante,selectedBlind:transaction.original.blind })}> Undo </Button>
                                                    </Group>


                                                </Timeline.Item>
                                            )
                                        })
                                    }
                                </Timeline>
                            </ScrollArea>
                        </Paper>
                    </Accordion.Panel>
                </Accordion.Item>
            </Accordion>

        </AppShell.Aside>
    )
}