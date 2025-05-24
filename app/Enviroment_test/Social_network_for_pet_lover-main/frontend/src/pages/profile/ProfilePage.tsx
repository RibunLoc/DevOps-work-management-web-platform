import React from "react";
import SideBarLRForm from "../../components/shared/SideBarLR/SideBarLRForm";
import MainProfileForm from "../../components/profile/MainProfileForm"; 
import PublicLayout from "../../Layout";
import SideBarHome from "../../components/sideBar/SideBarRight/Home/SideBarHome";

const ProfilePage = () => {
  return (
    <PublicLayout
      mainContent={<MainProfileForm/>}
      recentChatsContent={<SideBarHome/>}
    />
    
  );  
};

export default ProfilePage;
