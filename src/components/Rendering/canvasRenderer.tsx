import React, {useEffect, useMemo, useRef, useState} from "react";
import {useHover, useMergedRef, useMouse, useResizeObserver} from "@mantine/hooks";
import {AspectRatio} from "@mantine/core";
import type {Layer} from "../../modules/classes/Layer.ts";

const globalImageCache = new Map<string, HTMLImageElement>();
// De-dupe concurrent loads: cache the in-flight promise (not just the resolved
// image) so repeated renders of the same uncached source share one fetch.
const inFlightImageLoads = new Map<string, Promise<HTMLImageElement>>();

interface RenderCanvasProps {
    layers: Array<any>,
    invert?: boolean,
    spacing?: boolean,
    animated?: boolean
}


function loadImage(url: string): Promise<HTMLImageElement> {
    const cached = globalImageCache.get(url);
    if (cached) return Promise.resolve(cached);
    const inFlight = inFlightImageLoads.get(url);
    if (inFlight) return inFlight;

    const promise = new Promise<HTMLImageElement>((resolve, reject) => {
        const image = new Image();
        image.addEventListener('load', () => {
            globalImageCache.set(url, image);
            inFlightImageLoads.delete(url);
            resolve(image);
        });
        image.addEventListener('error', () => {
            // Reject (and drop the in-flight entry) so callers can .catch and a
            // later render may retry, instead of hanging forever on a dead promise.
            inFlightImageLoads.delete(url);
            reject(new Error(`Failed to load image: ${url}`));
        });
        image.src = url;
    });
    inFlightImageLoads.set(url, promise);
    return promise;
}

async function loadAllImagesIntoCache() {
    const urls = [
        "images/8BitDeck.png",
        "images/BlindChips.png",
        "images/Boosters.png",
        "images/Editions.png",
        "images/Enhancers.png",
        "images/Jokers.png",
        "images/stickers.png",
        "images/tags.png",
        "images/Tarots.png",
        "images/Vouchers.png",
    ];
    // Per-url catch so a single failed asset doesn't reject the whole preload.
    await Promise.all(urls.map(url => loadImage(url).catch(err => console.log(err))));
}

loadAllImagesIntoCache()
    .catch(err => {
        console.log(err)
    });

export function renderImage(
    canvas: HTMLCanvasElement,
    context: CanvasRenderingContext2D,
    image: HTMLImageElement,
    layer: Layer,
    timestamp?: number
) {
    if (!image || !layer || !layer?.pos) return 0;
    const cardWidth = (image.width / layer.columns);
    const cardHeight = (image.height / layer.rows);

    if (layer.order === 0) {
        canvas.width = cardWidth;
        canvas.height = cardHeight;
        canvas.style.width = `${cardWidth}px`;
        canvas.style.height = `${cardHeight}px`;
    }

    canvas.style.imageRendering = 'pixelated';
    context.imageSmoothingEnabled = true;

    // Save context state before modifying
    context.save();

    if (layer.animated && timestamp) {
        // Apply animation effects to this specific layer
        const elapsed = timestamp;

        // Gentle vertical movement (3px up and down)
        const yOffset = Math.sin(elapsed / 1000) * 3;

        // Subtle horizontal movement (1.5px side to side)
        const xOffset = Math.sin(elapsed / 1500) * 1.5;

        // Opacity fluctuation between 0.85 and 1
        // Apply the transform and opacity to just this layer
        context.globalAlpha = 0.65 + (Math.sin(elapsed / 2000) + 1) * 0.075;
        context.translate(xOffset, yOffset);
    }

    context.drawImage(
        image,
        layer.pos.x * cardWidth,
        layer.pos.y * cardHeight,
        cardWidth,
        cardHeight,
        0,
        0,
        canvas.width,
        canvas.height
    );

    // Restore context to previous state
    context.restore();

    return cardWidth / cardHeight;
}

interface SimpleRenderProps {
    layers: Array<Layer>,
    invert?: boolean,
}


export function SimpleRenderCanvas({layers, invert = false}: SimpleRenderProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [ratio, setRatio] = useState(3 / 4);

    useEffect(() => {
        if (!canvasRef.current || !layers || layers.length === 0) return;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        if (!context) return;

        let cancelled = false;
        // Load every layer's image first, then draw the sorted set in one pass so
        // z-order is deterministic and a late base (order 0) layer can't wipe
        // already-drawn overlays.
        const sorted = [...layers].sort((a, b) => a.order - b.order);
        Promise.all(sorted.map(layer => loadImage(layer.source).then(image => ({layer, image}))))
            .then(loaded => {
                if (cancelled) return;
                context.clearRect(0, 0, canvas.width, canvas.height);
                loaded.forEach(({layer, image}) => {
                    const imageRatio = renderImage(canvas, context, image, layer);
                    if (layer.order === 0 && imageRatio) {
                        setRatio(imageRatio);
                    }
                });
            })
            .catch(err => console.log(err));

        return () => {
            cancelled = true;
        };
    }, [layers]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        canvas.style.filter = invert ? 'invert(0.8)' : 'none';
    }, [invert]);

    return (
        <AspectRatio ratio={ratio} w="100%">
            <canvas
                ref={canvasRef}
                style={{
                    borderRadius: '6px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                }}
            />
        </AspectRatio>
    );
}


// Advanced card rendering with canvas
export function RenderImagesWithCanvas({layers, invert = false, spacing = false}: RenderCanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef(null);
    const [ratio, setRatio] = useState(3 / 4);
    const animationFrameRef = useRef<number | null>(null);
    // Images loaded for the current layers, in z-order, ready to draw imperatively.
    const loadedLayersRef = useRef<Array<{ layer: Layer; image: HTMLImageElement }>>([]);

    const hasAnimatedLayer = layers?.some(layer => layer.animated);

    // Draw the already-loaded layers in z-order in a single pass. Called both for
    // the initial static draw and (imperatively) from the animation loop.
    const draw = (timestamp?: number) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const context = canvas.getContext('2d');
        if (!context) return;
        context.clearRect(0, 0, canvas.width, canvas.height);
        loadedLayersRef.current.forEach(({layer, image}) => {
            const imageRatio = renderImage(canvas, context, image, layer, timestamp);
            if (layer.order === 0 && imageRatio) {
                setRatio(imageRatio);
            }
        });
    };

    // Load all layer images, then draw them once in the correct z-order.
    useEffect(() => {
        if (!canvasRef.current || !layers || layers.length === 0) return;
        let cancelled = false;
        const sorted = [...layers].sort((a, b) => a.order - b.order);
        Promise.all(sorted.map(layer => loadImage(layer.source).then(image => ({layer, image}))))
            .then(loaded => {
                if (cancelled) return;
                loadedLayersRef.current = loaded;
                draw();
            })
            .catch(err => console.log(err));
        return () => {
            cancelled = true;
        };
    }, [layers]);

    // Apply / reset the invert filter reactively.
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        canvas.style.filter = invert ? 'invert(0.8)' : 'none';
    }, [invert]);

    // Animation loop: keep the timestamp in the rAF callback and redraw the canvas
    // imperatively each frame, instead of driving a React re-render per frame.
    useEffect(() => {
        if (!hasAnimatedLayer) return;

        let startTime: number;

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            draw(timestamp - startTime);
            animationFrameRef.current = requestAnimationFrame(animate);
        };

        animationFrameRef.current = requestAnimationFrame(animate);

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [hasAnimatedLayer]);

    const {hovered, ref: hoverRef} = useHover();
    const {ref: mouseRef, x: mouseX, y: mouseY} = useMouse();
    const [rectRef, rect] = useResizeObserver();
    const mergedRef = useMergedRef(mouseRef, hoverRef, containerRef, rectRef);

    // Handle card tilt effect
    const transform = useMemo(() => {
        const SCALE_X = 6;
        const SCALE_Y = 8;
        const x = mouseX - rect.x;
        const y = mouseY - rect.y;
        const mousePosition = {
            x,
            y
        }
        const cardSize = {
            width: rect.width,
            height: rect.height
        }
        return `perspective(1000px) rotateX(${
            (mousePosition.y / cardSize.height) * -(SCALE_Y * 2) + SCALE_Y
        }deg) rotateY(${
            (mousePosition.x / cardSize.width) * (SCALE_X * 2) - SCALE_X
        }deg) translateZ(10px)`

    }, [mouseX, mouseY, rect.x, rect.y, rect.width, rect.height]);

    return (
        <AspectRatio
            ratio={ratio}
            w={spacing ? '80%' : "100%"}
            py={spacing ? 'xs' : 0}
            ref={mergedRef}
            style={{
                transition: hovered ? 'none' : 'transform 0.4s ease',
                transform: hovered ? transform : 'none',
                transformStyle: 'preserve-3d',
                transformOrigin: 'center center',
                display: 'flex',
            }}
        >
            <canvas
                ref={canvasRef}
                style={{
                    boxShadow: hovered
                        ? `0 2px 12px rgba(0,0,0,0.3)`
                        : '0 2px 8px rgba(0,0,0,0.2)',
                    borderRadius: '6px',
                    transition: hovered ? 'none' : 'box-shadow 0.4s ease-out'
                }}
            />
        </AspectRatio>
    )
}
