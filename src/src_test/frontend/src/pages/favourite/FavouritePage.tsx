import React from 'react'
import { Grid2, Paper } from '@mui/material'
import SideBarFavourite from '../../components/sideBar/SideBarFavourite/SideBarFavourite'
import { Outlet } from 'react-router-dom'
import PublicLayout from "../../Layout";

const FavouritePage = () => {
  return (
    <Grid2 container sx={{ height: "100vh", overflowY: "auto" }}>
      <Grid2
        size={2.52}
        sx={{ display: "inline-block", justifyContent: "flex-start" }}
      >
        <Paper>
          <SideBarFavourite isOpened={true} />
        </Paper>  
      </Grid2>


      <Grid2
        size={9.45}
        sx={{ display: "inline-block", justifyContent: "center" }}
      >
        <Paper>{<Outlet />}</Paper>
      </Grid2>
    </Grid2>
  )
}

export default FavouritePage
