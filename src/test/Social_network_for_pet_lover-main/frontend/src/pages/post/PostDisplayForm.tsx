import React, { useContext} from "react";
import PostInformationCard from "../../components/profile/Post/PostInformationCard";
import {
  PostContext,
  PostProvider,
} from "../../components/profile/Post/PostContext";
import style from "./css/PostDisplayForm.module.css";
interface Props 
{
    updatePostsState: () => void;
}
const PostDisplayForm:React.FC<Props> = ({updatePostsState}) => {
  const {post}= useContext(PostContext)!
  return (
    <div className={style.coverContainer}>
      <div className={style.bodyContainer}>
          <PostInformationCard
            key={post?._id}
            updatePostsState={updatePostsState}
          />
      </div>
    </div>
  );
};

export default PostDisplayForm;
