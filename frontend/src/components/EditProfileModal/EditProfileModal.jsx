import React from "react";
import * as Icon from "react-feather";
import { IconButton } from "../IconButton";
import { Input } from "../Input";
import { Button } from "../Button";
import { useUpdateUser } from "../../api/user";

export const EditProfileModal = ({ closeModal }) => {

  const localUser = JSON.parse(localStorage.getItem("user"));
  const { mutate: updateUser } = useUpdateUser(localUser._id, {
    onSuccess: (data) => {
      closeModal();
    },
  });

  const [data, setData] = React.useState({
    profilePictureSrc: localUser.profilePictureSrc,
    bannerImageSrc: localUser.bannerImageSrc,
    name: localUser.name,
    email: localUser.email,
    password: "",
  });

  const isButtonDisabled =
    data.profilePictureSrc === localUser.profilePictureSrc &&
    data.bannerImageSrc === localUser.bannerImageSrc &&
    data.name === localUser.name &&
    data.email === localUser.email &&
    data.password === "";

  return (
    <div className="fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center">
      <div className="min-w-[40%] rounded-lg bg-light-background p-4 shadow-2xl dark:bg-dark-background">
        <div className="flex justify-between pb-6">
          <p className="text-3xl font-bold">Editar Perfil</p>
          <IconButton
            icon={<Icon.X size={24} />}
            haveTooltip={false}
            onClickFunction={() => closeModal()}
            customButtonStyles="mx-2"
          />
        </div>
        <div className="flex flex-col gap-5">
          <div className="flex flex-col items-center gap-2">
            <label>Foto de Perfil</label>
            <div className="relative w-1/5">
              <div className="absolute right-0">
                <IconButton
                  icon={<Icon.HelpCircle size={24} />}
                  tooltip="Selecione uma foto de perfil clicando na imagem"
                  customButtonStyles="text-light-background bg-light-primary rounded-full"
                />
              </div>
              <img
                src={data.profilePictureSrc}
                alt="logo"
                className="object-contain p-3"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label>Foto de Fundo</label>
            <img
              src={data.bannerImageSrc}
              alt="banner"
              className="object-contain p-3"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label>Nome</label>
            <Input
              type="text"
              placeholder="Nome Completo"
              value={data.name}
              onChange={(e) => {
                setData({ ...data, name: e.target.value });
              }}
              name="name"
              customStyles={"w-full"}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label>E-mail</label>
            <Input
              type="text"
              placeholder="Email"
              value={data.email}
              onChange={(e) => {
                setData({ ...data, email: e.target.value });
              }}
              name="email"
              customStyles={"w-full"}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label>Senha</label>
            <Input
              type="password"
              placeholder="Digite uma nova senha"
              value={data.password}
              onChange={(e) => {
                setData({ ...data, password: e.target.value });
              }}
              name="password"
              customStyles={"w-full"}
            />
          </div>
        </div>
        <div className="flex justify-center pt-8">
          <Button
            label="Atualizar"
            customStyles="w-1/2 p-2 bg-light-primary text-white dark:text-light-background enabled:hover:brightness-75 enabled:dark:hover:brightness-75"
            onClick={() => updateUser(data)}
            disabled={isButtonDisabled}
          />
        </div>
      </div>
    </div>
  );
};
