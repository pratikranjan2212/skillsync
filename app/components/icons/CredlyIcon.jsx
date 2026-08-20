import React from "react";

export default function CredlyIcon({ className = "w-4 h-4", ...props }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1ZM12 6.5C14.76 6.5 17 8.74 17 11.5C17 13.06 16.29 14.45 15.18 15.38L16.2 18.5L13.8 17.15C13.24 17.38 12.63 17.5 12 17.5C9.24 17.5 7 15.26 7 11.5C7 8.74 9.24 6.5 12 6.5ZM12 9C10.62 9 9.5 10.12 9.5 11.5C9.5 12.88 10.62 14 12 14C13.38 14 14.5 12.88 14.5 11.5C14.5 10.12 13.38 9 12 9Z" />
    </svg>
  );
}
