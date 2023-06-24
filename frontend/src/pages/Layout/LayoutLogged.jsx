import React from "react";
import { Outlet } from "react-router-dom";

import { SideBar } from "../../components/SideBar";

export const LayoutLogged = () => {
  return (
    <div
      className="flex h-screen w-screen flex-row bg-light-background font-archivoNarrow
      text-light-secondary transition-all duration-100 dark:bg-dark-backgroundSecondary dark:text-dark-secondary"
    >
      <SideBar />
      <div className="h-full w-full">
        <Outlet />
      </div>
    </div>
  );
};
