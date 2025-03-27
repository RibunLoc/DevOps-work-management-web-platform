import React, { useEffect, useState } from "react";
import {
  handleDeleteHistoryByIdAPI,
  handleGetSearchListByIdAPI,
  handleSearchUserByUsername,
  handleWriteHistoryAPI,
} from "../../sercives/api";
import SearchIcon from "@mui/icons-material/Search";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { User } from "../../types";
import clsx from "clsx";
import style from "./css/SearchHeadr.module.css";
import { Avatar, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
const SearchHeader = () => {
  // Searchstring
  const [searchString, setSearchString] = useState("");
  const [userResultList, setUserResultList] = useState<User[]>();
  const [searchUserHistory, setSearchUserHistory] = useState<User[]>();
  const [isModalDisplay, setIsModalDisplay] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    fetchSearchData();
  }, [searchString]);

  const fetchSearchData = async () => {
    const userResultList = await handleSearchUserByUsername(searchString);
    //console.log("user list", userResultList);
    setUserResultList(userResultList);
  };
  useEffect(() => {
    if (searchString === "") {
      fetchHistorySearching();
    }
  }, [searchString,isModalDisplay]);
  const fetchHistorySearching = async () => {
    const result = await handleGetSearchListByIdAPI(
      localStorage.getItem("userId")
    );
    setSearchUserHistory(result);
  };

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target;
    const id = target.id;
    const value = target.value;
    setSearchString(value);
  };

  const handleWriteSearchHistory = async (targetId: string) => {
    const response = await handleWriteHistoryAPI(
      localStorage.getItem("userId"),
      targetId,
      "search"
    );
  };
  const handleDeleteSearchHistory = async (targetId: string) => {
    const result = await handleDeleteHistoryByIdAPI(
      localStorage.getItem("userId"),
      targetId,
      "search"
    );
    if (result) {
      setSearchUserHistory((prev) =>
        prev?.filter((history) => history._id !== result.targetId)
      );
    }
  };
  const handleClickUserCard = (user:User) =>
  {
    setSearchString("")
    handleWriteSearchHistory(user._id);
    setIsModalDisplay(false);
    navigate(`/profile/${user._id}`);
  }
  return (
    <>
      <div className={clsx(style.searchMain)}>
        <div style={{ display: "flex" }}>
          <IconButton
            className={clsx(
              style.icon,
              isModalDisplay ? style.visible : style.hidden
            )}
            onClick={() => {
              setIsModalDisplay(!isModalDisplay);
            }}
          >
            <KeyboardBackspaceIcon />
          </IconButton>
          <div
            className={style.container}
            onClick={() => {
              setIsModalDisplay(true);
            }}
          >
            <div
              className={clsx(
                style.searchicon,
                style.icon,
                !isModalDisplay ? style.visible : style.hidden
              )}
            >
              <SearchIcon />
            </div>
            <input
              type="text"
              placeholder="Search user name"
              value={searchString} // Bind value to the input field
              onChange={onChange} // Handle input change
              className={clsx(style.inputText)}
            />
          </div>
        </div>
        {isModalDisplay &&
          (searchString ? (
            userResultList && userResultList?.length > 0 ? (
              <div className={clsx(style.modal)}>
                {userResultList?.map((user) => user._id!==localStorage.getItem("userId") && (
                  <div
                    className={clsx(style.userCard)}
                    onClick={() => {
                      handleClickUserCard(user)
                    }}
                    key={user._id}
                  >
                    <div className={clsx(style.avatar)}>
                      <img src={user.avatar}></img>
                    </div>
                    <div className={clsx(style.name)}>
                      <p>{user.firstname}</p>
                      <p>{user.lastname}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={clsx(style.modal)}>
                <div className={clsx(style.userCard)}>
                  <p>No search result</p>
                </div>
              </div>
            )
          ) : (
            <div className={clsx(style.modal)}>
              <p style={{fontSize:"15px",paddingLeft:"10px",paddingTop:"10px",fontWeight:"600"}}>History</p>
              {searchUserHistory&&searchUserHistory?.length>0 ? (
                searchUserHistory?.map((user) => (
                  <div className={clsx(style.userCardWrapper)}>
                    <div
                      className={clsx(style.userCard)}
                      onClick={() => {
                        navigate(`/profile/${user._id}`);
                      }}
                      key={user._id}
                    >
                      <div className={clsx(style.avatar)}>
                        <img src={user.avatar}></img>
                      </div>
                      <div className={clsx(style.name)}>
                        <p>{user.firstname}</p>
                        <p>{user.lastname}</p>
                      </div>
                    </div>
                    <IconButton
                      onClick={() => handleDeleteSearchHistory(user._id)}
                      className={style.deleteButton}
                    >
                      X
                    </IconButton>
                  </div>
                ))
              ) : (
                <div className={clsx(style.userCard)}><p>
                  Not things to show
                  </p>
                  </div>
              )}
            </div>
          ))}
      </div>
    </>
  );
};

export default SearchHeader;
