import React from 'react'
import { IconButton, Input, Box, Avatar, Typography, Link, TextField, InputAdornment, Stack, List, ListItem, ListItemText, ListItemAvatar, ImageList, ImageListItem, Divider } from '@mui/material'
import { SearchOutlined, MessageOutlined, Add } from '@mui/icons-material'
import AddIcon from "@mui/icons-material/Add";
import { styled } from "@mui/material/styles";
import useRecentChats from '../../hooks/chat/useRecentChats'
import { useEffect, useState } from 'react'
import { useSelectedUser } from './SelectedUserContext'
import { useSocket } from './SocketContext'
import { useBackground } from './BackgroundContext'
import { lightTheme } from '../../themes/theme'
import uploadToCloudinary from '../profile/UploadImage';
import { useNavigate, useParams } from 'react-router-dom';
import { RecentChat } from '../../types';

interface message {
  _id: string,
  latestMessage: string,
  sendAt: string
}

interface image {
  img: string,
  title: string
}

interface JsonImage {
  isDeleted: boolean;
  link: string;
  name: string;
  recipentEmail: string;
  sendAt: string;
  senderEmail: string;
  __v: number;
  _id: string;
}

const imageDataArray = [
  {
    img: "https://plus.unsplash.com/premium_photo-1664202526559-e21e9c0fb46a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZmFzaGlvbnxlbnwwfHwwfHx8MA%3D%3D",
    title: 'Breakfast',
  },
  {
    img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZmFzaGlvbnxlbnwwfHwwfHx8MA%3D%3D",
    title: 'Burger',
  },
  {
    img: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8ZmFzaGlvbnxlbnwwfHwwfHx8MA%3D%3D",
    title: 'Camera',
  },
  {
    img: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8ZmFzaGlvbnxlbnwwfHwwfHx8MA%3D%3D",
    title: 'Coffee',
  },
  {
    img: "https://plus.unsplash.com/premium_photo-1675186049419-d48f4b28fe7c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8ZmFzaGlvbnxlbnwwfHwwfHx8MA%3D%3D",
    title: 'Hats',
  },
  {
    img: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGZhc2hpb258ZW58MHx8MHx8fDA%3D",
    title: 'Honey',
  },
  {
    img: "https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzB8fGZhc2hpb258ZW58MHx8MHx8fDA%3D",
    title: 'Basketball',
  },
  {
    img: "https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzB8fGZhc2hpb258ZW58MHx8MHx8fDA%3D",
    title: 'Fern',
  },
  {
    img: "https://images.unsplash.com/photo-1477064996809-dae46985eee7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDd8fGZhc2hpb258ZW58MHx8MHx8fDA%3D",
    title: 'Mushrooms',
  }
];

// const RoundButton = styled(Button)(({ theme }) => ({
//   minWidth: 0,
//   width: 60,
//   height: 60,
//   borderRadius: "50%",
//   backgroundColor: theme.palette.primary.main,
//   color: theme.palette.common.white,
//   boxShadow: theme.shadows[4],
//   "&:hover": {
//     backgroundColor: theme.palette.primary.dark,
//   },
// }));


const SideBar = () => {

  //const recentMessages = useRecentChats("Baonguyen2110@gmail.com")



  const email = localStorage.getItem("email")
  const selectedUserEmail = useParams().userEmail
  const { setSelectedUserEmail } = useSelectedUser()
  const [recentChats, setRecentChats ] = useState<RecentChat[]>([])
  const { setBackgroundImageOver, isPaletteOpen, setIsPaletteOpen, setSelectedTheme } = useBackground()
  const [imageData, setImageData] = useState<image[]>(imageDataArray)
  const [dataArray, setDataArray] = useState<message[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedId, setSelectedId] = useState<string>("")
  const [backgroundColor, setBackgroundColor] = useState<string>(lightTheme.colors.background)
  const nav = useNavigate()
  const [selectedUserAvatar, setSelectedUserAvatar] = useState<string|undefined>("")
  const [selectedUserFirstName, setSelectedUserFirstName] = useState<string>("")
  const [selectedUserLastName, setSelectedUserLastName] = useState<string>("")
  useEffect(() => {
    const fetchData = async () => {
      debugger;
      const url = `${process.env.REACT_APP_API_URL}/api/v1/user/info?email=${selectedUserEmail}`;
      try {
        const response = await fetch(url, {
          method: "GET",
        });
        if (!response.ok) {
          throw new Error("Error in getting user");
        }
        const data = await response.json();
        setSelectedUserAvatar(data.userInfo.avatar)
        setSelectedUserFirstName(data.userInfo.firstname)
        setSelectedUserLastName(data.userInfo.lastname)
      } catch (e) {
        console.error("Error fetching data:", e);
      }
    };

    fetchData(); // Call fetchData inside useEffect
  }, [selectedUserEmail]);

  const handleFileChangeBackground = async (event: React.ChangeEvent<HTMLInputElement>) => {
    debugger;
    const file = event.target.files?.[0]
    if (file) {
      const imageLink = await uploadToCloudinary(file)
      const imageName = file.name
      const newImage = {
        "img": imageLink,
        "title": imageName
      }

      const prevImageArray = imageData
      const newImageArray = [...prevImageArray, newImage]
      setImageData(newImageArray)

      const url = `${process.env.REACT_APP_API_URL}/api/v1/image/upload?type=messageBackground`

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Important: Specify that the body is JSON
        },
        body: JSON.stringify({
          "senderEmail": email,
          "recipentEmail": selectedUserEmail,
          "link": imageLink,
          "name": imageName
        })
      })

      if (!response.ok) {
        console.log("fail to upload image to server")
      }

      console.log("link", imageLink)
    } else {
      console.log("no file selected")
    }

    if (file) {
      console.log("File selected:", file);
    }
  };


  // useEffect(() => {

  //   const getMessagesHistory = async () => {

  //     if (!selectedUserEmail) {
  //       return
  //     }
      
  //     const url = `${process.env.REACT_APP_API_URL}/api/v1/message/history?senderEmail=${email}&recipentEmail=${selectedUserEmail}`

  //     try {
  //       const response = await fetch(url)

  //       if (!response.ok) {
  //         console.log("get history fail")
  //         throw new Error("get history fail")


  //       }

  //       const data = await response.json()

  //       if (data.chatHistory.length === 0) {
  //         debugger;
          
  //         setRecentChats((prev) => [...prev, newRecentChat])
  //       }

  //     } catch (e) {
  //       console.log("Some errors happen", e)
  //     }


  //   }

  //   getMessagesHistory()
  //   return (() => {

  //   })

  // }, [selectedUserEmail])


  useEffect(() => {
    const fetchData = async () => {


      const url = `${process.env.REACT_APP_API_URL}/api/v1/message/recent?email=${email}`

      try {



        const response = await fetch(url, {
          method: "GET"
        })

        if (!response.ok) {
          throw new Error(`Error in getting message`);
        }

        debugger;
        const data = await response.json()
        const recentMessages:RecentChat[] = data.recentMessages
        console.log("data", data)
        console.log("recentMessages", recentMessages)
        if (recentMessages.length > 0) {
          const selectedUserAvatar = recentMessages[0]?.userInfo?.avatar; // Use optional chaining
          setSelectedUserAvatar(selectedUserAvatar)
          console.log("Selected User Avatar:", selectedUserAvatar);
        }
        const emailExists = recentMessages.some(chat => chat.userInfo?.email === selectedUserEmail);
        if(!emailExists && selectedUserEmail) {
          var firstname = ''
          var lastname=''
          var avatar =''
          const fetchData = async () => {
            debugger;
            const url = `${process.env.REACT_APP_API_URL}/api/v1/user/info?email=${selectedUserEmail}`;
            try {
              const response = await fetch(url, {
                method: "GET",
              });
              if (!response.ok) {
                throw new Error("Error in getting user");
              }
              const data = await response.json();
              avatar= data.userInfo.avatar
              firstname= data.userInfo.firstname
              lastname = data.userInfo.lastname
            } catch (e) {
              console.error("Error fetching data:", e);
            }
          };
      
          await fetchData(); // Call fetchData inside useEffect
          const newRecentChat: RecentChat = {
            _id: selectedUserEmail,
            latestMessage: "",
            timeStamp: Date(),
            userInfo: {
              firstname: lastname,
              lastname: firstname,
              avatar: avatar,
              email: selectedUserEmail,
              phone: undefined
            }
          }


          recentMessages.push(newRecentChat)
        }
        console.log("selectedUserAvatar", selectedUserAvatar)
        setRecentChats(recentMessages)


        return recentMessages


      } catch (e) {
        console.log("Some errors happen", e)
        return []
      } finally {
        setLoading(false)
      }
    };



    fetchData();


  }, []);

  useEffect(() => {
    const fetchData = async () => {

      debugger;
      const url = `${process.env.REACT_APP_API_URL}/api/v1/message/conversation/get?senderEmail=${email}&recipentEmail=${selectedUserEmail}`
      try {



        const response = await fetch(url, {
          method: "GET"
        })

        if (!response.ok) {
          throw new Error(`Error in getting background`);
        }


        const data = await response.json()
        const backgroundImage = data.image
        const theme = data.theme

        setBackgroundImageOver(backgroundImage)
        setSelectedTheme(theme)
      } catch (e) {
        console.log("Some errors happen", e)
        return []
      } finally {
        setLoading(false)
      }
    };

    const getBackgroundImage = async () => {
      const url = `${process.env.REACT_APP_API_URL}/api/v1/image/get?type=messageBackground&senderEmail=${email}&recipentEmail=${selectedUserEmail}`

      const response = await fetch(url, {
        method: "GET"
      })

      if (!response.ok) {
        throw new Error(`Error in getting image`);
      }
      var newArray = []
      const data = await response.json()
      if (data.backgroundImages.length > 0) {
        newArray = data.backgroundImages.map((item: JsonImage) => ({ "img": item.link, "title": item.name }));
      }

      setImageData(newArray)
      console.log(newArray)
    }

    getBackgroundImage()

    fetchData();


  }, [selectedUserEmail]);

  if (loading) {
    return (
      <div>loading</div>
    )
  }

  return (

    <Box
      component="div"
      id="rightBar"
      height="100vh"
      width="100%"
      display="flex"
      justifyContent="center"
      justifyItems="center"
      bgcolor={backgroundColor}
      sx={{
        //backgroundColor: "#ffffff",
        boxShadow: "-2px 0px 10px -5px rgba(0, 0, 0, 0.2)"
      }}
    >
      <Box
        component="div"
        id="mainRightBar"
        width="80%"
        height="65%"
        padding="20px"
        bgcolor={lightTheme.colors.background}
      //marginTop="10%"
      >
        <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
          <SearchOutlined sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
          <TextField id="input-with-sx" label="Search for chat" variant="standard" />
        </Box>



        <List sx={{ width: '100%', maxWidth: 360, bgcolor: lightTheme.colors.background }}>
          {
            recentChats.map((message) => {
              console.log("recent message", message)
              return <ListItem
                key={message._id}

                onClick={() => {
                  nav(`/message/${message._id}`)

                }
                }




                sx={{
                  height: "100px",
                  backgroundColor: selectedUserEmail === message._id ? "rgba(0, 0, 0, 0.08)" : lightTheme.colors.background,
                  borderRadius: "10px",
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.08)', // Change background color on hover
                    cursor: 'pointer', // Change cursor to pointer on hover
                  },

                }}
              >
                <ListItemAvatar>
                  <Avatar src={message.userInfo?.avatar}>
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={`${message.userInfo?.firstname}${message.userInfo?.lastname}`} secondary={<span
                  style={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    maxWidth: '200px', // Adjust width as needed
                    display: 'block', // Ensures the span behaves as a block element
                  }}
                >
                  {message.latestMessage}
                </span>} />

                <Typography
                  variant="caption"
                  sx={{
                    position: "relative",
                    bottom: "-13px"
                  }}
                >
                  {new Date(message.timeStamp).toLocaleString().slice(0, 5)}

                </Typography>
              </ListItem>
})
          }

        </List>

        <Divider orientation="horizontal"></Divider>
        <div style={{ width: "100%", height: '450px', overflowY: 'scroll' }}>
          <div>
            <label htmlFor="file-input-background">
              {/* Round Upload Button */}
              <IconButton component="span">
                <AddIcon fontSize="large" />
              </IconButton>
            </label>

            {/* Hidden File Input */}
            <Input
              id="file-input-background"
              type="file"
              style={{ display: "none" }}
              onChange={handleFileChangeBackground}
            />
          </div>
          <ImageList cols={2} rowHeight={100}

          >
            {imageData.map((item) => (
              <ImageListItem key={item.img}

              >
                <img
                  srcSet={`${item.img}`}
                  src={`${item.img}`}
                  alt={item.title}
                  loading="lazy"
                  className="imageItem"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",

                  }}

                  onMouseEnter={(e) => {
                    e.currentTarget.style.cursor = "pointer";
                    e.currentTarget.style.opacity = "0.8";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = "1";
                  }}

                  onClick={
                    () => {
                      debugger;
                      console.log("item.img", item.img)
                      setBackgroundImageOver(item.img)
                      setIsPaletteOpen(!isPaletteOpen)
                    }}


                />
              </ImageListItem>
            ))}
          </ImageList>

        </div>

      </Box>
    </Box >

  )

}

export default SideBar