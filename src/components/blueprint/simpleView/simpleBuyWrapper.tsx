// src/components/SimpleBuyerWrapper.tsx
import React, {useRef} from "react";
import {IconLock} from "@tabler/icons-react";
import {ActionIcon, Box, Tooltip} from "@mantine/core";
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
    const isLocked = cardId in lockedCards;
    
    const startXRef = useRef<number>(0);
    const startYRef = useRef<number>(0);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const longPressTriggeredRef = useRef<boolean>(false);

    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        if (isLocked) {
            unlockCard(cardId);
        } else {
            lockCard(cardId, card);
        }
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        startXRef.current = e.clientX;
        startYRef.current = e.clientY;
        longPressTriggeredRef.current = false;

        // Set up long press timer
        timeoutRef.current = setTimeout(() => {
            longPressTriggeredRef.current = true;
            if (isLocked) {
                unlockCard(cardId);
            } else {
                lockCard(cardId, card);
            }
        }, 500); // 500ms long press duration
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        // If already triggered, don't cancel
        if (longPressTriggeredRef.current) return;

        const deltaX = Math.abs(e.clientX - startXRef.current);
        const deltaY = Math.abs(e.clientY - startYRef.current);
        
        // If mouse moved more than threshold, cancel the long press
        if (deltaX+deltaY > 4) {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
            }
        }
    };

    const handleMouseUp = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
        longPressTriggeredRef.current = false;
    };

    return (
        <Box
            onContextMenu={handleContextMenu}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            style={{
                position: 'relative',
                cursor: 'context-menu',
            }}
        >
            <Box
                style={{
                    border: isLocked ? '1px solid #FFD700' : 'none',
                    borderRadius: '2px',
                    padding: 0,
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
