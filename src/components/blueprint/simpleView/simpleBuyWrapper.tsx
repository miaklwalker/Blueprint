// src/components/SimpleBuyerWrapper.tsx
import React from "react";
import {IconLock} from "@tabler/icons-react";
import {ActionIcon, Tooltip, Box} from "@mantine/core";
import {useLongPress} from "@mantine/hooks"
import {useCardStore} from "../../../modules/state/store.ts";


interface SimpleBuyerWrapperProps {
    card: any;
    cardId: string;
    children: React.ReactNode;
}

export function SimpleBuyerWrapper({card, cardId, children}: SimpleBuyerWrapperProps) {
    const lockedCards = useCardStore(state => state.lockState.lockedCards);
    const lockCard = useCardStore(state => state.lockCard);
    const unlockCard = useCardStore(state => state.unlockCard);
    const analyzeSeed = useCardStore(state => state.analyzeSeed);
    const isLocked = cardId in lockedCards;

    const handlers = useLongPress(()=>{
        if (isLocked) {
            unlockCard(cardId);
            analyzeSeed();
        } else {
            lockCard(cardId, card);
            analyzeSeed();
        }
    });

    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        if (isLocked) {
            unlockCard(cardId);
            analyzeSeed();
        } else {
            lockCard(cardId, card);
            analyzeSeed();
        }
    };

    return (
        <Box
            onContextMenu={handleContextMenu}
            {...handlers}
            style={{
                position: 'relative',
                cursor: 'context-menu',
            }}
        >
            <Box
                style={{
                    border: isLocked ? '2px solid #FFD700' : 'none',
                    borderRadius: '4px',
                    padding: isLocked ? '2px' : '4px',
                }}
            >
                {children}
            </Box>

            {isLocked && (
                <Tooltip label="Card is locked. Right-click to unlock">
                    <ActionIcon
                        variant="filled"
                        color="yellow"
                        size="xs"
                        style={{
                            position: 'absolute',
                            top: '5px',
                            right: '5px',
                            zIndex: 10,
                        }}
                    >
                        <IconLock size={10}/>
                    </ActionIcon>
                </Tooltip>
            )}
        </Box>
    );
}
