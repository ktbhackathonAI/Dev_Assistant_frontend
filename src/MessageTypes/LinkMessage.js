import React, { useContext } from "react";
import { Link, Box, Typography } from "@mui/material";
import { ThemeContext } from "../ThemeContext";
import ReactMarkdown from "react-markdown";
import githubDark from "../assets/image/githubdark.svg"; 
import githubLight from "../assets/image/githublight.svg"; 

const LinkMessage = ({ content }) => {
    const { darkMode } = useContext(ThemeContext);

    return(
        <Box sx={{ mt: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box
                component="img"
                src={darkMode ? githubLight : githubDark}
                alt="GitHub Logo"
                sx={{ width: 28, height: 28, mr: 1}}
            />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {"깃허브 주소"}
            </Typography>
            </Box>
            <ReactMarkdown>{`---`}</ReactMarkdown>
            <ReactMarkdown
            components={{
                a: ({ node, ...props }) => (
                <Link
                    {...props}
                    sx={{
                        mt:2,
                        color: darkMode ? "#fff" : "#1976d2", 
                        textDecoration: "none",
                        ":hover": { textDecoration: "underline" }
                    }}
                />
                ),
            }}
            >
            {`🔗 [${content}](${content})`}
            </ReactMarkdown>
        </Box>
    );
};

export default LinkMessage;

