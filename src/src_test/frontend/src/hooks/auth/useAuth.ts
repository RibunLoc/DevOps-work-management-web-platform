import { User } from '../../types';
import { Navigate, useNavigate } from 'react-router-dom';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { Snackbar } from '@mui/material';



const useAuth = () => {


    const login = async (user: string, password: string): Promise<boolean> => {

        debugger;

        const url = `${process.env.REACT_APP_API_URL}/api/v1/login`
        try {
            const response = await fetch(url, {
                method: "POST", 
                headers: {
                    "Content-Type": "application/json" // Add this line to specify that the body contains JSON data
                },
                body: JSON.stringify({
                    "email": user,
                    "password": password
                })
            })

            if (!response.ok) {
                return false
            }

            const data = await response.json()
            const jwt = data.jwt
            const userId = data.user_id
            console.log(data)
            
            
            localStorage.setItem("jwt", jwt)
            localStorage.setItem("userId", userId)
            localStorage.setItem("email", user)

            return true
        } catch(e) {
            console.log("Some errors happen", e)
            return false
        }
            
    }

    return {login}

}

export default useAuth