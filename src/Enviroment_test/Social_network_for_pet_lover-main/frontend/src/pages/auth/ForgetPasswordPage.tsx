import React from 'react'
import ImageSlider from '../../components/auth/ImageSlider'
import ForgetPasswordForm from '../../components/auth/ForgetPasswordForm'
import { Grid2 } from '@mui/material'

const ForgetPasswordPage = () => {
  return (
    <Grid2 container sx={{height: "100vh"}}>
        <Grid2 size={6}>
            <ImageSlider/>
        </Grid2>

        <Grid2 size={6}>
            <ForgetPasswordForm/>
        </Grid2>
    </Grid2>
  )
}

export default ForgetPasswordPage