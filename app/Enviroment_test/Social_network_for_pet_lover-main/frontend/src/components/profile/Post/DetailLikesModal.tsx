import { Avatar, Box, Button, Modal, Typography } from "@mui/material";
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Position, User } from "../../../types";
import style from "../css/DetailLikesModal.module.css";
import ToolTipBox from "./ToolTipBox";
import { hover } from "@testing-library/user-event/dist/hover";
import { handleFollow } from "../../../sercives/api";
import ButtonFollow from "./ButtonFollow";

interface Props {
  open: boolean;
  onClose: () => void;
  likedUserInfo?: User[];
}

const DetaiLikesModal: React.FC<Props> = ({ open, onClose, likedUserInfo }) => {
  const navigate = useNavigate();
  const [isFollowing, setIsFollowing] = useState(false);
  const [hoveredUser, setHoveredUser] = useState<User | null>(null);
  const [positionToolTip, setPositionToolTip] = useState<Position | undefined>({
    x: 0,
    y: 0,
  });
  const avatarRef = useRef<HTMLDivElement>(null);
  const userNameRef = useRef<HTMLDivElement>(null);
  async function handleFollowLikedUser(followingId: string | undefined) {
    const response = await handleFollow(
      localStorage.getItem("userId"),
      followingId
    );
    if (response && response.ok) {
      alert("Followed successfully");
      setIsFollowing(true);
      setHoveredUser((prev) => {
        if (prev === null) {
          return {
            isFollowed: true,
            _id: "",
            firstname: "",
            lastname: "",
            avatar: "",
            location: "",
            email: "",
            description: "",
            petCount: 0,
            followerCount:0
          };
        }
        return { ...prev, isFollowed: true };
      });
    } else {
      alert("Failed to follow user.");
    }
  }
  return (
    <div>
      <Modal open={open} onClose={onClose}>
        <>
          <Box
            sx={{
              "&.MuiBox-root": {
                padding: "0px !important", // Targeting the root specifically
              },
              position: "relative",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "auto",
              maxWidth: "500px",
              maxHeight: "500px",
              minHeight: "200px",
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              borderRadius: 2,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box
              sx={{
                display: "flex",
                padding: "10px 10px 0px 10px",
                justifyContent: "space-between",
                position: "sticky",
                alignItems: "center",
              }}
            >
              <Typography
                sx={{
                  display: "inline-block",
                  borderBottom: "3px solid #89966B",
                  padding: "8px",
                }}
              >
                All
              </Typography>
              <Button
                onClick={onClose}
                variant="outlined"
                sx={{ margin: "0px" }}
              >
                X
              </Button>
            </Box>
            <Box
              sx={{
                padding: "10px 10px 10px 10px",
                flex: 1,
                overflowY: "auto", // Cho phép nội dung cuộn
              }}
            >
              {likedUserInfo &&
                likedUserInfo.map((userlike, index) => (
                  <div className={style.userLikeCard} key={index}>
                    <div className={style.userInfoContainer}>
                      <div
                        onClick={() => {
                          navigate(`/profile/${userlike?._id}`);
                        onClose()
                        }}
                        className={style.avatar}
                      >
                        <Avatar
                          src={userlike.avatar}
                          ref={avatarRef}
                        />
                      </div>
                      <div
                        onClick={() => {
                          navigate(`/profile/${userlike?._id}`);
                          onClose()
                        }}
                      >
                        <Typography
                          sx={{
                            marginLeft: "10px",
                            fontStyle: "bold",
                            fontSize: "16px",
                          }}
                          ref={userNameRef}
                          className={style.likedUserName}
                        >
                          {userlike.firstname + " " + userlike.lastname}
                        </Typography>
                      </div>
                    </div>
                    {userlike._id !== localStorage.getItem("userId") ? (
                      !userlike.isFollowed ? (
                        <ButtonFollow
                          isFollowing={isFollowing}
                          handleFollow={() => {
                            handleFollowLikedUser(userlike._id);
                          }}
                        />
                      ) : (
                        "Message"
                      )
                    ) : (
                      ""
                    )}
                  </div>
                ))}
            </Box>
          </Box>
          {hoveredUser && (
            <ToolTipBox
              handleFollow={handleFollowLikedUser}
              hoveredUser={hoveredUser}
              positionToolTip={positionToolTip}
            />
          )}
        </>
      </Modal>
    </div>
  );
};

export default DetaiLikesModal;
