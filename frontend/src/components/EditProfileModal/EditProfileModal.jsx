import React from "react";
import * as Icon from "react-feather";
import { IconButton } from "../IconButton";
import { Input } from "../Input";
import { Button } from "../Button";
import { useUpdateUser, useUser } from "../../api/user";
import { useParams } from "react-router-dom";
import { useQueryClient } from "react-query";

export const EditProfileModal = ({ refetchData, closeModal }) => {
  const { userId } = useParams();

  const [data, setData] = React.useState({
    profilePictureSrc: "",
    bannerImageSrc: "",
    name: "",
    email: "",
    password: "",
  });

  const { mutate: updateUser, isLoading: isUpdateUserLoading } = useUpdateUser(
    userId,
    {
      onSuccess: () => {
        refetchData();
        closeModal();
      },
    }
  );
  const { data: user } = useUser(userId, {
    onSuccess: (data) => {
      setData({
        profilePictureSrc: data.profilePictureSrc,
        bannerImageSrc: data.bannerImageSrc,
        name: data.name,
        email: data.email,
        password: "",
      });
    },
  });

  const isInfoValid =
    data.profilePictureSrc !== user.profilePictureSrc &&
    data.bannerImageSrc !== user.bannerImageSrc &&
    data.name &&
    data.name !== user.name &&
    data.email &&
    data.email !== user.email &&
    data.password &&
    data.password !== "";

  return (
    <div className="fixed z-50 flex h-full w-full items-center justify-center">
      <div className="flex h-fit w-[50%] flex-col justify-center rounded-lg bg-light-background p-4 shadow-2xl dark:bg-dark-background">
        <div className="flex justify-between pb-3">
          <p className="text-2xl font-bold">Editar Perfil</p>
          <div>
            <IconButton
              icon={<Icon.X size={24} />}
              haveTooltip={false}
              onClickFunction={() => closeModal()}
            />
          </div>
        </div>
        <div className="flex w-full justify-between">
          <div className="flex w-2/5 flex-col items-center">
            <label className="text-2xl">Foto de Perfil</label>
            <div className="relative">
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
                className="object-contain p-1"
              />
            </div>
          </div>
          <div className="flex w-3/5 flex-col items-center">
            <div className="h-[55%] w-full flex-col items-center">
              <label className="text-2xl">Foto de Fundo</label>
              <img
                src={data.bannerImageSrc}
                alt="banner"
                className="object-contain p-1"
              />
            </div>
            <div className="flex h-[45%] w-full justify-between p-1">
              <div className="flex w-1/2 flex-col items-center justify-between pb-4">
                <div className="flex w-5/6 flex-col">
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
                <div className="flex w-5/6 flex-col">
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
              </div>
              <div className="flex w-1/2 flex-col items-center justify-between pb-4">
                <div className="flex w-5/6 flex-col">
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
                <div className="flex w-5/6 justify-end">
                  <Button
                    label="Atualizar"
                    customStyles="w-full p-2 bg-light-primary text-white dark:text-light-background enabled:hover:brightness-75 enabled:dark:hover:brightness-75"
                    onClick={() => updateUser(data)}
                    disabled={isInfoValid || isUpdateUserLoading}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
