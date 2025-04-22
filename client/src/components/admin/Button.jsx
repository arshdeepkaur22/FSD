import React from "react";

export default function Button({ 
  children, 
  className, 
  variant = "default", 
  size = "default",
  ...props 
}) {
  const getVariantClasses = () => {
    switch (variant) {
      case "outline":
        return "border border-gray-700 bg-transparent hover:bg-gray-800";
      case "ghost":
        return "bg-transparent hover:bg-gray-800";
      default:
        return "bg-blue-600 hover:bg-blue-700";
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "py-1 px-3 text-sm";
      case "lg":
        return "py-3 px-6 text-lg";
      default:
        return "py-2 px-4";
    }
  };

  return (
    <button
      className={`rounded-md text-white transition-colors ${getVariantClasses()} ${getSizeClasses()} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}