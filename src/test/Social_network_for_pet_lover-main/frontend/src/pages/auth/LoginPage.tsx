import React from 'react'
import ImageSlider from '../../components/auth/ImageSlider'
import LoginForm from '../../components/auth/LoginForm'
import { Grid2 } from '@mui/material'

const LoginPage = () => {
  return (
    <Grid2 container sx={{height: "100vh"}}>
        <Grid2 size={6}>
            <ImageSlider/>
        </Grid2>

        <Grid2 size={6}>
            <LoginForm/>
        </Grid2>
    </Grid2>
  )
}

export default LoginPage