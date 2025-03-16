import {ActionIcon, Anchor, AppShell, Button, Center, Group, Stack, Text} from "@mantine/core";
import {IconBrandGithubFilled, IconCoffee} from "@tabler/icons-react";


export default function Footer() {
    //
    return (
        <AppShell.Footer>
            <Center>
                <Group>

                    <Stack gap={0}>
                        <Text ta={'center'} fz={'xs'}>
                            Made with {' '}
                            <Anchor fz={'xs'} href={"https://mantine.dev/"} target={"_blank"}  > Mantine </Anchor>,
                            <Anchor fz={'xs'} href={'https://vite.dev/'}> Vite </Anchor>,
                            <Anchor fz={'xs'} href={'https://github.com/pmndrs/zustand'}> Zustand </Anchor>,
                            <Anchor fz={'xs'} href={'https://github.com/MathIsFun0/Immolate'}> Immolate </Anchor>
                        </Text>
                        <Text ta={'center'} fz={'xs'}>
                            Made by Michael Walker 2025
                        </Text>
                    </Stack>


                    {/*<ActionIcon component={'a'} href={'https://github.com/miaklwalker/Blueprint'} target={'_blank'} radius={'xl'} variant={'outline'} color={'white'}>*/}
                    {/*    <IconBrandGithubFilled/>*/}
                    {/*</ActionIcon>*/}
                    {/*<Button component={'a'} target={'_blank'} href={'https://buymeacoffee.com/ouisihai2'} size={'compact-sm'} color={'yellow'} leftSection={<IconCoffee/>}>Buy me a coffee</Button>*/}
                </Group>


            </Center>

        </AppShell.Footer>
    )
}