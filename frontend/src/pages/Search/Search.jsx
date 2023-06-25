import React, { useEffect } from "react";
import * as Icon from "react-feather";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import { InsideLinks } from "../../utils/redirectionLinks";

import { useUsers } from "../../api/user";

import { useNavigate } from "react-router-dom";

export const Search = () => {
  const navigate = useNavigate();

  const [searchText, setSearchText] = React.useState("");

  const localUser = JSON.parse(localStorage.getItem("user"));
  const { data: users } = useUsers(
    {
      ...(!searchText
        ? {
            _id: {
              $in: localUser.friends,
            },
          }
        : {
            name: {
              $regex: searchText,
              $options: "i",
            },
          }),
    },
    {
      initialData: [],
    },
    ["search"]
  );

  const onClickUser = (user) => {
    navigate(`${InsideLinks.userProfile}/${user._id}`);
  };

  return (
    <div className="h-full w-full overflow-y-auto p-5">
      <div className="flex flex-col items-center justify-center gap-8">
        <div className="flex w-3/4 flex-row gap-2">
          <Input
            icon={<Icon.Search size={18} />}
            id="search"
            type="text"
            name="search"
            placeholder="Pesquisar"
            customStyles={"w-full"}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
        <div className="flex w-3/4 flex-col gap-5">
          {users.map((user) => (
            <div
              key={user._id}
              className="flex flex-row items-center gap-2 rounded-lg bg-light-background p-2 hover:brightness-75 dark:bg-dark-background"
              onClick={() => onClickUser(user)}
            >
              <img
                src={user.profilePictureSrc}
                alt="profile picture"
                className="h-10 w-10 border-2 border-black object-cover"
              />
              <div className="flex w-full flex-col">
                <h1>{user.name}</h1>
                <h2>{user.email}</h2>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
