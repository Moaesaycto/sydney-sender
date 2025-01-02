import React from "react";
import styled from "styled-components";
import seedrandom from "seedrandom";
import background from "./cityscape.svg";

export type TimeMode = "morning" | "day" | "evening" | "night";

interface CityscapeProps {
    height: number;
    seed?: string;
    mode?: TimeMode;
}

const CITY_HEIGHT = 200;
const BACKGROUND_HEIGHT_RATIO = 0.8;
const NUM_STARS = 100;

/** Static stars */
const Star = styled.circle`
    opacity: 0.8;
`;

const Cloud = styled.div`
    position: absolute;
    background: rgba(255, 255, 255, 0.5);
    border-radius: 50%;
    filter: blur(30px);
`;

/** Layer container for each mode */
const Layer = styled.div<{ $isVisible: boolean }>` 
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: ${({ $isVisible }) => ($isVisible ? 1 : 0)};
    transition: opacity 1s ease-in-out;
`;

export const Cityscape = ({ height, seed = "default-seed", mode = "day" }: CityscapeProps) => {
    void height;

    const rng = seedrandom(seed);

    const stars = Array.from({ length: NUM_STARS }).map((_, i) => {
        const x = rng() * 100;
        const y = Math.pow(rng(), 2) * 95 + 5;
        const size = rng() * 2 + 1;
        return <Star key={i} cx={`${x}%`} cy={`${y}%`} r={size} fill="white" />;
    });

    const clouds = Array.from({ length: 5 }).map((_, i) => {
        const size = 150 + rng() * 100;
        const left = rng() * 100;
        const top = rng() * 20;

        return (
            <Cloud
                key={i}
                style={{
                    width: `${size}px`,
                    height: `${size * 0.6}px`,
                    top: `${top}%`,
                    left: `${left}%`,
                }}
            />
        );
    });

    return (
        <div
            style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%", // Full height
                overflow: "hidden",
            }}
        >
            {/* Morning Layer */}
            <Layer $isVisible={mode === "morning"}>
                <div
                    style={{
                        height: "100%",
                        width: "100%",
                        background: "linear-gradient(to bottom, rgb(255, 223, 186), rgb(255, 204, 153), rgb(255, 153, 51))",
                    }}
                />
                <div
                    style={{
                        position: "absolute",
                        bottom: "0%",
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: "200px",
                        height: "200px",
                        background: "radial-gradient(circle, rgb(255, 255, 255) 0%, rgba(255, 223, 186, 0) 100%)",
                        borderRadius: "50%",
                    }}
                />
            </Layer>

            {/* Day Layer */}
            <Layer $isVisible={mode === "day"}>
                <div
                    style={{
                        height: "100%",
                        width: "100%",
                        background: "linear-gradient(to bottom, rgb(135, 206, 235), rgb(173, 216, 230), rgb(240, 248, 255))",
                    }}
                />
                {clouds}
            </Layer>

            {/* Evening Layer */}
            <Layer $isVisible={mode === "evening"}>
                <div
                    style={{
                        height: "100%",
                        width: "100%",
                        background: "linear-gradient(to bottom, rgb(192, 128, 77), rgb(138, 71, 108), rgb(77, 45, 83))",
                    }}
                />
                <svg
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                    }}
                >
                    {stars.map((star) => React.cloneElement(star, { style: { opacity: 0.2 } }))} {/* Fainter stars */}
                </svg>
            </Layer>

            {/* Night Layer */}
            <Layer $isVisible={mode === "night"}>
                <div
                    style={{
                        height: "100%",
                        width: "100%",
                        background: "linear-gradient(to bottom, rgba(0, 0, 0), rgb(48, 71, 133), rgb(121, 222, 240))",
                    }}
                />
                <svg
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                    }}
                >
                    {stars}
                </svg>
            </Layer>

            {/* Background and Foreground Skylines */}
            <div
                style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    height: `${CITY_HEIGHT}px`,
                    width: "100%",
                    backgroundImage: `url(${background})`,
                    backgroundSize: `auto ${CITY_HEIGHT * BACKGROUND_HEIGHT_RATIO}px`,
                    backgroundPosition: "left bottom",
                    backgroundRepeat: "repeat-x",
                    zIndex: 1,
                }}
            />
        </div>
    );
};
