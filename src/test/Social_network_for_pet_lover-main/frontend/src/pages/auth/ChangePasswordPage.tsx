import React from 'react'
import ImageSlider from '../../components/auth/ImageSlider'
import ChangePasswordForm from '../../components/auth/ChangePasswordForm'
import { Grid2 } from '@mui/material'

const ChangePasswordPage = () => {
  return (
    <Grid2 container sx={{height: "100vh"}}>
        <Grid2 size={6}>
            <ImageSlider/>
        </Grid2>

        <Grid2 size={6}>
            <ChangePasswordForm/>
        </Grid2>
    </Grid2>
  )
}

export default ChangePasswordPage