import React from "react";

import * as Icon from "react-feather";
import { IconButton } from "../../components/IconButton";

import { CreatePost } from "../../components/CreatePost";
import { Post } from "../../components/Post";
import { HorizontalDivider } from "../../components/Divider";
import { FriendList } from "../../components/FriendList";

import { EditProfileModal } from "../../components/EditProfileModal";

import { useParams } from "react-router-dom";
import { useUser, useUsers, useUpdateUser } from "../../api/user";
import { usePosts } from "../../api/post";

import { buildPostFeed } from "../../utils";

export const Profile = () => {
  const { userId } = useParams();
  const localUser = JSON.parse(localStorage.getItem("user"));
  const isMyProfile = localUser._id === userId;
  const isMyFriend = localUser.friends.includes(userId);
  const { data: user, refetch: refetchUser } = useUser(userId, {
    initialData: {},
  });
  const { data: friends } = useUsers(
    {
      _id: {
        $in: user.friends,
      },
    },
    {
      initialData: [],
      enabled: Boolean(isMyProfile && localUser.friends.length > 0),
    }
  );
  const { mutate: updateUser } = useUpdateUser(localUser._id, {
    onSettled: (data) => {
      const { value: updatedLocalUser } = data;
      localStorage.setItem("user", JSON.stringify(updatedLocalUser));
    },
    enabled: !isMyProfile,
  });
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const [currentPage, setCurrentPage] = React.useState(1);
  const { refetch: refetchPosts } = usePosts(
    {
      userId: userId,
      options: {
        page: currentPage,
        size: 2,
        user: true,
      },
    },
    {
      initialData: [],
    }
  );
  const posts = buildPostFeed(currentPage, [userId]);

  return (
    <div className="h-full w-full overflow-y-auto pb-10">
      {isMyProfile && isModalOpen && (
        <EditProfileModal
          refetchData={() => {
            refetchUser();
            refetchPosts();
          }}
          closeModal={() => setIsModalOpen(false)}
        />
      )}
      <div className={`${isModalOpen ? "blur-xl" : "blur-0"}`}>
        <div id="main-profile" className="pb-14">
          <img
            id="background-image"
            className="h-80 w-full border border-light-secondary dark:border-dark-secondary"
            src={user.bannerImageSrc}
            alt={user.name}
          />
          <div className="mx-32 -mt-44 flex items-end gap-5">
            <img
              id="profile-picture"
              className="h-64 w-64 rounded-lg border-4 border-light-secondary object-fill shadow-2xl dark:border-dark-secondary"
              src={user.profilePictureSrc}
              alt={user.name}
            />
            <div className="flex h-20 items-center gap-5">
              <p className="my-auto text-6xl font-bold">{user.name}</p>
              {isMyProfile ? (
                <IconButton
                  icon={<Icon.Edit size={24} />}
                  haveTooltip={false}
                  onClickFunction={() => setIsModalOpen(true)}
                />
              ) : (
                <IconButton
                  icon={
                    isMyFriend ? (
                      <Icon.MinusCircle size={24} />
                    ) : (
                      <Icon.PlusCircle size={24} />
                    )
                  }
                  tooltip={isMyFriend ? "Remover amigo" : "Adicionar amigo"}
                  colorOnHover={
                    isMyFriend ? "hover:text-red-700" : "hover:text-green-700"
                  }
                  onClickFunction={() =>
                    updateUser({
                      friends: isMyFriend
                        ? localUser.friends.filter(
                            (friend) => friend !== userId
                          )
                        : localUser.friends.concat(userId),
                    })
                  }
                />
              )}
            </div>
          </div>
        </div>
        <div className="flex justify-center">
          <div className="flex w-3/4 flex-col gap-8">
            {isMyProfile && (
              <div id="friend-list" className="flex w-full">
                <FriendList friends={friends} />
              </div>
            )}
            {isMyProfile && (
              <div id="create-post" className="flex w-full">
                <CreatePost icon={<Icon.Image size={24} />} size={"w-full"} />
              </div>
            )}
            <div
              id="posts"
              className="flex w-full flex-col gap-5 rounded-b-lg rounded-t-lg bg-light-background p-2 dark:bg-dark-background"
            >
              {posts.map((post, index) => (
                <div
                  className="flex h-fit w-full flex-col gap-5"
                  key={`post-${post._id}`}
                >
                  <Post post={post} />
                  {posts.length > 1 && index < posts.length - 1 && (
                    <HorizontalDivider />
                  )}
                </div>
              ))}
            </div>
            <button
              onClick={async () => {
                setCurrentPage((prev) => prev + 1);
                await new Promise((resolve) => setTimeout(resolve, 1000));
                await refetchPosts();
              }}
            >
              Carregar mais posts
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
