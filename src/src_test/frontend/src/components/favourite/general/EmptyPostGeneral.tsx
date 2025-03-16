import React from "react";
import style from "./css/PostGeneral.module.css";
const EmptyPostGeneral = () => {
  return (
    <div className={style.postAvatar}>
      <p style={{ fontWeight: "500" }}>You don't save any post</p>
    </div>
  );
};

export default EmptyPostGeneral;
