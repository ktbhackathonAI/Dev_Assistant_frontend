import React, { useContext } from "react";
import { Box, Typography } from "@mui/material";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { ThemeContext } from "../ThemeContext";
import { oneDark, oneLight, prism } from "react-syntax-highlighter/dist/esm/styles/prism";
import ReactMarkdown from "react-markdown";

const FolderMessage = ({ content }) => {
  const { darkMode } = useContext(ThemeContext);

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" sx={{ fontWeight: 700 }}>
          {"📂 폴더 구조"}
      </Typography>
       <ReactMarkdown>{`---`}</ReactMarkdown>
       <Box sx={{ mt: 2 }}>
        <SyntaxHighlighter language="plaintext" style={darkMode ? oneDark : oneLight}>
          {content}
        </SyntaxHighlighter>
      </Box>
    </Box>
  );
};

export default FolderMessage;
