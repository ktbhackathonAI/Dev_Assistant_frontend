import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Link,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate(); // 페이지 이동 Hook
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // 유효성 검사 함수
  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = '이메일을 입력해주세요.';
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = '유효한 이메일을 입력해주세요.';
    if (!formData.password) newErrors.password = '비밀번호를 입력해주세요.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 로그인 API 요청
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setErrorMessage('');

    try {
      const response = await fetch('http://localhost:4000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token); // ✅ 토큰 저장
        alert('로그인 성공!');
        navigate('/feed'); // ✅ 로그인 후 /feed 페이지로 이동
      } else {
        setErrorMessage(data.error || '로그인 실패! 이메일 또는 비밀번호를 확인해주세요.');
      }
    } catch (error) {
      setErrorMessage('서버 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      maxWidth="xs"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
      }}
    >
      <Box
        sx={{
          width: '100%',
          textAlign: 'center',
          mb: 4,
        }}
      >
        <Typography variant="h4" gutterBottom>
          로그인
        </Typography>
        <Typography variant="body2" color="text.secondary">
          계정이 없으신가요?{' '}
          <Link href="/signup" underline="hover">
            회원가입
          </Link>
        </Typography>
      </Box>

      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

      {/* 로그인 폼 */}
      <Box
        component="form"
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
        onSubmit={handleLogin}
      >
        <TextField
          label="이메일"
          variant="outlined"
          fullWidth
          margin="normal"
          name="email"
          value={formData.email}
          onChange={handleChange}
          error={!!errors.email}
          helperText={errors.email}
        />
        <TextField
          label="비밀번호"
          variant="outlined"
          fullWidth
          margin="normal"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          error={!!errors.password}
          helperText={errors.password}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
          disabled={loading}
        >
          {loading ? '로그인 중...' : '로그인'}
        </Button>
      </Box>
      {/* 비밀번호 찾기 */}
      <Box sx={{ mt: 2, textAlign: 'center' }}>
        <Link href="/forgot-password" underline="hover">
          비밀번호를 잊으셨나요?
        </Link>
      </Box>
    </Container>
  );
};

export default LoginPage;
