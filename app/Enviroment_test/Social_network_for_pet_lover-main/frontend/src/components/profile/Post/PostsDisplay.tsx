import React, { useState, useEffect, useContext } from "react";
import PostInformationCard from "./PostInformationCard";
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
} from "@mui/material";
import {
  AddReaction,
  AddPhotoAlternate,
  Comment,
  Share,
  MoreVert,
  ThumbUp,
  BookmarkBorder,
  Edit,
  Delete,
  VisibilityOff,
} from "@mui/icons-material";
import style from "./css/PostsDisplay.module.css";
import PostToolDisplay from "./PostToolDisplay";
import { Like, Post, User } from "../../../types";
import { PostProvider } from "./PostContext";
import PostRequestBar from "./PostRequestBar";
import { AccessUrlContext } from "../AccessUrlContext";
import { useParams } from "react-router-dom";

const PostsDisplay = () => {
  const [isDisplayTool, setIsDisplayTool] = useState(false);
  const [postsData, setPostsData] = useState<Post[]>([]);
  const [page,setPage] = useState(0)
  const [user, setUser] = useState<User>();
  const { url, setUrl } = useContext(AccessUrlContext)!;
  const toggleDisplayToolBox = () => {
    setIsDisplayTool((prev) => !prev);
  };

  const updatePostsState = async () => {
    try {
      fetchData();
    } catch (error) {
      console.error("Error updating post state:", error);
    }
  };
  useEffect(() => {
    fetchData(); // Call fetchData inside useEffect
  }, [url]);
  // const fetchData = async () => {
  //   if (!url) return;
  //   try {
  //     const response = await fetch(url, {
  //       method: "GET",
  //     });
  //     if (!response.ok) {
  //       throw new Error("Error in getting message");
  //     }
  //     const data = await response.json();
  //     setPostsData(data.posts);
  //     setUser(data.user);
  //   } catch (e) {
  //     console.error("Error fetching data:", e);
  //   }
  // };
  const fetchData = async (page: number = 1, limit: number = 2) => {
    if (!url) return;
    console.log("abcde",`${url}&page=${page}&limit=${limit}`)
    try {
      const response = await fetch(`${url}&page=${page}&limit=${limit}`, {
        method: "GET",
      });
      if (!response.ok) {
        throw new Error("Error in getting posts");
      }
      const data = await response.json();
      if (data.posts.length > 0) {
        console.log('fetchaskdja')
        setPostsData((prev) => [...prev, ...data.posts]); // Append new data
        setUser(data.user);
      } else {
        console.log("No more posts to load");
      }
    } catch (e) {
      console.error("Error fetching data:", e);
    }
  };
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchData(page + 1); // Tăng page lên và gọi API
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1 }
    );

    const loadMoreTrigger = document.querySelector("#load-more-trigger");
    if (loadMoreTrigger) observer.observe(loadMoreTrigger);

    return () => observer.disconnect();
  }, [page]);
  // const handleHide = () => {
  //   console.log("Hide clicked");
  // };
  return (
    <Box sx={{ width: "100", mx: "auto", mt: 4 }}>
      {/* Top post input area */}
      <PostRequestBar
        user={user}
        toggleDisplayToolBox={toggleDisplayToolBox}
        isDisplayTool={isDisplayTool}
        updatePostsState={updatePostsState}
      />
      {postsData != undefined && postsData?.length > 0
        ? postsData?.map((post, index) => {
            return (
              <PostProvider post={post} key={post._id}>
                <PostInformationCard updatePostsState={updatePostsState} />
              </PostProvider>
            );
          })
        : "Don't have any post"}
        <div id="load-more-trigger"></div> 
    </Box>
  );
};

export default PostsDisplay;
