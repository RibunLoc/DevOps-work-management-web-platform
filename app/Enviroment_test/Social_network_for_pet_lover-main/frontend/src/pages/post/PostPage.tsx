import React, { useEffect, useState } from "react";
import PublicLayout from "../../Layout";
import SideBarHome from "../../components/sideBar/SideBarRight/Home/SideBarHome";
import PostDisplayForm from "./PostDisplayForm";
import { useParams } from "react-router-dom";
import { handleGetPostByPostId } from "../../sercives/api";
import { Post } from "../../types";
import { PostProvider } from "../../components/profile/Post/PostContext";

const PostPage = () => {
  const { postId } = useParams();
  const [post, setPost] = useState<Post>();

  useEffect(() => {
    fetchData(); // Call fetchData inside useEffect
  }, [postId]);
  const fetchData = async () => {
    const post = await handleGetPostByPostId(
      postId,
      localStorage.getItem("userId")
    );
    setPost(post);
  };
  const updatePostsState = async () => {
    try {
      fetchData();
    } catch (error) {
      console.error("Error updating post state:", error);
    }
  };
  return (
    <>
        <PostProvider post={post} key={post?._id}>
          <PublicLayout
            mainContent={
             post? <PostDisplayForm updatePostsState={updatePostsState} /> :"Invalid Url"
            }
            recentChatsContent={<SideBarHome />}
          />
        </PostProvider>
    </>
  );
};

export default PostPage;
