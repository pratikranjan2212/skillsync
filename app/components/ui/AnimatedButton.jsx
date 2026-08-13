"use client";

import React, { useState } from "react";
import RollingText from "./RollingText";

/**
 * AnimatedButton wrapper that renders a button or custom container
 * with RollingText animation on hover/focus.
 */
export default function AnimatedButton({
    children,
    text,
    className = "",
    textColor,
    font,
    rollDuration = 0.5,
    staggerDelay = 0.02,
    animationPattern = "sequential",
    animationDirection = "up",
    as: Component = "button",
    ...props
}) {
    const [isHovered, setIsHovered] = useState(false);

    // If string text is passed or simple children string
    const targetText = text || (typeof children === "string" ? children : null);

    if (targetText) {
        return (
            <Component
                className={className}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onFocus={() => setIsHovered(true)}
                onBlur={() => setIsHovered(false)}
                {...props}
            >
                <RollingText
                    text={targetText}
                    autoPlay={isHovered}
                    animationTrigger="onAppear"
                    rollDuration={rollDuration}
                    staggerDelay={staggerDelay}
                    animationPattern={animationPattern}
                    animationDirection={animationDirection}
                    textColor={textColor || "currentColor"}
                    font={font}
                />
            </Component>
        );
    }

    return (
        <Component
            className={className}
            {...props}
        >
            {children}
        </Component>
    );
}
