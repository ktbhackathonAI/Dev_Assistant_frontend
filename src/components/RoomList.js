import React, { useState } from "react";
import { List, ListItem, ListItemButton, ListItemText, IconButton, Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";


const RoomList = ({ chats, setChats, setMessages }) => {
  const API_URL = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const [expandedChatId, setExpandedChatId] = useState(null);

  // 대화방 클릭 시 메시지 불러오기
  const handleRoomClick = async (roomId) => {
    const response = await fetch(`${API_URL}/chat/rooms/${roomId}/messages`);
    if (response.ok) {
      const messages = await response.json();
      setMessages(messages);  // 대화방 메시지 상태 업데이트
      navigate(`/rooms/${roomId}`);  // 해당 대화방으로 이동
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
            <ListItemButton onClick={() => handleRoomClick(chat.room_id)}>
              <pre>{JSON.stringify(chat, null, 2)}</pre>
              <ListItemText primary={"chat.id" + chat.room_id} />
              <IconButton onClick={() => toggleRepoVisibility(chat.room_id)} sx={{ ml: 2 }}>
                <Typography variant="body2" sx={{ fontSize: 16 }}>
                  {expandedChatId === chat.id ? "▼" : "▶"}
                </Typography>
              </IconButton>
            </ListItemButton>
          </ListItem>

          {expandedChatId === chat.id && chat.repo && (
            <Box sx={{ pl: 4, pt: 1 }}>
              <Typography variant="body2" color="textSecondary">
                {chat.repo}
              </Typography>
            </Box>
          )}
        </React.Fragment>
        ))}
      </List>
    </Box>
  );
};

export default RoomList;
