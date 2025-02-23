import {useEffect, useRef} from "react";
import {Box, Center} from "@mantine/core";

export function RenderWithCanvas({renderFn, width, height, value}) {
    const renderCanvas = useRef(null);
    useEffect(() => {
        if (renderCanvas.current !== null) {
            if (width) renderCanvas.current.width = width;
            if (height) renderCanvas.current.height = height;
            renderFn(renderCanvas.current, value);
        }
    }, [value])
    return (
        <Center>
            <canvas ref={renderCanvas}/>
        </Center>
    )
}