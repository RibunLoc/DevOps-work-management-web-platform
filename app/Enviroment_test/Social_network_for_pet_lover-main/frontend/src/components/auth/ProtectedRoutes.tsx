import React, {Component, ComponentType} from 'react'
import { useSelector } from 'react-redux'
import { Route, Navigate, PathRouteProps } from 'react-router-dom'
import { AuthState } from '../../types'

interface ProtectedRouteProps extends PathRouteProps {
    component: ComponentType<any>
}

const ProtectedRoutes: React.FC<ProtectedRouteProps> = ({
    component,
    ...rest
}) => {

    const isAuthenticated = useSelector((state:AuthState) => state.isAuthenticated)    
  return (
    <Route
        {...rest}
        element={isAuthenticated? (
            <Component></Component>
        ): (
            <Navigate to="/login"></Navigate>
        )}
    >

    </Route>
  )
}

export default ProtectedRoutes