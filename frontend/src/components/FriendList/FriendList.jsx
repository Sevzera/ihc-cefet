import React from "react";
import * as Icon from "react-feather";
import { IconButton } from "../IconButton";
import { InsideLinks } from "../../utils/redirectionLinks";

import { FriendComponent } from "./FriendComponent.jsx";

import { useNavigate } from "react-router-dom";

export const FriendList = ({ friends }) => {
  const navigate = useNavigate();

  const numberOfFriendsShown = 5;
  const [startPositionInArray, setStartPositionInArray] = React.useState(0);

  const onClickLeftArrow = () => {
    if (startPositionInArray - numberOfFriendsShown < 0) {
      return null;
    }
    if (startPositionInArray > 0) {
      setStartPositionInArray(startPositionInArray - numberOfFriendsShown);
    }
  };
  const onClickRightArrow = () => {
    if (startPositionInArray + numberOfFriendsShown >= friends.length) {
      return null;
    }
    if (startPositionInArray < friends.length) {
      setStartPositionInArray(startPositionInArray + numberOfFriendsShown);
    }
  };

  const onClickFriend = (friend) => {
    navigate(`${InsideLinks.userProfile}/${friend._id}`);
  };

  return (
    <div className="flex w-full flex-col items-center gap-2">
      <p className="w-fit font-bold"> Amigos </p>
      <div className="flex w-full flex-row">
        <IconButton
          icon={<Icon.ArrowLeft size={18} />}
          haveTooltip={false}
          onClickFunction={onClickLeftArrow}
        />
        <div className="flex w-fit flex-row gap-5">
          <FriendComponent
            friends={friends}
            start={startPositionInArray}
            end={startPositionInArray + numberOfFriendsShown}
            onClick={onClickFriend}
          />
        </div>
        <IconButton
          icon={<Icon.ArrowRight size={18} />}
          haveTooltip={false}
          onClickFunction={onClickRightArrow}
        />
      </div>
    </div>
  );
};
