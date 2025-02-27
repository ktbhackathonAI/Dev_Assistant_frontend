import React, { useState, useEffect, useContext } from "react";
import { List, ListItem, ListItemButton, ListItemText, IconButton, Box, Typography, Link } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../ThemeContext";


const RoomList = ({ chats, setChats, setMessages }) => {
  const API_URL = "http://211.188.60.112:8000";//"http://localhost:8000"
  const navigate = useNavigate();
  const { darkMode } = useContext(ThemeContext);
  const [expandedChatId, setExpandedChatId] = useState(null);
  const [selectedChatId, setSelectedChatId] = useState(null);

  // 대화방 클릭 시 메시지 불러오기
  const handleRoomClick = async (roomId) => {
    const response = await fetch(`${API_URL}/chat/rooms/${roomId}/messages`);
    if (response.ok) {
      const messages = await response.json();
      setMessages(messages); // 대화방 메시지 상태 업데이트
      setSelectedChatId(roomId); // 선택된 채팅방 업데이트
      navigate(`/rooms/${roomId}`); // 해당 대화방으로 이동
    } else {
      console.error("대화방 메시지 목록을 가져오는 데 실패했습니다.");
    }
  };

  // 대화방의 repo URL 토글 기능
  const toggleRepoVisibility = (chatId) => {
    setExpandedChatId(expandedChatId === chatId ? null : chatId); // 토글 기능
  };

  return (
    <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
      <List>
        {chats.map((chat, index) => (
          <React.Fragment key={chat.room_id || index}>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => handleRoomClick(chat.room_id)}
                sx={{
                  backgroundColor: selectedChatId === chat.room_id
                    ? (darkMode ? "#424242" : "#E5F3E5")
                    : "transparent",
                }}
              >
                <ListItemText
                  primary={`채팅방 ${chat.room_id}`}
                  sx = {{
                    pl:1,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                />
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation(); // ListItemButton으로 이벤트 전파 방지
                    chat.repo_url && toggleRepoVisibility(chat.room_id);
                  }}
                  sx={{ ml: 2 }}
                >
                  <Typography variant="body2" sx={{ fontSize: 16 }}>
                    {expandedChatId === chat.room_id ? "▼" : "▶"}
                  </Typography>
                </IconButton>
              </ListItemButton>
            </ListItem>

            {expandedChatId === chat.room_id && chat.repo_url && (
              <Box sx={{
                pt:1,
                pb:1,
                pl:3,
                pr:1,
                bgcolor: darkMode ? "#1E1E1E" : "#f5f5f5" }
              }>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography variant="body2" color="textSecondary">
                    🔗
                  </Typography>
                  <Link
                    href={chat.repo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      color: darkMode ? "#1E90FF" : "#1976d2",
                      textDecoration: "none",
                      "&:hover": { textDecoration: "underline" },
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {chat.repo_url}
                  </Link>
                </Box>
              </Box>
            )}
        </React.Fragment>
        ))}
      </List>
    </Box>
  );
};

export default RoomList;
