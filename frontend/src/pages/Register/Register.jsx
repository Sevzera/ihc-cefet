import React from "react";
import { useNavigate } from "react-router-dom";

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
  const [selectedProfilePicture, setSelectedProfilePicture] = React.useState();

  const [data, setData] = React.useState({
    profilePictureSrc: "",
    name: "",
    email: "",
    password: "",
  });

  function readFile(file) {
    return new Promise((resolve) => {
      if (file.size) {
        const reader = new FileReader();
        reader.onload = (e) => {
          resolve({
            binary: file,
            b64: e.target.result,
          });
        };
        reader.readAsDataURL(file);
      }
    });
  }

  const handleProfilePicture = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedProfilePicture(URL.createObjectURL(file));
      const imagePromise = readFile(file);
      const image_64 = imagePromise.then((obj) => {
        setData({ ...data, profilePictureSrc: obj.b64.split(",").pop() });
      });
    }
  };

  const handleNameChange = (event) => {
    setData({ ...data, name: event.target.value });
  };

  const handleEmailChange = (event) => {
    setData({ ...data, email: event.target.value });
  };

  const handlePasswordChange = (event) => {
    setData({ ...data, password: event.target.value });
  };

  const handleBtnClick = () => {
    inputFileRef.current.click();
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
      <div className="flex w-full flex-col items-center justify-center gap-5">
        <div className="flex w-full flex-col items-center justify-center text-center">
          <p className="text-[80px] lg:text-[50px] font-bold text-light-primary">
            CADASTRE-SE
          </p>
          <p className="text-[36px] lg:text-[20px] text-light-secondary dark:text-dark-secondary">
            Apenas a um clique de se <span className="underline">conectar</span>
          </p>
        </div>
        <div className="flex w-full flex-col items-center justify-center gap-8 lg:gap-5">
          <div className="relative w-2/5 lg:w-1/5">
            <div className="absolute -top-1 right-1">
              <IconButton
                icon={<Icon.HelpCircle size={24} />}
                tooltip="Selecione uma foto de perfil clicando na imagem"
                customButtonStyles="text-light-background bg-light-primary rounded-full"
              />
            </div>
            <label htmlFor="dropzone-file" className="w-full">
              {data.profilePictureSrc === "" ? (
                <img
                  src={avatar}
                  alt="logo"
                  className="w-full border border-gray-400 object-contain hover:cursor-pointer"
                />
              ) : (
                <img
                  src={selectedProfilePicture}
                  alt="logo"
                  className="w-full border border-gray-400 object-contain hover:cursor-pointer"
                />
              )}
              <input
                type="file"
                id="dropzone-file"
                onChange={handleProfilePicture}
                accept="image/jpeg, image/png, image/gif"
                className="hidden"
              />
            </label>
          </div>
          <div className="flex w-1/2 flex-col gap-3 lg:gap-2 scale-125 lg:scale-100">
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
          <div className="flex w-1/2 flex-row items-center justify-center gap-2 scale-125 lg:scale-100">
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
      <div className="absolute bottom-2 lg:bottom-4 left-3 lg:left-0 w-16 rounded-tr-md lg:rounded-r-md scale-150 lg:scale-100 bg-light-secondary shadow-xl dark:bg-dark-secondary">
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
