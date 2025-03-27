import React, { useState } from "react";
import clsx from "clsx";
import { User } from "../../../types";
import style from "../css/FollowingUserCard.module.css";
import { Avatar, IconButton, Menu, MenuItem } from "@mui/material";
import Confirmation from "../../comfirmation/Confirmation";
import { handleDeleteFollow } from "../../../sercives/api";
import { useNavigate, useParams } from "react-router-dom";
import { MoreHoriz } from "@mui/icons-material";
interface Props {
  user: User;
  type: number; //type == 1 following //type == follower
  updateStatement: () => void;
}
const FollowingUserCard: React.FC<Props> = ({
  user,
  updateStatement,
  type,
}) => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openMenu, setOpenMenu] = useState(false);
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const handleClickMoreHoriz = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget); // Xác định vị trí menu
    setOpenMenu(true);
  };
  const handleCloseMenu = () => {
    setOpenMenu(false); // Đóng menu khi click ra ngoài
  };
  const handleOpenConfirmation = () => {
    setOpenConfirmation(true);
  };
  const handleUnfollowUser = async () => {
    const unfollowInfo = await handleDeleteFollow(userId, user._id);
    if (unfollowInfo) {
      setAnchorEl(null);
      setOpenMenu(false);
      updateStatement();
    }
  };
  const handleStopFollower = async () => {
    const unfollowInfo = await handleDeleteFollow(user._id, userId);
    if (unfollowInfo) {
      setAnchorEl(null);
      setOpenMenu(false);
      updateStatement();
    }
  };
  return (
    <div className={clsx(style.container)}>
      <Avatar
        src={user.avatar}
        className={clsx(style.avatar)}
        onClick={() => {
          navigate(`/profile/${user._id}`);
        }}
      />
      <p
        onClick={() => {
          navigate(`/profile/${user._id}`);
        }}
      >
        {user.firstname + " " + user.lastname}
      </p>
      {userId === localStorage.getItem("userId") ? (
        <IconButton onClick={handleClickMoreHoriz}>
          <MoreHoriz />
        </IconButton>
      ) : (
        ""
      )}
      <Menu
        anchorEl={anchorEl}
        open={openMenu}
        onClose={handleCloseMenu}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        {type == 1 ? (
          <MenuItem onClick={handleOpenConfirmation}>Unfollow</MenuItem>
        ) : (
          <MenuItem onClick={handleOpenConfirmation}>Delete</MenuItem>
        )}
      </Menu>
      <Confirmation
        onConfirm={() => {
          if (type == 1) {
            handleUnfollowUser();
          } else {
            handleStopFollower();
          }
        }}
        open={openConfirmation}
        title={
          type == 1
            ? `Do you want to unfollow?`
            : `Do you want stop following you?`
        }
        message={
          type == 1
            ? `Do you want to unfollow ${user.firstname + " " + user.lastname}?`
            : `Stop this person from following you?`
        }
        onClose={() => {
          setOpenMenu(false);
          setOpenConfirmation(false);
        }}
      />
    </div>
  );
};

export default FollowingUserCard;
