import React from 'react';
import { Avatar, Typography, Grid, Card, CardMedia } from '@mui/material';

function Profile() {
  const user = { name: 'John Doe', avatar: 'https://via.placeholder.com/150' };
  const posts = [
    { id: 1, image: 'https://via.placeholder.com/300' },
    { id: 2, image: 'https://via.placeholder.com/300' },
    { id: 3, image: 'https://via.placeholder.com/300' },
  ];

  return (
    <div style={{ padding: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
        <Avatar src={user.avatar} sx={{ width: 80, height: 80, mr: 2 }} />
        <Typography variant="h5">{user.name}</Typography>
      </div>
      <Grid container spacing={2}>
        {posts.map((post) => (
          <Grid item xs={4} key={post.id}>
            <Card>
              <CardMedia component="img" image={post.image} alt="Post" />
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

export default Profile;
