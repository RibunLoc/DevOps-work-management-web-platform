import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import React, { useRef, useState } from "react";
import ExpandComment from "../profile/ExpandComment/ExpandComment";
import { BookmarkBorder, Share, Comment, ThumbUp } from "@mui/icons-material";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import clsx from "clsx";
import {
  createPostUserRelationship,
  handleGetPostByPostId,
  handleLikePost,
} from "../../sercives/api";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import style from "./css/DetailPostExploreModal.module.css";
import { IComment, Post } from "../../types";
import { getTimeAgo } from "../../helper";
import CommentBar from "../profile/CommentBar";
import { useNavigate } from "react-router-dom";
import DetaiLikesModal from "../profile/Post/DetailLikesModal";
interface Props {
  post: Post | null | undefined;
  onClose: () => void;
}
const DetailPostExploreModal: React.FC<Props> = ({ post, onClose }) => {
  const [countComment, setCountComment] = useState<number>(0);
  const [currentPost, setCurrentPost] = useState<Post | null | undefined>(post);
  const commentInputRef = useRef<HTMLInputElement>(null);
  const [newCommentsArray, setNewCommentsArray] = useState<IComment[]>();
  const [openDetailLikes, setOpenDetailLikes] = useState(false);
  const handleCloseDetailLikes = () => {
    setOpenDetailLikes(false);
  };
  //const [likeCount, setLikeCount] = useState<Number>(post.likedUserInfo.length);
  const navigate = useNavigate();
  const updateComments = (comments: IComment[]) => {
    setCountComment(comments.length);
  };
  const handleLike = async () => {
    const result = await handleLikePost(post?._id);
    //console.log("sadasdkdhasjkdadd111shdadasjksajkd", result);
    setCurrentPost(result.updatedPost);
  };
  const handleCommentClick = () => {
    if (commentInputRef.current) {
      commentInputRef.current.focus();
    }
  };
  const handleAddComment = (newComment: IComment | undefined) => {
    if (!newComment) return;
    setNewCommentsArray((prev) =>
      prev ? [...prev, newComment] : [newComment]
    );
    //setCountComment(countComment + 1);
  };
  const handleSavePost = async () => {
    const reponse = await createPostUserRelationship(currentPost?._id);
    const userId = localStorage.getItem("userId");
    setCurrentPost(await handleGetPostByPostId(currentPost?._id, userId));
  };
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const images = currentPost?.images || [];
  const handleNext = () => {
    if (currentImageIndex < images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };
  const handleBack = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };
  const renderImage = () => {
    return images[currentImageIndex];
  };
  return (
    <div className={style.modal_container}>
      <div className={style.modal_contentBox}>
        <div style={{ position: "absolute" }}>
          <Button onClick={onClose} variant="outlined" sx={{ margin: "0px" }}>
            X
          </Button>
        </div>
        <Box
          sx={{
            height: "100%",
            margin: "0px",
            marginTop: "40px",
            width: "100%",
          }}
        >
          <Card
            sx={{ height: "100%", display: "flex", flexDirection: "column" }}
          >
            <Box
              sx={{
                alignItems: "center",
                borderBottom: "1px solid #708258",
                padding: "5px",
              }}
            >
              <div style={{ display: "flex" }}>
                <div
                  onClick={() => {
                    navigate(`/profile/${post?.userId}`);
                  }}
                >
                  <Avatar
                    src={currentPost?.userInfo.avatar}
                    className={clsx(style.avatar)}
                  />
                </div>
                <div style={{ marginLeft: "20px" }}>
                  <p
                    style={{ fontWeight: "500" }}
                    className={clsx(style.name)}
                    onClick={() => {
                      navigate(`/profile/${post?.userId}`);
                    }}
                  >
                    {currentPost?.userInfo.firstname +
                      " " +
                      currentPost?.userInfo.lastname}
                  </p>
                  <p>
                    {currentPost?.createdAt
                      ? getTimeAgo(currentPost?.createdAt)
                      : ""}
                  </p>
                </div>
              </div>
              <div style={{ margin: "5px 0px" }}>
                <p style={{ fontSize: "18px", fontWeight: "600" }}>
                  {currentPost?.title}
                </p>
                <Typography sx={{ fontSize: "16px" }} variant="body2">
                  {currentPost?.content}
                </Typography>
              </div>
            </Box>

            <CardActions
              disableSpacing
              sx={{
                position: "sticky",
                top: 0,
                backgroundColor: "background.paper",
                zIndex: 10,
                borderBottom: "2px solid #708258",
              }}
            >
              <Stack direction="row" spacing={1} alignItems="center">
                <IconButton onClick={handleLike}>
                  {currentPost?.isLiked ? (
                    <ThumbUp color="primary"/>
                  ) : (
                    <ThumbUp />
                  )}
                </IconButton>
                <div
                  onClick={() => {
                    setOpenDetailLikes(true);
                  }}
                >
                  <Typography variant="body2" className={clsx(style.countLike)}>
                    {/* Hiển thị số lượt thích */}
                    {currentPost && currentPost.likedUserInfo.length > 0
                      ? `${
                        currentPost.isLiked
                            ? "You"
                            : `${currentPost.likedUserInfo[0]?.firstname} ${currentPost.likedUserInfo[0]?.lastname}`
                        }${
                          currentPost.likedUserInfo.length > 1
                            ? ` and ${currentPost.likedUserInfo.length - 1} other${
                                currentPost.likedUserInfo.length - 1 > 1 ? "s" : ""
                              }`
                            : ""
                        }`
                      : ""}
                  </Typography>
                </div>
                <DetaiLikesModal
                  open={openDetailLikes}
                  onClose={handleCloseDetailLikes}
                  likedUserInfo={currentPost?.likedUserInfo}
                />
              </Stack>
              <Stack direction="row" spacing={1} ml="auto" alignItems="center">
                <IconButton onClick={handleCommentClick}>
                  <Comment />
                </IconButton>
                <Typography
                  variant="body2"
                  sx={{
                    margin: "0px 0px 0px 5px !important",
                    "&:hover": {
                      textDecoration: "underline",
                      cursor: "pointer",
                    },
                  }}
                >
                  {countComment} comments
                </Typography>
                <IconButton onClick={handleSavePost}>
                  {currentPost?.isSaved ? (
                    <BookmarkIcon style={{ color: "#F17826" }} />
                  ) : (
                    <BookmarkBorder />
                  )}
                </IconButton>
                <IconButton>
                  <Share />
                </IconButton>
              </Stack>
            </CardActions>

            <CardContent
              sx={{
                flexGrow: 1,
                display: "inline-block",
                maxHeight: "65%",
                overflowY: "scroll",
                scrollbarWidth: "thin",
                "&::-webkit-scrollbar": {
                  width: "0.4em",
                },
                "&::-webkit-scrollbar-track": {
                  background: "#f1f1f1",
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "#888",
                },
                "&::-webkit-scrollbar-thumb:hover": {
                  background: "#555",
                },
              }}
            >
              {post && (
                <Box>
                  <ExpandComment
                    level={0}
                    newCommentsArray={newCommentsArray}
                    postId={post._id}
                    updateComments={updateComments}
                  />
                </Box>
              )}
            </CardContent>

            <Box
              sx={{
                position: "sticky",
                backgroundColor: "background.paper",
                boxShadow: "0 -2px 5px rgba(0,0,0,0.1)",
              }}
            >
              {post && (
                <CommentBar
                  ref={commentInputRef}
                  postId={post._id}
                  onAddComment={handleAddComment}
                />
              )}
            </Box>
          </Card>
        </Box>
      </div>
      <div className={style.modal_img}>
        <img src={renderImage()} alt={currentPost?.content} />
        <button
          onClick={handleBack}
          disabled={currentImageIndex === 0}
          className={clsx(style.btn, style["btn-left"])}
        >
          <KeyboardArrowLeftIcon style={{ fontSize: "40px" }} />
        </button>
        <button
          onClick={handleNext}
          disabled={currentImageIndex === images.length - 1}
          className={clsx(style.btn, style["btn-right"])}
        >
          <KeyboardArrowRightIcon style={{ fontSize: "40px" }} />
        </button>
      </div>
    </div>
  );
};

export default DetailPostExploreModal;
