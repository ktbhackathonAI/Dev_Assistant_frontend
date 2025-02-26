import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import Grid from '@mui/material/Grid';
import NavBar from '../components/NavBar';
import Header from '../components/Header'; 

const drawerWidth = 240; // 네비게이션 바 너비 설정

function Main() {
  const [drawerOpen, setDrawerOpen] = useState(true);

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* ✅ 좌측 네비게이션 바 */}
      <NavBar open={drawerOpen} toggleDrawer={() => setDrawerOpen(!drawerOpen)} />  {/* 드로어 상태 전달 */}

      {/* ✅ 고정된 헤더 */}
      <Header drawerOpen={drawerOpen} drawerWidth={drawerWidth} /> {/* ✅ Header 컴포넌트 사용 */}

      {/* ✅ 메인 콘텐츠 영역 */}
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          height: '100vh',
          marginLeft: drawerOpen ? `${drawerWidth}px` : '0', // 사이드 바 열리고 닫힐 때 왼쪽 여백 변경
          overflow: "auto",
        }}
      >
        <Grid container sx={{ width: '100%', marginTop: '20px' }}>
          <Grid item xs={1} sx={{ height: '100vh' }}></Grid>
          <Grid item xs={10} sx={{ height: '100vh' }}>
            {/* 자식 라우트 렌더링 */}
            <Outlet />
          </Grid>
          <Grid item xs={1} sx={{ height: '100vh' }}></Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default Main;
