import React from "react";
import { styles } from "./styles.js";

export const IconButton = ({
  icon,
  tooltip = "tooltip 💡",
  haveTooltip = true,
  colorOnHover = "",
  onClickFunction,
  disabled = false,
  customButtonStyles = "",
  customTooltipStyles = "",
  ...props
}) => {
  return (
    <div
      className={`group z-10 ${styles.icon} ${colorOnHover} ${customButtonStyles}`}
      onClick={disabled ? null : onClickFunction}
    >
      {icon}
      {haveTooltip && (
        <span
          className={`pointer-events-none group-hover:scale-100 ${styles.tooltip} ${customTooltipStyles}`}
        >
          {tooltip}
        </span>
      )}
    </div>
  );
};
