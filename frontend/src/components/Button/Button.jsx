import React from "react";

export const Button = ({ label, onClick, customStyles, ...props }) => {
  return (
    <button
      onClick={onClick}
      className={`dark:hover:text-dark-secondary" flex h-10 cursor-pointer items-center 
      justify-center rounded-lg border-2 border-light-primary font-archivoNarrow 
      font-bold text-light-primary hover:bg-light-primary hover:text-light-background 
      disabled:cursor-not-allowed 
      dark:border-dark-primary dark:text-dark-primary dark:hover:bg-dark-primary
      hover:dark:text-light-background 
      ${customStyles}`}
      {...props}
    >
      {label}
    </button>
  );
};
