import React from 'react'
import clsx from 'clsx'
import { Avatar, Link} from '@mui/material'
import { Message } from '@mui/icons-material';
import { RecentChatInSideBar } from '../../../../../types';  

import style from './Chat.module.css'

const Chat: React.FC<{chat: RecentChatInSideBar}> = ({chat}) => {
  return (
    <Link href="/message" underline="none">
    <div className={clsx(style.container)}>
      <Avatar src={chat.userInfo.avatar} className={clsx(style.avt)}
      ></Avatar>
      <div className={clsx(style.infor)}>
        <h1 className={clsx(style.name)}>{chat.userInfo.firstname+" "+chat.userInfo.lastname}</h1>
        <h1 className={clsx(style.location)}>{chat.userInfo.location}</h1>
        <h1 className={clsx(style.lastMessage)}>{chat.latestMessage}</h1>
      </div>
      <Message className={style.icon}/>
    </div>
    </Link>
  )
}

export default Chat
