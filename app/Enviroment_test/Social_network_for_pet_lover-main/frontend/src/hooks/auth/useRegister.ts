import { User } from '../../types';
import { useNavigate } from 'react-router-dom'; 
import { useSnackbar } from '../../components/shared/SnackBarProvider';


const useRegister = () => {
    const register = async (email:string, password:string, confirmedPassword: string, firstName:string, lastName:string, phone: string): Promise<boolean> => {
        debugger;

        
        if (password !== confirmedPassword) {
            return false
        }
        

        const url = `${process.env.REACT_APP_API_URL}/api/v1/register`
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json" 
                },
                body: JSON.stringify({
                    "email": email,
                    "password": password,
                    "firstName": firstName,
                    "lastName": lastName,
                    "phone": phone
                })
            })

            if (!response.ok) {
                return false
            }

            return true
        } catch(e) {
            console.log("Some errors happen", e)
            return false
        }
            
    }

    return {register}

}

export default useRegister