"use client";

import React from "react";
import { motion } from "framer-motion";

export function FadeIn({
  children,
  className = "",
  delay = 0,
  duration = 0.85,
  distance = 32,
  direction = "up",
  viewport = { once: true, amount: 0.15, margin: "0px 0px -80px 0px" },
  as = "div",
  ...props
}) {
  const getYOffset = () => {
    if (direction === "up") return distance;
    if (direction === "down") return -distance;
    return 0;
  };

  const Component = motion[as] || motion.div;

  return (
    <Component
      initial={{ opacity: 0, y: getYOffset() }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewport}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={className}
      {...props}
    >
      {children}
    </Component>
  );
}

export function FadeInStagger({
  children,
  className = "",
  staggerDelay = 0.18,
  delayChildren = 0.1,
  viewport = { once: true, amount: 0.15, margin: "0px 0px -80px 0px" },
  as = "div",
  ...props
}) {
  const Component = motion[as] || motion.div;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren,
      },
    },
  };

  return (
    <Component
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      variants={containerVariants}
      className={className}
      {...props}
    >
      {children}
    </Component>
  );
}

export function FadeInItem({
  children,
  className = "",
  distance = 32,
  duration = 0.85,
  as = "div",
  ...props
}) {
  const Component = motion[as] || motion.div;

  const itemVariants = {
    hidden: { opacity: 0, y: distance },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <Component
      variants={itemVariants}
      className={className}
      {...props}
    >
      {children}
    </Component>
  );
}

export default FadeIn;

