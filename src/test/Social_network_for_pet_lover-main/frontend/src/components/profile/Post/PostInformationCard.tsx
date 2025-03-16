import React, { useState, useEffect, useContext, useRef } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  IconButton,
  TextField,
  Stack,
  Typography,
  MenuItem,
  Menu,
  ImageList,
  ImageListItem,
  Modal,
} from "@mui/material";
import {
  AddReaction,
  AddPhotoAlternate,
  Comment,
  Share,
  MoreVert,
  ThumbUp,
  Edit,
  Delete,
  VisibilityOff,
  MoreHoriz,
  BookmarkBorder,
} from "@mui/icons-material";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import clsx from "clsx";
import style from "../css/PostInformationCard.module.css";
import { Like, Post, IComment } from "../../../types";
import CommentBar from "../CommentBar";
import ProposalCommentContainer from "./ProposalCommentContainer";
import { getTimeAgo } from "../../../helper";
import DetailPostContainer from "../ExpandComment/DetailPostContainer";
import DetaiLikesModal from "./DetailLikesModal";
import { PostContext } from "./PostContext";
import {
  createPostUserRelationship,
  handleLikeAPI,
} from "../../../sercives/api";
import { useNavigate } from "react-router-dom";
import EditPostTool from "./EditPostTool";
import Confirmation from "../../comfirmation/Confirmation";
import { title } from "process";
import DetailPostExploreModal from "../../explore/DetailPostExploreModal";
interface Props {
  updatePostsState: () => void;
}
const PostInformationCard: React.FC<Props> = (props) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { post, setPost } = useContext(PostContext)!;
  const [isCommentBarDisplay, setIsCommentBarDisplay] = useState(false);
  const open = Boolean(anchorEl);
  const commentRef = useRef<HTMLInputElement>(null);
  const [bonusComment, setBonusComment] = useState<IComment>();
  const [countComment, setCountComment] = useState<number>(0);
  const [openDetailLikes, setOpenDetailLikes] = useState(false);
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [openDetaiExplorePost, setOpenDetaiExplorePost] = useState(false);
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);
  const [propsConfirmation, setPropsConfirmation] = useState({
    title: "",
    message: "",
    open: false,
  });
  const [openEditModal, setOpenEditModal] = useState(false);
  const handleAddComment = (newComment: IComment | undefined) => {
    setBonusComment(newComment);
    setCountComment(countComment + 1);
  };
  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const updateComments = (comments: IComment[]) => {
    setCountComment(comments.length);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    setOpenEditModal(true);
    handleClose();
  };
  const handleShowDeleteConfirmation = async () => {
    setPropsConfirmation({
      open: true,
      title: "Do you want to delete?",
      message: "Do you want to delete this post?",
    });
    handleClose();
  };
  const handleDelete = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/v1/post/delete?postId=${post?._id}`,
        { method: "DELETE" }
      );
      if (!response.ok) {
        throw new Error("Failed to delete post");
      }
      const result = await response.json();
      setAnchorEl(null);
      props.updatePostsState?.();
    } catch (e) {
      console.error(e);
    }
  };
  const handleHide = () => {
    console.log("Hide clicked");
  };
  const handleLike = async (isLiked: boolean) => {
    const result = await handleLikeAPI(post?._id, "post");
    if (result) props.updatePostsState?.();
  };
  const handleCommentClick = () => {
    setIsCommentBarDisplay(true);
    // Focus vào trường nhập bình luận
    if (commentRef) commentRef.current?.focus();
  };
  const handleOpenDetailLikes = () => {
    setOpenDetailLikes(true);
  };
  const handleCloseDetailLikes = () => {
    setOpenDetailLikes(false);
  };
  const handleSavePost = async () => {
    const reponse = await createPostUserRelationship(post?._id);
    props.updatePostsState();
  };
  const handleNavigateToProfile = () => {
    navigate(`/profile/${post?.userId}`);
  };
  return (
    <Card
      sx={{
        borderRadius: "20px !important",
        backgroundColor: "#F9F9F9",
        width: "100%",
        mb: 2,
      }}
    >
      <CardHeader
        avatar={
          <Avatar
            alt="User Avatar"
            src={post?.userInfo.avatar}
            className={clsx(style.avatar)}
            onClick={handleNavigateToProfile}
          />
        }
        action={
          <>
            {/* Nút ba chấm */}
            <IconButton onClick={handleMenuClick}>
              <MoreVert />
            </IconButton>

            {/* Menu với các tùy chọn */}
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
            >
              {post?.userInfo._id === localStorage.getItem("userId") ? (
                <MenuItem
                  sx={{ justifyContent: "flex-start" }}
                  onClick={handleEdit}
                >
                  <Edit />
                  Edit
                </MenuItem>
              ) : (
                ""
              )}
              {post?.userInfo._id === localStorage.getItem("userId") ? (
                <MenuItem
                  sx={{ justifyContent: "flex-start" }}
                  onClick={handleShowDeleteConfirmation}
                >
                  <Delete />
                  Delete
                </MenuItem>
              ) : (
                ""
              )}

              <MenuItem
                sx={{ justifyContent: "flex-start" }}
                onClick={handleHide}
              >
                <VisibilityOff />
                Hide
              </MenuItem>
            </Menu>
          </>
        }
        title={
          <p className={clsx(style.userName)} onClick={handleNavigateToProfile}>
            {post?.userInfo.firstname + " " + post?.userInfo.lastname}
          </p>
        }
        subheader={post?.createdAt && getTimeAgo(post.createdAt)}
      />
      <CardContent>
        {post?.title && (
          <Typography variant="body1" sx={{ mb: 2, fontWeight: "bold" }}>
            {post?.title}
          </Typography>
        )}
        <Typography variant="body1" sx={{ mb: 2 }}>
          {post?.content}
        </Typography>
        {post?.images != undefined && post.images.length > 0 && (
          <ImageList variant="masonry" cols={post.images.length} gap={8}>
            {post.images.map((url, i) => {
              return (
                <ImageListItem key={i + ""}>
                  <img
                    src={`${url}?w=248&fit=crop&auto=format&dpr=2`}
                    loading="lazy"
                    className={clsx(style.image)}
                    onClick={() => {
                      setOpenDetaiExplorePost(true);
                    }}
                  />
                </ImageListItem>
              );
            })}
          </ImageList>
        )}
        <Modal
          open={openDetaiExplorePost}
          onClose={handleClose}
          sx={{ backdropFilter: "blur(2px)" }}
        >
          <Box
            sx={{
              display: "flex",
              position: "absolute",
              top: "50%",
              left: "50%",
              height: "100%",
              width: "100%",
              transform: "translate(-50%, -50%)",
              bgcolor: "background.paper",
              outline: "none",
              border: "0px",
              boxShadow: 24,
              borderRadius: "9px",
            }}
          >
            {openDetaiExplorePost && (
              <DetailPostExploreModal
                post={post}
                onClose={() => {
                  setOpenDetaiExplorePost(false);
                }}
              />
            )}
          </Box>
        </Modal>
      </CardContent>
      <CardActions disableSpacing>
        <Stack direction="row" spacing={1} alignItems="center">
          <IconButton onClick={()=>
          {
            if(post) {
              handleLike(post.isLiked)
            }
          }
            }>
            {post?.isLiked ? <ThumbUp color="primary" /> : <ThumbUp />}
          </IconButton>
          <div onClick={handleOpenDetailLikes}>
            <Typography variant="body2" className={clsx(style.countLike)}>
              {post && post.likedUserInfo.length > 0
                ? `${
                    post.isLiked
                      ? "You"
                      : `${post.likedUserInfo[0]?.firstname} ${post.likedUserInfo[0]?.lastname}`
                  }${
                    post.likedUserInfo.length > 1
                      ? ` and ${post.likedUserInfo.length - 1} other${
                          post.likedUserInfo.length - 1 > 1 ? "s" : ""
                        }`
                      : ""
                  }`
                : ""} 
            </Typography>
          </div>
          <DetaiLikesModal
            open={openDetailLikes}
            onClose={handleCloseDetailLikes}
            likedUserInfo={post?.likedUserInfo}
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
            onClick={handleOpenModal}
          >
            {countComment} comments
          </Typography>
          <IconButton onClick={handleSavePost}>
            {post?.isSaved ? (
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
          paddingBottom: "0px !important",
          position: "relative",
          justifySelf: "left",
        }}
      >
        <ProposalCommentContainer
          newComment={bonusComment}
          postId={post?._id}
          updateComments={updateComments}
          handleLike={()=>handleLike(true)}
          handleSave={handleSavePost}
        />
        {post && isCommentBarDisplay && (
          <CommentBar
            ref={commentRef}
            postId={post._id}
            onAddComment={handleAddComment}
          />
        )}
      </CardContent>
      <DetailPostContainer
        updatePostsState={props.updatePostsState}
        open={openModal}
        handleClose={handleCloseModal}
        handleLike={()=>handleLike(true)}
        handleSave={handleSavePost}
      />
      <Confirmation
        title={propsConfirmation.title}
        open={propsConfirmation.open}
        message={propsConfirmation.message}
        onClose={() =>
          setPropsConfirmation((prev) => ({ ...prev, open: false }))
        }
        onConfirm={handleDelete}
      />
      <EditPostTool
        isOpen={openEditModal}
        onClose={() => {
          setOpenEditModal(false);
        }}
        onUpdated={props.updatePostsState}
      />
    </Card>
  );
};

export default PostInformationCard;
