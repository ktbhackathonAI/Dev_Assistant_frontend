import React, { useState, useContext, useRef, useEffect } from "react";
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
  const { darkMode } = useContext(ThemeContext);
  const theme = useTheme();
  const [requests, setRequests] = useState([]); 
  const [input, setInput] = useState(""); 
  const [step, setStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false); 
  const messagesEndRef = useRef(null);

  const handleSendRequest = () => {
    if (input.trim() === "") return;

    setRequests([...requests, { type: "text", role: "user", content: input }]);

    setIsLoading(true); 

    if (step === 0) {
      setTimeout(() => {
        setRequests((prev) => [...prev, { type: "text", role: "server", content: "프로젝트 이름을 입력하세요." }]);
        setIsLoading(false);
      }, 500);

      setStep(1);
    } else if (step === 1) {
      setTimeout(() => {
        setRequests((prev) => [...prev, { type: "text", role: "server", content: "📦 사용할 기술 스택을 입력하세요. (예: Node.js, Express, MongoDB)" }]);
        setIsLoading(false);
      }, 500);
      setStep(2);
    } else if (step === 2) {
      setTimeout(() => {
        setRequests((prev) => [...prev, { type: "text", role: "server", content: "🛠 프로젝트를 생성하는 중..." }]);
        setIsLoading(false);
      }, 500);

      setTimeout(() => {
        setRequests((prev) => [...prev, ...mockServerData]);
        setIsLoading(false); 
      }, 2000);
      setStep(0);
    }

    setInput("");
  };

  // ✅ 서버에서 오는 데이터 테스트용
  const mockServerData = [
    { type: "text", role: "server", content: "프로젝트가 생성되었습니다!" },
    { type: "folder", role: "server", content: "├── src/\n│   ├── app.js\n│   ├── routes/\n│   │   ├── api.js\n├── package.json" },
    { type: "url", role: "server", content: "GET /api/project/status → 서버 상태 확인\nPOST /api/project/data → 데이터 저장" },
    { type: "code", role: "server", content: "const express = require(\"express\");\nconst app = express();\n\napp.get(\"/\", (req, res) => {\n  res.send(\"Hello, World!\");\n});\n\napp.listen(3000, () => {\n  console.log(\"Server running on port 3000\");\n});" },
    { type: "link", role: "server", content: "https://github.com/user/project" }
  ];

  // ✅ 자동 스크롤
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [requests]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "calc(100vh - 40px)", bgcolor: theme.palette.background.default, color: theme.palette.text.primary, p: 2, mt: 2, mb: 2 }}>
      {/* ✅ 채팅 내역 */}
      <Paper sx={{ flexGrow: 1, overflowY: "auto", p: 2, borderRadius: 2, bgcolor: darkMode ? "#1E1E1E" : "#f5f5f5", "&::-webkit-scrollbar": { display: "none" } }}>
        <List>
          {requests.map((msg, index) => (
            <ListItem key={index} sx={{ justifyContent: msg.role === "user" ? "flex-end" : "flex-start", textAlign: msg.role === "user" ? "right" : "left", mb: 1 }}>
              <Paper sx={{
                p: 1.5, 
                borderRadius: 2, 
                bgcolor: msg.role === "user" ? theme.palette.primary.main : 
                          (msg.type === "text" ? "#ddd" : darkMode ? "#1E1E1E" : "#f5f5f5"), 
                color: msg.role === "user" ? "#fff" : 
                        (msg.type === "text" ? "#000" : darkMode ? "#fff" : "#000"),
                boxShadow: msg.role === "server" && msg.type !== "text" ? "none" : theme.shadows[1],
                minWidth: msg.role === "server" && msg.type !== "text" ? "50%" : "auto",
              }}>
                {msg.type === "code" ? <CodeMessage content={msg.content} /> :
                 msg.type === "link" ? <LinkMessage content={msg.content} /> :
                 msg.type === "folder" ? <FolderMessage content={msg.content} /> :
                 msg.type === "url" ? <UrlMessage content={msg.content} /> :
                 <ListItemText
                  primary={
                    msg.type === "text" ? (
                      <Typewriter
                        options={{
                          strings: [msg.content], 
                          autoStart: true,
                          delay: 50, 
                          cursor: "", 
                        }}
                      />
                    ) : msg.content
                  }/>}
              </Paper>
            </ListItem>
          ))}
          <div ref={messagesEndRef} />
        </List>
      </Paper>
      {/* ✅ 입력 필드 */}
      <Box sx={{ display: "flex", mt: 2 }}>
        <TextField 
          fullWidth 
          variant="outlined" 
          placeholder="메시지를 입력하세요..." 
          value={input} 
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSendRequest()}
          disabled={isLoading}  
        />
        <IconButton 
          color="primary" 
          onClick={handleSendRequest} 
          disabled={isLoading || input.trim() === ""} 
        >
          <Send />
        </IconButton>
      </Box>
    </Box>
  );
};

export default Chat;





