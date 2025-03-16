import { Button } from "@mui/material";
import React from "react";
interface Props 
{
    isFollowing: boolean,
    handleFollow: () => void
}
const ButtonFollow:React.FC<Props> = ({isFollowing,handleFollow}) => {
  return (
    <div>
      <Button
        variant="contained"
        color="success"
        style={{ height: "30px" }}
        onClick={handleFollow}
      >
        {isFollowing ? "Cancel follow" : "Follow"}
      </Button>
    </div>
  );
};

export default ButtonFollow;
