import React, {ReactNode, useEffect, useRef, useState} from "react";
import {Box} from "@mantine/core";

interface DragScrollProps {
    children: ReactNode;
    className?: string;
    friction?: number;
    style?: React.CSSProperties;
}
export function DragScroll({children, className, friction = 0.95, style}: DragScrollProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const [momentum, setMomentum] = useState(0);
    const [lastX, setLastX] = useState(0);
    const [lastTimestamp, setLastTimestamp] = useState(0);

    const handleMouseDown = (e: React.MouseEvent) => {
        if (!containerRef.current) return;

        setIsDragging(true);
        setStartX(e.pageX - containerRef.current.offsetLeft);
        setScrollLeft(containerRef.current.scrollLeft);
        setLastX(e.pageX);
        setLastTimestamp(Date.now());
        setMomentum(0);
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        if (!containerRef.current) return;

        setIsDragging(true);
        setStartX(e.touches[0].pageX - containerRef.current.offsetLeft);
        setScrollLeft(containerRef.current.scrollLeft);
        setLastX(e.touches[0].pageX);
        setLastTimestamp(Date.now());
        setMomentum(0);
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!isDragging || !containerRef.current) return;

        e.preventDefault();
        const x = e.pageX - containerRef.current.offsetLeft;
        const delta = x - startX;
        containerRef.current.scrollLeft = scrollLeft - delta;

        // Calculate momentum
        const now = Date.now();
        const elapsed = now - lastTimestamp;
        if (elapsed > 0) {
            const velocity = (lastX - e.pageX) / elapsed;
            setMomentum(velocity * 15);
            setLastX(e.pageX);
            setLastTimestamp(now);
        }
    };

    const handleTouchMove = (e: TouchEvent) => {
        if (!isDragging || !containerRef.current) return;

        const x = e.touches[0].pageX - containerRef.current.offsetLeft;
        const delta = x - startX;
        containerRef.current.scrollLeft = scrollLeft - delta;

        // Calculate momentum
        const now = Date.now();
        const elapsed = now - lastTimestamp;
        if (elapsed > 0) {
            const velocity = (lastX - e.touches[0].pageX) / elapsed;
            setMomentum(velocity * 15);
            setLastX(e.touches[0].pageX);
            setLastTimestamp(now);
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleTouchEnd = () => {
        setIsDragging(false);
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

    // Add and remove event listeners
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleMouseLeave = () => setIsDragging(false);

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        document.addEventListener('touchmove', handleTouchMove, {passive: false});
        document.addEventListener('touchend', handleTouchEnd);
        container.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            document.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('touchend', handleTouchEnd);
            container?.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [isDragging, scrollLeft, startX, lastX, lastTimestamp]);

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