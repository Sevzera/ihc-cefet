import React from "react";

export const FriendComponent = ({ friends, start, end, onClick }) => {
  return friends.map((friend, index) => {
    if (index >= start && index < end) {
      return (
        <div
          className="flex cursor-pointer flex-col items-center justify-center hover:brightness-75"
          key={`friend-${friend._id}`}
          onClick={() => onClick(friend)}
        >
          <img
            className="h-10 w-10 rounded-full"
            src={friend.profilePictureSrc}
            alt={friend.name}
          />
          <p className="text-xs">{friend.name}</p>
        </div>
      );
    }
  });
};
