import React from "react";
import { useNavigate } from "react-router-dom";
import * as Icon from "react-feather";

import loginPageCollage from "../../assets/images/login-page-collage.png";
import logoLight from "../../assets/images/logoLight.png";
import logoDark from "../../assets/images/logoDark.png";
import { InsideLinks } from "../../utils";

import useDarkMode from "../../hooks/useDarkMode";
import { VerticalDivider as Divider } from "../../components/Divider/";
import { Input } from "../../components/Input/";
import { Button } from "../../components/Button";
import { IconButton } from "../../components/IconButton";
import { useLogin } from "../../api/user";

export const Login = () => {
  const navigate = useNavigate();

  const [darkMode, setDarkMode] = useDarkMode();
  const handleDarkMode = () => {
    setDarkMode(!darkMode);
    console.log("Dark Mode: ", darkMode);
  };

  const [credentials, setCredentials] = React.useState({
    email: "",
    password: "",
  });

  const { mutate: login } = useLogin(credentials);

  const handleEmailChange = (event) => {
    setCredentials({ ...credentials, email: event.target.value });
  };
  const handlePasswordChange = (event) => {
    setCredentials({ ...credentials, password: event.target.value });
  };

  const handleLoginButtonClick = () => {
    login(credentials, {
      onSettled: (result) => {
        const { success } = result;
        if (!success) {
          const { message } = result;
          return alert(message);
        }
        const { data } = result;
        localStorage.setItem("user", JSON.stringify(data));
        navigate(InsideLinks.home);
      },
    });
  };
  const handleRegisterButtonClick = () => {
    navigate(InsideLinks.register);
  };

  return (
    <div className="flex h-full w-full">
      <div className="flex h-full w-1/2 flex-col items-center justify-center">
        <img
          src={loginPageCollage}
          alt="collage"
          className="w-2/3 object-contain"
        />
        <div className="mt-5 flex w-1/2 flex-wrap items-center justify-center">
          <p className="text-center font-balooChettan font-extrabold sm:text-[calc(0.4*56px)] md:text-[calc(0.6*56px)] lg:text-[calc(0.8*56px)] ">
            <span className="text-light-primary dark:text-light-primary">
              COMPARTILHE
            </span>{" "}
            E DESCUBRA
          </p>
        </div>
      </div>
      <div className="flex items-center">
        <Divider customStyles="h-4/5" />
      </div>
      <div className="flex h-full w-1/2 flex-col items-center justify-center">
        <div className="mb-10 w-1/2">
          <img
            src={darkMode ? logoDark : logoLight}
            alt="logo"
            className="object-contain"
          />
        </div>
        <div className="flex w-1/2 flex-col items-center justify-center gap-3">
          <Input
            icon={<Icon.AtSign size={22} />}
            type="email"
            placeholder="Email"
            value={credentials.email}
            onChange={(event) => {
              handleEmailChange(event);
            }}
            name="email"
            customStyles={"w-full"}
          />
          <Input
            icon={<Icon.Key size={22} />}
            type="password"
            placeholder="Senha"
            value={credentials.password}
            onChange={(event) => {
              handlePasswordChange(event);
            }}
            name="password"
            customStyles={"w-full"}
          />
          <div className="flex w-full items-center justify-center">
            <Button
              label="LOGIN"
              customStyles="w-1/2"
              onClick={handleLoginButtonClick}
            />
          </div>
          <div
            onClick={handleRegisterButtonClick}
            className="w-2/3 overflow-hidden text-center text-light-primary hover:cursor-pointer hover:underline"
          >
            Não Possui uma conta? Registre-se
          </div>
        </div>
      </div>
      <div className="absolute bottom-4 left-0 w-16 rounded-r-md bg-light-secondary shadow-xl dark:bg-dark-secondary">
        {darkMode ? (
          <IconButton
            icon={<Icon.Sun size={24} />}
            tooltip="Light Mode"
            onClickFunction={handleDarkMode}
            customButtonStyles="text-dark-background"
            customTooltipStyles="left-16"
          />
        ) : (
          <IconButton
            icon={<Icon.Moon size={24} />}
            tooltip="Dark Mode"
            onClickFunction={handleDarkMode}
            customButtonStyles="text-light-background"
            customTooltipStyles="left-16"
          />
        )}
      </div>
    </div>
  );
};
