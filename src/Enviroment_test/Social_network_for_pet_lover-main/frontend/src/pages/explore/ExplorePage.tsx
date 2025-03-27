import React from "react";
import SideBarLRForm from "../../components/shared/SideBarLR/SideBarLRForm";
import ExploreForm from "../../components/explore/ExploreForm";
import PublicLayout from "../../Layout";
import SideBarHome from "../../components/sideBar/SideBarRight/Home/SideBarHome";

const ExplorePage = () => {
  return (
    <PublicLayout
      mainContent={<ExploreForm/>}
      recentChatsContent={<SideBarHome/>}
    />

  );  
};

export default ExplorePage;
