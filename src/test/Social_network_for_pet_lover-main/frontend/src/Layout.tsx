import React, { ReactNode, useState } from 'react';
import SideBar from '../src/components/sideBar/SideBar';
import Header from '../src/components/layout/Header';
import { Grid2, ToggleButton } from '@mui/material';
import { ArrowRightOutlined } from '@mui/icons-material';

// Define props type for PublicLayout

interface PublicLayoutProps {
  mainContent: ReactNode; // Required main content
  recentChatsContent: ReactNode; // Required recent chats content
  extraContent?: ReactNode; // Optional content like Palette
}
// interface PublicLayoutProps {
//   children: [ReactNode, ReactNode, ReactNode]; // Sidebar, MainContent, RecentChats
// }

const PublicLayout: React.FC<PublicLayoutProps> = ({
  mainContent,
  recentChatsContent,
  extraContent,
}) => {
  const [isOpened, setIsOpened] = useState<boolean>(true);

  // Destructure children into specific parts


  return (
    <Grid2
      container
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <Grid2 size={12}>
        <Header />
        {extraContent}
      </Grid2>

      {/* Main Content */}
      <Grid2
        size={12}
        sx={{ flex: 1, display: 'flex', overflow: 'hidden' }}
      >
        {/* Sidebar */}
        <Grid2
          size={isOpened ? 2.5 : 0.9}
          sx={{
            position: 'relative',
            transition: 'all 0.3s ease-in-out',
            overflow: 'hidden',
            height: '100%',
          }}
        >
          <SideBar isOpened={isOpened} />
          <ToggleButton
            value="slide"
            selected={isOpened}
            onChange={() => setIsOpened((prevState) => !prevState)}
            sx={{
              position: 'absolute',
              top: '50%',
              right: '0px',
              width: '40px',
              height: '40px',
              bgcolor: 'transparent',
              '&.Mui-selected': { backgroundColor: 'transparent' },
              '&:hover': { backgroundColor: 'transparent' },
              transition: 'transform 0.3s ease-in-out',
              transform: isOpened ? 'rotate(180deg)' : 'rotate(0deg)',
            }}
          >
            <ArrowRightOutlined />
          </ToggleButton>
        </Grid2>

        {/* Main Content */}
        <Grid2
          size={isOpened ? 7 : 8.6}
          sx={{
            height: '100%',
            overflow: 'scroll',
            display: 'flex',
            flexDirection: 'column',
            transition: 'all 0.3s ease-in-out',
          }}
        >
          {mainContent}
        </Grid2>

        {/* Recent Chats */}
        <Grid2 size={2.5} sx={{ height: '100%', overflow: 'scroll' }}>
          {recentChatsContent}
        </Grid2>
      </Grid2>
    </Grid2>
  );
};

export default PublicLayout;
