import React, { ReactEventHandler, useRef, useEffect } from 'react'
import ColorThief, { RGBColor } from 'colorthief'
import MessageComponent from './MessageComponent'
import { Box } from '@mui/material'
import { MessageComponentType } from '../../types'
import { useSelectedUser } from './SelectedUserContext'
import { useSocket } from './SocketContext'
import { useBackground } from './BackgroundContext'
import { useState } from 'react'
import { lightTheme } from '../../themes/theme'
import { useParams } from 'react-router-dom'


interface MessageComponentArray {
  //messages: MessageComponentType[] | []
  isChatbot: boolean
}

const MessageDisplay: React.FC<MessageComponentArray> = ({ isChatbot }) => {

  const scrollRef = useRef<HTMLDivElement>(null);
  const recipentEmail = localStorage.getItem("email")
  //const { selectedUserEmail } = useSelectedUser()
  const [recentMessages, setRecentMessages] = useState<MessageComponentType[]>([])
  const { messages, setMessages, chatbotMessages, setChatbotMessages } = useSocket();
  const { backgroundImageOver, setPalette } = useBackground()
  //const [selectedUserEmail, setSelectedUserEmail] = useState<string|undefined>("")
  const selectedUserEmail = useParams().userEmail
  const imgRef = useRef<HTMLImageElement>(null);
  const [messageColor, setMessageColor] = useState<string>("#f0f0f0");


  useEffect(() => {
    const colorThief = new ColorThief();
    const img = new Image()
    img.src = backgroundImageOver
    img.crossOrigin = "anonymous"; // Important for cross-origin images

    img.onload = () => {
      const palette = colorThief.getPalette(img);
      setPalette(palette)
    };

  }, [backgroundImageOver])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(()=> {
    debugger;
    setMessages([])
  },[selectedUserEmail])
  useEffect(() => {

    const getMessagesHistory = async () => {
      if (!selectedUserEmail) {
        return
      }
      debugger;
      const url = `${process.env.REACT_APP_API_URL}/api/v1/message/history?senderEmail=${selectedUserEmail}&recipentEmail=${recipentEmail}`

      try {
        const response = await fetch(url)

        if (!response.ok) {
          console.log("get history fail")
          throw new Error("get history fail")


        }

        const data = await response.json()
        setRecentMessages(data.chatHistory.reverse())

        console.log("messages",messages)
      } catch (e) {
        console.log("Some errors happen", e)
      }


    }

    getMessagesHistory()
    return (() => {

    })

  }, [selectedUserEmail])



  return (
    <Box
      ref={scrollRef}
      component="div"
      height="100%"
      bgcolor={isChatbot ? "#89966b" : lightTheme.colors.secondary}
      //marginTop="2px"
      padding="20px"
      sx={{
        overflowY: "scroll",
        backgroundImage: `url(${backgroundImageOver})`,
        backgroundSize: "cover"
      }}
    >
      {
        !isChatbot ?
          [...recentMessages, ...messages].map((message) => {
            debugger;
            console.log("Message Image URL:", message.image)
            return message.image ?
              
              <Box
                component="div"
                sx={{
                  display: "flex",
                  justifyContent: message.isSender ? "flex-start" : "flex-end",
                  margin: "10px",
                }}
              >
                <Box
                  component="img"
                  src={message.image}
                  alt="Uploaded"
                  sx={{
                    maxWidth: "200px",       // Adjust maximum width
                    maxHeight: "200px",      // Adjust maximum height
                    borderRadius: "8px",     // Rounded corners
                    objectFit: "cover",      // Ensures image fills the box neatly
                    boxShadow: 2,            // Adds a slight shadow for aesthetics
                  }}
                />
              </Box>


              :
              message.content!==""?
              <MessageComponent
                key={message.timeStamp}
                content={message.content}
                timeStamp={new Date(message.timeStamp).toLocaleString().slice(0, 9)}
                isSender={message.isSender}
                isChatbot={false}
              />
              :
              null

})
          :
          [...chatbotMessages].map((message) => (

            <MessageComponent
              key={message.timeStamp}
              content={message.content}
              timeStamp={new Date(message.timeStamp).toLocaleString().slice(0, 9)}
              isSender={message.isSender}
              isChatbot={true}
            />

          ))
      }

    </Box>
  )
}

export default MessageDisplay