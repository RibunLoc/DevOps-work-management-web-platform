import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import style from "./css/CommentBar.module.css";
import {
  Avatar,
  Button,
  IconButton,
  TextareaAutosize,
  TextField,
} from "@mui/material";
import { PostComment, IComment, Post, UserInfo, User, EventSocket } from "../../types";
import { Share } from "@mui/icons-material";
import SendIcon from "@mui/icons-material/Send";
import { getUserByUserId } from "../../sercives/api";
import { handleGetPostByPostId } from "../../sercives/api";
import { io, Socket } from 'socket.io-client';
import clsx from 'clsx'
import createBatchProcessor from "../../sercives/debounce";
const socket = io(process.env.REACT_APP_API_URL);
interface Props {
  postId: string | undefined | null
  parentId?: string | undefined | null
  onAddComment?: (newComment: IComment | undefined) => void
  content?: string | null
}

const CommentBar = forwardRef<HTMLInputElement, Props>((props, ref) => {


  const handleSocketEmit = async () => {

    const url = `${process.env.REACT_APP_API_URL}/api/v1/notification/create`
    if(eventSocketList.length >=3) {
      try {
        debugger;
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(eventSocketList)
        })
  
        if (!response.ok) {
          console.log("error in posting event")
        }
        setEventSocketList([])
        console.log("posting event successfully")
      } catch (e) {
        console.log("error", e)
      }
    }
    
  }
  const batchProcessor = createBatchProcessor(5, 3000, handleSocketEmit)


  const [fields, setFields] = useState<PostComment>({
    content: "",
    postId: props.postId ? props.postId : "",
    userId: "",
    parentId: props.parentId ? props.parentId : "",
  });
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<User>();
  const [postOwnerEmail, setPostOwnerEmail] = useState<string>("")
  const [eventSocketList, setEventSocketList] = useState<EventSocket[]>([])
  useEffect(() => {
    fetchUserData()
  }, [])
  //
  const fetchUserData = async () => {
    const userId = localStorage.getItem("userId")
    setCurrentUser(await getUserByUserId(userId))
  };
  const handlePostComment = async () => {
    if (fields.content === "") {
      return;
    }

    try {
      const url = `${process.env.REACT_APP_API_URL}/api/v1/comment/create`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: fields.content,
          postId: fields.postId,
          userId: localStorage.getItem("userId"),
          parentId: fields.parentId,
        }),
      });


      const res = await handleGetPostByPostId(props.postId, localStorage.getItem("userId"))
      const postOwnerEmail = res.userInfo.email

      console.log("res", res)
      const comment = {
        "userEmail": localStorage.getItem("email"),
        "postOwnerEmail": postOwnerEmail,
        "postId": props.postId,
        "type": "comment",
      }


      socket.emit("newLike", comment)
      setPostOwnerEmail(postOwnerEmail)
      //const result = await res.json();

      if (response.ok) {
        const data = await response.json()
        //console.log("avcdf",data.newComment)
        props.onAddComment?.(data.newComment)
        //console.log("Comment posted successfully");
        setFields((prev) => ({ ...prev, content: "" }));
      }
    } catch (e) {
      console.log("Error: ", e);
    }

    const infoUrl = `${process.env.REACT_APP_API_URL}/api/v1/user/info?email=${localStorage.getItem("email")}`;
    try {
      const response = await fetch(infoUrl, {
        method: "GET",
      });
      if (!response.ok) {
        throw new Error("Error in getting user");
      }

      const data = await response.json();

      const userAvatar = data.userInfo.avatar
      const userName = `${data.userInfo.firstname} ${data.userInfo.lastname}`
      const event: EventSocket = {
        eventType: "comment",
        postId: props.postId,
        userName: userName,
        userAvatar: userAvatar,
        createdAt: new Date,
        postOwnerEmail: postOwnerEmail
      }

      console.log("event", event)

      setEventSocketList((prev)=> [...prev, event])
      handleSocketEmit()


    } catch (e) {
      console.log(e)
    }
  };
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target;
    const id = target.id;
    const value = target.value;
    setFields((fields) => ({
      ...fields,
      ...{
        [id]: value,
      },
    }));
  };
  return (
    <div className={clsx(style.container)}>
      <Avatar src={currentUser?.avatar} />
      <div className={clsx(style.inputContent)}>
        <TextField
          id="content"
          inputRef={ref}
          placeholder={
            "Đang bình luận dưới tên " +
            currentUser?.firstname +
            " " +
            currentUser?.lastname
          }
          sx={{
            flexGrow: 1,
            border: "0px",
            borderRadius: 2,
          }}
          value={fields.content}
          multiline
          maxRows={6}
          fullWidth
          onChange={onChange}
        />
      </div>
      <IconButton onClick={handlePostComment}>
        <SendIcon />
      </IconButton>
    </div>
  );
})

export default CommentBar;
