import React from "react";

import * as Icon from "react-feather";
import { IconButton } from "../IconButton";
import { CommentTextArea } from "../CommentTextArea";
import { Button } from "../Button";
import { usePost, useUpdatePost } from "../../api/post";

import { useQueryClient } from "react-query";

export const Post = ({ post, setLocalPosts }) => {
  const { mutate: updatePost } = useUpdatePost(post._id);
  const queryClient = useQueryClient();
  const localUser = JSON.parse(localStorage.getItem("user"));
  const date = new Date(post.createdAt).toLocaleString();

  const [commentText, setCommentText] = React.useState("");

  const [shouldRefetchPost, setShouldRefetchPost] = React.useState(false);
  usePost(post._id, {
    enabled: shouldRefetchPost,
    onSuccess: (data) => {
      console.log(data);
      setLocalPosts((prev) =>
        prev.map((p) => {
          if (p._id === data._id) {
            return data;
          }
          return p;
        })
      );
      setShouldRefetchPost(false);
      queryClient.invalidateQueries("posts");
    },
  });
  const isPostLiked = post.likes.includes(localUser._id);
  const onClickLikePost = () => {
    const newLikes = isPostLiked
      ? post.likes.filter((userId) => userId !== localUser._id)
      : [...post.likes, localUser._id];
    console.log(newLikes);
    updatePost(
      {
        likes: newLikes,
      },
      {
        onSuccess: () => {
          setShouldRefetchPost(true);
          queryClient.invalidateQueries("posts");
        },
      }
    );
  };
  const onClickComment = () => {
    updatePost(
      {
        comments: [
          ...post.comments,
          {
            userId: localUser._id,
            text: commentText,
            likes: [],
          },
        ],
      },
      {
        onSuccess: () => {
          setShouldRefetchPost(true);
          queryClient.invalidateQueries("posts");
        },
      }
    );
  };
  const onClickLikeComment = (isCommentLiked, index) => {
    const newComments = post.comments.map((comment, localIndex) => {
      if (localIndex === index) {
        const newCommentLikes = isCommentLiked
          ? comment.likes.filter((userId) => userId !== localUser._id)
          : [...comment.likes, localUser._id];
        return {
          ...comment,
          likes: newCommentLikes,
        };
      }
      return comment;
    });
    updatePost(
      {
        comments: newComments,
      },
      {
        onSuccess: () => {
          setShouldRefetchPost(true);
          queryClient.invalidateQueries("posts");
        },
      }
    );
  };

  return (
    <div className="h-fit w-full">
      <div id="user" className="flex h-fit w-full flex-row items-center gap-2">
        <img
          src={post.user.profilePictureSrc}
          alt="profile picture"
          className="h-16 w-16 border-2 border-black object-contain"
        />
        <div className="flex w-full flex-col">
          <h1>{post.user.name}</h1>
          <h2>{date}</h2>
        </div>
      </div>
      <div
        id="content"
        className="flex h-fit w-full flex-col items-center pt-2"
      >
        <div className="flex w-full flex-row items-center">
          <div className="w-full pl-4">{post.text}</div>
          <div className="flex flex-row items-center gap-2">
            <IconButton
              id={`like-${post._id}`}
              icon={<Icon.Heart size={18} />}
              haveTooltip={false}
              colorOnHover={"hover:text-red-700"}
              customButtonStyles={isPostLiked ? "text-red-700" : ""}
              onClickFunction={() => onClickLikePost()}
            />
            <p>{post.likes.length}</p>
          </div>
        </div>
        {post.imageSrc && (
          <img
            src={post.imageSrc}
            alt="post"
            className="w-1/4 object-contain p-4"
          />
        )}
      </div>
      <div
        id="comment"
        className="flex h-fit w-full flex-row items-center gap-2"
      >
        <CommentTextArea
          writable={true}
          value={commentText}
          setValue={setCommentText}
        />
        <Button
          label="Comentar"
          customStyles="w-fit p-2 bg-light-primary text-white dark:text-light-background hover:brightness-75 dark:hover:brightness-75"
          onClick={onClickComment}
        />
      </div>
      <div id="users-comment" className="mt-4 flex h-fit w-full flex-col">
        {post.comments.map((comment, index) => {
          const isCommentLiked = comment.likes.some(
            (userId) => userId === localUser._id
          );
          return (
            <div
              key={`comment-${index}`}
              className="flex h-fit w-full flex-col items-center pl-4 pt-2"
            >
              <div
                id={`user-${index}`}
                className="flex h-fit w-full flex-row items-center gap-2"
              >
                <img
                  src={comment.user.profilePictureSrc}
                  alt="profile picture"
                  className="h-8 w-8 border-2 border-black object-contain"
                />
                <div className="flex w-full flex-col">
                  <h1>{comment.user.name}</h1>
                  <h2>{date}</h2>
                </div>
              </div>
              <div
                id={`comment-${index}`}
                className="flex h-fit w-full flex-row gap-2"
              >
                <CommentTextArea writable={false} value={comment.text} />
                <div className="flex flex-row items-center gap-2">
                  <IconButton
                    id={`like-${index}`}
                    icon={<Icon.Heart size={18} />}
                    haveTooltip={false}
                    colorOnHover={"hover:text-red-700"}
                    customButtonStyles={isCommentLiked ? "text-red-700" : ""}
                    onClickFunction={() =>
                      onClickLikeComment(isCommentLiked, index)
                    }
                  />
                  <p>{comment.likes.length}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
