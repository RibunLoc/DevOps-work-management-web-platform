import { Avatar, Button, Icon } from "@mui/material";
import style from "./css/ProfileContainer.module.css";
import React, { useEffect, useState } from "react";
import { User } from "../../types";
import EditProfileTool from "./User/EditProfileTool";
interface Properties {
  userData: User | undefined;
}
const ProfileContainer: React.FC<Properties> = (props) => {
  const [isOpenModal,setIsOpenModal] = useState(false);
  const handleCloseEditModal = () => {
    setIsOpenModal(false)
  }
  const handleOpenEditModal = () => setIsOpenModal(true)
  const handleGetUpdatedUserInformation = (newUser: User | undefined)=>{
    
  }
  return (
    <div className={style.container}>
      <div className={style.avatarContainer}>
        <Avatar
          sx={{ height: "80px", width: "80px" }}
          src={props.userData?.avatar}
        />
      </div>
      <div className={style.containerRight}>
        <div className={style.containerRight_Top}>
          <h1>{props.userData?.firstname + " " + props.userData?.lastname}</h1>
          {props.userData?._id === localStorage.getItem("userId") ? (
            <Button
              sx={{
                background: "#DFDFDF",
                height: "30px",
                alignSelf: "flex-end",
                color: "#000",
                borderRadius: "8px",
                fontSize: "12px",
                fontWeight: "bold",
                "&:hover": {
                  background: "#89966B",
                  color: "#fff",
                },
              }}
              onClick={handleOpenEditModal}
            >
              Edit profile
            </Button>
          ) : (
            ""
          )}
        </div>
        <div className={style.containerRight_Bottom}>
          <div className={style.containerinfo}>
            <div className={style.sectionInfo}>Description</div>
            <div className={style.sectionSenDetails}>
              {props.userData?.description}
            </div>
          </div>
          <div className={style.containerinfo}>
            <div className={style.sectionInfo}>Living</div>
            <div className={style.sectionSenDetails}>
              {props.userData?.location}
            </div>
          </div>
          <div className={style.containerinfo}>
            <div className={style.sectionInfo}>My pets</div>
            <div className={style.sectionBossAMount}>
              <div className={style.bossIcon}>
                <img src="" alt="" />
                <h5>{props.userData?.petCount}</h5>
              </div>
            </div>
          </div>
        </div>
      </div>
      <EditProfileTool oldUserInformation={props.userData} onUpdate={handleGetUpdatedUserInformation} isOpen={isOpenModal} onClose={handleCloseEditModal}/>
    </div>
  );
};

export default ProfileContainer;
