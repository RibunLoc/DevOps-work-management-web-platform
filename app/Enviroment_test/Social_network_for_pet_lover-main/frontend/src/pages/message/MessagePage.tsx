import React, { useEffect, useState } from 'react'
import SideBar from '../../components/sideBar/SideBar'
import RecentChats from '../../components/message/RecentChats'
import MainMessage from '../../components/message/MainMessage'
import Header from '../../components/layout/Header'
import Palette from '../../components/palette/Palette'
import { lightTheme } from '../../themes/theme'
import PublicLayout from '../../Layout'

import { SelectedUserProvider } from '../../components/message/SelectedUserContext'
import { SocketProvider } from '../../components/message/SocketContext'
import { BackgroundProvider, useBackground } from '../../components/message/BackgroundContext'
import { Grid2, ToggleButton, Box,Divider } from '@mui/material'
import { ArrowLeftOutlined, ArrowRightOutlined } from '@mui/icons-material'

// const MessagePageContent = () => {
//   const { backgroundImageOver } = useBackground();
//   const [isOpened, setIsOpened] = useState(true);

//   return (
//     <Grid2
//       container
//       sx={{
//         display: "flex",
//         flexDirection: "column",
//         height: "100vh", 
//         overflow: "hidden", 
//       }}
//     >
//       <Grid2 size={12}>
//         <Header />
//         <Palette imgSrc={backgroundImageOver} />
//       </Grid2>
//       <Divider/>
//       <Grid2  size={12} sx={{ flex: 1, display: "flex", overflow: "hidden" }}>
//         <Grid2 container sx={{ flex: 1, height: "100%" }}>
//           <Grid2

//             size={isOpened ? 2.5 : 0.9}
//             sx={{
//               position: "relative",
//               transition: "all 0.3s ease-in-out",
//               overflow: "hidden", // Hide content when sidebar is collapsed
//               height: "100%", // Ensure it stretches the full height of the container
              
//             }}
//           >
//             <SideBar isOpened={isOpened} />
//             <ToggleButton
//               value="slide"
//               selected={isOpened}
//               onChange={() => setIsOpened((prevState) => !prevState)}
//               sx={{
//                 position: "absolute",
//                 top: "50%",
//                 right: "0px",
//                 width: "40px",
//                 height: "40px",
//                 bgcolor: "transparent",
//                 overflowX: "hidden",
//                 "&.Mui-selected": {
//                   backgroundColor: "transparent", // Ensure the background stays transparent when selected
//                 },
//                 "&:hover": {
//                   backgroundColor: "transparent", // Make background transparent on hover
//                 },
//                 transition: "transform 0.3s ease-in-out", // Smooth rotation transition
//                 transform: isOpened ? "rotate(180deg)" : "rotate(0deg)", // Rotate when selected
//               }}
//             >
//               <ArrowRightOutlined />
//             </ToggleButton>
//           </Grid2>
//           {/* <Divider orientation='vertical'/> */}
//           <Grid2
            
//             size={isOpened ? 7 : 8.6}
//             sx={{
//               height: "100%", // Ensure it stretches the full height of the container
//               overflow: "hidden", // Prevent overflow
//               display: "flex",
//               flexDirection: "column",
//               transition: "all 0.3s ease-in-out"
//             }}
//           >

//               <MainMessage />

//           </Grid2>

//           <Grid2 size={2.5} sx={{ height: "100%" }}>
//             <RecentChats />
//           </Grid2>
//         </Grid2>
//       </Grid2>
//     </Grid2>
//   );
// };

  

const MessagePage = () => {
  debugger;

  const [backgroundImage, setBackgroundImage] = useState<string>("")
  const { backgroundImageOver } = useBackground();

  useEffect(()=> {
    debugger;
    setBackgroundImage(backgroundImageOver)
  },[backgroundImageOver])
  console.log("backgroundImageOver", backgroundImageOver)
  return (
    <BackgroundProvider>
      <SocketProvider>
        <SelectedUserProvider>
          <PublicLayout 
            mainContent={<MainMessage/>}
            recentChatsContent={<RecentChats/>}
            extraContent={<Palette imgSrc={backgroundImage} />}
          />
          {/* <MessagePageContent /> */}
        </SelectedUserProvider>
      </SocketProvider>
    </BackgroundProvider>
  );
};

export default MessagePage;
