import {Layer} from "../modules/classes/Layer.ts";
import {useEffect, useRef, useState} from "react";
import {useHover, useMergedRef, useMouse, useResizeObserver} from "@mantine/hooks";
import {AspectRatio} from "@mantine/core";

const globalImageCache = new Map<string, HTMLImageElement>();
interface RenderCanvasProps {
    layers: any[],
    invert?: boolean,
    spacing?: boolean
}
export function renderImage(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, image: HTMLImageElement, layer: Layer) {
    if (!image || !layer || !layer?.pos) return 0;
    const cardWidth = (image.width / layer.columns);
    const cardHeight = (image.height / layer.rows);
    if (layer.order === 0) {
        canvas.width = cardWidth;
        canvas.height = cardHeight;
        canvas.style.width = `${cardWidth}px`;
        canvas.style.height = `${cardHeight}px`;
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
    return cardWidth / cardHeight;
}
export function RenderImagesWithCanvas({layers, invert = false, spacing = false}: RenderCanvasProps) {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const [ratio, setRatio] = useState(3 / 4);
    const [transform, setTransform] = useState('');

    useEffect(() => {
        if (!canvasRef.current) return;
        if (!layers) return;
        const canvas: HTMLCanvasElement = canvasRef.current;
        const context: CanvasRenderingContext2D | null = canvas.getContext('2d');
        if (!context) return;
        context.clearRect(0, 0, canvas.width, canvas.height);
        layers
            .sort((a, b) => a.order - b.order)
            .forEach((layer => {
                if (globalImageCache.has(layer.source)) {
                    let image = globalImageCache.get(layer.source) as HTMLImageElement;
                    renderImage(canvas, context, image, layer);
                    return;
                }
                const img = new Image();
                img.src = layer.source;
                img.onload = () => {
                    const imageRatio = renderImage(canvas, context, img, layer);
                    globalImageCache.set(layer.source, img);
                    if (layer.order === 0) {
                        setRatio(imageRatio);
                    }
                }
            }))
        if (invert) {
            canvas.style.filter = 'invert(0.8)';
        }
    }, [layers]);

    const {hovered, ref: hoverRef} = useHover();
    const {ref: mouseRef, x: mouseX, y: mouseY} = useMouse();
    const [rectRef, rect] = useResizeObserver();
    const mergedRef = useMergedRef(mouseRef, hoverRef, containerRef, rectRef);


    // Handle card tilt effect
    useEffect(() => {
        const SCALE_X = 6;
        const SCALE_Y = 8;
        const x = mouseX - rect.x;
        const y = mouseY - rect.y;
        let mousePosition = {
            x,
            y
        }
        let cardSize = {
            width: rect.width,
            height: rect.height
        }
        setTransform(
            `perspective(1000px) rotateX(${
                (mousePosition.y / cardSize.height) * -(SCALE_Y * 2) + SCALE_Y
            }deg) rotateY(${
                (mousePosition.x / cardSize.width) * (SCALE_X * 2) - SCALE_X
            }deg) translateZ(10px)`
        )

    }, [mouseX, mouseY, hovered]);

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
            display: 'flex'
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
