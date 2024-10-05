import { useState } from 'react';
import { TextField, Button, Grid, Select, MenuItem, FormControl, InputLabel, Typography, TextareaAutosize, Box } from '@mui/material';
import { Map, Home, Phone, Email } from '@mui/icons-material';
import { db } from '../firebaseConfig'; // Import Firestore instance
import { collection, addDoc } from 'firebase/firestore'; // Firestore functions

const Contact = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    subject: '',
    category: '',
    message: ''
  });

  const [loading, setLoading] = useState(false); // To manage loading state
//   const [success, setSuccess] = useState(false); // To manage success state

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Add a new document with formData in 'contacts' collection
      await addDoc(collection(db, 'contacts'), {
        fullName: formData.fullName,
        email: formData.email,
        subject: formData.subject,
        category: formData.category,
        message: formData.message,
        timestamp: new Date(), // You can add a timestamp as well
      });
      setLoading(false);
      alert("Your message has been sent successfully!");// Set success state to true
      setFormData({
        fullName: '',
        email: '',
        subject: '',
        category: '',
        message: ''
      })
    } catch (error) {
      console.error('Error adding document: ', error);
      setLoading(false);
    }
  };

  return (
    <Box sx={{ padding: 5 }}>
      <Typography variant="h4" gutterBottom>Get in Touch</Typography>
      <Typography variant="body1" gutterBottom>
        If you have any questions or need help, please fill out the form below. We do our best to respond within 1 business day.
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Full Name"
              id="fullName"
              placeholder="Enter your full name..."
              variant="outlined"
              value={formData.fullName}
              onChange={handleChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Email Address"
              id="email"
              placeholder="Enter your email address..."
              variant="outlined"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Subject"
              id="subject"
              placeholder="Enter a subject..."
              variant="outlined"
              value={formData.subject}
              onChange={handleChange}
              margin="normal"
            />
            <FormControl fullWidth margin="normal">
              <InputLabel id="category-label">Category</InputLabel>
              <Select
                labelId="category-label"
                id="category"
                value={formData.category}
                onChange={(e) => handleChange({ target: { id: 'category', value: e.target.value } })}
                label="Category"
              >
                <MenuItem value="">
                  <em>Select a category...</em>
                </MenuItem>
                <MenuItem value="General Inquiry">General Inquiry</MenuItem>
                <MenuItem value="Support">Support</MenuItem>
                <MenuItem value="Feedback">Feedback</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <TextareaAutosize
                minRows={5}
                placeholder="Enter your message..."
                style={{ width: '100%', padding: '15px', borderColor: '#ccc', borderRadius: '4px' }}
                value={formData.message}
                onChange={(e) => handleChange({ target: { id: 'message', value: e.target.value } })}
              />
              <Typography variant="caption" color="textSecondary">
                Message has to be minimum 40 characters.
              </Typography>
            </FormControl>

            <Button variant="contained" color="primary" type="submit" disabled={loading}>
              {loading ? 'Sending...' : 'Send Message'}
            </Button>

            {/* {success && (
              <Typography variant="body2" color="success.main" sx={{ mt: 2 }}>
                Your message has been sent successfully!
              </Typography>
            )} */}
          </form>

          <Typography variant="caption" display="block" color="textSecondary" sx={{ mt: 3 }}>
            Protected by hCaptcha (<a href="#">Privacy Policy</a> - <a href="#">Terms of Service</a>)
          </Typography>
        </Grid>

        <Grid item xs={12} md={4} sx={{ mt: 4 }}>
          <Box sx={{ mb: 3 }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d243647.25176871577!2d78.40804555!3d17.4123487!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb99daeaebd2c7%3A0xae93b78392bafbc2!2sHyderabad%2C%20Telangana!5e0!3m2!1sen!2sin!4v1720530015254!5m2!1sen!2sin"
              width="100%"
              height="250"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Home sx={{ mr: 1 }} />
            <Typography>Hyderabad, Telangana, India 500092</Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Phone sx={{ mr: 1 }} />
            <Typography>+91 944 035 6328 (Mon to Fri 9am to 6pm)</Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Email sx={{ mr: 1 }} />
            <Typography>yuvaprakashsai@gmail.com</Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Contact;
