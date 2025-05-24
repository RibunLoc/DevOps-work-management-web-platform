import React from "react";
import { useSocket } from "../components/message/SocketContext";
import { EventSocket } from "../types";
import { io, Socket } from "socket.io-client";
const socket = io(process.env.REACT_APP_API_URL);

export const register = (body: object) => {
  const url = `${process.env.REACT_APP_API_URL}/api/v1/register`;
};

export const getUserByUserId = async (userId: string | undefined | null) => {
  const url = `${process.env.REACT_APP_API_URL}/api/v1/user/getbyid/${userId}`;
  try {
    const response = await fetch(url, {
      method: "GET",
    });
    if (!response.ok) {
      throw new Error("Error in getting user");
    }
    const data = await response.json();
    return data.user;
  } catch (e) {
    console.error("Error fetching data:", e);
    return undefined;
  }
};
export async function handleFollow(
  follower: string | null,
  followingId: string | undefined
) {
  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/follow/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        followerId: follower,
        followingId: followingId,
      }),
    });
    return response;
  } catch (error) {
    console.error("Error following user:", error);
    alert("Error occurred while trying to follow.");
  }
}
export async function checkFollowed(
  follower: string | null,
  followingId: string | undefined
) {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/v1/follow/isfollowed`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          followerId: follower,
          followingId: followingId,
        }),
      }
    );
    return response;
  } catch (error) {
    console.error("Error fetch follow user:", error);
    alert("Error occurred while trying to fetch follow.");
  }
}
export async function handleLikePost(postId: string | undefined) {
  if (postId == undefined) return;

  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/like/likepost`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: localStorage.getItem("userId"),
        targetId: postId,
        targetType: "post",
      }),
    });
    if (!response.ok) {
      throw new Error("Failed to like post");
    }
    const result = await response.json();

    return result;
  } catch (e) {
    console.error(e);
  }
}

export async function handleGetFavouritedPetByUserId() {
  const userId = localStorage.getItem("userId");
  try {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/v1/petuser/favourited/getbyuserid?userId=${userId}`,
      {
        method: "Get",
      }
    );
    if (!response.ok) {
      throw new Error("Failed to like post");
    }
    const result = await response.json();
    if (result.pets.length > 0)
      //FavouritePet
      return result.pets;
    return null;
  } catch (e) {
    console.error(e);
  }
}

export async function createPetUserRelationship(petId: string | null) {
  if (petId === undefined) return;
  try {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/v1/petuser/create`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: localStorage.getItem("userId"),
          petId: petId,
        }),
      }
    );
    if (!response.ok) {
      throw new Error("Failed to create petuser");
    }
    const result = await response.json();
    return result;
  } catch (e) {
    console.error(e);
  }
}

export async function handleDeletePetUserById(petUserId: String | undefined) {
  if (petUserId === undefined) return;
  try {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/v1/petuser/delete?petUserId=${petUserId}`,
      {
        method: "POST",
      }
    );
    if (!response.ok) {
      throw new Error("Failed to like post");
    }
    const result = await response.json();
    //console.log("return petuser",result)
    return result;
  } catch (e) {
    console.error(e);
  }
}

export async function isChecked(
  userId: string | undefined | null,
  petId: string
) {
  if (userId === undefined || petId === undefined) return;
  try {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/v1/petuser/checksaved?userId=${userId}&petId=${petId}`,
      {
        method: "GET",
      }
    );
    if (!response.ok) {
      throw new Error("Failed to like post");
    }
    const result = await response.json();
    //console.log("return petuser",result)
    return result;
  } catch (e) {
    console.error(e);
  }
}

//FavvouritePost
export async function createPostUserRelationship(
  postId: string | null | undefined
) {
  if (postId === undefined) return;
  try {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/v1/postuser/toggleSave`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: localStorage.getItem("userId"),
          postId: postId,
        }),
      }
    );
    if (!response.ok) {
      throw new Error("Failed to create postuser");
    }
    const result = await response.json();
    return result;
  } catch (e) {
    console.error(e);
  }
}
export async function handleGetFavouritedPostByUserId() {
  const userId = localStorage.getItem("userId");
  console.log("sdsda");
  try {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/v1/postuser/favourited/getbyuserid?userId=${userId}`,
      {
        method: "Get",
      }
    );
    if (!response.ok) {
      throw new Error("Failed to like post");
    }
    const result = await response.json();
    if (result.posts.length > 0)
      //FavouritePet
      return result.posts;
    return null;
  } catch (e) {
    console.error(e);
  }
}

export async function handleDeletePostUserById(postUserId: String | undefined) {
  if (postUserId === undefined) return;
  try {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/v1/postuser/delete?postUserId=${postUserId}`,
      {
        method: "POST",
      }
    );
    if (!response.ok) {
      throw new Error("Failed to delete favourtie post");
    }
    const result = await response.json();
    //console.log("return petuser",result)
    return result;
  } catch (e) {
    console.error(e);
  }
}

export async function handleGetPostByPostId(
  postId: String | null | undefined,
  userId: string | null
) {
  if (postId === undefined) return;
  try {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/v1/post/getpostbypostid?postId=${postId}&userAccessId=${userId}`,
      {
        method: "POST",
      }
    );
    if (!response.ok) {
      throw new Error("Failed to delete favourtie post");
    }
    const result = await response.json();
    //console.log("return petuser",result)
    return result.post;
  } catch (e) {
    console.error(e);
  }
}

export async function handleLikeAPI(postId: string | undefined, type: string) {

  const handleSocketEmit = async (eventSocketList: EventSocket[]) => {

    const url = `${process.env.REACT_APP_API_URL}/api/v1/notification/create`

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

      console.log("posting event successfully")
    } catch (e) {
      console.log("error", e)
    }

  }
  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/like/likepost`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: localStorage.getItem("userId"),
        targetId: postId,
        targetType: type,
      }),
    });
    if (!response.ok) {
      throw new Error("Failed to like post");
    }

    debugger;
    const res = await handleGetPostByPostId(
      postId,
      localStorage.getItem("userId")
    );
    const postOwnerEmail = res.userInfo.email;
    console.log("res", res);
    const like = {
      userEmail: localStorage.getItem("email"),
      postOwnerEmail: postOwnerEmail,
      postId: postId,
      type: "like",
    };


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
          eventType: "like",
          postId: postId,
          userName: userName,
          userAvatar: userAvatar,
          createdAt: new Date,
          postOwnerEmail: postOwnerEmail
        }

        handleSocketEmit([event])
      } catch(e) {
        console.log(e)
      }

    socket.emit("newLike", like);
      const result = await response.json();
      //setCurrentPost(result.updatedPost);
      //setPost(result.updatedPost);
      //setIsLiked(result.updatedPost.isLiked)
      return result;
    
  }catch (e) {
    console.error(e);
  }
}

export async function handleDeleteCommentAPI(commentId: string | undefined) {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/v1/comment/delete?commentId=${commentId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to comment post");
      }
      const result = await response.json();
      return result;
    } catch (e) {
      console.error(e);
    }
  }

  export async function handleUpdateNameAPI(
    lastName: String | undefined,
    firstName: String | undefined,
    userId: String | undefined
  ) {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/v1/user/updatename`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: userId,
            lastName: lastName,
            firstName: firstName,
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to comment post");
      }
      const result = await response.json();
      return result;
    } catch (e) {
      console.error(e);
    }
  }

  export async function handleUpdateDescriptionAPI(
    description: String | undefined,
    userId: String | undefined
  ) {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/v1/user/updatedescription`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: userId,
            description: description,
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to comment post");
      }
      const result = await response.json();
      return result;
    } catch (e) {
      console.error(e);
    }
  }

  export async function handleUpdateAvatarAPI(
    imageUrl: String | undefined,
    userId: String | undefined
  ) {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/v1/user/updateAvatar`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: userId,
            imageUrl: imageUrl,
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to comment post");
      }
      const result = await response.json();
      return result;
    } catch (e) {
      console.error(e);
    }
  }

  export async function handleUpdatePostAPI(
    title: String | undefined,
    content: String | undefined,
    images: String[],
    postId: String | undefined
  ) {
    //console.log("images",images)
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/v1/post/updatepost`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            postId: postId,
            title: title,
            content: content,
            images: images,
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to comment post");
      }
      const result = await response.json();
      return result;
    } catch (e) {
      console.error(e);
    }
  }

  export async function handleUpdateCommentAPI(
    content: String | undefined,
    commentId: String | undefined
  ) {
    //console.log("images",images)
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/v1/comment/update`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contentComment: content,
            commentId: commentId,
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to updateComment");
      }
      const result = await response.json();
      return result;
    } catch (e) {
      console.error(e);
    }
  }

  export async function handleGetFollowingByUserId(userId: string | null | undefined, searchString: string | null = "") {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/v1/follow/getfollowingbyuserid?followerId=${userId}&searchString=${searchString}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          }
        }
      );
      if (!response.ok) {
        throw new Error("Failed to getFollowingUsers");
      }
      const result = await response.json();
      return result.followingUsers;
    } catch (e) {
      console.error(e);
    }
  }

  export async function handleGetFollowerByUserId(userId: string | null | undefined, searchString: string | null = "") {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/v1/follow/getfollowerbyuserid?followingId=${userId}&searchString=${searchString}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          }
        }
      );
      if (!response.ok) {
        throw new Error("Failed to getFollowingUsers");
      }
      const result = await response.json();
      return result.followerUsers;
    } catch (e) {
      console.error(e);
    }
  }

  export async function handleDeleteFollow(followerId: string | undefined, followingId: string | undefined) {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/v1/follow/deletefollow?followerId=${followerId}&followingId=${followingId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          }
        }
      );
      if (!response.ok) {
        throw new Error("Failed to getFollowingUsers");
      }
      const result = await response.json();
      return result.unfollowInfo;
    } catch (e) {
      console.error(e);
    }
  }

export async function handleSearchUserByUsername(searchString:string|null)
{
  try {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/v1/user/searchuserbyusername?searchString=${searchString}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        }
      }
    );
    if (!response.ok) {
      throw new Error("Failed to getFollowingUsers");
    }
    const result = await response.json();
    return result.usersResult;
  } catch (e) {
    console.error(e);
  }
}


export async function handleWriteHistoryAPI(userId:string|null,targetId:string,type:string)
{
  console.log("handleWriteHistory",userId,targetId,type)
  try {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/v1/history/create`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          targetId: targetId,
          type:type
        }),
      }
    );
    if (!response.ok) {
      throw new Error("Failed to getFollowingUsers");
    }
    const result = await response.json();
    return result.searchHistory;
  } catch (e) {
    console.error(e);
  }
}

export async function handleDeleteHistoryByIdAPI(userId:string|null,targetId:string,type:string)
{
  try {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/v1/history/delete`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          targetId: targetId,
          type:type
        }),
      }
    );
    if (!response.ok) {
      throw new Error("Failed to getFollowingUsers");
    }
    const result = await response.json();
    return result.deleteHistory;
  } catch (e) {
    console.error(e);
  }
}

export async function handleGetSearchListByIdAPI(userId:string|null)
{
  try {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/v1/history/gethistorysearch`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
        }),
      }
    );
    if (!response.ok) {
      throw new Error("Failed to getFollowingUsers");
    }
    const result = await response.json();
    return result.searchHistoryUsers;
  } catch (e) {
    console.error(e);
  }
}