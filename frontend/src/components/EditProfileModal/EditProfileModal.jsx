import React from "react";
import * as Icon from "react-feather";
import { IconButton } from "../IconButton";
import { Input } from "../Input";
import { Button } from "../Button";
import { useUpdateUser, useUser } from "../../api/user";
import { useParams } from "react-router-dom";

export const EditProfileModal = ({ refetchData, closeModal }) => {
  const { userId } = useParams();
  const [profilePicture_URL, setProfilePicture_URL] = React.useState();
  const [bannerImage_URL, setBannerImage_URL] = React.useState();
  const [selectedProfilePicture, setSelectedProfilePicture] = React.useState();
  const [selectedBannerImage, setSelectedBannerImage] = React.useState();

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

  const [data, setData] = React.useState({
    profilePictureSrc: null,
    bannerImageSrc: null,
    name: null,
    email: null,
    password: null,
  });

  const handleProfilePicture = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfilePicture_URL(URL.createObjectURL(file));
      const imagePromise = readFile(file);
      imagePromise.then((obj) => {
        setSelectedProfilePicture(obj.b64.split(",").pop());
      });
    }
  };

  const handleBannerImage = (event) => {
    const file = event.target.files[0];
    if (file) {
      setBannerImage_URL(URL.createObjectURL(file));
      const imagePromise = readFile(file);
      imagePromise.then((obj) => {
        setSelectedBannerImage(obj.b64.split(",").pop());
      });
    }
  };

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
        profilePictureSrc: selectedProfilePicture,
        bannerImageSrc: selectedBannerImage,
        name: data.name,
        email: data.email,
        password: "",
      });
    },
  });

  const currentUserInfo = useUser(userId);

  const isInfoValid =
    data.profilePictureSrc &&
    data.profilePictureSrc !== user.profilePictureSrc &&
    data.bannerImageSrc &&
    data.bannerImageSrc !== user.bannerImageSrc &&
    data.name &&
    data.name !== user.name &&
    data.email &&
    data.email !== user.email &&
    data.password &&
    data.password !== "";

  return (
    <div className="fixed z-50 flex h-full w-full items-center justify-center">
      <div
        className="flex h-fit w-[80%] flex-col justify-center rounded-lg border border-dark-background bg-light-background p-4 shadow-2xl 
      dark:border-light-background dark:bg-dark-background md:w-[70%] 2xl:w-[50%]"
      >
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
        <div className="flex w-full flex-col gap-2 lg:flex-row lg:gap-0">
          <div className="flex flex-col items-center lg:w-2/5">
            <label className="text-2xl">Foto de Perfil</label>
            <div className="relative">
              <div className="absolute -top-1 right-1">
                <IconButton
                  icon={<Icon.HelpCircle size={24} />}
                  tooltip="Selecione uma foto de perfil clicando na imagem"
                  customButtonStyles="text-light-background bg-light-primary rounded-full"
                />
              </div>
              <label for="dropzone-profile-pic">
                {!profilePicture_URL ? (
                  <img
                    src={currentUserInfo.data.profilePictureSrc}
                    alt="logo"
                    className="h-72 w-80 rounded border border-gray-500 hover:cursor-pointer"
                  />
                ) : (
                  <img
                    src={profilePicture_URL}
                    alt="logo"
                    className="h-72 w-80 rounded border border-gray-500 hover:cursor-pointer"
                  />
                )}
                <input
                  type="file"
                  id="dropzone-profile-pic"
                  onChange={handleProfilePicture}
                  accept="image/jpeg, image/png, image/gif"
                  class="hidden"
                />
              </label>
            </div>
          </div>
          <div className="flex flex-col items-center lg:w-3/5">
            <div className="flex w-full flex-col items-center">
              <label className="text-2xl">Foto de Fundo</label>
              <label for="dropzone-banner">
                {!bannerImage_URL ? (
                  <img
                    src={currentUserInfo.data.bannerImageSrc}
                    alt="logo"
                    className="mb-4 h-24 w-96 border border-gray-500 object-fill hover:cursor-pointer"
                  />
                ) : (
                  <img
                    src={bannerImage_URL}
                    alt="logo"
                    className="mb-4 h-24 w-96 border border-gray-500 object-fill hover:cursor-pointer"
                  />
                )}
                <input
                  type="file"
                  id="dropzone-banner"
                  onChange={handleBannerImage}
                  accept="image/jpeg, image/png, image/gif"
                  class="hidden"
                />
              </label>
            </div>
            <div className="flex h-[45%] w-full justify-between p-1">
              <div className="flex w-1/2 flex-col items-center justify-between">
                <div className="flex w-5/6 flex-col gap-2">
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
                <div className="flex w-5/6 flex-col gap-2">
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
              <div className="flex w-1/2 flex-col items-center justify-between">
                <div className="flex w-5/6 flex-col gap-2">
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
                <div className="flex w-5/6 flex-col items-end justify-end">
                  {!isNameValid && (
                    <p className="text-md text-red-500">Nome inválido</p>
                  )}
                  {!isEmailValid && (
                    <p className="text-md text-red-500">Email inválido</p>
                  )}
                  {!isPasswordValid && (
                    <p className="text-md text-red-500">Senha inválida</p>
                  )}
                  <Button
                    label="Atualizar"
                    customStyles="w-full p-2 bg-light-primary text-white dark:text-light-background enabled:hover:brightness-75 enabled:dark:hover:brightness-75"
                    onClick={() => updateUser(data)}
                    disabled={!isInfoValid || isUpdateUserLoading}
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
