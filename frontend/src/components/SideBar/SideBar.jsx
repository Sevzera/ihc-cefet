import React from "react";
import { useNavigate } from "react-router-dom";

import useDarkMode from "../../hooks/useDarkMode";

import { InsideLinks } from "../../utils/redirectionLinks";

import * as Icon from "react-feather";
import { IconButton } from "../IconButton";
import { HorizontalDivider as Divider } from "../Divider";

export const SideBar = () => {
  const navigate = useNavigate();

  const localUser = JSON.parse(localStorage.getItem("user"));
  const [darkMode, setDarkMode] = useDarkMode();
  const handleDarkMode = () => {
    setDarkMode(!darkMode);
    console.log("Dark Mode: ", darkMode);
  };

  const handleButtonClickNavigation = (url) => {
    if (window.location.pathname === url) navigate(0);
    navigate(url);
  };

  const handleButtonClickToOtherSite = (url) => {
    window.open(url, "_blank");
  };

  return (
    <div className="flex justify-between lg:justify-normal left-0 top-0 lg:flex h-20 w-screen lg:h-screen lg:w-16 flex-row lg:flex-col gap-3 border-t-[1px] lg:border-r-[1px] shadow-xl border-zinc-500 border-opacity-20 bg-light-background p-3 dark:bg-dark-background">
      <div className="flex flex-col justify-center items-center pl-8 lg:pl-0">
        <IconButton
          icon={<Icon.User size={24} />}
          tooltip="Profile"
          onClickFunction={() =>
            handleButtonClickNavigation(
              `${InsideLinks.userProfile}/${localUser._id}`
            )
          }
        />
      </div>
      <Divider customStyles="w-full hidden lg:flex" />
      <div className="flex flex-row lg:flex-col items-center gap-28 lg:gap-2">
        <IconButton
          icon={<Icon.Home size={24} />}
          tooltip="Home"
          onClickFunction={() => handleButtonClickNavigation(InsideLinks.home)}
        />
        <IconButton
          icon={<Icon.Search size={24} />}
          tooltip="Search"
          onClickFunction={() =>
            handleButtonClickNavigation(InsideLinks.search)
          }
        />
        <IconButton
          icon={<Icon.LogOut size={24} />}
          tooltip="Logout"
          onClickFunction={() => handleButtonClickNavigation(InsideLinks.login)}
        />
      </div>
      <Divider customStyles="w-full hidden lg:flex" />
      <div className="flex flex-col justify-center items-center pr-8 lg:pr-0">
        {darkMode ? (
          <IconButton
            icon={<Icon.Sun size={24} />}
            tooltip="Light Mode"
            customButtonStyles="text-light-background"
            onClickFunction={handleDarkMode}
          />
        ) : (
          <IconButton
            icon={<Icon.Moon size={24} />}
            tooltip="Dark Mode"
            customButtonStyles="text-dark-background"
            onClickFunction={handleDarkMode}
          />
        )}
      </div>
    </div>
  );
};
