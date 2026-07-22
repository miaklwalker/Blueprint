import React, { useEffect, useState } from "react";
import {ActionIcon, Button, Group, InputLabel, List, Loader, NumberInput, Popover, Stack, Text} from "@mantine/core";
import { IconChevronLeft, IconChevronRight, IconInfoCircle } from "@tabler/icons-react";
import { useDebouncedCallback, useDisclosure } from "@mantine/hooks";
import { MAX_SHOP_QUEUE_DEPTH } from "../modules/ImmolateWrapper";
import { DEFAULT_SHOP_WINDOW, useCardStore, useShopWindow } from "../modules/state/store.ts";
import { useShopQueue } from "../modules/state/shopQueueProvider.tsx";

/**
 * Picks which slice of the shop queue is rendered. Past Search Depth the slice is
 * generated on demand, so the offset is bounded only by the engine's backstop.
 */
export default function ShopWindowControls() {
    const { total, loading, isDeep } = useShopQueue();
    const { offset: windowOffset, size: windowSize } = useShopWindow();
    const selectedAnte = useCardStore(state => state.applicationState.selectedAnte);
    const searchDepth = useCardStore(state => state.immolateState.cardsPerAnte);
    const setShopWindowOffset = useCardStore(state => state.setShopWindowOffset);
    const setShopWindowSize = useCardStore(state => state.setShopWindowSize);
    const [helpOpened, { open: openHelp, close: closeHelp }] = useDisclosure(false);

    const [localOffset, setLocalOffset] = useState<number | string>(windowOffset);
    const [localSize, setLocalSize] = useState<number | string>(windowSize);
    useEffect(() => { setLocalOffset(windowOffset); }, [windowOffset]);
    useEffect(() => { setLocalSize(windowSize); }, [windowSize]);

    const debouncedSetOffset = useDebouncedCallback(setShopWindowOffset, 250);
    const debouncedSetSize = useDebouncedCallback(setShopWindowSize, 250);

    const isEmpty = total === 0 || windowOffset >= total;
    const firstShown = isEmpty ? 0 : windowOffset + 1;
    const lastShown = Math.min(windowOffset + windowSize, total);
    const atCeiling = windowOffset + windowSize >= MAX_SHOP_QUEUE_DEPTH;

    return (
        <div id="shop-window-controls">
            <Popover opened={helpOpened} width={340} position={'bottom-start'} withArrow shadow={'md'}>
                <Popover.Target>
                    <Group gap={6} align={'center'} onMouseEnter={openHelp} onMouseLeave={closeHelp} w={'fit-content'}>
                        <InputLabel style={{ cursor: 'help' }}>Shop Depth</InputLabel>
                        <ActionIcon variant={'subtle'} color={'gray'} size={'xs'} aria-label={'Shop window help'}>
                            <IconInfoCircle size={14} />
                        </ActionIcon>
                    </Group>
                </Popover.Target>
                <Popover.Dropdown onMouseEnter={openHelp} onMouseLeave={closeHelp}>
                    <Stack gap={'xs'}>
                        <Text fz={'sm'} fw={600}>Shop Window</Text>
                        <Text fz={'xs'} c={'dimmed'}>
                            The shop queue for an ante can run thousands of cards deep. Rendering all
                            of them is slow and leaves you scrolling forever, so only a slice is shown
                            at a time. This picks the slice.
                        </Text>
                        <List fz={'xs'} spacing={4} c={'dimmed'}>
                            <List.Item>
                                <Text component={'span'} fz={'xs'} fw={600}>Offset</Text> — the card the
                                slice starts at. 0 is the first card in the shop.
                            </List.Item>
                            <List.Item>
                                <Text component={'span'} fz={'xs'} fw={600}>Window</Text> — how many
                                cards are rendered. Smaller is faster; 200 or less stays snappy.
                            </List.Item>
                            <List.Item>
                                The arrows page back and forward one full window at a time.
                            </List.Item>
                        </List>
                        <Text fz={'xs'} c={'dimmed'}>
                            Each ante keeps its own window, so digging deep into one ante leaves the
                            others where you left them. Antes you have not touched start at{' '}
                            0&ndash;{DEFAULT_SHOP_WINDOW.size}.
                        </Text>
                        <Text fz={'xs'} c={'dimmed'}>
                            Search Depth (currently <Text component={'span'} fz={'xs'} fw={600}>{searchDepth}</Text>)
                            is how many cards the analysis generates up front. Move the window past it
                            and the extra cards are generated on the fly for ante {selectedAnte} only —
                            it takes a moment, and those cards will not turn up in search, which
                            still only covers the first {searchDepth}.
                        </Text>
                    </Stack>
                </Popover.Dropdown>
            </Popover>

            <Group gap={'xs'} align={'flex-end'} wrap={'nowrap'} mb={'xs'}>
                <NumberInput
                    label={'Offset'}
                    flex={1}
                    min={0}
                    max={MAX_SHOP_QUEUE_DEPTH - windowSize}
                    step={windowSize}
                    value={localOffset}
                    onChange={(val) => {
                        setLocalOffset(val);
                        if (val === '') return;
                        const num = typeof val === 'string' ? parseInt(val) : val;
                        if (Number.isNaN(num)) return;
                        debouncedSetOffset(num);
                    }}
                    onBlur={() => {
                        const num = typeof localOffset === 'string' ? parseInt(localOffset) : localOffset;
                        if (localOffset === '' || Number.isNaN(num)) setLocalOffset(windowOffset);
                    }}
                />
                <NumberInput
                    label={'Window'}
                    flex={1}
                    min={1}
                    max={1000}
                    value={localSize}
                    onChange={(val) => {
                        setLocalSize(val);
                        if (val === '') return;
                        const num = typeof val === 'string' ? parseInt(val) : val;
                        if (Number.isNaN(num)) return;
                        debouncedSetSize(num);
                    }}
                    onBlur={() => {
                        const num = typeof localSize === 'string' ? parseInt(localSize) : localSize;
                        if (localSize === '' || Number.isNaN(num)) setLocalSize(windowSize);
                    }}
                />
                <Button.Group>
                    <Button
                        variant={'default'}
                        disabled={windowOffset === 0}
                        onClick={() => setShopWindowOffset(Math.max(0, windowOffset - windowSize))}
                        aria-label={'Previous window'}
                    >
                        <IconChevronLeft size={16} />
                    </Button>
                    <Button
                        variant={'default'}
                        // Past Search Depth the next window is generated on demand,
                        // so this only stops at the engine's backstop.
                        disabled={atCeiling}
                        onClick={() => setShopWindowOffset(windowOffset + windowSize)}
                        aria-label={'Next window'}
                    >
                        <IconChevronRight size={16} />
                    </Button>
                </Button.Group>
            </Group>
            {
                loading ? (
                    <Group gap={'xs'}>
                        <Loader size={'xs'} />
                        <Text fz={'xs'} c={'dimmed'}>
                            Generating cards {windowOffset + 1}&ndash;{windowOffset + windowSize}&hellip;
                        </Text>
                    </Group>
                ) : total === 0 ? (
                    // No analysis yet (no seed) - there is nothing to report.
                    null
                ) : isEmpty ? (
                    <Group gap={'xs'}>
                        <Text fz={'xs'} c={'orange'}>
                            Could not generate past card {total}.
                        </Text>
                        <Button size={'compact-xs'} variant={'subtle'} onClick={() => setShopWindowOffset(0)}>
                            Reset
                        </Button>
                    </Group>
                ) : (
                    <Text fz={'xs'} c={isDeep ? 'yellow' : 'dimmed'}>
                        Showing {firstShown}&ndash;{lastShown}
                        {isDeep && ' — past Search Depth (not searchable)'}
                    </Text>
                )
            }
        </div>
    )
}
