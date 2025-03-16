import React, { useEffect, useState } from "react";
import { Box, Typography, Avatar, Link, Modal } from "@mui/material";
import { Notifications } from "@mui/icons-material";
import { lightTheme } from "../../themes/theme";
import { useSocket } from "../message/SocketContext";
import clsx from "clsx";
import style from "./css/header.module.css";
import { useNavigate } from "react-router-dom";
import SearchHeader from "../search/SearchHeader";
interface Props {
  updatePostsState: () => void;
}

const Header: React.FC = () => {
  var avatarSrc = localStorage.getItem("userAvatar")
  const userId = localStorage.getItem("userId")
  const userEmail = localStorage.getItem("email")
  const { hasNotification, likePostDetailed, setHasNotification, notiList, setNotiList } = useSocket()
  // State for modal visibility
  const [open, setOpen] = useState(false);
  const [openDetailPostModal, setOpenDetailPostModal] = useState(false);
  const [detailedNotiList, setDetailedNotiList] = useState<any[]>([])
  const handleOpenDetailPostModal = () => setOpenDetailPostModal(true);
  const handleCloseDetailPostModal = () => setOpenDetailPostModal(false);
  
  // Modal handlers
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setHasNotification(false);
    setOpen(false);
  };
  const navigate = useNavigate();

  useEffect(() => {
    const getNoti = async () => {
      debugger;
      const url = `${process.env.REACT_APP_API_URL}/api/v1/notification/get?page=1&limit=5&postOwnerEmail=${userEmail}`
      try {
        const response = await fetch(url)
        const data = await response.json()

        localStorage.setItem("NotiQueue", JSON.stringify(data.noties))
        setNotiList(data.noties)
      } catch (e) {
        console.log(e)
      }

    }
    getNoti()
  }, [])
  return (
    <>
      <Box
        component="div"
        sx={{
          height: "10vh",
          backgroundColor: lightTheme.colors.background,
          color: "black",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          zIndex: 1000,
          fontFamily: "Helvetica",
          fontSize: "30px",
          paddingLeft: "50px",
          marginRight: "50px",
          borderBottom:"1px solid #89966B"
        }}
      >
        {/* Left Side */}
        <div className={clsx(style.avatarContainer)} onClick={() => { navigate('/home') }}>
          <img src='https://res.cloudinary.com/dh6brjozr/image/upload/Brown_Black_Simple_Modern_Pet_Shop_Logo_hizos1.png' />
{/*           𝓕𝓪𝓼𝓱𝓲𝓸𝓷𝓲𝓼𝓽𝓪 */}
        </div>
        {/* Middle Box */}
        <Box
          sx={{
            flexGrow: 1, // Allows it to expand and take up the middle space
            display: "flex",
            justifyContent: "left", // Centers content horizontally
            alignItems: "center", // Centers content vertically
          }}
        >
          <SearchHeader/>
        </Box>
        {/* Right Side */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
            minWidth: "200px", // Add spacing between notifications and avatar
          }}
        >
          <Notifications
            sx={{
              color: hasNotification ? "red" : "inherit", // Change color based on notification
            }}
            onClick={handleOpen}
          />

          <Modal open={open} onClose={handleClose}>
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                bgcolor: "background.paper",
                boxShadow: 24,
                p: 4,
                width: 300,
                borderRadius: "8px",
              }}
            >
              <Typography variant="h6" component="h2" gutterBottom>
                Notifications
              </Typography>
              {notiList ? notiList.map((noti, index) => (

                <Link href={`/post/${noti.postId}`} underline='none' color='black'>
                  <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  {/* User Avatar */}
                  <Avatar
                    src={noti.userAvatar}
                    alt={noti.userName}
                    sx={{
                      width: 40,
                      height: 40,
                      mr: 2,
                    }}
                  />

                  {/* Text Content */}
                  <Box>
                    <Typography variant="body1">
                      {`${noti.userName} ${noti.eventType} your post`}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {noti.createdAt.toLocaleString()}
                    </Typography>
                  </Box>
                </Box>
                </Link>
                

              )) : (
                <Typography>No new notifications.</Typography>
              )}
            </Box>
          </Modal>
          <Link href={`/profile/${userId}`} underline="none">
            <Avatar
              src={localStorage.getItem("userAvatar") || undefined}
              sx={{
                width: "35px",
                height: "35px",
              }}
            />
          </Link>
        </Box>
      </Box>
    </>
  );
};

export default Header;
