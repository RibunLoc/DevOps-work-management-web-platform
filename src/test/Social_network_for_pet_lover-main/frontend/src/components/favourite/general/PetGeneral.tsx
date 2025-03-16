import React from "react";
import clsx from "clsx";
import style from "./css/PetGeneral.module.css";
import { PetFavourite } from "../../../types";
import { useNavigate } from "react-router-dom";
interface Props {
  pet: PetFavourite;
}
const PetGeneral: React.FC<Props> = ({ pet }) => {
  const navigate = useNavigate();
  return (
    <div className={style.petAvatar} onClick={()=>{navigate(`/profile/${pet.ownerInfo._id}/pets`)}} >
      <img src={pet.petInfo.profilePicture}></img>
      <span className={clsx(style.petInfo)}>
        <p>{pet.petInfo.name}</p>
        <p className={clsx(style.followerCount)}>
          {pet.petInfo.followerCount == 1
            ? pet.petInfo.followerCount + " follower"
            : pet.petInfo.followerCount > 1
            ? pet.petInfo.followerCount + " followers"
            : " "}
        </p>
      </span>
      <span className={clsx(style.ownerInfo)}>
        <div className={style.ownerAvatar}>
        <img src={pet.ownerInfo.avatar}  />
        </div>
        <p style={{whiteSpace:"nowrap",textOverflow:"ellipsis"}}>{pet.ownerInfo.firstname + " " + pet.ownerInfo.lastname}</p>
      </span>
    </div>
  );
};

export default PetGeneral;
