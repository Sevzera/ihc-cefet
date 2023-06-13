import React from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

import * as Icon from "react-feather";
import avatar from "../../assets/images/avatar.png";
import { InsideLinks } from "../../utils";

import useDarkMode from "../../hooks/useDarkMode";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import { IconButton } from "../../components/IconButton";

import { useCreateUser } from "../../api/user";

export const Register = () => {
  const { mutate: createUser } = useCreateUser();
  const navigate = useNavigate();

  const [data, setData] = React.useState({
    name: "",
    email: "",
    password: "",
  });

  const handleNameChange = (event) => {
    setData({ ...data, name: event.target.value });
  };

  const handleEmailChange = (event) => {
    setData({ ...data, email: event.target.value });
  };

  const handlePasswordChange = (event) => {
    setData({ ...data, password: event.target.value });
  };

  const [darkMode, setDarkMode] = useDarkMode();
  const handleDarkMode = () => {
    setDarkMode(!darkMode);
    console.log("Dark Mode: ", darkMode);
  };

  const handleRegisterButtonClick = () => {
    createUser(
      {
        ...data,
        _id: uuidv4(),
      },
      {
        onSuccess: () => {
          console.log("Usuario cadastrado com sucesso!");
          navigate(InsideLinks.login);
        },
      }
    );
  };

  const handleVoltarButtonClick = () => {
    navigate(InsideLinks.login);
  };

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex w-3/4 flex-col items-center justify-center gap-5">
        <div className="flex w-full flex-col items-center justify-center text-center">
          <p className="text-[50px] font-bold text-light-primary">
            CADASTRE-SE
          </p>
          <p className="text-[20px] text-light-secondary dark:text-dark-secondary">
            Apenas a um clique de se <span className="underline">conectar</span>
          </p>
        </div>
        <div className="flex w-full flex-col items-center justify-center gap-5">
          <div className="relative w-1/5">
            <div className="absolute right-0">
              <IconButton
                icon={<Icon.HelpCircle size={24} />}
                tooltip="Selecione uma foto de perfil clicando na imagem"
                customButtonStyles="text-light-background bg-light-primary rounded-full"
              />
            </div>
            <img src={avatar} alt="logo" className="object-contain p-3" />
          </div>
          <div className="flex w-1/2 flex-col gap-2">
            <Input
              icon={<Icon.User size={22} />}
              type="text"
              placeholder="Nome Completo"
              value={data.name}
              onChange={(event) => {
                handleNameChange(event);
              }}
              name="name"
              customStyles={"w-full"}
            />
            <Input
              icon={<Icon.AtSign size={22} />}
              type="email"
              placeholder="Email"
              value={data.email}
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
              value={data.password}
              onChange={(event) => {
                handlePasswordChange(event);
              }}
              name="password"
              customStyles={"w-full"}
            />
          </div>
          <div className="flex w-1/2 flex-row items-center justify-center gap-2">
            <Button
              label="REGISTRAR"
              customStyles="w-1/2"
              onClick={handleRegisterButtonClick}
            />
            <Button
              label="VOLTAR"
              customStyles="w-1/2"
              onClick={handleVoltarButtonClick}
            />
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
