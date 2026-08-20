import React from "react";

export default function CourseraIcon({ className = "w-4 h-4", ...props }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      <path
        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
        fill="currentColor"
        opacity="0.2"
      />
      <path
        d="M16.5 8.5C15.35 7.27 13.78 6.5 12 6.5c-3.03 0-5.5 2.47-5.5 5.5s2.47 5.5 5.5 5.5c1.78 0 3.35-.77 4.5-2l-1.42-1.42C14.28 14.86 13.2 15.3 12 15.3c-1.82 0-3.3-1.48-3.3-3.3s1.48-3.3 3.3-3.3c1.2 0 2.28.44 3.08 1.22L16.5 8.5z"
        fill="currentColor"
      />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    </svg>
  );
}
