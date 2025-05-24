import { AuthState, AuthAction,User } from "../types"

const initialState = {
    isAuthenticated: false,
    payload: {
        user: null,
        jwt: localStorage.getItem('jwt')
    }
}

//type
const LOG_IN = 'LOG_IN'
const LOG_OUT = 'LOG_OUT'


//reducer
const authReducer = (state:AuthState = initialState, action: AuthAction) => {
    switch(action.type) {
        case LOG_IN:
            return {
                ...state,
                isAuthenticated: true,
                user: action.payload.user,
                jwt: action.payload.jwt
            }
        case LOG_OUT:
            return {
                ...state,
                isAuthenticated: false,
                user: null,
                jwt: null
            }
        default:
            return state
    }
}


//actions
const logInAction = (user: User, jwt: string) => {
    localStorage.setItem('jwt', jwt)
    return {
        type: 'LOG_IN',
        payload: {
            user: user,
            jwt: jwt
        }
    }
}

const logOutAction = () => {
    localStorage.removeItem('jwt')
    return {
        type: 'LOG_OUT'
    }
} 

export {authReducer, logInAction, logOutAction}

