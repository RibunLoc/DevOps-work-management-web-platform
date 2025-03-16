import { Avatar, Box, Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Position, User } from "../../../types";
import style from "../css/ToolTipBox.module.css";
import { checkFollowed, getUserByUserId } from "../../../sercives/api";

interface Props {
  positionToolTip: Position | undefined;
  hoveredUser: User | null;
  handleFollow: (following: string | undefined) => void;
}
const ToolTipBox: React.FC<Props> = ({
  positionToolTip,
  hoveredUser,
  handleFollow,
}) => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<User | null>(hoveredUser);
  const [isFollowed, setIsFollowed] = useState<boolean>(false);
  const [isFollowing, setIsFollowing] = useState(false);
  useEffect(() => {
    fetchUserData();
  }, [hoveredUser]);
  const fetchUserData = async () => {
    setCurrentUser(await getUserByUserId(hoveredUser?._id));
    const response = await checkFollowed(
      localStorage.getItem("userId"),
      hoveredUser?._id
    );
    if (response?.ok) {
      setIsFollowed(true);
    } else setIsFollowed(false);
  };
  return (
    <div>
      <Box
        sx={{
          position: "absolute",
          backgroundColor: "white",
          zIndex: 1000,
          top: positionToolTip?.y + "px",
          left: positionToolTip?.x + "px",
          transform: "translate(-50%, -100%)",
          borderRadius: "10px",
        }}
      >
        {hoveredUser && (
          <div className={style.tooltip}>
            <div className={style.infoUser}>
              <div
                onClick={() => {
                  navigate(`/profile/${hoveredUser?._id}`);
                }}
              >
                <Avatar src={currentUser?.avatar} />
              </div>
              <div className={style.tooltipContainerRight}>
                <div
                  onClick={() => {
                    navigate(`/profile/${hoveredUser?._id}`);
                  }}
                >
                  <p>{currentUser?.firstname + " " + currentUser?.lastname}</p>
                </div>
                <div className={style.living}>
                  <p style={{ fontWeight: "800" }}>Living in </p>
                  <p>{currentUser?.location}</p>
                </div>

                {/* {currentUser && currentUser?.petCount > 1 ? (
                  <p>Have {currentUser?.petCount} pets</p>
                ) : (
                  <p>Have a pets</p>
                )} */}
              </div>
            </div>
            <div className={style.actionsBar}>
              {currentUser?._id !== localStorage.getItem("userId") ? (
                !isFollowed ? (
                  <Button
                    variant="contained"
                    color="success"
                    style={{ height: "30px" }}
                    onClick={() => handleFollow(currentUser?._id)}
                  >
                    {isFollowing ? "Cancel follow" : "Follow"}
                  </Button>
                ) : (
                  "message"
                )
              ) : (
                ""
              )}
            </div>
          </div>
        )}
      </Box>
    </div>
  );
};

export default ToolTipBox;
