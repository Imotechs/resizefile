import React, { useState, useEffect } from "react";

const SuccessAnimation = ({ message = "Operation Successful!", isVisible }) => {
  return (
    <div
      className={`${
        isVisible ? "flex" : "hidden"
      } flex-col items-center justify-center gap-2 bg-green-50 border border-green-200 rounded-lg p-4 w-64 mx-auto`}
    >
      {/* Animated SVG */}
      <div className="relative w-20 h-20">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          className="w-full h-full text-green-600 animate-checkmark"
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            fill="none"
            className="stroke-current stroke-[2px] animate-draw-circle"
          />
          <path
            fill="none"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 12l4 4L18 8"
            className="stroke-current stroke-[2px] animate-draw-check"
          />
        </svg>
      </div>

      {/* Success Message */}
      <p className="text-sm font-medium text-green-700">{message}</p>
    </div>
  );
};

export default SuccessAnimation;
