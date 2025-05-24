import React, {useEffect, useState} from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box } from "@mui/material";
import { Link, RouteProps } from "react-router-dom";


interface ProtectedRoutesProps {
  children: React.ReactNode;
}


const isAuthenticated = async () => {

    const jwt = localStorage.getItem("jwt")
    if(!jwt || jwt === "") {
        return false
    }

    const url = `${process.env.REACT_APP_API_URL}/api/v1/user/verify`

    const response = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${jwt}`
        }
    })

    if(!response.ok) {
        return false
    }
   

    return true
}
const ProtectedRoutes: React.FC<RouteProps> = ({ element, ...rest }) => {
    debugger;
    const [open, setOpen] = useState(false);
  
    // If the user is not authenticated, show the modal
    useEffect(()=> {

        const authenticated = async () => {
            const authenticated = await isAuthenticated()
            if(!authenticated) {
                setOpen(true)
            }
        }

        authenticated()
       
    },[])
  

  
    return (
        open?
        <Box>
            <Dialog open={open}>
            <DialogTitle>Please Log In</DialogTitle>
            <DialogContent>
              <p>You need to log in to view the content.</p>
            </DialogContent>
            <DialogActions>
              <Button component={Link} to="/login" color="primary">
                Go to Login
              </Button>
            </DialogActions>
          </Dialog>

        </Box>
            
        :
        <>{element}</>

    )
}
export default ProtectedRoutes
