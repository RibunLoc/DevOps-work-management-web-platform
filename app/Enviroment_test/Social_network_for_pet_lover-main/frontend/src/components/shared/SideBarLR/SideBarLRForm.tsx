import React from "react";
import { Grid2, Paper } from "@mui/material";
import SideBar from "../../sideBar/SideBar";
import SideBarHome from "../../sideBar/SideBarRight/Home/SideBarHome";

interface ExploreCenterPage {
  children?: React.ReactNode; // Khai báo kiểu cho children
}

const SideBarLRForm: React.FC<ExploreCenterPage> = ({ children }) => {
  return (
    <Grid2 container sx={{ height: "100vh", overflowY: "auto" }}>
      <Grid2
        size={2.5}
        sx={{ display: "inline-block", justifyContent: "flex-start" }}
      >
        <Paper>
          <SideBar isOpened={true} />
        </Paper>
      </Grid2>


      <Grid2
        size={7.5}
        sx={{ display: "inline-block", justifyContent: "center" }}
      >
        <Paper>{children}</Paper>
      </Grid2>

      
      <Grid2
        size={2}
        sx={{ display: "inline-block", justifyContent: "flex-end" }}
      >
        <Paper style={{width:"100%"}}>
          <SideBarHome />
        </Paper>
      </Grid2>
    </Grid2>
  );
};

export default SideBarLRForm;
