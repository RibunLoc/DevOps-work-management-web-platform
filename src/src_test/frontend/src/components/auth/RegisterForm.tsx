import React, { useState } from "react"
import { TextField, Button, Box, Typography, Divider, Link } from "@mui/material"
import { APP_NAME } from "../../constants/constants"
import { User } from "../../types"
import useRegister from "../../hooks/auth/useRegister"
import { useSnackbar } from "../shared/SnackBarProvider";
import { useNavigate } from "react-router-dom"



const RegisterForm: React.FC = () => {
    const {showSnackBar} = useSnackbar()
    const navigate = useNavigate()
    const { register } = useRegister();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        phone: ''
    });

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        try {
            const isRegisterSuccessed = await register(formData.email, formData.password, formData.confirmPassword, formData.firstName, formData.lastName, formData.phone)
            if(isRegisterSuccessed) {
                showSnackBar("Register succesfully","success")
                navigate("/login")
            } else {
                showSnackBar("Error in registration!! Try again", "error")
            }
        } catch (e) {
            console.log("Login failed", e)
        }
    }

    return (
        <Box
            component="div"
            sx={{
                backgroundColor: "#fffef3",
                height: "100vh",
                position: "relative",
                overflowY: "auto",
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            }}
        >
            <Box
                component="div"
                sx={{
                    bgcolor: "transparent",
                    position: "absolute",
                    width: "60%",
                    height: "80%",
                    // top: "10%",
                    // left: "20%"
                }}
            >
                <Typography
                    variant="h2" color="#506e4d" align="center" gutterBottom
                >
                    {APP_NAME}
                </Typography>
                <Typography
                    variant="h6" color="#ACBAA4" margin={3} gutterBottom
                >
                    Create new account to begin your adventure in discovering the fashion world
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Box
                        component="div"
                        sx={{
                            display: "flex",
                            justifyContent: "space-between"
                        }}

                    >
                        <TextField
                            required
                            id="firstName"
                            variant="outlined"
                            label="Enter your first name"
                            onChange={(e) => setFormData({
                                ...formData, 
                                "firstName": e.target.value
                            })}
                            sx={{

                                "& .MuiOutlinedInput-notchedOutline": {
                                    borderColor: "#DFE5D5",
                                    borderWidth: "2px",
                                    borderRadius: "20px"
                                },
                                width: "48%",
                                marginBottom: "15px",
                            }}
                        >

                        </TextField>

                        <TextField
                            required
                            id="lastName"
                            variant="outlined"
                            label="Enter your last name"
                            onChange={(e) => setFormData({
                                ...formData, 
                                "lastName": e.target.value
                            })}
                            sx={{

                                "& .MuiOutlinedInput-notchedOutline": {
                                    borderColor: "#DFE5D5",
                                    borderWidth: "2px",
                                    borderRadius: "20px"
                                },
                                width: "48%",
                                marginBottom: "15px",
                            }}
                        >

                        </TextField>
                    </Box>
                    
                    <TextField
                        required
                        id="phone"
                        variant="outlined"
                        label="Enter your phone"
                        onChange={(e) => setFormData({
                            ...formData, 
                            "phone": e.target.value
                        })}
                        sx={{

                            "& .MuiOutlinedInput-notchedOutline": {
                                borderColor: "#DFE5D5",
                                borderWidth: "2px",
                                borderRadius: "20px"
                            },
                            width: "100%",
                            marginBottom: "15px",
                        }}
                    >

                    </TextField>

                    <TextField
                        required
                        id="email"
                        variant="outlined"
                        label="Enter your email"
                        onChange={(e) => setFormData({
                            ...formData, 
                            "email": e.target.value
                        })}
                        sx={{

                            "& .MuiOutlinedInput-notchedOutline": {
                                borderColor: "#DFE5D5",
                                borderWidth: "2px",
                                borderRadius: "20px"
                            },
                            width: "100%",
                            marginBottom: "15px",
                        }}
                    >

                    </TextField>

                    <TextField
                        required
                        id="password"
                        variant="outlined"
                        label="Enter your password"
                        type="password"
                        onChange={(e) => setFormData({
                            ...formData, 
                            "password": e.target.value
                        })}
                        sx={{

                            "& .MuiOutlinedInput-notchedOutline": {
                                borderColor: "#DFE5D5",
                                borderWidth: "2px",
                                borderRadius: "20px"
                            },
                            width: "100%",
                            marginBottom: "15px",
                        }}
                    >

                    </TextField>

                    <TextField
                        required
                        id="confirmedPassword"
                        variant="outlined"
                        label="Confirm your password"
                        type="password"
                        onChange={(e) => setFormData({
                            ...formData, 
                            "confirmPassword": e.target.value
                        })}
                        sx={{

                            "& .MuiOutlinedInput-notchedOutline": {
                                borderColor: "#DFE5D5",
                                borderWidth: "2px",
                                borderRadius: "20px"
                            },
                            width: "100%",
                            marginBottom: "24px",
                        }}
                    >

                    </TextField>

                    <Button
                        id="loginBtn"
                        variant="contained"
                        color="success"
                        type="submit"

                        sx={{
                            width: "100%",
                            borderRadius: "20px",
                            marginBottom: "24px"
                        }}
                    >
                        Create
                    </Button>
                </form>


                <Divider sx={{ marginBottom: "24px" }}> OR </Divider>

                <Box sx={{ display: "flex", alignItems: "center", width: "100%", justifyContent: "center" }}>
                    <Typography variant="body1" sx={{ color: "#ADBBA5", marginRight: 1 }}>
                        Already have an account?
                    </Typography>
                    <Link href="/login" color="#91A48B" sx={{ textDecoration: "none", fontWeight: "500", lineHeight: "1.5" }}>
                        Log in
                    </Link>
                </Box>

            </Box>

        </Box>
    )
}

export default RegisterForm