import React, { useEffect, useState } from 'react'
import { Box, Avatar, Typography, Link, IconButton } from '@mui/material'
import { HomeOutlined, WindowOutlined, PeopleOutline, TagOutlined, SendOutlined, ExitToAppOutlined } from '@mui/icons-material'
import { useLocation, matchPath } from 'react-router-dom'
import { useSelectedUser } from '../message/SelectedUserContext'
import { lightTheme } from '../../themes/theme'

interface SideBarProps {
  isOpened: boolean;
}

const SideBar: React.FC<SideBarProps> = ({ isOpened }) => {

  const location = useLocation()
  const userId = localStorage.getItem("userId")

  const isActive = (path: string) => {  
  // Check if the path is '/profile/:user_id'
  if (path === "/profile") {
    return !!matchPath("/profile/:userId", location.pathname); // Match the dynamic profile route
  }

  // Check for other static routes
  return location.pathname.split("/")[1] === path;
  }
  //const {selectedUserAvatar, selectedUserName, selectedUserEmail} = useSelectedUser()
  const [userName, setUserName] = useState<string>("")
  const [userAvatar, setUserAvatar] = useState<string>("")
  console.log(location.pathname.split("/")[1])
  const currentEmail = localStorage.getItem("email")

  const handleLogout = () => {
    localStorage.clear()
  }

  useEffect(() => {
    const getUserInfo = async () => {
      debugger;
      try {
        const url = `${process.env.REACT_APP_API_URL}/api/v1/user/info?email=${currentEmail}`

        const response = await fetch(url, {
          method: "GET",
          headers: {
            "content-type": "application/json"
          }
        })

        if (!response.ok) {
          throw new Error(`Error in getting message`);
        }



        const data = await response.json()
        //console.log("user data", data)
        setUserAvatar(data.userInfo.avatar)
        localStorage.setItem("userAvatar",data.userInfo.avatar )
        setUserName(`${data.userInfo.firstname} ${data.userInfo.lastname}`)

        console.log(userAvatar)
        console.log(userName)
      } catch (e) {
        console.log("Some errors happen", e)
      }

    }

    getUserInfo()


  }, [])
  return (
    isOpened ?
      <Box
        component="div"
        id="wrapperSideBar"
        width="100%"
        height="100%"
        display="flex"
        justifyContent="center"
        alignContent="center"

        sx={{
          backgroundColor: lightTheme.colors.background,
          boxShadow: "5px 0px 10px -5px rgba(0, 0, 0, 0.2)",
          overflowY: "scroll"
        }}
      >
        <Box
          component="div"
          id="mainSideBar"
          width="80%"
          height="80%"
          marginTop="10%"
        >
          {/* <Box
          component="div"
          id="avatar"
          height="150px"
          width="100%"
          display="flex"
          justifyContent="center"
          alignContent="center"

        >
          <Avatar
            src={userAvatar}
            sx={{
              height: "100%",
              width: "150px"
            }}
          />
        </Box>
        <Typography
          component="div"
          id="name"
          variant="h5"
          align="center"
          fontFamily="Inter"
          color={lightTheme.colors.text}
          marginTop="10px"
        >
          {userName}

        </Typography>
        <Typography
          component="div"
          id="shortName"
          variant="body1"
          align="center"
          fontFamily="Inter"
          color={lightTheme.colors.text}
        >
          {`@${currentEmail?.replace("@gmail.com", "")}`}

        </Typography> */}

          <Box
            display="flex"
            flexDirection="column"
            gap={2}
            //width="80%"
            alignContent="center"
            //bgcolor="white"
            padding={2}
          >
            <Box sx={{
            }}
              display="flex" alignItems="center" gap={1.5} id="home" height="40px" padding="10px" borderRadius="10px"   >
              <Avatar
                src={userAvatar}
                sx={{
                  width: "25px",
                  height: "25px"
                }}
              />
              <Typography fontFamily="Inter" color={lightTheme.colors.text} fontWeight="500">{userName}</Typography>

            </Box>

            <Link href="/home" underline="none">
              <Box sx={{
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.08)', // Change background color on hover
                  cursor: 'pointer', // Change cursor to pointer on hover
                }
              }}
                display="flex" alignItems="center" gap={1} id="home" height="40px" padding="10px" borderRadius="10px" bgcolor={isActive("home") ? lightTheme.colors.primary : lightTheme.colors.background}>
                <HomeOutlined sx={{ color: lightTheme.colors.secondary }} />
                <Typography fontFamily="Inter" color={lightTheme.colors.secondary} fontWeight="500">Home</Typography>

              </Box>
            </Link>

            <Link href="/explore" underline="none">
              <Box sx={{
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.08)', // Change background color on hover
                  cursor: 'pointer', // Change cursor to pointer on hover
                }
              }}
                display="flex" alignItems="center" gap={1} id="explore" height="40px" padding="10px" borderRadius="10px" bgcolor={isActive("explore") ? lightTheme.colors.primary : lightTheme.colors.background}>
                <WindowOutlined sx={{ color: lightTheme.colors.secondary }} />
                <Typography fontFamily="Inter" color={lightTheme.colors.secondary} fontWeight="500">Explore</Typography>

              </Box>
            </Link>


            <Link href={`/profile/${userId}`} underline="none">
              <Box sx={{
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.08)', // Change background color on hover
                  cursor: 'pointer', // Change cursor to pointer on hover
                }
              }}
                display="flex" alignItems="center" gap={1} id="group" height="40px" padding="10px" borderRadius="10px" bgcolor={isActive("group") ? lightTheme.colors.primary : lightTheme.colors.background}>
                <PeopleOutline sx={{ color: lightTheme.colors.secondary }} />
                <Typography fontFamily="Inter" color={lightTheme.colors.secondary} fontWeight="500">Profile</Typography>

              </Box>
            </Link>


            <Link href="/favourite" underline="none">
              <Box sx={{
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.08)', // Change background color on hover
                  cursor: 'pointer', // Change cursor to pointer on hover
                }
              }}
                display="flex" alignItems="center" gap={1} id="favorite" height="40px" padding="10px" borderRadius="10px" bgcolor={isActive("favourite") ? lightTheme.colors.primary : lightTheme.colors.background}>
                <TagOutlined sx={{ color: lightTheme.colors.secondary }} />
                <Typography fontFamily="Inter" color={lightTheme.colors.secondary} fontWeight="500">Favourite</Typography>

              </Box>
            </Link>


            <Link href="/message" underline="none">
              <Box sx={{
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.08)', // Change background color on hover
                  cursor: 'pointer', // Change cursor to pointer on hover
                }
              }}
                display="flex" alignItems="center" gap={1} id="message" height="40px" padding="10px" borderRadius="10px" bgcolor={isActive("message") ? lightTheme.colors.primary : lightTheme.colors.background}>
                <SendOutlined sx={{ color: lightTheme.colors.secondary }} />
                <Typography fontFamily="Inter" color={lightTheme.colors.secondary} fontWeight="500">Message</Typography>

              </Box>
            </Link>


            <Box flexGrow={2} />

            {/* Item sticking to the bottom */}

            <Link href="/login" underline="none">
              <Box 
              component="div"
              sx={{
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.08)', // Change background color on hover
                  cursor: 'pointer', // Change cursor to pointer on hover
                }

                

                
              }}

              onClick= {
                handleLogout
              }
                display="flex" alignItems="center" gap={1} id="logOut" height="40px" padding="10px" borderRadius="10px" >
                <ExitToAppOutlined sx={{ color: lightTheme.colors.secondary }} />
                <Typography fontFamily="Inter" color={lightTheme.colors.secondary} fontWeight="500">Log out</Typography>

              </Box>
            </Link>

          </Box>

        </Box>
      </Box>

      :
      <Box
        component="div"
        id="wrapperSideBar"
        width="100%"
        height="100vh"
        display="flex"
        justifyContent="center"
        alignContent="center"
        sx={{
          backgroundColor: lightTheme.colors.background,
          boxShadow: "2px 0px 10px -5px rgba(0, 0, 0, 0.2)",
          overflowY: "scroll"
        }}
      >
        <Box
          component="div"
          id="mainSideBar"
          width="80%"
          height="80%"
          marginTop="10%"
        >
          <Box
            display="flex"
            flexDirection="column"
            gap={2}
            //width="80%"
            alignContent="center"
            //bgcolor="white"
            padding={2}
          >

            <Box sx={{
            }}
              display="flex" alignItems="center" id="home" height="40px" padding="10px" borderRadius="10px"   >
              <Avatar
                src={userAvatar}
                sx={{
                  width: "25px",
                  height: "25px"
                }}
              />


            </Box>

            <Link href="/home" underline="none">
              <Box sx={{
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.08)', // Change background color on hover
                  cursor: 'pointer', // Change cursor to pointer on hover
                }
              }}
                display="flex" alignItems="center" id="home" height="40px" padding="10px" borderRadius="10px" bgcolor={isActive("home") ? lightTheme.colors.primary : lightTheme.colors.background}>
                <HomeOutlined sx={{ color: lightTheme.colors.text, width:"100%" }} />
                {/* <Typography fontFamily="Inter" color={lightTheme.colors.text} fontWeight="500">Home</Typography> */}

              </Box>
            </Link>

            <Link href="/explore" underline="none">
              <Box sx={{
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.08)', // Change background color on hover
                  cursor: 'pointer', // Change cursor to pointer on hover
                }
              }}
                display="flex" alignItems="center" gap={1} id="explore" height="40px" padding="10px" borderRadius="10px" bgcolor={isActive("explore") ? lightTheme.colors.primary : lightTheme.colors.background}>
                <WindowOutlined sx={{ color: lightTheme.colors.text, width:"100%" }} />
                {/* <Typography fontFamily="Inter" color={lightTheme.colors.text} fontWeight="500">Explore</Typography> */}

              </Box>
            </Link>


            <Link href="/message" underline="none">
              <Box sx={{
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.08)', // Change background color on hover
                  cursor: 'pointer', // Change cursor to pointer on hover
                }
              }}
                display="flex" alignItems="center" gap={1} id="group" height="40px" padding="10px" borderRadius="10px" bgcolor={isActive("group") ? lightTheme.colors.primary : lightTheme.colors.background}>
                <PeopleOutline sx={{ color: lightTheme.colors.text, width:"100%" }} />
                {/* <Typography fontFamily="Inter" color={lightTheme.colors.text} fontWeight="500">Group</Typography> */}

              </Box>
            </Link>


            <Link href="/favourite" underline="none">
              <Box sx={{
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.08)', // Change background color on hover
                  cursor: 'pointer', // Change cursor to pointer on hover
                }
              }}
                display="flex" alignItems="center" gap={1} id="favorite" height="40px" padding="10px" borderRadius="10px" bgcolor={isActive("favourite") ? lightTheme.colors.primary : lightTheme.colors.background}>
                <TagOutlined sx={{ color: lightTheme.colors.text, width:"100%" }} />
                {/* <Typography fontFamily="Inter" color={lightTheme.colors.text} fontWeight="500">Favourite</Typography> */}

              </Box>
            </Link>


            <Link href="/message" underline="none">
              <Box sx={{
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.08)', // Change background color on hover
                  cursor: 'pointer', // Change cursor to pointer on hover
                }
              }}
                display="flex" alignItems="center" gap={1} id="message" height="40px" padding="10px" borderRadius="10px" bgcolor={isActive("message") ? lightTheme.colors.primary : lightTheme.colors.background}>
                <SendOutlined sx={{ color: lightTheme.colors.text, width:"100%" }} />
                {/* <Typography fontFamily="Inter" color={lightTheme.colors.text} fontWeight="500">Message</Typography> */}

              </Box>
            </Link>


            <Box flexGrow={2} />

            {/* Item sticking to the bottom */}

            <Link href="/login" underline="none">
              <Box sx={{
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.08)', // Change background color on hover
                  cursor: 'pointer', // Change cursor to pointer on hover
                }
              }}
                display="flex" alignItems="center" gap={1} id="logOut" height="40px" padding="10px" borderRadius="10px">
                <ExitToAppOutlined sx={{ color: lightTheme.colors.text, width:"100%" }} />
                {/* <Typography fontFamily="Inter" color={lightTheme.colors.text} fontWeight="500">Log out</Typography> */}

              </Box>
            </Link>

          </Box>

        </Box>
      </Box>


  )
}

export default SideBar