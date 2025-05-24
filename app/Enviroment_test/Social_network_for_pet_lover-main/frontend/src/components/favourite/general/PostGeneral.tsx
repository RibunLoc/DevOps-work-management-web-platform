import React from "react";
import style from "./css/PostGeneral.module.css";
import { PetFavourite, PostFavourite } from "../../../types";
import clsx from "clsx";
import { ThumbUp } from "@mui/icons-material";
interface Props {
  post: PostFavourite;
  handleOpenModal: ()=>void
}

const PostGeneral: React.FC<Props> = ({ post,handleOpenModal }) => {
  return (
    <div className={style.postAvatar} onClick={handleOpenModal}>
      <img src={post.postInfo.images.at(0)}></img>
      <span className={clsx(style.postInfo)}>
        <div className={clsx(style.avatar_FollowerCount)}>
          <div className={clsx(style.ownerAvatar)}>
            <img src={post.ownerInfo.avatar}></img>
          </div>
          <p className={clsx(style.followerCount)}>
            {post.ownerInfo.followerCount == 1
              ? post.ownerInfo.followerCount + " follower"
              : post.ownerInfo.followerCount > 1
              ? post.ownerInfo.followerCount + " followers"
              : " 0"}
          </p>
        </div>
        <p>{post.ownerInfo.firstname + " " + post.ownerInfo.lastname}</p>
      </span>
      <span className={clsx(style.likeCount)}>
        <p style={{whiteSpace:"nowrap",textOverflow:"ellipsis"}}>{post.postInfo.likeCount}</p>
        <ThumbUp color="primary" />
      </span>
    </div>
  );
};

export default PostGeneral;
