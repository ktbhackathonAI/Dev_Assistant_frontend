import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Link,
  Alert,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

const Join = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isProfileEdit = location.pathname === '/profile-edit'; // ✅ 프로필 수정 모드 여부

  const [userId, setUserId] = useState(null); // ✅ 사용자 ID 저장
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // ✅ 입력 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // ✅ 프로필 수정 모드일 경우 기존 데이터 불러오기
  useEffect(() => {
    if (isProfileEdit) {
      const fetchUserData = async () => {
        setLoading(true);
        try {
          const token = localStorage.getItem('token');
          const response = await fetch('http://localhost:4000/api/auth/me', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          if (response.ok) {
            const data = await response.json();
            setUserId(data.id); // ✅ 사용자 ID 저장
            setFormData({
              email: data.email || '',
              username: data.username || '',
              password: '', // 비밀번호는 빈 값 유지 (보안)
            });
          } else {
            alert('사용자 정보를 불러오지 못했습니다.');
            navigate('/feed');
          }
        } catch (error) {
          alert('서버 오류가 발생했습니다.');
        } finally {
          setLoading(false);
        }
      };

      fetchUserData();
    }
  }, [isProfileEdit, navigate]);

  // ✅ 유효성 검사 함수
  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = '이메일을 입력해주세요.';
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = '유효한 이메일을 입력해주세요.';
    if (!formData.username) newErrors.username = '아이디를 입력해주세요.';
    if (isProfileEdit && formData.password && formData.password.length < 6)
      newErrors.password = '비밀번호는 최소 6자 이상이어야 합니다.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ 회원가입 / 계정 수정 요청
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const url = isProfileEdit
        ? `http://localhost:4000/api/auth/users/${userId}` // ✅ 계정 수정 API
        : 'http://localhost:4000/api/auth/register'; // ✅ 회원가입 API

      const method = isProfileEdit ? 'PATCH' : 'POST';
      const token = localStorage.getItem('token');

      const body = isProfileEdit
        ? JSON.stringify({
            username: formData.username,
            email: formData.email,
            ...(formData.password && { password: formData.password }), // ✅ 비밀번호는 변경 시에만 포함
          })
        : JSON.stringify(formData);
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': isProfileEdit ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body,
      });

      if (response.ok) {
        setSuccessMessage(isProfileEdit ? '계정이 성공적으로 수정되었습니다!' : '회원가입 성공!');
        setTimeout(() => navigate(isProfileEdit ? '/feed' : '/login'), 2000); // ✅ 완료 후 이동
      } else {
        const data = await response.json();
        setErrorMessage(data.message || '요청을 처리하는 데 실패했습니다.');
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
      <Box sx={{ width: '100%', textAlign: 'center', mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          {isProfileEdit ? '계정 수정' : '회원가입'}
        </Typography>
        {!isProfileEdit && (
          <Typography variant="body2" color="text.secondary">
            이미 계정이 있으신가요?{' '}
            <Link href="/login" underline="hover">
              로그인
            </Link>
          </Typography>
        )}
      </Box>

      {successMessage && <Alert severity="success">{successMessage}</Alert>}
      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

      {/* 회원가입 / 계정 수정 폼 */}
      <Box component="form" sx={{ width: '100%', display: 'flex', flexDirection: 'column' }} onSubmit={handleSubmit}>
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
          label="아이디 (Username)"
          variant="outlined"
          fullWidth
          margin="normal"
          name="username"
          value={formData.username}
          onChange={handleChange}
          error={!!errors.username}
          helperText={errors.username}
        />
        <TextField
          label="비밀번호 (변경 시 입력)"
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
        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }} disabled={loading}>
          {loading ? '처리 중...' : isProfileEdit ? '계정 수정' : '회원가입'}
        </Button>
      </Box>
    </Container>
  );
};

export default Join;
