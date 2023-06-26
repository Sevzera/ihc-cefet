import React from "react";
import { Outlet } from "react-router-dom";

import { SideBar } from "../../components/SideBar";

export const LayoutLogged = () => {
  return (
    <div
      className="flex h-screen w-screen flex-row bg-light-background font-archivoNarrow
      text-light-secondary transition-all duration-100 dark:bg-dark-backgroundSecondary dark:text-dark-secondary"
    >
      <div className="hidden lg:flex">
        <SideBar />
      </div>
      
      <div className="flex h-full w-full">
        <Outlet />
      </div>

      <div className="fixed lg:hidden bottom-0 z-50 shadow-zinc-500 shadow-2xl ">
        <SideBar />
      </div>
    </div>
  );
};
