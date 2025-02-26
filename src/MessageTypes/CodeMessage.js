import React, { useContext } from "react";
import { Box } from "@mui/material";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { ThemeContext } from "../ThemeContext";
import { oneDark, oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import ReactMarkdown from "react-markdown";

const CodeMessage = ({ content }) => {
  const { darkMode } = useContext(ThemeContext);

  return (
    <Box>
      <ReactMarkdown>{`### </> 코드`}</ReactMarkdown>
      <SyntaxHighlighter language="javascript" style={darkMode ? oneDark : oneLight}>
        {content}
      </SyntaxHighlighter>
    </Box>
  );
};

export default CodeMessage;
