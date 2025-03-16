import React, { useEffect, useState } from "react";
import { handleGetPostByPostId } from "../../../sercives/api";
import { useLocation, useParams } from "react-router-dom";
import { Post } from "../../../types";
import DetailPostContainer from "../../profile/ExpandComment/DetailPostContainer";
import { PostProvider } from "../../profile/Post/PostContext";
import zIndex from "@mui/material/styles/zIndex";

interface Props
{
  postId: String|null|undefined
  openModal:boolean
}

const PostModal:React.FC<Props> = ({postId,openModal}) => {
  // const location = useLocation();
  // const { id } = useParams(); 
  // const background = location.state?.background;
  
  // const handleLike = async () => {
  //   try {
  //     const response = await fetch(
  //       `${process.env.REACT_APP_API_URL}/api/v1/like/likepost",
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({
  //           userId: localStorage.getItem("userId"),
  //           targetId: post?._id,
  //           targetType: "post",
  //         }),
  //       }
  //     );
  //     if (!response.ok) {
  //       throw new Error("Failed to like post");
  //     }
  //     const result = await response.json();
  //   } catch (e) {
  //     console.error(e);
  //   }
  // };
  
  return (
    <div style={{
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      zIndex: 1000,  // Đảm bảo modal ở trên nền
      backgroundColor: "white", // Màu nền của modal
    }}>
      {/* {post ? (
        <PostProvider post={post}>
          <DetailPostContainer open={true} />
        </PostProvider>
      ) : (
        ""
      )} */}
    </div>
  );
};

export default PostModal;
