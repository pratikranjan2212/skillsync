import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines Tailwind CSS classes with clsx and tailwind-merge.
 * @param {...any} inputs - Class names or conditional class objects.
 * @returns {string} Merged class names string.
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
