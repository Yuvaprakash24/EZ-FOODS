import { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField, 
  Button, 
  Select, 
  MenuItem, 
  FormControlLabel, 
  Checkbox,
  InputLabel,
  FormControl,
} from '@mui/material';
import { collection, addDoc, doc, updateDoc } from "firebase/firestore";
import { db } from '../firebaseConfig';

const AddItemForm = ({ onClose, onSubmit, item }) => {
  const [formData, setFormData] = useState({
    name: '',
    typeofcourse: '',
    price: '',
    stock: '',
    img: '',
    veg_or_not: false
  });

  useEffect(() => {
    if (item) {
      setFormData(item);
    }
  }, [item]);

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: name === 'veg_or_not' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (item) {
        // Editing existing item
        await updateDoc(doc(db, "foods", item.id), formData);
      } else {
        // Adding new item
        await addDoc(collection(db, "foods"), formData);
      }
      onSubmit();  // Refresh the food list
      onClose();  // Close the form
    } catch (error) {
      console.error("Error saving document: ", error);
    }
  };

  return (
    <Dialog open={true} onClose={onClose}>
      <DialogTitle>{item ? 'Edit Item' : 'Add Item'}</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <TextField
            name="name"
            label="Name"
            fullWidth
            margin="normal"
            value={formData.name}
            onChange={handleChange}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Category</InputLabel>
            <Select
              name="typeofcourse"
              value={formData.typeofcourse}
              onChange={handleChange}
              label="Category"
            >
              <MenuItem value="Select Category" disabled>Select Category</MenuItem>
              <MenuItem value="Starters">Starters</MenuItem>
              <MenuItem value="Main Course">Main Course</MenuItem>
              <MenuItem value="Beverages">Beverages</MenuItem>
              <MenuItem value="Desserts">Desserts</MenuItem>
            </Select>
          </FormControl>
          <TextField
            name="price"
            label="Price"
            type="number"
            fullWidth
            margin="normal"
            value={formData.price}
            onChange={handleChange}
          />
          <TextField
            name="stock"
            label="Stock"
            type="number"
            fullWidth
            margin="normal"
            value={formData.stock}
            onChange={handleChange}
          />
          <TextField
            name="img"
            label="Image URL"
            fullWidth
            margin="normal"
            value={formData.img}
            onChange={handleChange}
          />
          <FormControlLabel
            control={
              <Checkbox
                name="veg_or_not"
                checked={formData.veg_or_not}
                onChange={handleChange}
              />
            }
            label="Vegetarian"
          />
          <DialogActions>
            <Button onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">
              {item ? 'Update' : 'Save'}
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddItemForm;