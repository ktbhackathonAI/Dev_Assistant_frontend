import React from 'react';
import { Box, Typography } from '@mui/material';
import { useTheme } from "@mui/material/styles";


const Header = ({ drawerOpen, drawerWidth }) => {
    const theme = useTheme();
  return (
    <Box
      sx={{
        width: `calc(100% - ${drawerOpen ? drawerWidth : 0}px)`, // 사이드 바 상태에 따라 너비 조정
        height: '64px',
        position: 'fixed',
        top: 0,
        left: drawerOpen ? `${drawerWidth}px` : '0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        borderBottom: "1px solid black",
        zIndex: 10,
        transition: 'left 0.3s ease',
      }}
    >
      <Typography variant="h6">JARVIS</Typography>
    </Box>
  );
};

export default Header;