import React, { useState, useContext, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Box, TextField, IconButton, List, ListItem, ListItemText, Paper } from "@mui/material";
import { Send } from "@mui/icons-material";
import { ThemeContext } from "../ThemeContext";
import { useTheme } from "@mui/material/styles";
import CodeMessage from "../MessageTypes/CodeMessage";
import LinkMessage from "../MessageTypes/LinkMessage";
import FolderMessage from "../MessageTypes/FolderMessage";
import UrlMessage from "../MessageTypes/UrlMessage";
import Typewriter from "typewriter-effect";


const Chat = () => {
  const API_URL = process.env.REACT_APP_API_URL;

  const { darkMode } = useContext(ThemeContext);
  const theme = useTheme();
  const [input, setInput] = useState("");
  const [isServerTyping, setIsServerTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const { roomId } = useParams();
  const [messages, setMessages] = useState([]);

  // 서버 응답을 기대하는 형식으로 변환하는 함수
  const transformServerResponse = (serverData) => {
    const { content, sender } = serverData;
    // content를 기반으로 type을 추정하거나, 이미 정의된 형식을 따름
    if (content.startsWith("http")) {
      return { type: "link", role: sender, content };
    } else if (content.includes("→")) {
      return { type: "url", role: sender, content };
    } else if (content.includes("const") || content.includes("function")) {
      return { type: "code", role: sender, content };
    } else if (content.includes("├──")) {
      return { type: "folder", role: sender, content };
    } else {
      return { type: "text", role: sender, content };
    }
  };

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(`${API_URL}/chat/rooms/${roomId}/messages`);
        if (response.ok) {
          const data = await response.json();
          // 서버에서 반환된 데이터를 변환
          const transformedMessages = data.map(transformServerResponse);
          console.log(data);
          setMessages(transformedMessages);
        } else {
          console.error("대화방 메시지 목록을 가져오는 데 실패했습니다.");
        }
      } catch (error) {
        console.error("메시지 가져오기 오류:", error);
      }
    };

    fetchMessages();
  }, [roomId]);

  const handleSendRequest = async () => {
    if (input.trim() === "") return;

    const newUserMessage = { type: "text", role: "user", content: input };
    console.log("User message sent:", newUserMessage);
    setMessages((prev) => [...prev, newUserMessage]);
    setIsServerTyping(true);

    try {
      console.log("Sending request to:", `${API_URL}/chat/rooms/${roomId}/messages`);
      const response = await fetch(`${API_URL}/chat/rooms/${roomId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: input }),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      console.log("Response received, status:", response.status);

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let newServerMessages = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          console.log("Streaming complete, total messages:", newServerMessages);
          break;
        }

        const chunk = decoder.decode(value);
        console.log("Received chunk:", chunk);

        const lines = chunk.split("\n").filter((line) => line.trim());
        console.log("Split into lines:", lines);

        for (const line of lines) {
          let messageData;
          if (line.startsWith("data: ")) {
            const content = line.substring(6); // "data: " 제거
            console.log("SSE data detected, raw content:", content);
            try {
              messageData = JSON.parse(content);
              console.log("Parsed JSON:", messageData);
            } catch {
              messageData = { content, sender: "server" };
              console.log("Non-JSON content, treated as text:", messageData);
            }
          } else {
            try {
              messageData = JSON.parse(line);
              console.log("Parsed JSON line:", messageData);
            } catch (e) {
              console.error("Invalid JSON:", line, e);
              messageData = { content: line, sender: "server" };
              console.log("Fallback to text:", messageData);
            }
          }
          const transformedMessage = transformServerResponse(messageData);
          console.log("Transformed message:", transformedMessage);
          newServerMessages.push(transformedMessage);
        }
      }
      setMessages((prev) => [...prev, ...newServerMessages]);
    } catch (error) {
      console.error("전송 오류:", error);
      setMessages((prev) => [
        ...prev,
        { type: "text", role: "system", content: "❌ 서버 오류: " + error.message },
      ]);
    }
    setIsServerTyping(false);
    setInput("");
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
        mb: 2,
      }}
    >
      <Paper
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          p: 2,
          borderRadius: 2,
          bgcolor: darkMode ? "#1E1E1E" : "#f5f5f5",
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
        <List>

          {messages.map((msg, index) => (
            <ListItem
              key={index}
              sx={{
                justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                textAlign: msg.role === "user" ? "right" : "left",
                mb: 1,
              }}
            >
              <Paper
                sx={{
                  pt: 1, pr: 2, pb: 1, pl: 2,
                  borderRadius: 2,
                  bgcolor:
                    msg.role === "user"
                      ? theme.palette.primary.main
                      : msg.type === "text"
                      ? "#ddd"
                      : darkMode
                      ? "#1E1E1E"
                      : "#f5f5f5",
                  color:
                    msg.role === "user"
                      ? "#fff"
                      : msg.type === "text"
                      ? "#000"
                      : darkMode
                      ? "#fff"
                      : "#000",
                  boxShadow:
                    msg.role === "system" && msg.type !== "text"
                      ? "none"
                      : theme.shadows[1],
                  width: msg.role === "system" && msg.type !== "text" ? "100%" : "auto",
                }}
              >
                {msg.type === "code" ? (
                  <CodeMessage content={msg.content} />
                ) : msg.type === "link" ? (
                  <LinkMessage content={msg.content} />
                ) : msg.type === "folder" ? (
                  <FolderMessage content={msg.content} />
                ) : msg.type === "url" ? (
                  <UrlMessage content={msg.content} />
                ) : (
                  <ListItemText
                      primary={msg.content}
                    />
                )}
              </Paper>
            </ListItem>
          ))}
          <div ref={messagesEndRef} />
        </List>
      </Paper>

      <Box
        sx={{
          display: "flex",
          mt: 2,
          p: 1,
          borderRadius: 2,
          bgcolor: theme.palette.background.paper,
        }}
      >
        <TextField
          fullWidth
          variant="outlined"
          placeholder="입력하세요..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && !isServerTyping && handleSendRequest()}
          sx={{
            bgcolor: darkMode ? "#2C2C2C" : "#fff",
            color: theme.palette.text.primary,
            borderRadius: 2,
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: darkMode ? "#555" : "#ccc" },
              "&:hover fieldset": { borderColor: darkMode ? "#888" : "#999" },
              "&.Mui-focused fieldset": { borderColor: theme.palette.primary.main },
            },
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

export default Chat;
