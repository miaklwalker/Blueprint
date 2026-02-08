import React from "react";
import {
    Anchor,
    AppShell,
    Button,
    Center, Divider,
    Flex,
    HoverCard,
    HoverCardDropdown,
    HoverCardTarget,
    Text, Title
} from "@mantine/core";
import {IconCoffee, IconHeart} from "@tabler/icons-react";
import {useQuery} from "@tanstack/react-query";
import ShinyText from "../../shinyText/shinyText.tsx";
import {GaEvent} from "../../../modules/useGA.ts";


export default function Footer() {
    const {data: supporters, isPending: isPending} = useQuery<Array<{ name: string, subscription: boolean }>>({
        queryKey: ['supporters'],
        queryFn: async () => {
            const response = await fetch('https://ttyyetpmvt.a.pinggy.link/supporters', {
                method: 'POST',
            });
            if (!response.ok) {
                console.error(response);
                return [{name: 'pifreak', subscription: true}]
            }
            return response.json();
        }
    })
    return (
        <AppShell.Footer p={'xs'}>
            <Center w={'100%'}>
                <Flex align={'center'} direction={{base: "column", sm: "row"}} gap={'sm'}>
                    <Text ta={'center'} fz={'xs'}>
                        Made by Michael Walker with {' '}
                        <Anchor fz={'xs'} href={"https://mantine.dev/"} target={"_blank"}> Mantine </Anchor>,
                        <Anchor fz={'xs'} href={'https://vite.dev/'}> Vite </Anchor>,
                        <Anchor fz={'xs'} href={'https://github.com/pmndrs/zustand'}> Zustand </Anchor>,
                        <Anchor fz={'xs'} href={'https://github.com/MathIsFun0/Immolate'}> Immolate </Anchor>.
                    </Text>
                    <Button
                        component={'a'}
                        target={'_blank'}
                        href={'https://buymeacoffee.com/ouisihai2'}
                        size={'compact-sm'}
                        color={'yellow'}
                        leftSection={<IconCoffee/>}
                    >
                        Buy me a coffee
                    </Button>
                    <HoverCard onOpen={() => GaEvent('view_supporters')}>
                        <HoverCardTarget>
                            <Text ta={'center'} fz={'xs'}>
                                <IconHeart size={'11'}/> Coffee Buyers
                            </Text>
                        </HoverCardTarget>
                        <HoverCardDropdown w={'100%'} maw={400}>
                            <Title order={4}>Coffee Buyers</Title>
                            {
                                !isPending &&
                                supporters?.length &&
                                supporters.length > 0 && (
                                    <>
                                        <Text fz={'xs'} c={'dimmed'}>
                                            These awesome people have bought me a coffee to support my work and have kept me
                                            motivated to keep improving Blueprint!:
                                        </Text>
                                        <Divider mb={'sm'}/>
                                    </>
                                )
                            }
                            {
                                supporters?.length ?
                                    supporters
                                        .sort((a, b) => {
                                            if (a.subscription && !b.subscription) return -1;
                                            if (!a.subscription && b.subscription) return 1;
                                            return 0;
                                        })
                                        .map((s, i) => {
                                            if (s.subscription) {
                                                return <Text key={i} fz={'sm'}><ShinyText text={s.name}
                                                                                          speed={3}/></Text>
                                            } else {
                                                return <Text key={i} fz={'sm'}>{s.name}</Text>
                                            }
                                        })
                                    : <Text fz={'xs'}>No supporters yet</Text>}
                            <Divider my={'sm'}/>
                            <Text fz={'xs'} c={'dimmed'}>
                                If you have recently bought me a coffee and don&#39;t see your name here,
                                please give it approximately 5 minutes to appear.
                            </Text>
                        </HoverCardDropdown>
                    </HoverCard>
                </Flex>

            </Center>

        </AppShell.Footer>
    )
}
