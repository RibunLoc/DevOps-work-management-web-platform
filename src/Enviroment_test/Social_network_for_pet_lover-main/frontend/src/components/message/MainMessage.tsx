import React from 'react'
import { Box, Avatar, Typography, Link, TextField, InputAdornment, Stack, List, ListItem, ListItemText, ListItemAvatar, ImageList, ImageListItem, Divider } from '@mui/material'
import { SearchOutlined, MessageOutlined } from '@mui/icons-material'
import useRecentChats from '../../hooks/chat/useRecentChats'
import { useEffect, useState, useRef } from 'react'
import MessageHeader from './MessageHeader'
import MessageDisplay from './MessageDisplay'
import MessageInput from './MessageInput'
import { MessageComponentType } from '../../types'
import { Recipent } from '../../types';
import { useSelectedUser } from './SelectedUserContext'
import { useSocket } from './SocketContext'
import { useParams } from 'react-router-dom'


interface MessageComponentArray {
    messages: MessageComponentType[]
}

interface MessageInputProps {
    recipent: Recipent
    onSendMessage: (content: string) => void
}


const selectedUser = {
    senderId: "123",
    recipentId: "456",
    content: null
}

const messages = [

]

const MainMessage = () => {
    const selectedUserEmail = useParams().userEmail
    //const [selectedUserEmail, setSelectedUserEmail] = useState<string>("")

    //const [messages, setMessages] = useState<MessageComponentType[]>([])
    //const {messages,setMessages} = useSocket()
    const [isSender, setIsSender] = useState<boolean | undefined>(undefined)
    const currentEmail = localStorage.getItem("email")
    
    
    //console.log("selectedUserEmails", selectedUserEmails)
    //const { selectedUserEmail, setSelectedUserEmail } = useSelectedUser()
    const selectedUser: Recipent = {
        senderEmail: currentEmail || undefined,
        recipentEmail: selectedUserEmail,
        content: null
    }


    return (
        <>
            <MessageHeader />
            <MessageDisplay isChatbot={false} />
            <MessageInput recipent={selectedUser} isChatbot={false} petFavourites={null}/>
        </>
    )

}

export default MainMessage
