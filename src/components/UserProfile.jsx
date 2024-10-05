import { useState, useEffect, useCallback } from 'react';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { TextField, Button, Box, Avatar, Typography, Container, CircularProgress } from '@mui/material';

function UserProfile() {
  const [profile, setProfile] = useState(null);
  const [editedProfile, setEditedProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();
  const db = getFirestore();

  const fetchUserProfile = useCallback(async (uid) => {
    setLoading(true);
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      const userData = userSnap.data();
      setProfile(userData);
      setEditedProfile(userData);
    } else {
      const defaultProfile = {
        displayName: '',
        email: '',
        phoneNumber: '',
        address: '',
        photoURL: '',
        favoriteCuisines: [],
      };
      setProfile(defaultProfile);
      setEditedProfile(defaultProfile);
    }
    setLoading(false);
  }, [db]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserProfile(user.uid);
      } else {
        setProfile(null);
        setEditedProfile(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [auth, fetchUserProfile]);

  const handleChange = (e) => {
    setEditedProfile(prevProfile => ({ ...prevProfile, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    if (auth.currentUser) {
      const userRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(userRef, editedProfile);
      setProfile(editedProfile);
      setIsEditing(false);
    }
  };

  const handleEdit = (e) => {
    e.preventDefault(); // Prevent any unintentional form submission
    setIsEditing(true);
  };

  if (loading) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (!profile) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography variant="h4" gutterBottom>
            Please log in to view your profile
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4,mb: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Avatar src={profile.photoURL} sx={{ width: 100, height: 100, mb: 2 }} />
        <Typography variant="h4" gutterBottom>
          User Profile
        </Typography>
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <TextField
            fullWidth
            margin="normal"
            name="displayName"
            label="Name"
            value={isEditing ? editedProfile.displayName || '' : profile.displayName || ''}
            onChange={handleChange}
            disabled={!isEditing}
          />
          <TextField
            fullWidth
            margin="normal"
            name="email"
            label="Email"
            value={profile.email || ''}
            disabled
          />
          <TextField
            fullWidth
            margin="normal"
            name="phoneNumber"
            label="Phone Number"
            value={isEditing ? editedProfile.phoneNumber || '' : profile.phoneNumber || ''}
            onChange={handleChange}
            disabled={!isEditing}
          />
          <TextField
            fullWidth
            margin="normal"
            name="address"
            label="Address"
            value={isEditing ? editedProfile.address || '' : profile.address || ''}
            onChange={handleChange}
            disabled={!isEditing}
          />
          <TextField
            fullWidth
            margin="normal"
            name="favoriteCuisines"
            label="favoriteCuisines"
            value={isEditing ? editedProfile.favoriteCuisines || [] : profile.favoriteCuisines || []}
            onChange={handleChange}
            disabled={!isEditing}
          />
          {isEditing ? (
            <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
              Save Changes
            </Button>
          ) : (
            <Button onClick={handleEdit} variant="contained" color="primary" sx={{ mt: 2 }}>
              Edit Profile
            </Button>
          )}
        </form>
      </Box>
    </Container>
  );
}

export default UserProfile;
