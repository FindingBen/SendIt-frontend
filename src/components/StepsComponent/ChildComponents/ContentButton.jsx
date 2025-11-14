// ContentButton.jsx
import React from "react";

const ContentButton = ({ icon: Icon, label, onClick, disabled = false }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        flex flex-col items-center justify-center gap-1 p-3 rounded-lg transition
        bg-white/10 hover:bg-white/20
        text-white font-medium text-sm
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
      `}
    >
      {Icon && <Icon className="w-6 h-6 lg:w-8 lg:h-8 text-white/70" />}
      <span className="text-white/70">{label}</span>
    </button>
  );
};

export default ContentButton;
