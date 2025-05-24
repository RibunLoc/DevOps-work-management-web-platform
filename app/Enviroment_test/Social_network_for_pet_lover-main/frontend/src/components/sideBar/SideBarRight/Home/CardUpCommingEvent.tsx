import React, { useEffect, useState } from "react";
import clsx from "clsx";

import { Avatar, AvatarGroup, Button, Link } from "@mui/material";
import { lightTheme } from "../../../../themes/theme";

import { Event } from "../../../../types";
import style from "./UpCommingEvent.module.css";
import {formatDate} from '../../../../helper'
const CardUpCommingEvent = () => {
  const [chatsList, setChatsList] = useState<Event[]>();
  useEffect(() => {
    const fetchData = async () => {
      const url = `${process.env.REACT_APP_API_URL}/api/v1/event/all`;

      try {
        const response = await fetch(url, {
          method: "GET",
        });
        if (!response.ok) {
          throw new Error("Error in getting message");
        }
        const data = await response.json();
        if (data.upcomingEvent.length > 0) {
          setChatsList(data.upcomingEvent);
        } else {
          console.log("No chats found");
        }
      } catch (e) {
        console.error("Error fetching data:", e);
      }
    };

    fetchData(); // Call fetchData inside useEffect
  }, []);
  return (
    <>
      { chatsList?.map((chat,index) => {
        return (
          <div key={index} className={style.upcomingEventCard}>
            <div className={style.headerCard}>
              <Avatar src={chat.imageUrl} />
              <div className={style.headerContent}>
                <h5>{chat.eventName}</h5>
                <h4 className={style.location}>{chat.location}</h4>
                <h6>{formatDate(chat.dateTime.toString())}</h6>
              </div>
            </div>
            <div className={style.contentCard}>
              {chat.description}
            </div>

            <Link href={chat.link} underline="none">
              <Button
                variant="contained"
                
                sx={{
                  backgroundColor:lightTheme.colors.primary,
                  color: lightTheme.colors.text,
                  textTransform: "none", // Keeps the text as is (not all caps)
                  fontSize: "16px",      // Slightly larger text for better readability
                  padding: "8px 16px",   // Adds spacing for a comfortable click area
                  borderRadius: "8px",   // Rounded corners for a modern look
                  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", // Adds a subtle shadow
                  "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.2)", // Darker shade for hover effect
                    boxShadow: "0px 6px 10px rgba(0, 0, 0, 0.2)", // Enhanced shadow on hover
                  },
                }}
              >
                Go Visit Event Page
              </Button>
            </Link>
            <div></div>
          </div>

        
        );
      })}
    </>
  );
};

export default CardUpCommingEvent;
