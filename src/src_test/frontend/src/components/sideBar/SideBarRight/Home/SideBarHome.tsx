import React, { useEffect, useState } from "react";
import clsx from "clsx";
import { Avatar, AvatarGroup, Button, List, ListItem, ListItemAvatar, ListItemText, Typography } from "@mui/material";

import RecentChatsList from "./RecentChatsList/RecentChats";
import SearchBar from "../../../shared/SearchBar/SearchBar";
import style from "./SideBarHome.module.css";
import NotFollowContainer from './NotFollowContainer'
import CardUpCommingEvent from "./CardUpCommingEvent";
import { RecentChatInSideBar } from '../../../../types';
import { lightTheme } from "../../../../themes/theme";
import { useNavigate, useNavigation } from "react-router-dom";


interface SearchUser {
  _id: string,
  fullName: string,
  location: string,
  avatar: string
}

const SideBarHome = () => {

  const [chatsList, setChatsList] = useState<RecentChatInSideBar[]>()
  const [filteredUsers, setFilteredUsers] = useState<SearchUser[]>([]); // Store filtered users
  const [userList, setUserList] = useState<SearchUser[]>([])
  const currentEmail = localStorage.getItem("email")
  const [searchTerm, setSearchTerm] = useState(""); // Track search term
  const nav = useNavigate()
  useEffect(() => {
    const fetchData = async () => {
      const url = `${process.env.REACT_APP_API_URL}/api/v1/message/recent?email=${currentEmail}`;

      try {
        const response = await fetch(url, {
          method: "GET",
        });
        if (!response.ok) {
          throw new Error("Error in getting message");
        }
        const data = await response.json();
        if (data.recentMessages.length > 0) {

          setChatsList(data.recentMessages);
        } else {
          console.log("No chats found");
        }
      } catch (e) {
        console.error("Error fetching data:", e);
      }
    };

    const getAllUser = async () => {
      const url = `${process.env.REACT_APP_API_URL}/api/v1/user/getAll`;

      try {
        const response = await fetch(url, {
          method: "GET",
        });
        if (!response.ok) {
          throw new Error("Error in getting user");
        }
        const data = await response.json();
        if (data.length > 0) {

          setUserList(data);
        } else {
          console.log("No users found");
        }
      } catch (e) {
        console.error("Error fetching data:", e);
      }
    }

    fetchData();
    getAllUser();
  }, []);


  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    debugger;
    const query = e.target.value;
    setSearchTerm(query);
    //console.log("userList", userList)
    if (userList && Array.isArray(userList)) {
      // Filter users based on search term
      if (query) {
        const filtered = userList.filter(user =>
          user.fullName.toLowerCase().includes(query.toLowerCase())
        );

        console.log("filter", filtered)
        setFilteredUsers(filtered); // Set filtered users based on the search term
      } else {
        setFilteredUsers([]); // If no query, show all users
      }
    } else {
      console.error("User list is empty or not loaded.");
      setFilteredUsers([]); // You can set an empty array or handle this case as needed
    }
  };
  return (
    <div style={{padding:"8px 15px"}}>
      <SearchBar
        placeHolderString="Search for friend"
        value={searchTerm}
        onChange={handleSearch}
      />
      {filteredUsers && filteredUsers.length > 0 ? (
        // Render the list of users if filteredUsers is not null and has at least one user
        <List sx={{ width: '100%', maxWidth: 360, bgcolor: lightTheme.colors.background }}>
          {
            filteredUsers.map((user) => (
              <ListItem
                key={user._id}

                onClick={() => {
                  nav(`/profile/${user._id}`)
                }
                }
                sx={{
                  height: "100px",
                  backgroundColor: lightTheme.colors.background,
                  borderRadius: "10px",
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.08)', // Change background color on hover
                    cursor: 'pointer', // Change cursor to pointer on hover
                  },

                }}
              >
                <ListItemAvatar>
                  <Avatar src={user.avatar}>
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={user.fullName} secondary={<span
                  style={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    maxWidth: '200px', // Adjust width as needed
                    display: 'block', // Ensures the span behaves as a block element
                  }}
                >
                  {user.location}
                </span>} />
              </ListItem>
            ))
          }

        </List>
      ) : null}
      <div className={clsx(style.recent_chats_box)}  >
        <h1 className={clsx(style.title)}>Recent Chats</h1>
        <RecentChatsList chatsList={chatsList} />
        <NotFollowContainer />
        <div className={clsx(style.line)}></div>
        <div
          className={clsx(style.mightLikeTitle)}
          style={{ justifyContent: "space-between", display: "flex" }}
        >
          <h5>Upcoming Events</h5>
          <h5 className={style.titleClick}>See all</h5>
        </div>
        <CardUpCommingEvent />
      </div>
    </div>
  )
}

export default SideBarHome;
