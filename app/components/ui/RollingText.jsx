import React, { useState, useEffect, useRef, startTransition } from "react"
import { motion, useInView } from "framer-motion"

export default function RollingText(props) {
    const {
        mode = "text",
        text = "MOTION",
        initialNumber = 58,
        finalNumber = 100,
        prefix = "",
        suffix = "",
        separator = "",
        separatorColor = "#FFFFFF",
        duplicateCount = 2,
        rollDuration = 0.7,
        staggerDelay = 0,
        initialDelay = 0,
        autoPlay = false,
        textColor = "#FFFFFF",
        prefixSuffixColor = "#FFFFFF",
        font,
        animationPattern = "together",
        animationTrigger = "inView",
        animationDirection = "auto",
        useCustomCharacterSet = false,
        customCharacterSet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        respectReducedMotion = true,
        style = {},
    } = props

    const [isAnimating, setIsAnimating] = useState(false)
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
    const containerRef = useRef(null)
    const isInView = useInView(containerRef, { once: true })

    const displayText =
        mode === "number" ? `${prefix}${finalNumber}${suffix}` : text
    const initialText =
        mode === "number" ? `${prefix}${initialNumber}${suffix}` : text

    const isPrefixOrSuffix = (index) => {
        if (mode !== "number") return false
        const prefixLength = prefix.length
        const totalLength = displayText.length
        const suffixLength = suffix.length
        return index < prefixLength || index >= totalLength - suffixLength
    }

    useEffect(() => {
        if (typeof window !== "undefined" && respectReducedMotion) {
            const mediaQuery = window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            )
            setPrefersReducedMotion(mediaQuery.matches)

            const handleChange = (e) => {
                setPrefersReducedMotion(e.matches)
            }

            mediaQuery.addEventListener("change", handleChange)
            return () => mediaQuery.removeEventListener("change", handleChange)
        }
    }, [respectReducedMotion])

    useEffect(() => {
        let shouldAnimate = false
        if (autoPlay && !prefersReducedMotion) {
            if (animationTrigger === "inView" && isInView) shouldAnimate = true
            if (animationTrigger === "onAppear") shouldAnimate = true
        }
        if (shouldAnimate) {
            const timer = setTimeout(
                () => {
                    startTransition(() => setIsAnimating(true))
                },
                30 + initialDelay * 1000
            )
            return () => clearTimeout(timer)
        } else {
            setIsAnimating(false)
        }
    }, [
        autoPlay,
        isInView,
        animationTrigger,
        prefersReducedMotion,
        initialDelay,
    ])

    const characters = displayText.split("")

    const randomDelays = characters.map(
        () => Math.random() * staggerDelay * characters.length
    )

    function getDelay(index) {
        const baseDelay = (() => {
            switch (animationPattern) {
                case "sequential":
                    return index * staggerDelay
                case "alternating":
                    return index * staggerDelay
                case "random":
                    return randomDelays[index]
                case "together":
                    return 0
                case "wave":
                    return (
                        Math.sin(index) * staggerDelay * 2 +
                        index * staggerDelay * 0.5
                    )
                case "bounce":
                    return index * staggerDelay * 0.7
                case "elastic":
                    return index * staggerDelay * 0.5
                case "spring":
                    return index * staggerDelay * 0.5
                case "easeIn":
                    return index * staggerDelay * 0.8
                case "easeOut":
                    return index * staggerDelay * 0.8
                case "easeInOut":
                    return index * staggerDelay * 0.8
                default:
                    return 0
            }
        })()

        return baseDelay + initialDelay
    }

    function getEase() {
        switch (animationPattern) {
            case "bounce":
                return [0.68, -0.55, 0.27, 1.55]
            case "wave":
                return [0.4, 0, 0.2, 1]
            case "elastic":
                return [0.87, 0, 0.13, 1]
            case "spring":
                return [0.22, 1, 0.36, 1]
            case "easeIn":
                return [0.42, 0, 1, 1]
            case "easeOut":
                return [0, 0, 0.58, 1]
            case "easeInOut":
                return [0.42, 0, 0.58, 1]
            default:
                return [0.22, 1, 0.36, 1]
        }
    }

    function generateCharacterSet(targetChar, charIndex) {
        if (mode === "number") {
            if (!/^\d$/.test(targetChar)) {
                return [targetChar]
            }

            const targetDigit = parseInt(targetChar, 10)

            let initialDigit = 0
            if (charIndex < initialText.length) {
                const initialChar = initialText[charIndex]
                if (/^\d$/.test(initialChar)) {
                    initialDigit = parseInt(initialChar, 10)
                }
            }

            const sequence = []
            sequence.push(initialDigit.toString())

            const count = Math.max(1, duplicateCount - 1)
            for (let i = 0; i < count; i++) {
                sequence.push(targetChar)
            }

            return sequence
        }

        if (!useCustomCharacterSet) {
            return Array(Math.max(2, duplicateCount)).fill(targetChar)
        }

        const chars = customCharacterSet.split("")
        const result = []

        result.push(targetChar)
        const extraCount = Math.max(2, duplicateCount) - 2
        for (let i = 0; i < extraCount; i++) {
            const randomChar = chars[Math.floor(Math.random() * chars.length)]
            result.push(randomChar)
        }
        result.push(targetChar)

        return result
    }

    if (prefersReducedMotion && respectReducedMotion) {
        return (
            <div
                ref={containerRef}
                style={{
                    ...style,
                    position: "relative",
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                }}
            >
                <span
                    style={{
                        color: textColor,
                        ...font,
                    }}
                >
                    {displayText}
                </span>
            </div>
        )
    }

    return (
        <div
            ref={containerRef}
            style={{
                ...style,
                position: "relative",
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                userSelect: "none",
            }}
        >
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    ...font,
                }}
            >
                {characters.map((char, index) => (
                    <React.Fragment key={`${char}-${index}`}>
                        <CharacterColumn
                            character={char}
                            characterSet={generateCharacterSet(char, index)}
                            rollDuration={rollDuration}
                            delay={getDelay(index)}
                            isAnimating={isAnimating}
                            textColor={textColor}
                            prefixSuffixColor={prefixSuffixColor}
                            isPrefixOrSuffix={isPrefixOrSuffix(index)}
                            font={font}
                            animationPattern={animationPattern}
                            characterIndex={index}
                            ease={getEase()}
                            animationDirection={animationDirection}
                            mode={mode}
                        />
                        {separator &&
                            (() => {
                                if (mode === "number") {
                                    const totalLength = displayText.length
                                    const suffixLength = suffix.length
                                    const prefixLength = prefix.length
                                    const numberLength =
                                        totalLength -
                                        prefixLength -
                                        suffixLength

                                    const isInNumberPart =
                                        index >= prefixLength &&
                                        index < totalLength - suffixLength

                                    if (isInNumberPart) {
                                        const positionInNumber =
                                            index - prefixLength
                                        const positionFromRightInNumber =
                                            numberLength - 1 - positionInNumber

                                        const shouldAddSeparator =
                                            positionFromRightInNumber > 0 &&
                                            positionFromRightInNumber % 3 === 0

                                        if (shouldAddSeparator) {
                                            return (
                                                <span
                                                    style={{
                                                        color: separatorColor,
                                                        ...font,
                                                    }}
                                                >
                                                    {separator}
                                                </span>
                                            )
                                        }
                                    }
                                    return null
                                } else {
                                    if (index < characters.length - 1) {
                                        return (
                                            <span
                                                style={{
                                                    color: separatorColor,
                                                    ...font,
                                                }}
                                            >
                                                {separator}
                                            </span>
                                        )
                                    }
                                    return null
                                }
                            })()}
                    </React.Fragment>
                ))}
            </div>
        </div>
    )
}

function CharacterColumn({
    character,
    characterSet,
    rollDuration,
    delay,
    isAnimating,
    textColor,
    prefixSuffixColor,
    isPrefixOrSuffix,
    font,
    animationPattern,
    characterIndex,
    ease,
    animationDirection,
}) {
    const lineHeight = parseFloat(font?.lineHeight || "1.2em")
    const fontSize = parseFloat(font?.fontSize || "16px")
    const characterHeight = fontSize * lineHeight

    const totalScrollDistance = characterHeight * (characterSet.length - 1)

    let shouldRollFromBottom = false

    if (animationDirection === "down") {
        shouldRollFromBottom = true
    } else if (animationDirection === "up") {
        shouldRollFromBottom = false
    } else {
        const isOddPosition = characterIndex % 2 === 1
        shouldRollFromBottom =
            animationPattern === "alternating" ? isOddPosition : false
    }

    const initialY = shouldRollFromBottom ? -totalScrollDistance : 0
    const finalY = shouldRollFromBottom ? 0 : -totalScrollDistance

    const displayColor = isPrefixOrSuffix ? prefixSuffixColor : textColor

    return (
        <div
            style={{
                position: "relative",
                height: `${characterHeight}px`,
                overflow: "hidden",
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "center",
            }}
        >
            <motion.div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
                initial={{ y: initialY, opacity: 1 }}
                animate={
                    isAnimating
                        ? { y: finalY, opacity: 1 }
                        : { y: initialY, opacity: 1 }
                }
                transition={{
                    duration: rollDuration,
                    delay: delay,
                    ease: ease,
                    type: typeof ease === "string" ? ease : "tween",
                }}
            >
                {characterSet.map((char, index) => (
                    <span
                        key={index}
                        style={{
                            color: displayColor,
                            height: `${characterHeight}px`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            whiteSpace: "pre",
                            ...font,
                            lineHeight: font?.lineHeight || "1.2em",
                        }}
                    >
                        {char === " " ? "\u00A0" : char}
                    </span>
                ))}
            </motion.div>
        </div>
    )
}

