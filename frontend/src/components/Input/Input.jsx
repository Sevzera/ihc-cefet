import React from "react";
import * as Icon from "react-feather";
import { VerticalDivider } from "../Divider";
import { IconButton } from "../IconButton";

export const Input = ({
  icon,
  type,
  placeholder,
  value,
  onChange,
  name,
  customStyles,
  ...props
}) => {
  const handlePasswordVisibility = () => {
    const input = document.getElementById(`input-${name}`);
    if (input.type === "password") {
      input.type = "text";
    } else {
      input.type = "password";
    }
  };

  return (
    <div
      className={`flex h-10 flex-row items-center rounded-lg border-2 border-input-stroke border-opacity-[20%] 
        bg-light-inputFill focus-within:border-light-primary dark:bg-dark-inputFill ${customStyles}`}
    >
      {icon && (
        <span>
          <span
            alt={`input-icon-${name}`}
            className="flex w-14 items-center justify-center text-input-icon"
          >
            {icon}
          </span>
        </span>
      )}
      {icon && <VerticalDivider customStyles={"h-2/3"} /> }
      <input
        id={`input-${name}`}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        name={name}
        className="peer w-full rounded-lg bg-transparent px-4 text-light-secondary placeholder-input-text focus:outline-none"
        {...props}
      />
      {type === "password" && (
        <IconButton
          icon={<Icon.Eye size={24} />}
          tooltip="Mostrar Senha"
          customButtonStyles="text-input-icon dark:text-input-icon p-2"
          onClickFunction={handlePasswordVisibility}
        />
      )}
    </div>
  );
};
