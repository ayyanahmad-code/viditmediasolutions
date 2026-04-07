import React from 'react';
import { Container, Typography, Box, Grid, Card, CardContent, Avatar, Rating } from '@mui/material';

const Testimonials = () => {
  const testimonials = [
    { name: 'John Doe', role: 'CEO, Company A', rating: 5, text: 'Excellent service! The team delivered beyond our expectations.' },
    { name: 'Jane Smith', role: 'Marketing Director', rating: 5, text: 'Very professional and responsive. Highly recommended!' },
    { name: 'Mike Johnson', role: 'Business Owner', rating: 4, text: 'Great experience working with them. Will definitely use again.' },
    { name: 'Sarah Williams', role: 'Product Manager', rating: 5, text: 'Outstanding quality and support throughout the project.' },
  ];

  return (
    <Box sx={{ position: 'relative', zIndex: 1, py: 8 }}>
      <Container maxWidth="lg">
        <Typography variant="h3" align="center" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
          What Our Clients Say
        </Typography>
        <Typography variant="h6" align="center" color="text.secondary" sx={{ mb: 6 }}>
          Don't just take our word for it - hear from our satisfied clients
        </Typography>
        
        <Grid container spacing={4}>
          {testimonials.map((testimonial, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                    <Avatar sx={{ bgcolor: '#667eea', width: 56, height: 56 }}>
                      {testimonial.name.charAt(0)}
                    </Avatar>
                  </Box>
                  <Rating value={testimonial.rating} readOnly sx={{ mb: 2, justifyContent: 'center', display: 'flex' }} />
                  <Typography variant="body2" paragraph align="center">
                    "{testimonial.text}"
                  </Typography>
                  <Typography variant="subtitle1" align="center" fontWeight="bold">
                    {testimonial.name}
                  </Typography>
                  <Typography variant="caption" align="center" display="block" color="text.secondary">
                    {testimonial.role}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Testimonials;