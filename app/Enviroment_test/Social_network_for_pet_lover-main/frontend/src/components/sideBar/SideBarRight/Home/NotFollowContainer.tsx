import clsx from "clsx";
import { useEffect, useState } from "react";

import style from "./cssNotFollowContainer.module.css";
import { User } from "../../../../types";
import CardMightLikeBox from "./CardMightLikeBox";
const NotFollowContainer = () => {
  const [notFollowList, setNotFollowList] = useState<User[]>();
  useEffect(() => {
  const currentUserId = localStorage.getItem("userId");
    const fetchData = async () => {
      const url = `${process.env.REACT_APP_API_URL}/api/v1/follow/recommentfollow/${currentUserId}`;

      try {
        const response = await fetch(url, {
          method: "GET",
        });
        if (!response.ok) {
          throw new Error("Error in getting message");
        }
        const data = await response.json();
        if (data.notFollowed.length > 0) {
          setNotFollowList(data.notFollowed);
        }
      } catch (e) {
        console.error("Error fetching data:", e);
      }
    };

    fetchData(); // Call fetchData inside useEffect
  }, []);
  return (
    <>
      <div className={clsx(style.line)}></div>
      <div
        className={clsx(style.mightLikeTitle)}
        style={{ justifyContent: "space-between", display: "flex" }}
      >
        <h5>You might like</h5>
        <h5 className={style.titleClick}>See all</h5>
      </div>
      {notFollowList?.map((user) => {
        return <CardMightLikeBox key={user._id} notFollowUser={user} />;
      })}
    </>
  );
};

export default NotFollowContainer;
