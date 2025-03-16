import React from 'react'
import { Box, keyframes, IconButton, Icon } from '@mui/material'
import { useState, useRef, useEffect } from 'react'
import { ChatBubbleOutlined, CloseOutlined } from '@mui/icons-material'
import MessageInput from '../message/MessageInput'
import MessageDisplay from '../message/MessageDisplay'
import { handleGetFavouritedPetByUserId } from '../../sercives/api';
import { useSocket } from '../message/SocketContext'

const ChatBot = () => {

  const [isOpened, setIsOpened] = useState<boolean>(false)
  const [scrollToBottom, setScrollToBottom] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [petFavourites, setPetFavourites] = useState([]) 
  // const [initialInput, setInitialInput] = useState<string | null>(null);
  const {initialInput, setInitialInput} = useSocket()

  useEffect(() => {
    if (scrollToBottom && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      setScrollToBottom(false); // Reset flag after scrolling
    }
  }, [scrollToBottom]); 

  useEffect(()=>{
    const getFavouritePets = async () => {
      debugger;
      const petFavouriteArray = await handleGetFavouritedPetByUserId()
      setPetFavourites(petFavouriteArray)
    }
    
    getFavouritePets()
  },[])

  useEffect(() => {
    if (initialInput) {
      setInitialInput(initialInput); // Preload the input with the initial message
      setIsOpened(true); // Auto-open the chatbot
    }
  }, [initialInput]);


  const shockwaveAnimation = keyframes`
  0% {
    transform: scale(1);
    opacity: 0.5;
  }
  100% {
    transform: scale(4);
    opacity: 0;
  }
`;
  const handleOnClick = () => {
    if (!isOpened) {
      setIsOpened(true)
    }
  }

  const handleExit = () => {
    if (isOpened) {
      setIsOpened(false)
    }
  }
  return (

    isOpened ?

      <Box
        //ref={scrollRef}
        component="div"
        width="20vw"
        maxWidth="50vw"
        maxHeight="70vh"
        sx={{ position: 'fixed', bottom: 16, right: 16, zIndex: 1000, display: 'flex', flexDirection:"column"}}
      >
        <Box
          sx={{
            padding: "0 8px",
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: "#f8f8f8",
            borderBottom: "1px solid #ccc"
            
          }}
        >
          <Box>Chatbot</Box>
          <IconButton onClick={handleExit}>
            <CloseOutlined />
          </IconButton>
        </Box>
        <MessageDisplay isChatbot={true} />


        <Box
          sx={{
            padding: "8px",
            borderTop: "1px solid #ccc", 
            backgroundColor: "#f8f8f8", 
          }}
        >
          <MessageInput recipent={null} isChatbot={true} petFavourites={JSON.stringify(petFavourites)}  />
        </Box>
      </Box>
      :
      <Box
        component="div"
        sx={{ position: 'fixed', bottom: 16, right: 16, zIndex: 1000, minHeight: "40px", minWidth: "40px", borderRadius: isOpened ? "10px" : "50%", bgcolor: isOpened ? "#89966b" : "#cbd9c4", overflowY: "scroll" }}
        onClick={handleOnClick}
      >
        <IconButton
          sx={{
            padding:"16px"
          }}
        >
          <ChatBubbleOutlined
            sx={{
              color: "white"
            }}
          />
        </IconButton>
      </Box>


  )
}

export default ChatBot