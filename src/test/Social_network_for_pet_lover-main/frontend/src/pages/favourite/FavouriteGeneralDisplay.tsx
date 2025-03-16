import React, { useEffect, useState } from "react";
import {
  handleGetFavouritedPetByUserId,
  handleGetFavouritedPostByUserId,
  handleGetPostByPostId,
  handleLikeAPI,
} from "../../sercives/api";
import { PetFavourite, Post, PostFavourite } from "../../types";
import { Avatar, IconButton } from "@mui/material";
import PetGeneral from "../../components/favourite/general/PetGeneral";
import PostGeneral from "../../components/favourite/general/PostGeneral";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import style from "./css/FavouriteGeneral.module.css";
import { useNavigate } from "react-router-dom";
import { PostProvider } from "../../components/profile/Post/PostContext";
import DetailPostContainer from "../../components/profile/ExpandComment/DetailPostContainer";
import EmptyPetGeneral from "../../components/favourite/general/EmptyPetGeneral";
import EmptyPostGeneral from "../../components/favourite/general/EmptyPostGeneral";

const FavouriteGeneralDisplay = () => {
  const [pets, setPets] = useState<PetFavourite[]>();
  const [selectedPostId, setSelectedPostId] = useState<String>();
  const [selectedPost, setSelectedPost] = useState<Post>();
  const [posts, setPosts] = useState<PostFavourite[]>();
  const [openModal, setOpenModal] = useState(false);

  const navigate = useNavigate();
  useEffect(() => {
    
    fetchDataArray();
  }, []);
  const fetchDataArray = async () => {
    const pets = await handleGetFavouritedPetByUserId();
    setPets(pets);
    const posts = await handleGetFavouritedPostByUserId();
    setPosts(posts);
  };
  useEffect(() => {
    fetchData();
  }, [selectedPostId]);
  const fetchData = async () => {
    const userId = localStorage.getItem("userId");
    const response = await handleGetPostByPostId(selectedPostId, userId);
    setSelectedPost(response);
  };
  const handleCloseModal = () => setOpenModal(false);
  const handleLike = async (postId: string | undefined) => {
    const result = await handleLikeAPI(postId, "post");
    fetchData();
    fetchDataArray();
  };
  const handleOpenModal = (id: String | undefined) => {
    setSelectedPostId(id);
    setOpenModal(true);
  };
  return (
    <div className={style.container}>
      {/* <div className={style.favouriteContainer}>
        <div className={style.row}>
          <p className={style.section}>Pets Favourite</p>
          <div className={style.row}>
            <p className={style.title}>See All</p>
            <IconButton
              onClick={() => {
                navigate("/favourite/pets");
              }}
            >
              <ArrowForwardIosIcon />
            </IconButton>
          </div>
        </div>
        <div className={style.containerInside}>
          {pets&&pets?.length>0?pets?.map((pet, index) => (
            <PetGeneral key={pet.petInfo._id} pet={pet} />
          )):<EmptyPetGeneral/>}
        </div>
      </div> */}
      <div className={style.favouriteContainer}>
        <div className={style.row}>
          <p className={style.section}>Posts Favourite</p>
          <div className={style.row}>
            <p className={style.title}>See All</p>
            <IconButton
              onClick={() => {
                navigate("/favourite/posts");
              }}
            >
              <ArrowForwardIosIcon />
            </IconButton>
          </div>
        </div>
        <div className={style.containerInside}>
          {posts && posts?.length > 0
            ? posts?.map((post, index) => (
                <PostGeneral key={post.postInfo._id} post={post} handleOpenModal={()=>{handleOpenModal(post.postInfo._id)}} />
              ))
            : <EmptyPostGeneral/>}
        </div>
      </div>
      {selectedPost !== undefined && (
        <PostProvider post={selectedPost ? selectedPost : null}>
          <DetailPostContainer
            open={openModal}
            handleClose={handleCloseModal}
            handleLike={() => {
              handleLike(selectedPost?._id);
            }}
          />
        </PostProvider>
      )}
    </div>
  );
};

export default FavouriteGeneralDisplay;
