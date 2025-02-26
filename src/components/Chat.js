import React, { useState, useContext, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Box, TextField, IconButton, List, ListItem, ListItemText, Paper } from "@mui/material";
import { Send } from "@mui/icons-material";
import { ThemeContext } from "../ThemeContext";
import { useTheme } from "@mui/material/styles";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

const ProjectCreation = () => {
  const { darkMode } = useContext(ThemeContext);
  const theme = useTheme();
  const [requests, setRequests] = useState([]);
  const [input, setInput] = useState("");
  const [isServerTyping, setIsServerTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const { roomId } = useParams();
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // 기존 대화 내역 불러오기
    const fetchMessages = async () => {
      const response = await fetch(`http://localhost:8000/chat/rooms/${roomId}/messages`);
      if (response.ok) {
        const data = await response.json();
        console.log(data)
        setMessages(data);
      } else {
        console.error("대화방 메시지 목록을 가져오는 데 실패했습니다.");
      }
    };

    fetchMessages();
  }, [roomId]);

  const handleSendRequest = async () => {
    if (input.trim() === "") return;

    setRequests((prev) => [...prev, { text: input, sender: "user" }]);
    setIsServerTyping(true);
    try {
      console.log("Sending:", input, "to room:", roomId);  // 디버깅용 로그
      const response = await fetch(`http://localhost:8000/chat/rooms/${roomId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: input })
      });
      if (response.ok) {
        const newMessages = await response.json();
        console.log("Response:", newMessages);  // 응답 확인용
        setRequests((prev) => [...prev, ...newMessages]);
      } else {
        const errorText = await response.text();
        console.error("Error:", response.status, errorText);  // 오류 상세 출력
        setRequests((prev) => [
          ...prev,
          { text: `❌ 메시지 전송에 실패했습니다: ${response.status}`, sender: "system" }
        ]);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setRequests((prev) => [
        ...prev,
        { text: "❌ 서버 오류가 발생했습니다.", sender: "system" }
      ]);
    }
    setIsServerTyping(false);
    setInput("");
};

  // 자동 스크롤 처리
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [requests]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "calc(100vh - 40px)",
        bgcolor: theme.palette.background.default,
        color: theme.palette.text.primary,
        p: 2,
        mt: 2,
        mb: 2
      }}
    >
      {/* 채팅 내역 */}
      <Paper
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          p: 2,
          borderRadius: 2,
          bgcolor: darkMode ? "#1E1E1E" : "#f5f5f5",
          "&::-webkit-scrollbar": { display: "none" }
        }}
      >
        <List>
          {requests.map((msg, index) => (
            <ListItem
              key={index}
              sx={{
                justifyContent: msg.sender === "user" ? "flex-end" : "flex-start",
                textAlign: msg.sender === "user" ? "right" : "left",
                mb: 1
              }}
            >
              <Paper
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: msg.sender === "user" ? theme.palette.primary.main : "#ddd",
                  color: msg.sender === "user" ? "#fff" : "#000"
                }}
              >
                {typeof msg.text === "string" ? (
                  <ListItemText primary={msg.text} />
                ) : (
                  msg.text
                )}
              </Paper>
            </ListItem>
          ))}
          <div ref={messagesEndRef} />
        </List>
      </Paper>

      {/* 입력창 */}
      <Box
        sx={{
          display: "flex",
          mt: 2,
          p: 1,
          borderRadius: 2,
          bgcolor: theme.palette.background.paper
        }}
      >
        <TextField
          fullWidth
          variant="outlined"
          placeholder="입력하세요..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) =>
            e.key === "Enter" && !isServerTyping && handleSendRequest()
          }
          sx={{
            bgcolor: darkMode ? "#2C2C2C" : "#fff",
            color: theme.palette.text.primary,
            borderRadius: 2,
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: darkMode ? "#555" : "#ccc" },
              "&:hover fieldset": { borderColor: darkMode ? "#888" : "#999" },
              "&.Mui-focused fieldset": { borderColor: theme.palette.primary.main }
            }
          }}
          disabled={isServerTyping}
        />
        <IconButton
          color="primary"
          onClick={handleSendRequest}
          sx={{ ml: 1 }}
          disabled={!input.trim() || isServerTyping}
        >
          <Send />
        </IconButton>
      </Box>
    </Box>
  );
};

export default ProjectCreation;
