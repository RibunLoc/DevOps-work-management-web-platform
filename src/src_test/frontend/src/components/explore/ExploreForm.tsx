import React, { useState, useEffect } from "react";
import { Box, ImageList, ImageListItem, Modal, Button, Avatar, CardHeader, Card, CardActions, Stack, IconButton, Typography } from "@mui/material";
import {Comment,
} from "@mui/icons-material";
import style from "./css/ExploreForm.module.css";
import { PostResponse, Post } from "../../types";
import { getTimeAgo } from "../../helper";
import { ThumbUp } from "@mui/icons-material";
import DetailPostExploreModal from "./DetailPostExploreModal";

const Explore = () => {
  const [itemData, setItemData] = useState<Post[]>([]);
  const [selectedImage, setSelectedImage] = useState<Post | null>(null);
  useEffect(() => {
    const fetchData = async () => {
      const userId = localStorage.getItem("userId")
      const url = `${process.env.REACT_APP_API_URL}/api/v1/post/posts?userId=${userId}`;
      try {
        const response = await fetch(url, {
          method: "GET",
        });
        if (!response.ok) {
          throw new Error("Error in getting message");
        }
        const data: PostResponse = await response.json();
        if (data.recommentPost.length > 0) {
          setItemData(data.recommentPost);
        } else {
          console.log("No posts found");
        }
      } catch (e) {
        console.error("Error fetching data:", e);
      }
    };

    fetchData(); // Call fetchData inside useEffect
  }, [selectedImage]);

  const handleImageClick = (image: Post) => {
    setSelectedImage(image);
  };

  const handleClose = () => {
    setSelectedImage(null);
  };
  
  return (
    <Box sx={{ width: "100%", height: "100%", overflowY: "scroll" }}>
      <ImageList variant="masonry" cols={3} gap={8}>
        {itemData.length > 0
          ? itemData.map((item) => {
              return (item.images[0]?
                <ImageListItem
                  key={item._id}
                  className={style.imageItem}
                  onClick={() => handleImageClick(item)}
                >
                  <img
                    src={`${item.images[0]}?w=248&fit=crop&auto=format&dpr=2`}
                    // {...srcset(item.media, 121, item.cols, item.rows)}
                    alt={item.content}
                    loading="lazy"
                    className={style.image}
                  />
                  <div className={style.overlay}>
                    <h3>{item.title}</h3>
                  </div>
                </ImageListItem>:""
              );
            })
          : "Don't have any posts"}
      </ImageList>

      <Modal
        open={!!selectedImage}
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
          {selectedImage && <DetailPostExploreModal post={selectedImage} onClose={handleClose} />}
        </Box>
      </Modal>
    </Box>
  );
};
export default Explore;
