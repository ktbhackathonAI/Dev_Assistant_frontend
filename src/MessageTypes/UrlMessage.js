import React from "react";
import { Box } from "@mui/material";
import { Paper, Typography } from "@mui/material";
import ReactMarkdown from "react-markdown";

const UrlMessage = ({ content }) => (
  <Box>
    <ReactMarkdown>{`### 🚀 기본 API 엔드포인트`}</ReactMarkdown>
    <ReactMarkdown>{`---`}</ReactMarkdown>
    <Typography component="pre">{content}</Typography>
  </Box>
);

export default UrlMessage;