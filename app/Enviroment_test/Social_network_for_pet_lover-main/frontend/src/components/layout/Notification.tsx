import React from 'react';
import { Box, Avatar } from '@mui/material';
import { NotificationAddOutlined } from '@mui/icons-material';
import { lightTheme } from '../../themes/theme';

const Header: React.FC = () => {
  return (
    <>
      <Box
        component="div"
        display="flex"
        sx={{
          height: "10vh",
          backgroundColor: lightTheme.colors.background,
          color: "black",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          width: "100%",
          zIndex: 1000,
          fontFamily: "Helvetica",
          fontSize: "30px",
          //paddingLeft: "50px"
        }}
      >

      </Box> 
    </>
      

  );
};

export default Header;
