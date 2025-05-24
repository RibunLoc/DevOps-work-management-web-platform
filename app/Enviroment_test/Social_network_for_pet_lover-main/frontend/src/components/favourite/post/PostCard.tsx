import React, { useState } from "react";
import { PostFavourite } from "../../../types";
import { useLocation, useNavigate } from "react-router-dom";
import clsx from "clsx";
import {
  Avatar,
  Button,
  ImageList,
  ImageListItem,
  Typography,
} from "@mui/material";

import style from "./css/PostCard.module.css";

interface Props {
  data: PostFavourite | null;
  onDelete: (postId: String | undefined) => void;
  handleOpenModal: (id:String|undefined) => void
}
const PostCard: React.FC<Props> = ({ data, onDelete,handleOpenModal }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteTimeout, setDeleteTimeout] = useState<NodeJS.Timeout | null>(
    null
  );
  const navigate = useNavigate();
  const handleDelete = () => {
    setIsDeleting(true);
    const timeout = setTimeout(() => {
      onDelete(data?._id);
      setIsDeleting(false);
    }, 5000);
    setDeleteTimeout(timeout);
  };
  const handleUndo = () => {
    if (deleteTimeout) {
      clearTimeout(deleteTimeout); // Hủy timer
      setDeleteTimeout(null);
    }
    setIsDeleting(false); // Gỡ trạng thái đang xóa
  };
  //const location = useLocation();

  return (
    <div className={clsx(style.container)}>
      {isDeleting ? (
        <div>
          <span>Đang xoá, hoàn tác trong 5 giây...</span>
          <button onClick={handleUndo}>Hoàn tác</button>
        </div>
      ) : (
        <div className={clsx(style.container_inside)}>
          <div className={clsx(style.container_img)}>
          <img
            src={data?.postInfo.images.at(0)}
            className={style.image}
            onClick={() => {
              handleOpenModal(data?.postInfo._id)
            }}
          ></img>
            </div>
          
          <div className={clsx(style.container_inside_right)}>
            <div className={clsx(style.cardHeader)}>
              <p className={clsx(style.text, style.title)}>
                {data?.postInfo.title}
              </p>
              <p className={clsx(style.content)}>{data?.postInfo.content}</p>
            </div>
            <div className={clsx(style.cardContent)}>
              <div className={style.row}>
                <div className={clsx(style.section)}>Post -</div>
                <p style={{ marginLeft: "8px" }}>Saved in </p>
                <p style={{ marginLeft: "5px" }}>Favourite Posts</p>
              </div>
              <div className={style.row}>
                <Avatar
                  src={data?.ownerInfo.avatar}
                  className={clsx(style.avatarMini, style.imgHover)}
                  onClick={() => {
                    navigate(`/profile/${data?.ownerInfo._id}`)
                  }}
                />
                <div
                  className={clsx(style.section)}
                  style={{ marginLeft: "5px" }}
                >
                  Saved from
                </div>
                <p className={clsx(style.text, style.hoverText)} onClick={() => {
                    handleOpenModal(data?.postInfo._id)
                  }}>
                  {data?.ownerInfo.firstname + " " + data?.ownerInfo.lastname}'s
                  post
                </p>
              </div>
            </div>
            <div className={clsx(style.cardAction)}>
              <Button
                className={clsx(style.removeButton)}
                onClick={handleDelete}
              >
                Remove
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostCard;
