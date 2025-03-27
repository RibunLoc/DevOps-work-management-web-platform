import React, { createContext, ReactNode, useEffect, useState } from "react";
import { Post, IComment, User } from "../../../types";

interface PostContextType {
  post: Post | null|undefined; // Giá trị post hiện tại
  setPost: (post: Post) => void; // Hàm cập nhật post
  //setComment: (comment:IComment) => void; // Hàm cập nhật post
  //userId: String | null;
  //comment?: IComment | null
}

export const PostContext = createContext<PostContextType | undefined>(
  undefined
);

export const PostProvider: React.FC<{
  children: ReactNode;
  post: Post|null|undefined;
  comment?: IComment;
}> = ({ children, post, comment }) => {
  const [currentPost, setCurrentPost] = useState<Post|null|undefined>(post);
  useEffect(()=>{setCurrentPost(post)},[post])
  const [currentComment, setCurrentComment] = useState<IComment | undefined>(
    comment
  );
  return (
    <PostContext.Provider
      value={{
        post: currentPost,
        setPost: setCurrentPost,
      }}
    >
      {children}
    </PostContext.Provider>
  );
};
