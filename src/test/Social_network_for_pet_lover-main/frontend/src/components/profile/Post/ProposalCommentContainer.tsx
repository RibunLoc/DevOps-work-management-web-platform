import React, { useEffect, useState } from "react";
import style from "../css/ProposalCommentContainer.module.css";
import { IComment, Post } from "../../../types";
import ProposalComment from "./ProposalComment";
import DetailPostContainer from "../ExpandComment/DetailPostContainer";
import { List } from "@mui/material";
import { handleDeleteCommentAPI } from "../../../sercives/api";

interface props {
  onAddComment?: (newComment: IComment) => void;
  updateComments: (comments: IComment[]) => void;
  newComment?: IComment;
  postId?: string;
  handleLike: () => void;
  handleSave: () => void;
}

const ProposalCommentContainer: React.FC<props> = (props) => {
  const [comments, setComments] = useState<IComment[]>([]);

  //handletogglemodal
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    fetchData();
  }, [props.newComment]);
  const fetchData = async () => {
    const postId = props.postId;
    const userId = localStorage.getItem("userId");
    const url = `${process.env.REACT_APP_API_URL}/api/v1/comment/getCommentsByPostId?postId=${postId}&userId=${userId}`;
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Error in getting message");
      }
      const data = await response.json();
      if (data.comments.length > 0) { 
        console.log("abcdègh",data.comments)
        setComments(data.comments);
        props.updateComments(data.comments);
      }
    } catch (e) {
      console.error("Error fetching data:", e);
    }
  };
  // const handleDelete = async (id:string|undefined) => {
  //   const response = await handleDeleteCommentAPI(id);
  //   if(response) setComments((prev)=>{return prev.filter(comment=>comment._id!=response.deletedComment)})
  // }
  return (
    <>
      <div className={style.container}>
        {comments?.length > 1 && (
          <div className={style.watchAll} onClick={handleOpen}>
            Xem tất cả...
          </div>
        )}
        <div className={style.firstComment}>
          {comments?.length > 0 && (
            <ProposalComment level={1} comment={comments?.at(0)}  />
          )}
        </div>
      </div>
      <DetailPostContainer
        handleSave={props.handleSave}
        handleLike={props.handleLike}
        open={open}
        handleClose={handleClose}
      />
    </>
  );
};


export default ProposalCommentContainer;
