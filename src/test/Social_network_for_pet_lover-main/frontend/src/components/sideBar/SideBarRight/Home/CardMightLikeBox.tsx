import clsx from "clsx";
import React, { useState } from "react";
import { Avatar, AvatarGroup, Button } from "@mui/material";

import style from "./cssCardMightLike.module.css";
import { User } from "../../../../types";
import { useNavigate } from "react-router-dom";

type CardMightLikeBoxProps = {
  notFollowUser: User;
};

const CardMightLikeBox: React.FC<CardMightLikeBoxProps> = ({
  notFollowUser,
}) => {
  const currentUserId = localStorage.getItem("userId");
  const [isFollowing, setIsFollowing] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const navigate = useNavigate();
  async function handleFollow(followingId: string) {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/v1/follow/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            followerId: currentUserId,
            followingId: followingId,
          }),
        }
      );

      if (response.ok) {
        alert("Followed successfully");
        setIsFollowing(true);
        setTimeout(() => {
          setIsVisible(false);
        }, 7000);
        // Cập nhật trạng thái nút Follow nếu cần (ví dụ: đổi thành "Unfollow")
      } else {
        alert("Failed to follow user.");
      }
    } catch (error) {
      console.error("Error following user:", error);
      alert("Error occurred while trying to follow.");
    }
  }
  async function handleIgnore(followingId: string) {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/v1/follow/ignore`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ignorerId: currentUserId,
            ignoringId: followingId,
          }),
        }
      );

      if (response.ok) {
        alert("Ignored successfully");
        setTimeout(() => {
          setIsVisible(false);
        }, 500);
        // Cập nhật trạng thái nút Follow nếu cần (ví dụ: đổi thành "Unfollow")
      } else {
        alert("Failed to ignore user.");
      }
    } catch (error) {
      console.error("Error ignore user:", error);
      alert("Error occurred while trying to ignore.");
    }
  }
  return (
    <>
      {isVisible && (
        <div className={clsx(style.cardYouMightLike)} onClick={()=>{navigate(`/profile/${notFollowUser._id}`)}}>
          <div className={clsx(style.mightLikeBox)}>
            <Avatar
              sx={{ minHeight: 50, minWidth: 50, objectFit: "cover" }}
              src={notFollowUser.avatar}
            ></Avatar>
            <div className={clsx(style.mightLikeBoxInfo)}>
              <h5>{notFollowUser.firstname + " " + notFollowUser.lastname}</h5>
              <div className={clsx(style.relatedFriend)}>
                <div className={clsx(style.listFriends)}>
                  <AvatarGroup
                    max={4}
                    sx={{
                      "& .MuiAvatar-root": {
                        width: 25,
                        height: 25,
                        objectFit: "cover",
                        border: "2px solid white", // Optional: adds a white border for clarity
                        marginLeft: "-8px", // Controls the overlap
                      },
                    }}
                  >
                    <Avatar src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTScRDP7EjRojuWRHHqMTduqxtVec6EQA_uyg&s" />
                    <Avatar src="https://tmssl.akamaized.net//images/foto/galerie/erling-haaland-manchester-city-2024-1727103341-148917.jpg?lm=1727103361" />
                    <Avatar src="https://upload.wikimedia.org/wikipedia/commons/b/be/Pep_2017_%28cropped%29.jpg" />
                  </AvatarGroup>
                </div>
              </div>
            </div>
          </div>
          <div className={style.mightLikeBoxButton}>
            <Button
              variant="contained"
              color="success"
              style={{ height: "30px" }}
              onClick={() => handleFollow(notFollowUser._id)}
            >
              {isFollowing ? "Following" : "Follow"}
            </Button>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#AFAFAF",
                color: "white",
                height: "30px",
              }}
              onClick={()=>handleIgnore(notFollowUser._id)}
            >
              Ignore
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default CardMightLikeBox;
