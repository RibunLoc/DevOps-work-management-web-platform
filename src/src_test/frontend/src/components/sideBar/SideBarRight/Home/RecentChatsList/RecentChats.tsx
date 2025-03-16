import { Avatar } from "@mui/material";
import { Message } from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import { RecentChatInSideBar } from "../../../../../types";
import Chat from "./Chat";

const RecentChats: React.FC<{
  chatsList: RecentChatInSideBar[] | undefined;
}> = ({ chatsList }) => {
  return (
    <>
      {chatsList?.map((chatFromList, index) => {
        if (index == 3) return;
        return (
          <>
            <Chat key={chatFromList._id} chat={chatFromList}></Chat>
          </>
        );  
      })}
    </>
  );
};

export default RecentChats;
