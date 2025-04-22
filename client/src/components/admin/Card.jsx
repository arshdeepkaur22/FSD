import React from "react";

export default function Card({ children, className }) {
  return (
    <div className={`rounded-lg overflow-hidden ${className}`}>
      <div className="p-4">
        {children}
      </div>
    </div>
  );
}