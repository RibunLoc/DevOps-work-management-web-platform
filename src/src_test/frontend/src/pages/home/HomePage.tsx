import React from 'react'
import SideBarLRForm from '../../components/shared/SideBarLR/SideBarLRForm'
import HomeForm from '../../components/home/HomeForm'
import PublicLayout from '../../Layout'
import SideBarHome from '../../components/sideBar/SideBarRight/Home/SideBarHome'

const HomePage = () => {
  return (
    <PublicLayout
      mainContent={<HomeForm/>}
      recentChatsContent={<SideBarHome/>}
    />
  )
}

export default HomePage
