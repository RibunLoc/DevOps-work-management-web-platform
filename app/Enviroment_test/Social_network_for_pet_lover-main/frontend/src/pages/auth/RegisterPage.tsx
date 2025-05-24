import React from 'react'
import ImageSlider from '../../components/auth/ImageSlider'
import RegisterForm from '../../components/auth/RegisterForm'
import { Grid2 } from '@mui/material'

const RegisterPage = () => {
  return (
    <Grid2 container sx={{height: "100vh",
        overflowY: "auto"}}>
        <Grid2 size={6}>
            <ImageSlider/>
        </Grid2>

        <Grid2 size={6}>
            <RegisterForm/>
        </Grid2>
    </Grid2>
  )
}

export default RegisterPage