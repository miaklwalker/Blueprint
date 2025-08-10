import {
    Anchor,
    AppShell,
    Button,
    Center,
    Flex,
    HoverCard,
    HoverCardDropdown,
    HoverCardTarget,
    Text
} from "@mantine/core";
import {IconCoffee, IconHeart} from "@tabler/icons-react";


export default function Footer({ supporters } :{ supporters?: {name:string}[] }) {
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
                        {/*<Anchor fz={'xs'} href={'https://github.com/miaklwalker/Blueprint'}> source code </Anchor>.*/}
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
                    <HoverCard >
                        <HoverCardTarget>
                            <Text ta={'center'} fz={'xs'}>
                             <IconHeart size={'11'}/> Supporters
                            </Text>
                        </HoverCardTarget>
                        <HoverCardDropdown>
                            {supporters?.length ? supporters.map((s, i) => (
                                <Text key={i} fz={'xs'}>{s.name}</Text>
                            )) : <Text fz={'xs'}>No supporters yet</Text>}
                        </HoverCardDropdown>
                    </HoverCard >
                </Flex>

            </Center>

        </AppShell.Footer>
    )
}