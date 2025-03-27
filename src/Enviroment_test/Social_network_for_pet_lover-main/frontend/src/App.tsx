import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ForgetPasswordPage from "./pages/auth/ForgetPasswordPage";
import ChangePasswordPage from "./pages/auth/ChangePasswordPage";
import MessagePage from "./pages/message/MessagePage";
import ChatBot from "./components/chatBot/ChatBot";
import theme from "./themes/theme";

import ExplorePage from "../src/pages/explore/ExplorePage";
import ProfilePage from "./pages/profile/ProfilePage";
import PostsDisplay from "./components/profile/Post/PostsDisplay";
import PetsDisplay from "./components/profile/PetsDisplay";

import { ThemeProvider, Box } from "@mui/material";
import { SelectedUserProvider } from "./components/message/SelectedUserContext";
import { SocketProvider } from "./components/message/SocketContext";
import { BackgroundProvider } from "./components/message/BackgroundContext";
import { SnackbarProvider } from "./components/shared/SnackBarProvider";

import HomePage from "./pages/home/HomePage";
import ProtectedRoutes from "./pages/auth/ProtectedRoute";
//import { ProfileProvider } from "./components/profile/ProfileContext";
import FavouritePage from "./pages/favourite/FavouritePage";
import { Favorite } from "@mui/icons-material";
import FavouritePostsDisplay from "./pages/favourite/FavouritePostsDisplay";
import FavouritePetsDisplay from "./pages/favourite/FavouritePetsDisplay";
import FavouriteGeneral from "./pages/favourite/FavouriteGeneralDisplay";
import PostPage from "./pages/post/PostPage";
import FollowingDisplay from "./components/profile/Following/FollowingDisplay";
import FollowerDisplay from "./components/profile/Following/FollowerDisplay";

const App = () => {
  const location = useLocation();
  const state = location.state;
  return (
    <BackgroundProvider>
      <SocketProvider>
        <SelectedUserProvider>
          <SnackbarProvider>
            <ThemeProvider theme={theme}>
              <Box component="div" minHeight="100vh">

                
                <Routes>
                  
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/forget_password" element={<ForgetPasswordPage />} />
                  <Route path="/change_password" element={<ChangePasswordPage />} />


                  <Route path="/message/:userEmail?" element={<ProtectedRoutes element={<MessagePage />} />} />
                  <Route path="/explore" element={<ProtectedRoutes element={<ExplorePage />} />} />
                  <Route path="/home" element={<ProtectedRoutes element={<HomePage />} />} />
                  <Route path="/favourite" element={<ProtectedRoutes element={<FavouritePage />} />}>
                    <Route index element={<ProtectedRoutes element={<FavouriteGeneral />} />} />
                    <Route path="general" element={<ProtectedRoutes element={<FavouriteGeneral />} />} />
                    <Route path="posts" element={<ProtectedRoutes element={<FavouritePostsDisplay />} />} />
                    <Route path="pets" element={<ProtectedRoutes element={<FavouritePetsDisplay />} />} />
                  </Route>
                  <Route path="/profile/:userId" element={<ProtectedRoutes element={<ProfilePage />} />}>
                    <Route index element={<ProtectedRoutes element={<PostsDisplay />} />} />
                    <Route path="posts" element={<ProtectedRoutes element={<PostsDisplay />} />} />
                    <Route path="pets" element={<ProtectedRoutes element={<PetsDisplay />} />} />
                    <Route path="following" element={<ProtectedRoutes element={<FollowingDisplay />} />} />
                    <Route path="follower" element={<ProtectedRoutes element={<FollowerDisplay />} />} />
                  </Route>
                  <Route path="/post/:postId" element={<ProtectedRoutes element={<PostPage />} />} />
                </Routes>
                {location.pathname !== "/login" &&
                  location.pathname != "register" ? (
                  <ChatBot />
                ) : null}
              </Box>
            </ThemeProvider>
          </SnackbarProvider>

        </SelectedUserProvider>
      </SocketProvider>
    </BackgroundProvider>
  );
};

export default App;
