import { Avatar, Button, Card, Stack, TextField } from '@mui/material'
import React from 'react'
import PostToolDisplay from './PostToolDisplay'
import { AddPhotoAlternate, AddReaction } from '@mui/icons-material'
import { Post, User } from '../../../types'
import style from '../css/PostRequestBar.module.css'

interface Props
{
    user:User|undefined
    toggleDisplayToolBox: () => void
    updatePostsState: (returnPost:Post|undefined)=>void
    isDisplayTool:boolean
}

const PostRequestBar:React.FC<Props>= ({user,toggleDisplayToolBox,isDisplayTool,updatePostsState}) => {
  return (
    <Card
        sx={{
          mb: 3,
          padding: 2,
          borderRadius: "20px !important",
          backgroundColor: "#F7F7F7",
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center" display={"flex"}>
          <Avatar alt="User Avatar" src={user?.avatar}/>
          <TextField
            placeholder="Share something"
            sx={{
              flexGrow: 1,
              border:"0px",
              borderRadius: 2,
              }}
            multiline
            maxRows={6}
            fullWidth
            onClick={toggleDisplayToolBox}
          />
        </Stack>
        <Stack direction="row" justifyContent="center" sx={{ mt: 2 }}>
          <Button
            className={style.btn}
            sx={{ margin: "0px 20px" }}
            startIcon={<AddPhotoAlternate />}
            onClick={toggleDisplayToolBox}
          >
            Photos
          </Button>
          <Button
            className={style.btn}
            sx={{ margin: "0px 20px" }}
            startIcon={<AddReaction />}
            onClick={toggleDisplayToolBox}
          >
            Emotion
          </Button>
        </Stack>
        {isDisplayTool && <PostToolDisplay isOpen={isDisplayTool} onClose={toggleDisplayToolBox} onCreatedPost={updatePostsState}/>}
      </Card>
  )
}

export default PostRequestBar
