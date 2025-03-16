import React, { useContext, useRef, useState } from "react";
import { IComment, UserInfo } from "../../../types";
import {
  Avatar,
  Card,
  IconButton,
  Menu,
  MenuItem,
  TextField,
} from "@mui/material";
import style from "../css/ProposalComment.module.css";
import { getTimeAgo } from "../../../helper";
import { ThumbUp, MoreHoriz } from "@mui/icons-material";
import { PostContext, PostProvider } from "./PostContext";
import clsx from "clsx";
import CommentBar from "../CommentBar";
import ExpandComment from "../ExpandComment/ExpandComment";
import { useNavigate } from "react-router-dom";
import Confirmation from "../../comfirmation/Confirmation";
import {
  handleDeleteCommentAPI,
  handleUpdateCommentAPI,
} from "../../../sercives/api";

interface Props {
  comment: IComment | undefined;
  level: number; // cấp 1, cấp 2
  handleCommentParentClick?:
    | ((user: UserInfo | null | undefined) => void)
    | undefined;
}
const Comment: React.FC<Props> = (props) => {
  const [currentComment, setCurrentComment] = useState(props.comment);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null); // Dùng để quản lý vị trí menu
  const [openMenu, setOpenMenu] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [isHideComment, setIsHideComment] = useState(false);
  //const [countComment, setCountComment] = useState<number|undefined>(props.comment?.replies.length);
  const [showReplyBar, setShowReplyBar] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [contentComment, setContentComment] = useState(props.comment?.content);
  const [newCommentsArray, setNewCommentsArray] = useState<IComment[]>([]);
  //const [isNewComment, setIsNewComment] = useState<IComment>();
  const commentInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const inputRef = useRef<HTMLInputElement>(null);
  //const [replyComments, setReplyComments] = useState<IComment[]>();
  const handleLikeComment = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/v1/like/likepost`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: localStorage.getItem("userId"),
            targetId: props.comment?._id,
            targetType: "comment",
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to like post");
      }
      const result = await response.json();
      setCurrentComment(result.updatedComment);
    } catch (e) {
      console.error(e);
    }
  };
  const onAddComment = (newComment: IComment | undefined) => {
    //setCountComment((prev)=>prev?prev+1:0)
    if (!newComment) return;
    setNewCommentsArray((prev) =>
      prev ? [...prev, newComment] : [newComment]
    );
    //setIsNewComment(newComment);
  };
  const updateComments = (comments: IComment[]) => {
    //console.log("lengddsdsdsth",comments.length)
    //setCountComment(comments.length);
  };
  const handleCommentClick = (user: UserInfo | null | undefined) => {
    if (props.level !== 3) setShowReplyBar(true);
    if (commentInputRef.current) {
      commentInputRef.current.focus(); // Tập trung vào input
      if (user) {
        console.log(user.firstname);
        commentInputRef.current.value = user.firstname; // Đặt giá trị cho input
      }
    }
  };
  const handleNavigateToProfile = () => {
    navigate(`/profile/${props.comment?.userId}`);
  };
  const handleClickMoreHoriz = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget); // Xác định vị trí menu
    setOpenMenu(true);
  };

  const handleCloseMenu = () => {
    setOpenMenu(false); // Đóng menu khi click ra ngoài
  };

  const handleOpenDeleteModal = () => {
    handleCloseMenu();
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };
  const handleDelete = async (id: string | undefined) => {
    const response = await handleDeleteCommentAPI(id);
    if (response) setIsHideComment(true);
  };
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target;
    const id = target.id;
    const value = target.value;
    setContentComment(value);
  };
  const handleEditComment = async () => {
    const response = await handleUpdateCommentAPI(
      contentComment,
      props.comment?._id
    );
    if (response) {
      console.log("contentdkjdashk",response.editComment)
      setContentComment(response.editComment.content);
      setIsEditMode(false);
      setOpenMenu(false)
    }
  };
  const handleOpenEditInput = () => {
    setIsEditMode(true);
    setContentComment(props.comment?.content ? props.comment?.content : "");
    if (inputRef.current) inputRef.current.focus();
  };
  return (
    <>
      {!isHideComment ? (
        <div className={clsx(style.container)}>
          <div onClick={handleNavigateToProfile}>
            <Avatar
              src={currentComment?.userInfo.avatar}
              className={clsx(style.avatar)}
            />
          </div>
          <div className={clsx(style.containerRight)}>
            <div className={clsx(style.card)}>
              <div className={clsx(style.cardHeader)}>
                <h4
                  className={clsx(style.userName)}
                  onClick={handleNavigateToProfile}
                >
                  {props.comment?.userInfo.firstname +
                    " " +
                    props.comment?.userInfo.lastname}
                </h4>
              </div>
              <div className={clsx(style.cardBody)}>
                {isEditMode ? (
                  <TextField
                    ref={inputRef}
                    value={contentComment}
                    onChange={onChange}
                    sx={{
                      padding: 0,
                      "& .MuiOutlinedInput-root": {
                        padding: 0,
                        "&:hover fieldset": {
                          border: "none", // Xóa viền khi hover
                        },
                        "&.Mui-focused fieldset": {
                          border: "none", // Xóa viền khi focus
                        },
                        "& fieldset": {
                          border: "none", // Xóa viền mặc định
                        },
                      },
                      "& .MuiOutlinedInput-input": {
                        padding: "5px", // Điều chỉnh padding nội dung
                      },
                    }}
                    placeholder="Comment"
                  />
                ) : (
                  <p className={clsx(style.content)}>{contentComment}</p>
                )}
              </div>
            </div>
            <div className={clsx(style.cardFooter)}>
              {!isEditMode ? (
                <>
                  <div className={clsx(style.cardFooterActions)}>
                    <p style={{ fontSize: "13px", marginTop: "1px" }}>
                      {currentComment?.createdAt &&
                        getTimeAgo(currentComment?.createdAt)}
                    </p>
                    <button
                      className={clsx({
                        [style.like]: currentComment?.isLiked != null,
                      })}
                      onClick={handleLikeComment}
                    >
                      Like
                    </button>
                    <button
                      className={clsx(style.replyBtn,style.btn)}
                      onClick={() => {
                        if (props.level !== 3) setShowReplyBar(true);
                        else {
                          if (props.handleCommentParentClick !== undefined) {
                            props.handleCommentParentClick(
                              props.comment?.userInfo
                            );
                          }
                        }
                        handleCommentClick(null);
                      }}
                    >
                      Reply
                    </button>
                    <div
                      style={{
                        alignItems: "center",
                        alignSelf: "flex-start",
                      }}
                    >
                      {props.comment?.userId === userId ? (
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
                        <MenuItem onClick={handleOpenEditInput}>Edit</MenuItem>
                        <MenuItem onClick={handleOpenDeleteModal}>
                          Delete
                        </MenuItem>
                      </Menu>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifySelf: "right",
                    }}
                  >
                    {currentComment?.likedUserInfo ? (
                      currentComment?.likedUserInfo.length > 0 ? (
                        <>
                          <p style={{ fontSize: "13px" }}>
                            {currentComment?.likedUserInfo.length}{" "}
                          </p>
                          <ThumbUp sx={{ marginLeft: "5px" }} color="primary" />
                        </>
                      ) : (
                        ""
                      )
                    ) : (
                      ""
                    )}
                  </div>
                </>
              ) : (
                <>
                  <IconButton
                    onClick={() => {
                      setAnchorEl(null);
                      setIsEditMode(false);
                      setOpenMenu(false);
                    }}
                  >
                    Cancel
                  </IconButton>
                  <IconButton onClick={handleEditComment}>Save</IconButton>
                </>
              )}
            </div>
            {
              <ExpandComment
                newCommentsArray={newCommentsArray}
                handleCommentParentClick={handleCommentClick}
                level={props.level}
                updateComments={updateComments}
                commentParentId={props.comment?._id}
              />
            }
            {showReplyBar && (
              <CommentBar
                onAddComment={onAddComment}
                ref={commentInputRef}
                parentId={currentComment?._id}
                postId={currentComment?.postId}
              />
            )}
          </div>
          <Confirmation
            open={openModal}
            title="Delete comment?"
            message="Do you want to delete this comment?"
            onClose={handleCloseModal}
            onConfirm={() => {
              handleDelete(props.comment?._id);
            }}
          />
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export default Comment;
