import React from "react";

import * as Icon from "react-feather";

import { CreatePost } from "../../components/CreatePost";
import { Post } from "../../components/Post";
import { HorizontalDivider } from "../../components/Divider";
import { FriendList } from "../../components/FriendList";

import { buildPostFeed } from "../../utils";
import { usePosts } from "../../api/post";

import { useUsers } from "../../api/user";

export const Home = () => {
  const localUser = JSON.parse(localStorage.getItem("user"));
  const { data: friends } = useUsers(
    {
      _id: {
        $in: localUser.friends,
      },
    },
    {
      initialData: [],
      enabled: Boolean(localUser.friends.length > 0),
    }
  );

  const [arePostsOver, setArePostsOver] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(1);
  const { refetch: refetchPosts, status } = usePosts(
    {
      userId: {
        $in: [...localUser.friends, localUser._id],
      },
      options: {
        page: currentPage,
        size: 2,
        user: true,
      },
    },
    {
      initialData: [],
      enabled: Boolean(!arePostsOver),
    }
  );
  let posts = buildPostFeed(currentPage);

  return (
    <div className="h-full w-full overflow-y-auto py-10 pb-28 lg:pb-10 text-[26px] lg:text-[16px]">
      <div className="flex justify-center">
        <div className="flex w-[90%] lg:w-3/4 flex-col gap-8">
          <div id="friend-list" className="flex w-full">
            <FriendList friends={friends} />
          </div>
          <div id="create-post" className="flex w-full">
            <CreatePost icon={<Icon.Image size={24} />} size={"w-full"} />
          </div>
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
          {status === "loading" ? (
            <div>Carregando</div>
          ) : (
            <button
              disabled={arePostsOver}
              onClick={async () => {
                setCurrentPage((prev) => prev + 1);
                const { data } = await refetchPosts();
                // if (data.length === 0) {
                //   setArePostsOver(true);
                // }
              }}
            >
              {arePostsOver ? "Não há mais posts" : "Carregar mais posts"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
