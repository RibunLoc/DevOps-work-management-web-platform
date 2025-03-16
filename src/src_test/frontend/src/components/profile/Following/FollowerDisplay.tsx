import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import clsx from "clsx";
import { handleGetFollowerByUserId} from "../../../sercives/api";
import { User } from "../../../types";
import style from "../css/FollowingDisplay.module.css";
import FollowingUserCard from "./FollowingUserCard";
import SearchBar from "../../shared/SearchBar/SearchBar";
const FollowerDisplay = () => {
  const [valueInput,setValueInput] = useState("")
  const { userId } = useParams();
  const [followingList, setFollowingList] = useState<User[]>();
  useEffect(() => {
    fetchData();
  }, [userId,valueInput]);
  const fetchData = async () => {
    const result_followingUsers = await handleGetFollowerByUserId(userId,valueInput);
    setFollowingList(result_followingUsers);
  };

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const target = event.target;
      const id = target.id;
      const value = target.value;
      setValueInput(value)
  }
  return (
    <Box
      sx={{
        width: "100",
        mx: "auto",
        mt: 4,
        backgroundColor: "#C6D7B1",
        height: "100%",
        borderRadius:"10px",
        alignItems:"center"
      }}
    >
      <div className={clsx(style.header)}>
        <p className={clsx(style.section)}>Follower</p>
        <SearchBar placeHolderString="Search user name" value={valueInput} onChange={onChange}/>
      </div>
      <div className={clsx(style.coverBody)}>
      {followingList?.map((followingUser) => (
        <FollowingUserCard type = {2} key={followingUser._id} user={followingUser} updateStatement={()=>fetchData()} />
      ))}
      </div>
      
    </Box>
  );
};

export default FollowerDisplay;
