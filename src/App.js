import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Main from './pages/Main';
import Chat from './components/Chat';  // 대화방 메시지 컴포넌트
import RoomList from './components/RoomList';  // 대화방 목록 컴포넌트
import { ThemeProviderWrapper } from "./ThemeContext";

function App() {
  return (
    <ThemeProviderWrapper>
      <Router>
        <Routes>
          {/* Main 레이아웃을 위한 중첩 라우트 */}
          <Route path="/" element={<Main />}>
            {/* 대화방 목록 표시 */}
            <Route path="rooms" element={<RoomList />} />
            {/* 대화방 메시지 표시 */}
            <Route path="rooms/:roomId" element={<Chat />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProviderWrapper>
  );
}

export default App;
