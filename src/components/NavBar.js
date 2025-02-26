import React, { useContext, useState } from "react";
import PropTypes from "prop-types";
import {
  Box,
  CssBaseline,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Button,
  Menu,
  MenuItem,
  IconButton,
  Tooltip,
  Switch,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Add, Chat, AccountCircle, Logout, Brightness4, Brightness7, Hexagon, Search, Edit } from "@mui/icons-material";
import { ThemeContext } from "../ThemeContext";
import { useTheme } from "@mui/material/styles";

const drawerWidth = 240;

function ResponsiveDrawer({ open, toggleDrawer }) {
  const navigate = useNavigate();
  const { darkMode, toggleTheme } = useContext(ThemeContext);
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const [chats, setChats] = useState([
    { id: 1, title: "새로운 채팅" },
    { id: 2, title: "지난 대화 1" },
    { id: 3, title: "지난 대화 2" },
    { id: 3, title: "지난 대화 3" },
    { id: 3, title: "지난 대화 4" },
    { id: 3, title: "지난 대화 5" },
    { id: 3, title: "지난 대화 6" },
    { id: 3, title: "지난 대화 7" },
    { id: 3, title: "지난 대화 8" },
    { id: 3, title: "지난 대화 2" },
    { id: 3, title: "지난 대화 2" },
    { id: 3, title: "지난 대화 2" },
    { id: 3, title: "지난 대화 2" },
    { id: 3, title: "지난 대화 2" },
    { id: 3, title: "지난 대화 2" },
    { id: 3, title: "지난 대화 2" },
    { id: 3, title: "지난 대화 2" },
    { id: 3, title: "지난 대화 2" },
    { id: 3, title: "지난 대화 2" },
    { id: 3, title: "지난 대화 2" },
    { id: 3, title: "지난 대화 2" },
    { id: 3, title: "지난 대화 2" },
    { id: 3, title: "지난 대화 2" },
    { id: 3, title: "지난 대화 2" },
    { id: 3, title: "지난 대화 2" },
    { id: 3, title: "지난 대화 2" },
    { id: 3, title: "지난 대화 2" },

  ]);

  const isLoggedIn = !!localStorage.getItem("token");

  const handleAccountMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleAccountMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    handleAccountMenuClose();
    navigate("/login");
  };

  const handleNewChat = () => {
    const newChat = { id: chats.length + 1, title: `새로운 채팅 ${chats.length + 1}` };
    setChats([newChat, ...chats]);
  };

  const drawer = (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: theme.palette.background.default,
        color: theme.palette.text.primary,
      }}
    >
    {/* ✅ 상단 네비게이션 헤더 */}
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 2,
          paddingTop: 0,
          paddingBottom: 0,

        }}
      >
        {/* ✅ 닫기 버튼 */}
        <Tooltip>
        <IconButton sx={{ color: 'transparent' }}>
          <Hexagon />
        </IconButton>
        </Tooltip>
        <Tooltip title="채팅 검색" arrow>
        <IconButton color="black">
          <Search />
        </IconButton>
        </Tooltip>
        <Tooltip title="This is an information icon" arrow>
        <IconButton color="black" onClick={() => navigate("/new-post")}>
          <Edit />
        </IconButton>
        </Tooltip>
      </Toolbar>
      <Divider />

      {/* 새로운 채팅 버튼 */}
      <Box sx={{ p: 2 }}>
        <Button
          fullWidth
          variant="contained"
          startIcon={<Add />}
          onClick={handleNewChat}
          sx={{
            borderRadius: 5,
            bgcolor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            ":hover": { bgcolor: theme.palette.primary.dark },
          }}
        >
          새로운 대화
        </Button>
      </Box>
      <Divider />

      {/* 대화 목록 */}
      <List sx={{ flexGrow: 1, overflowY: "auto" }}>
        {chats.map((chat) => (
          <ListItem key={chat.id} disablePadding>
            <ListItemButton onClick={() => navigate(`/chat/${chat.id}`)}>
              <ListItemIcon>
                <Chat />
              </ListItemIcon>
              <ListItemText primary={chat.title} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

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
      <List>
        {/* 계정 설정 버튼 */}
        <ListItem disablePadding>
          <ListItemButton
            onClick={handleAccountMenuOpen}
            sx={{
              minHeight: 20, // 🔥 크기 조정 (기본보다 크게)
              px: 2, // 좌우 패딩 추가
              borderRadius: 2, // 둥글게
              "&:hover": { bgcolor: "rgba(0, 0, 0, 0.08)" },
            }}
          >
            <ListItemIcon sx={{ minWidth: 48 }}> {/* 🔥 아이콘 크기 조정 */}
              <AccountCircle sx={{ fontSize: "2rem" }} /> {/* 🔥 아이콘 확대 */}
            </ListItemIcon>
            <ListItemText
              primary="계정 설정"
              primaryTypographyProps={{ fontSize: "1.1rem", fontWeight: "bold" }} // 🔥 글자 크기 증가
            />
          </ListItemButton>
        </ListItem>

        {/* 로그아웃 버튼 (로그인 상태일 때만 표시) */}
        {isLoggedIn && (
          <ListItem disablePadding>
            <ListItemButton
              onClick={handleLogout}
              sx={{
                minHeight: 20, // 🔥 높이 증가
                px: 2, // 좌우 여백
                borderRadius: 2, // 둥글게
                "&:hover": { bgcolor: "rgba(0, 0, 0, 0.08)" },
              }}
            >
              <ListItemIcon sx={{ minWidth: 48 }}>
                <Logout sx={{ fontSize: "2rem" }} /> {/* 🔥 아이콘 확대 */}
              </ListItemIcon>
              <ListItemText
                primary="로그아웃"
                primaryTypographyProps={{ fontSize: "1.1rem", fontWeight: "bold" }} // 🔥 글자 크기 증가
              />
            </ListItemButton>
          </ListItem>
        )}
        </List>

      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Drawer
        variant="persistent" // 고정형 드로어
        sx={{
          "& .MuiDrawer-paper": {
            width: drawerWidth,
          },
        }}
        open={open} // 드로어 상태 제어
      >
        {drawer}
      </Drawer>

      <Box
        sx={{
          position: "absolute",
          top: 12,
          left: 24,
          zIndex: 2200, // 다른 요소들 위에 표시되도록 설정
        }}
      >
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
