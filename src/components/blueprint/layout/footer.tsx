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
import ShinyText from "../../shinyText/shinyText.tsx";


export default function Footer({ supporters } :{ supporters?: {name:string, subscription: boolean}[] }) {
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
                            {
                                supporters?.length ?
                                    supporters
                                        .sort((a, b) => {
                                            if (a.subscription && !b.subscription) return -1;
                                            if (!a.subscription && b.subscription) return 1;
                                            return 0;
                                        })
                                        .map((s, i) => {
                                        if(s.subscription){
                                            return <Text key={i} fz={'sm'}><ShinyText  text={s.name} speed={3}/></Text>
                                        }else{
                                            return <Text key={i} fz={'sm'}>{s.name}</Text>
                                        }
                                    })
                                    : <Text fz={'xs'}>No supporters yet</Text>}
                        </HoverCardDropdown>
                    </HoverCard >
                </Flex>

            </Center>

        </AppShell.Footer>
    )
}
