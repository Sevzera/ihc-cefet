import React from "react";
import { v4 as uuidv4 } from "uuid";

import { Button } from "../../components/Button";
import { IconButton } from "../../components/IconButton";

import { useCreatePost, usePost } from "../../api/post.js";

import { useQueryClient } from "react-query";

export const CreatePost = ({ icon, size }) => {
  const { mutate: createPost } = useCreatePost();
  const queryClient = useQueryClient();
  const localUser = JSON.parse(localStorage.getItem("user"));
  const [createdPostId, setCreatedPostId] = React.useState(null);
  const [data, setData] = React.useState({
    _id: uuidv4(),
    text: "",
    imageSrc: "",
  });

  let textAreaHeight = "h-12";

  const onInputTextArea = (e) => {
    e.target.style.height = "inherit";
    e.target.style.height = `${e.target.scrollHeight}px`;
    textAreaHeight = `h-[${e.target.scrollHeight}px]`;
    setData((prev) => ({ ...prev, text: e.target.value }));
  };

  usePost(createdPostId, {
    enabled: Boolean(createdPostId),
    onSuccess: (data) => {
      setCreatedPostId(null);
      queryClient.invalidateQueries(["posts"]);
    },
  });
  const onClickPost = () => {
    createPost(data, {
      onSuccess: () => {
        setCreatedPostId(data._id);
        setData({
          _id: uuidv4(),
          text: "",
          imageSrc: "",
        });
      },
    });
  };

  return (
    <div className={`flex flex-col ${size}`}>
      <div
        className={`bg-light-inputFill dark:bg-dark-inputFill resize-[${textAreaHeight}] rounded-t-lg focus-within:border-light-primary`}
      >
        <textarea
          id={`textarea-${localUser.name}`}
          value={data.text}
          placeholder="O que você está pensando..."
          className="peer w-full resize-none rounded-lg bg-light-inputFill bg-transparent px-3 py-2 text-light-secondary placeholder-input-text outline-none"
          onInput={(e) => onInputTextArea(e)}
        />
      </div>
      <div className="flex flex-row ">
        <div className="left-0 flex w-fit flex-row rounded-b-xl bg-light-inputFill dark:bg-dark-inputFill">
          <span
            alt={`input-icon-${localUser.name}`}
            className="flex w-14 items-center justify-center text-input-icon"
          >
            <IconButton
              icon={icon}
              tooltip="Adicionar foto"
              customButtonStyles="text-dark-background hover:dark:text-dark-background"
            />
          </span>
        </div>
        <div className="w-full" />
        <div className="right-0 flex w-fit flex-row rounded-b-xl bg-light-inputFill dark:bg-dark-inputFill">
          <Button
            label="Publicar"
            customStyles="w-fit p-2 rounded-t-none bg-light-primary text-white dark:text-light-background hover:brightness-75 dark:hover:brightness-75"
            onClick={onClickPost}
          />
        </div>
      </div>
    </div>
  );
};
