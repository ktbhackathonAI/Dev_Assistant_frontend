import React, { useContext } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { ThemeContext } from "../ThemeContext";
import { oneDark, oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import { CopyAll } from "@mui/icons-material"; // 복사 아이콘
import { CopyToClipboard } from "react-copy-to-clipboard"; // 클립보드 복사 기능
import ReactMarkdown from "react-markdown";

const CodeMessage = ({ content }) => {
  const { darkMode } = useContext(ThemeContext);

  // 복사 완료 메시지 상태
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // 2초 후 복사 상태 초기화
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" sx={{ fontWeight: 700 }}>
        {"</> 코드"}
      </Typography>
      <ReactMarkdown>{`---`}</ReactMarkdown>
      <Box sx={{ mt: 2, position: "relative" }}>
        <SyntaxHighlighter language="python" style={darkMode ? oneDark : oneLight}>
          {content}
        </SyntaxHighlighter>
        
        {/* 복사 버튼 추가 */}
        <CopyToClipboard text={content} onCopy={handleCopy}>
          <IconButton
            sx={{
              position: "absolute",
              top: 3,
              right: 3,     
              color: darkMode ? "#fff" : "#000",
              "&:hover": {
                backgroundColor: darkMode ? "#444" : "#e0e0e0",
              },
            }}
          >
            <CopyAll sx={{ fontSize: "20px" }}/>
          </IconButton>
        </CopyToClipboard>
        
        {/* 복사 완료 메시지 */}
        {copied && (
          <Typography
            sx={{
              position: "absolute",
              top: 5,
              right: 40,
              fontSize: "0.8rem",
              color: "green",
            }}
          >
            복사됨!
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default CodeMessage;
