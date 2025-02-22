import {AppShell, Text} from "@mantine/core";

export function Footer() {
    return (
        <AppShell.Footer>
            <Text ta={'center'} fz={'xs'}>
                Made with Mantine, Vite, Zustand, Immolate.
            </Text>
            <Text ta={'center'} fz={'xs'}>
                Made by Michael Walker 2025
            </Text>
        </AppShell.Footer>
    )
}