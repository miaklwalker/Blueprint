import {useEffect, useRef} from "react";
import {Box} from "@mantine/core";

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
        <Box>
            <canvas ref={renderCanvas}/>
        </Box>
    )
}