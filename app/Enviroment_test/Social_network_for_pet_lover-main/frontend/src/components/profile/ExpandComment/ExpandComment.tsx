import React, { useEffect, useState } from "react";
import clsx from "clsx";
import style from "../css/ProposalCommentContainer.module.css";
import { IComment, Post, UserInfo } from "../../../types";
import ProposalComment from "../Post/ProposalComment";
import DetailPostContainer from "./DetailPostContainer";
import { handleDeleteCommentAPI } from "../../../sercives/api";
import Confirmation from "../../comfirmation/Confirmation";

interface PropsBase {
  onAddComment?: (newComment: Comment) => void;
  level: number;
  newCommentsArray?: IComment[];
  updateComments: (comments: IComment[]) => void;
  handleCommentParentClick?: (user: UserInfo | null | undefined) => void; // focus vào commentbar của comment cha
}
type Props =
  | (PropsBase & { postId: string | undefined; commentParentId?: never })
  | (PropsBase & { commentParentId: string | undefined; postId?: never });

const ProposalCommentContainer: React.FC<Props> = (props) => {
  const [isWatchMoreComments, setIsWatchMoreComment] = useState<boolean>(false);
  const [comments, setComments] = useState<IComment[] | undefined>();
  const [deleteCommentId, setDeleteCommentId] = useState<string>();
  useEffect(() => {
    //console.log("load because have new commment",props.newCommentsArray)
    fetchData();
  }, [props.newCommentsArray]);
  const fetchData = async () => {
    const postId = props.postId;
    const commentId = props.commentParentId;
    const actionPath = postId
      ? `getCommentsByPostId?postId=${postId}`
      : `getCommentsByCommentId?commentParentId=${commentId}`;
    const userId = localStorage.getItem("userId");
    const url = `${process.env.REACT_APP_API_URL}/api/v1/comment/${actionPath}&userId=${userId}`;
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
        setComments(data.comments);
        props.updateComments(data.comments);
      }
    } catch (e) {
      console.error("Error fetching data:", e);
    }
  };
  const handleDelete = async (id: string | undefined) => {
    const response = await handleDeleteCommentAPI(id);
    if (response)
      setComments((prev) => {
        return prev ? prev.filter((comment) => comment._id != id) : prev;
      });
  };

 
  return (
    <div className={clsx(style.expandCommentContainer)}>
      {!isWatchMoreComments ? (
        <div
          onClick={() => {
            setIsWatchMoreComment(true);
          }}
          className={clsx(style.userName)}
        >
          {props.newCommentsArray &&
          props.newCommentsArray.length > 0 &&
          comments &&
          comments?.length > 0
            ? "Watch another comments"
            : comments && comments?.length > 0
            ? `Xem ${comments.length} bình luận`
            : ""}
        </div>
      ) : (
        <div className={clsx(style.container)}>
          <div className={clsx(style.firstComment)}>
            {comments &&
              comments.map((comment) => (
                <ProposalComment
                  key={comment._id}
                  level={props.level + 1}
                  handleCommentParentClick={props.handleCommentParentClick}
                  comment={comment}
                />
              ))}
          </div>
        </div>
      )}
      {props.newCommentsArray &&
        !isWatchMoreComments &&
        props.newCommentsArray.length > 0 &&
        props.newCommentsArray.map((newComment) => (
          <ProposalComment
            key={newComment._id}
            level={props.level + 1}
            handleCommentParentClick={props.handleCommentParentClick}
            comment={newComment}
          />
        ))}
      
    </div>
  );
};

export default ProposalCommentContainer;
