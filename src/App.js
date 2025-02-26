import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Join from './pages/Join';
import Main from './pages/Main';
import Chat from './components/Chat';
import { ThemeProviderWrapper } from "./ThemeContext";

function App() {
  return (
    <ThemeProviderWrapper>
      <Router>
        <Routes>
          {/* Main 레이아웃을 위한 중첩 라우트 */}
          <Route path="/" element={<Main />}>
            <Route index element={<Chat />} />  {/* /feed 경로에서 피드 표시 */}
          </Route>
        </Routes>
      </Router>
    </ThemeProviderWrapper>
  );
}

export default App;
