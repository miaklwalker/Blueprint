import {useViewportSize} from "@mantine/hooks";
import {AppShell, ScrollArea} from "@mantine/core";
import {CodeHighlight} from "@mantine/code-highlight";
import {useBlueprintStore} from "../../../modules/store.js";


export function Output() {
    const results = useBlueprintStore(state => state.results)
    const asideSizes = {base: 200, md: 300, lg: 550}
    return (
        <AppShell.Aside>
            <ScrollArea
                w={'100%'}
                h={'100%'}
                type="scroll"
            >
                <CodeHighlight
                    w={{base: '100%', lg: asideSizes.lg}}
                    maw={'100%'}
                    code={results || ''}
                    language={'plaintext'}
                />
            </ScrollArea>
        </AppShell.Aside>
    )
}