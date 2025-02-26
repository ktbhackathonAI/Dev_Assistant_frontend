import React, { useState, useContext, useRef, useEffect } from "react";
import { Box, TextField, IconButton, List, ListItem, ListItemText, Paper, Typography, Link } from "@mui/material";
import { Send } from "@mui/icons-material";
import { ThemeContext } from "../ThemeContext";
import { useTheme } from "@mui/material/styles";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark} from 'react-syntax-highlighter/dist/esm/styles/prism';

const ProjectCreation = () => {
  const { darkMode } = useContext(ThemeContext);
  const theme = useTheme();
  const [requests, setRequests] = useState([]); 
  const [input, setInput] = useState(""); 
  const [step, setStep] = useState(0); 
  const [projectName, setProjectName] = useState(""); 
  const [isServerTyping, setIsServerTyping] = useState(false); 
  const messagesEndRef = useRef(null);

  // GitHub 프로젝트 생성 시뮬레이션
  const generateProjectResponse = (name) => [
    { text: `✅ **"${name}" 프로젝트가 GitHub에 생성되었습니다!**`, sender: "system" },
    { text: "📂 **폴더 구조:**", sender: "system" },
    { text: (
      <pre style={{ backgroundColor: "#272822", color: "#FFF", padding: "10px", borderRadius: "5px" }} >
        {`├── src/
│   ├── app.js
│   ├── routes/
│   │   ├── api.js
├── package.json`}
      </pre>
    ), sender: "system" },
    { text: "🚀 **기본 API 엔드포인트:**", sender: "system" },
    { text: (
      <pre style={{ backgroundColor: "#272822", color: "#FFF", padding: "10px", borderRadius: "5px" }} >
        {`GET /api/${name}/status → 서버 상태 확인
POST /api/${name}/data → 데이터 저장`}
      </pre>
    ), sender: "system" },
    { text: <SyntaxHighlighter language="javascript" style={oneDark}>{`// exampleCode.js\nconst express = require("express");\nconst app = express();\n\napp.get("/", (req, res) => {\n  res.send("Hello, World!");\n});\n\napp.listen(3000, () => {\n  console.log("Server running on port 3000");\n});`}</SyntaxHighlighter>, sender: "system" },
    { text: (
      <Typography variant="body1">
        🔗 **GitHub Repository:** <Link href={`https://github.com/user/${projectName}`} target="_blank" rel="noopener noreferrer">
          https://github.com/user/{projectName}
        </Link>
      </Typography>
    ), sender: "system" },
  ];

  // 프로젝트 요청 전송
  const handleSendRequest = () => {
    if (input.trim() === "") return;

    setRequests([...requests, { text: input, sender: "user" }]);

    if (step === 0) {
      setTimeout(() => {
        setRequests((prev) => [...prev, { text: "✅ 프로젝트 이름을 입력하세요.", sender: "system" }]);
      }, 500);
      setStep(1);
    } else if (step === 1) {
      setProjectName(input);
      setTimeout(() => {
        setRequests((prev) => [...prev, { text: "📦 사용할 기술 스택을 입력하세요. (예: Node.js, Express, MongoDB)", sender: "system" }]);
      }, 500);
      setStep(2);
    } else if (step === 2) {
      setIsServerTyping(true); // 서버 타이핑 시작
      setTimeout(() => {
        setRequests((prev) => [...prev, { text: "🛠 프로젝트를 GitHub에 생성하는 중...", sender: "system" }]);
      }, 500);
      setTimeout(() => {
        setRequests((prev) => [...prev, { text: "🚀 **예제 코드:**" }]);
        setRequests((prev) => [...prev, ...generateProjectResponse(projectName)]);
        setIsServerTyping(false); 
      }, 2000);
      setStep(0);
    }

    setInput("");
  };

  // 자동 스크롤
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [requests]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "calc(100vh - 40px)", bgcolor: theme.palette.background.default, color: theme.palette.text.primary, p: 2, mt: 2, mb: 2 }}>
      {/* 채팅 내역 */}
      <Paper sx={{ flexGrow: 1, overflowY: "auto", p: 2, borderRadius: 2, bgcolor: darkMode ? "#1E1E1E" : "#f5f5f5", "&::-webkit-scrollbar": { display: "none" } }}>
        <List>
          {requests.map((msg, index) => (
            <ListItem key={index} sx={{ justifyContent: msg.sender === "user" ? "flex-end" : "flex-start", textAlign: msg.sender === "user" ? "right" : "left", mb: 1 }}>
              <Paper sx={{ p: 1.5, borderRadius: 2, bgcolor: msg.sender === "user" ? theme.palette.primary.main : "#ddd", color: msg.sender === "user" ? "#fff" : "#000" }}>
                {typeof msg.text === "string" ? <ListItemText primary={msg.text} /> : msg.text}
              </Paper>
            </ListItem>
          ))}
          <div ref={messagesEndRef} />
        </List>
      </Paper>

      {/* 프로젝트 입력창 */}
      <Box sx={{ display: "flex", mt: 2, p: 1, borderRadius: 2, bgcolor: theme.palette.background.paper }}>
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
        <IconButton color="primary" onClick={handleSendRequest} sx={{ ml: 1 }} disabled={!input.trim() || isServerTyping}>
          <Send />
        </IconButton>
      </Box>
    </Box>
  );
};

export default ProjectCreation;


