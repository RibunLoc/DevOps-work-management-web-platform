import React, { useEffect, useState } from "react";
import { Box, Avatar, Typography, IconButton } from "@mui/material";
import {
  HomeOutlined,
  WindowOutlined,
  PeopleOutline,
  TagOutlined,
  SendOutlined,
  ExitToAppOutlined,
  ArrowBackIosNew,
} from "@mui/icons-material";
import { Link, useLocation } from "react-router-dom";

import style from './css/SideBarFavourite.module.css'
interface SideBarProps {
  isOpened: boolean;
}


const SideBarFavourite: React.FC<SideBarProps> = ({ isOpened }) => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname.split("localhost:3000")[0] === path;
  //const {selectedUserAvatar, selectedUserName, selectedUserEmail} = useSelectedUser()
//   const [userName, setUserName] = useState<string>("");
//   const [userAvatar, setUserAvatar] = useState<string>("");
  console.log(location.pathname.split("localhost:3000")[0]);

//   useEffect(() => {
//     const getUserInfo = async () => {
//       debugger;
//       try {
//         const url = `${process.env.REACT_APP_API_URL}/api/v1/user/info?email=${currentEmail}`;

//         const response = await fetch(url, {
//           method: "GET",
//           headers: {
//             "content-type": "application/json",
//           },
//         });

//         if (!response.ok) {
//           throw new Error(`Error in getting message`);
//         }

//         const data = await response.json();
//         //console.log("user data", data)
//         setUserAvatar(data.userInfo.avatar);
//         setUserName(`${data.userInfo.firstname} ${data.userInfo.lastname}`);

//         console.log(userAvatar);
//         console.log(userName);
//       } catch (e) {
//         console.log("Some errors happen", e);
//       }
//     };

//     getUserInfo();
//   }, []);
  return (
    <Box
      component="div"
      id="wrapperSideBar"
      width="21%"
      height="100vh"
      display="flex"
      justifyContent="center"
      alignContent="center"
      position={"fixed"}
      top={0}
      sx={{
        backgroundColor: "#ffffff",
        boxShadow: "2px 0px 10px -5px rgba(0, 0, 0, 0.2)",
        overflowY: "scroll",
      }}
    >
      <Box
        component="div"
        id="mainSideBar"
        width="80%"
        height="80%"
        marginTop="10%"
      >
        <Box display="flex" alignItems="center">
          <Link to="/home">
            <IconButton>
              <ArrowBackIosNew />
            </IconButton>
          </Link>

          <Typography
            component="div"
            id="name"
            variant="h5"
            fontFamily="Inter"
            color="#A1A7B3"
            marginLeft="10px"
          >
            Saved
          </Typography>
        </Box>
        <Box
          display="flex"
          flexDirection="column"
          gap={2}
          //width="80%"
          alignContent="center"
          //bgcolor="white"
          padding={2}
        >
          <Link to="/favourite/general" className={style.text}>
            <Box
              sx={{
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.08)", // Change background color on hover
                  cursor: "pointer", // Change cursor to pointer on hover
                },
              }}
              display="flex"
              alignItems="center"
              gap={1}   
              id="home"
              height="40px"
              padding="10px"
              borderRadius="10px"
              bgcolor={isActive("/favourite/general")||isActive("/favourite") ? "#CBD9C4" : "#ffffff"}
            >
              <HomeOutlined sx={{ color: "#89966B" }} />
              <Typography fontFamily="Inter" color="#89966B" fontWeight="500">
                General
              </Typography>
            </Box>
          </Link>

          {/* <Link to="/favourite/pets" className={style.text}>
            <Box
              sx={{
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.08)", // Change background color on hover
                  cursor: "pointer", // Change cursor to pointer on hover
                },
              }}
              display="flex"
              alignItems="center"
              gap={1}
              id="explore"
              height="40px"
              padding="10px"
              borderRadius="10px"
              bgcolor={isActive("/favourite/pets") ? "#CBD9C4" : "#ffffff"}
            >
              <WindowOutlined sx={{ color: "#89966B" }} />
              <Typography fontFamily="Inter" color="#89966B" fontWeight="500">
                Pets
              </Typography>
            </Box>
          </Link> */}

          <Link to="/favourite/posts" className={style.text}>
            <Box
              sx={{
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.08)", // Change background color on hover
                  cursor: "pointer", // Change cursor to pointer on hover
                },
              }}
              display="flex"
              alignItems="center"
              gap={1}
              id="favorite"
              height="40px"
              padding="10px"
              borderRadius="10px"
              bgcolor={isActive("/favourite/posts") ? "#CBD9C4" : "#ffffff"}
            >
              <TagOutlined sx={{ color: "#89966B" }} />
              <Typography fontFamily="Inter" color="#89966B" fontWeight="500">
                Posts
              </Typography>
            </Box>
          </Link> 

          <Box flexGrow={2} />
        </Box>
      </Box>
    </Box>
  );
};

export default SideBarFavourite;
