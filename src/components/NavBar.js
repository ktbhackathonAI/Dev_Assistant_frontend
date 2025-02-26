import React, { useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Box, CssBaseline, Divider, Drawer, Toolbar, Typography, Button, IconButton, Tooltip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Add, Chat, Hexagon, Brightness7, Brightness4 } from "@mui/icons-material";  // Importing missing icons
import { ThemeContext } from "../ThemeContext";
import { useTheme } from "@mui/material/styles";
import RoomList from "./RoomList";  // RoomList 컴포넌트 가져오기

const drawerWidth = 240;

function ResponsiveDrawer({ open, toggleDrawer }) {
  const navigate = useNavigate();
  const { darkMode, toggleTheme } = useContext(ThemeContext);
  const theme = useTheme();

  const [chats, setChats] = useState([]);  // 대화방 목록 상태
  const [messages, setMessages] = useState([]);  // 대화방 메시지 상태

  const isLoggedIn = !!localStorage.getItem("token");

  // Define fetchRooms function here
  const fetchRooms = async () => {
    const response = await fetch('http://localhost:8000/chat/rooms');
    if (response.ok) {
      const rooms = await response.json();
      setChats(rooms);  // 대화방 목록을 상태에 업데이트
    } else {
      console.error("대화방 목록을 가져오는 데 실패했습니다.");
    }
  };

  useEffect(() => {
    // 대화방 목록을 초기 로딩
    fetchRooms();  // 페이지 초기화 시 대화방 목록을 가져옴
  }, []);  // 빈 배열을 전달하여 컴포넌트 마운트 시 한 번만 호출되도록

  const handleCreateRoom = async () => {
    const repoUrl = "https://github.com/user/test";  // 예시로 제공된 URL
    const response = await fetch('http://localhost:8000/chat/rooms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ repo_url: repoUrl }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log("대화방 생성 성공:", data);

      // 대화방 목록 갱신
      await fetchRooms();  // 대화방 목록 갱신

      // 생성된 대화방으로 이동
      navigate(`/rooms/${data.room_id}`);  // room_id를 사용하여 해당 대화방으로 이동
    } else {
      console.error("대화방 생성 실패");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const drawer = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column", bgcolor: theme.palette.background.default, color: theme.palette.text.primary }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 2, paddingTop: 0, paddingBottom: 0 }}>
        <Tooltip>
          <IconButton sx={{ color: 'transparent' }}>
            <Hexagon />
          </IconButton>
        </Tooltip>
        <Typography variant="h6">JARVIS</Typography>
      </Toolbar>
      <Divider />

      {/* 새로운 대화방 생성 버튼 */}
      <Box sx={{ p: 2 }}>
        <Button
          fullWidth
          variant="contained"
          startIcon={<Chat />}
          onClick={handleCreateRoom}
          sx={{
            borderRadius: 5,
            bgcolor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            ":hover": { bgcolor: theme.palette.primary.dark },
          }}
        >
          새로운 코드 제작
        </Button>
      </Box>
      <Divider />

      {/* 대화방 목록 */}
      <RoomList chats={chats} setChats={setChats} setMessages={setMessages} />

      {/* 다크모드 토글 버튼 */}
      <Box sx={{ p: 2, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Typography variant="body1">테마 변경</Typography>
        <IconButton onClick={toggleTheme} color="inherit">
          {darkMode ? <Brightness7 /> : <Brightness4 />}
        </IconButton>
      </Box>

      <Divider />

      {/* 사용자 계정 메뉴 */}
      <Box sx={{ p: 2 }}>
        <Button onClick={handleLogout}>로그아웃</Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Drawer variant="persistent" sx={{ "& .MuiDrawer-paper": { width: drawerWidth } }} open={open}>
        {drawer}
      </Drawer>

      <Box sx={{ position: "absolute", top: 12, left: 24, zIndex: 2200 }}>
        <Tooltip title={open ? "사이드바 닫기" : "사이드바 열기"} arrow>
          <IconButton onClick={toggleDrawer}>
            <Hexagon />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
}

ResponsiveDrawer.propTypes = {
  window: PropTypes.func,
  open: PropTypes.bool.isRequired,
  toggleDrawer: PropTypes.func.isRequired,
};

export default ResponsiveDrawer;
