import React from "react";
import { Box, Typography } from "@mui/material";
import { Paper } from "@mui/material";
import ReactMarkdown from "react-markdown";
import Typewriter from "typewriter-effect";

const UrlMessage = ({ content }) => (
  <Box sx={{ mt: 3 }}>
  <Typography variant="h6" sx={{ fontWeight: 700 }}>
    {"🚀 기본 API 엔드포인트"}
  </Typography>
  <ReactMarkdown>{`---`}</ReactMarkdown>

  <Typography component="pre" sx={{mt:2}}>
    {content}
  </Typography>
</Box>
);

export default UrlMessage;