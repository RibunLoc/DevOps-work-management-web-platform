import React, { useState } from "react";
import clsx from "clsx";
import { Avatar, Button, Typography } from "@mui/material";
import { PetFavourite } from "../../../types";
import { calculateAge, formatDate } from "../../../helper";
import { useNavigate } from "react-router-dom";

import style from "./css/PetCard.module.css";
interface Props {
  data: PetFavourite | null;
  onDelete: (postId: String | undefined) => void;
}

const PetCard: React.FC<Props> = ({ data, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();
  const [deleteTimeout, setDeleteTimeout] = useState<NodeJS.Timeout | null>(
    null
  );
  const handleDelete = () => {
    setIsDeleting(true);
    const timeout = setTimeout(() => {
      onDelete(data?._id);
      setIsDeleting(false)
    },5000);
    setDeleteTimeout(timeout);
  };
  const handleUndo = () => {
    if (deleteTimeout) {
      clearTimeout(deleteTimeout); // Hủy timer
      setDeleteTimeout(null);
    }
    setIsDeleting(false); // Gỡ trạng thái đang xóa
  };
  const handleGotoProfile = (id:String|undefined)=>{
    navigate(`/profile/${id}/pets`)
  }
  return (
    <div className={clsx(style.container)}>
      {isDeleting ? (
        <div>
          <span>Deleting, undo in 5 seconds...</span>
          <button onClick={handleUndo}>Hoàn tác</button>
        </div>
      ) : (
        <div className={clsx(style.container_inside)}>
          <div className={clsx(style.cardHeader)}>
            <Avatar className={clsx(style.avatar)} src={data?.petInfo.profilePicture}></Avatar>
            <div className={clsx(style.nameSex)}>
              <p className={clsx(style.name)}>{data?.petInfo.name}</p>
              <p className={clsx(style.sex)}>{data?.petInfo.sex}-{calculateAge(data?.petInfo.birthday)}</p>
            </div>
          </div>
          <div className={clsx(style.cardContent)}>
            <div className={style.row}>
              <div className={clsx(style.section)}>Type</div>
              <Typography className={style.text}>{data?.petInfo.type}</Typography>
            </div>
            <div className={style.row}>
              <div className={clsx(style.section)}>Breed</div>
              <Typography className={style.text}>{data?.petInfo.breed}</Typography>
            </div>
            <div className={style.row}>
              <div className={clsx(style.section)}>Birthday</div>
              <Typography className={style.text}>{formatDate(data?.petInfo.birthday)}</Typography>
            </div>
            <div className={style.row}>
              <div className={clsx(style.section)}>Bio</div>
              <Typography className={style.text}>
              {data?.petInfo.bio}
              </Typography>
            </div>
          </div>
          <div className={clsx(style.cardFooter)}>
            <Avatar className={clsx(style.avatar)} src={data?.ownerInfo.avatar}></Avatar>
            <div className={clsx(style.ownerInfo)}>
              <Typography className={style.text}>{data?.ownerInfo.firstname+" "+data?.ownerInfo.lastname}</Typography>
              <Typography className={style.text}>{data?.ownerInfo.location}</Typography>
            </div>
          </div>
          <div className={clsx(style.cardAction)}>
            <Button className={clsx(style.goToButton)} onClick={()=>{handleGotoProfile(data?.ownerInfo._id)}}>Go to profile</Button>
            <Button
              className={clsx(style.removeButton)}
              onClick={handleDelete}
            >Remove</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PetCard;
