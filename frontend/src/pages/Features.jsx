import React from 'react';
import { Container, Typography, Box, Grid, Paper } from '@mui/material';
import { CheckCircle, Speed, Security, Support } from '@mui/icons-material';

const Features = () => {
  const features = [
    { icon: <CheckCircle sx={{ fontSize: 48, color: '#667eea' }} />, title: 'Easy to Use', desc: 'Intuitive interface that anyone can use' },
    { icon: <Speed sx={{ fontSize: 48, color: '#667eea' }} />, title: 'Fast Performance', desc: 'Lightning fast response times' },
    { icon: <Security sx={{ fontSize: 48, color: '#667eea' }} />, title: 'Secure', desc: 'Bank-level security for your data' },
    { icon: <Support sx={{ fontSize: 48, color: '#667eea' }} />, title: '24/7 Support', desc: 'Round the clock customer support' },
  ];

  return (
    <Box sx={{ position: 'relative', zIndex: 1, py: 8 }}>
      <Container maxWidth="lg">
        <Typography variant="h3" align="center" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
          Features
        </Typography>
        <Typography variant="h6" align="center" color="text.secondary" sx={{ mb: 6 }}>
          Everything you need to succeed
        </Typography>
        
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Paper sx={{ p: 4, textAlign: 'center', height: '100%', transition: 'transform 0.3s', '&:hover': { transform: 'translateY(-5px)' } }}>
                <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                <Typography variant="h5" gutterBottom>
                  {feature.title}
                </Typography>
                <Typography color="text.secondary">
                  {feature.desc}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Features;