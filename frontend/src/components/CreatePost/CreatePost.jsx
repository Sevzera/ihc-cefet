import React from "react";
import { v4 as uuidv4 } from "uuid";
import * as Icon from "react-feather";

import { Button } from "../../components/Button";
import { IconButton } from "../../components/IconButton";

import { useCreatePost, usePost } from "../../api/post.js";

import { useQueryClient } from "react-query";

export const CreatePost = ({ icon, size }) => {
  const { mutate: createPost, isLoading: isCreatePostLoading } =
    useCreatePost();
  const queryClient = useQueryClient();
  const localUser = JSON.parse(localStorage.getItem("user"));
  const [data, setData] = React.useState({
    text: "",
    imageSrc: "",
  });
  const [selectedPostImage, setSelectedPostImage] = React.useState();

  let textAreaHeight = "h-12";

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

  const handlePostImage = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedPostImage(URL.createObjectURL(file));
      const imagePromise = readFile(file);
      const image_64 = imagePromise.then((obj) => {
        setData({ ...data, imageSrc: obj.b64.split(",").pop() });
      });
    }
  };

  const removePostImage = () => {
    setSelectedPostImage(null);
    setData({ ...data, imageSrc: "" });
  };

  const onInputTextArea = (e) => {
    e.target.style.height = "inherit";
    e.target.style.height = `${e.target.scrollHeight}px`;
    textAreaHeight = `h-[${e.target.scrollHeight}px]`;
    setData((prev) => ({ ...prev, text: e.target.value }));
  };

  const onClickPost = () => {
    if (data.text === "") {
      alert("O texto não pode estar vazio!");
      return;
    }
    createPost(data, {
      onSuccess: () => {
        queryClient.refetchQueries("posts");
      },
    });
    setData({ ...data, text: "", imageSrc: "" });
    setSelectedPostImage(null);
  };

  return (
    <div className={`flex flex-col ${size}`}>
      <div
        className={`bg-light-inputFill dark:bg-dark-inputFill resize-[${textAreaHeight}] rounded-t-lg border-2 border-light-secondary focus-within:border-light-primary dark:border-dark-inputFill focus-within:dark:border-dark-primary`}
      >
        <textarea
          id={`textarea-${localUser.name}`}
          value={data.text}
          placeholder="O que você está pensando..."
          className="peer w-full resize-none rounded-lg bg-light-inputFill bg-transparent px-3 py-2 text-light-secondary placeholder-input-text outline-none"
          onInput={(e) => onInputTextArea(e)}
        />
        <div className="flex w-full items-center justify-center">
          {selectedPostImage && (
            <div className="w-1/5 p-1">
              <div className="w-full relative">
                <div className="absolute -top-1 right-1">
                  <IconButton
                    icon={<Icon.X size={16} />}
                    tooltip="Remover a foto"
                    customButtonStyles="text-light-background bg-light-primary rounded-full"
                    customTooltipStyles="left-5"
                    onClickFunction={() => removePostImage()}
                  />
                </div>
                <img
                  src={selectedPostImage}
                  className="w-full border border-gray-400 object-contain"
                />
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-row">
        <div className="left-0 flex w-fit flex-row rounded-b-xl border-2 border-t-0 border-light-secondary bg-light-inputFill dark:border-dark-inputFill dark:bg-dark-inputFill">
          <span
            alt={`input-icon-${localUser.name}`}
            className="flex w-14 items-center justify-center text-input-icon"
          >
            <label htmlFor="dropzone-file">
              <IconButton
                icon={icon}
                tooltip="Adicionar foto"
                customButtonStyles="text-dark-background dark:hover:text-dark-background"
                disabled={isCreatePostLoading}
              />
              <input
                type="file"
                id="dropzone-file"
                accept="image/jpeg, image/png, image/gif"
                onChange={handlePostImage}
                className="hidden"
              />
            </label>
          </span>
        </div>
        <div className="w-full" />
        <div className="right-0 flex w-fit flex-row rounded-b-xl bg-light-inputFill dark:bg-dark-inputFill">
          <Button
            label="Publicar"
            customStyles="w-fit h-fit p-2 rounded-t-none bg-light-primary text-white dark:text-light-background hover:brightness-75 dark:hover:brightness-75"
            onClick={onClickPost}
            disabled={!data.text || isCreatePostLoading}
          />
        </div>
      </div>
    </div>
  );
};
