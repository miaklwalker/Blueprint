import React, { useEffect, useRef, useState} from "react";
import {Box} from "@mantine/core";
import type {ReactNode} from "react";

interface DragScrollProps {
    children: ReactNode;
    className?: string;
    friction?: number;
    style?: React.CSSProperties;
}
export function DragScroll({children, className, friction = 0.95, style}: DragScrollProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const isDraggingRef = useRef(false);
    const startXRef = useRef(0);
    const scrollLeftRef = useRef(0);
    const [momentum, setMomentum] = useState(0);
    const lastXRef = useRef(0);
    const lastTimestampRef = useRef(0);
    const momentumRef = useRef(0);

    const handleMouseDown = (e: React.MouseEvent) => {
        if (!containerRef.current) return;

        isDraggingRef.current = true;
        setIsDragging(true);
        startXRef.current = e.pageX - containerRef.current.offsetLeft;
        scrollLeftRef.current = containerRef.current.scrollLeft;
        lastXRef.current = e.pageX;
        lastTimestampRef.current = Date.now();
        momentumRef.current = 0;
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        if (!containerRef.current) return;

        isDraggingRef.current = true;
        setIsDragging(true);
        startXRef.current = e.touches[0].pageX - containerRef.current.offsetLeft;
        scrollLeftRef.current = containerRef.current.scrollLeft;
        lastXRef.current = e.touches[0].pageX;
        lastTimestampRef.current = Date.now();
        momentumRef.current = 0;
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!isDraggingRef.current || !containerRef.current) return;

        e.preventDefault();
        const x = e.pageX - containerRef.current.offsetLeft;
        const delta = x - startXRef.current;
        containerRef.current.scrollLeft = scrollLeftRef.current - delta;

        // Calculate momentum
        const now = Date.now();
        const elapsed = now - lastTimestampRef.current;
        if (elapsed > 0) {
            const velocity = (lastXRef.current - e.pageX) / elapsed;
            momentumRef.current = velocity * 15;
            lastXRef.current = e.pageX;
            lastTimestampRef.current = now;
        }
    };

    const handleTouchMove = (e: TouchEvent) => {
        if (!isDraggingRef.current || !containerRef.current) return;

        const x = e.touches[0].pageX - containerRef.current.offsetLeft;
        const delta = x - startXRef.current;
        containerRef.current.scrollLeft = scrollLeftRef.current - delta;

        // Calculate momentum
        const now = Date.now();
        const elapsed = now - lastTimestampRef.current;
        if (elapsed > 0) {
            const velocity = (lastXRef.current - e.touches[0].pageX) / elapsed;
            momentumRef.current = velocity * 15;
            lastXRef.current = e.touches[0].pageX;
            lastTimestampRef.current = now;
        }
    };

    const handleMouseUp = () => {
        isDraggingRef.current = false;
        setIsDragging(false);
        setMomentum(momentumRef.current);
    };

    const handleTouchEnd = () => {
        isDraggingRef.current = false;
        setIsDragging(false);
        setMomentum(momentumRef.current);
    };

    // Apply momentum scrolling
    useEffect(() => {
        if (isDragging || !containerRef.current) return;

        let animationId: number;
        let currentMomentum = momentum;

        const animateMomentum = () => {
            if (Math.abs(currentMomentum) < 0.1) return;

            if (containerRef.current) {
                containerRef.current.scrollLeft += currentMomentum;
                currentMomentum *= friction;
                animationId = requestAnimationFrame(animateMomentum);
            }
        };

        if (Math.abs(momentum) > 0.1) {
            animationId = requestAnimationFrame(animateMomentum);
        }

        return () => cancelAnimationFrame(animationId);
    }, [isDragging, momentum, friction]);

    // Add and remove event listeners once. Drag state is read from refs inside the
    // handlers, so the listeners never need to be torn down and reattached mid-drag,
    // and tracking correctly continues even when the cursor leaves the container.
    useEffect(() => {
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        document.addEventListener('touchmove', handleTouchMove, {passive: false});
        document.addEventListener('touchend', handleTouchEnd);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            document.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('touchend', handleTouchEnd);
        };
    }, []);

    return (
        <Box
            ref={containerRef}
            className={className}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            style={{
                overflowX: 'auto',
                overflowY: 'hidden',
                whiteSpace: 'nowrap',
                cursor: isDragging ? 'grabbing' : 'grab',
                userSelect: 'none',
                WebkitOverflowScrolling: 'touch',
                ...style
            }}
        >
            {children}
        </Box>
    );
}
