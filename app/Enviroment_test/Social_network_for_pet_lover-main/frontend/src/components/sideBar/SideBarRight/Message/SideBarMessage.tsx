import React from "react";
import clsx from "clsx";
import {} from "@mui/icons-material";

import SearchBar from "../../../shared/SearchBar/SearchBar";
import style from "../SideBarRight/SideBarMessage.module.css";

const SideBar_Right = () => {
  return (
    <div className={clsx(style.container)}
    style={{position:'fixed',top:0}}>
      {/* <SearchBar placeHolderString="Search for chats" />  */}
      <div className={clsx(style.recent_chats_box)}>
        <h1 className={clsx(style.title)}>Recent Chats</h1>

        <div className={clsx(style.line)}></div>
        <div className={clsx(style.see_all)}>See All</div>
        <div className={clsx(style.media)}>Media</div>
        <ul className={clsx(style.mediaBox)}>
          <li className={clsx(style.mediaItem)}>
            <img src="https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW1hZ2V8ZW58MHx8MHx8fDA%3D" />
          </li>
          <li className={clsx(style.mediaItem)}>
            <img src="https://img-cdn.pixlr.com/image-generator/history/65bb506dcb310754719cf81f/ede935de-1138-4f66-8ed7-44bd16efc709/medium.webp" />
          </li>
          <li className={clsx(style.mediaItem)}>
            <img src="https://gratisography.com/wp-content/uploads/2024/01/gratisography-cyber-kitty-800x525.jpg" />
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SideBar_Right;
