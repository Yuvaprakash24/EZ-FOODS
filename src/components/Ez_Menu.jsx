import { Typography, Box, FormControl, InputLabel, Select, MenuItem, Switch, Button, CardMedia, FormControlLabel, TextField, Card, CardContent } from '@mui/material';
import { useEffect, useState } from 'react';
import { collection, getDocs } from "firebase/firestore";
import { db, auth } from '../firebaseConfig';
import { onAuthStateChanged } from "firebase/auth";
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

const Ez_Menu = () => {
  const [selection, setSelect] = useState('');
  const [search, setSearch] = useState('');
  const [Veg, setVeg] = useState(true);
  const [filterfoods, setFilter] = useState([]);
  const [cart, setCart] = useState({}); // Initialize cart state
  const [foods, setFoods] = useState([]);

  const setv = () => {
    setVeg(!Veg);
    fliteritems(selection, !Veg, search);
  };

  const handleChange = (event) => {
    setSelect(event.target.value);
    fliteritems(event.target.value, Veg, search);
  };

  const searching = (e) => {
    setSearch(e.target.value);
    fliteritems(selection, Veg, e.target.value);
  };

  const fliteritems = (e1, e2, e3) => {
    const filterlist = foods.filter((ele) => {
      return (
        ele.name.toLowerCase().includes(e3.toLowerCase()) &&
        (ele.typeofcourse === e1 || e1 === "") &&
        (ele.veg_or_not === true || e2 === true)
      );
    });
    setFilter(filterlist);
  };

  const fetchFood = async () => {
    let foodArray = [];
    const querySnapshot = await getDocs(collection(db, "foods"));
    querySnapshot.forEach((doc) => {
      foodArray.push(doc.data());
    });
    setFoods(foodArray);
    setFilter(foodArray);
  };

  // const setCount = (item) => {
  //   setCart((prev) => {
  //     const currentItem = prev[item.name] || { ...item, quantity: 0 };
  //     if (currentItem.quantity + 1 > currentItem.stock) {
  //       alert(`Can't add more than ${item.stock} units of ${item.name}.`);
  //       return prev;
  //     } else {
  //       const newCart = {
  //         ...prev,
  //         [item.name]: { ...currentItem, quantity: currentItem.quantity + 1 },
  //       };
  //       localStorage.setItem('cart', JSON.stringify(newCart)); // Update local storage
  //       return newCart; // Update state
  //     }
  //   });
  // };

  // const subCount = (item) => {
  //   setCart((prev) => {
  //     const currentItem = prev[item.name];
  //     // If item does not exist, return previous state
  //     if (!currentItem) return prev;

  //     // Decrease the quantity
  //     const newQuantity = currentItem.quantity - 1;

  //     // If new quantity is zero, remove the item from the cart
  //     if (newQuantity <= 0) {
  //       const { [item.name]: _, ...rest } = prev; // Remove item from cart
  //       localStorage.setItem('cart', JSON.stringify(rest)); // Update local storage
  //       return rest; // Return updated cart
  //     }

  //     // Update the quantity of the item
  //     const updatedCart = {
  //       ...prev,
  //       [item.name]: { ...currentItem, quantity: newQuantity },
  //     };
  //     localStorage.setItem('cart', JSON.stringify(updatedCart)); // Update local storage
  //     return updatedCart; // Update state
  //   });
  // };


  const updateCartAndNotify = (newCart) => {
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
    // Dispatch a custom event to notify other components
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const [user, setUser] = useState(null); // Replace with actual user data or context
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
  
    return () => unsubscribe(); // Cleanup the listener on component unmount
  }, []);
  const setCount = (item) => {
    if (user) { // Check if the user is logged in
      const currentItem = cart[item.name] || { ...item, quantity: 0 };
      if (currentItem.quantity + 1 > item.stock) {
        alert(`Can't add more than ${item.stock} units of ${item.name}.`);
      } else {
        const newCart = {
          ...cart,
          [item.name]: { ...currentItem, quantity: currentItem.quantity + 1 },
        };
        updateCartAndNotify(newCart);
      }
    } else {
      alert("Please log in to add items to the cart.");
    }
  };
  const subCount = (item) => {
    const currentItem = cart[item.name];
    if (!currentItem) return;

    const newQuantity = currentItem.quantity - 1;
    if (newQuantity <= 0) {
      const { [item.name]: _, ...rest } = cart;
      updateCartAndNotify(rest);
    } else {
      const updatedCart = {
        ...cart,
        [item.name]: { ...currentItem, quantity: newQuantity },
      };
      updateCartAndNotify(updatedCart);
    }
  };

  useEffect(() => {
    fetchFood();
    fliteritems(selection, Veg, search);
    
    // Retrieve cart from local storage on component mount
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  return (
    <>
      <div className='menu__container'>
        <Typography variant='h4' component="h3">Menu</Typography><br />
        <div className='menu__properties'>
          <Box sx={{ minWidth: 120, mr: { lg: '2rem', md: '2rem' } }}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Category</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={selection}
                label="Category"
                onChange={handleChange}
              >
                <MenuItem value={""}>All Categories</MenuItem>
                <MenuItem value={"Starters"}>Starters</MenuItem>
                <MenuItem value={"Main course"}>Main Course</MenuItem>
                <MenuItem value={"Beverages"}>Beverages</MenuItem>
                <MenuItem value={"Deserts"}>Deserts</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <FormControlLabel onChange={setv} value={Veg} sx={{ mr: { lg: '2rem', md: '2rem' } }} control={<Switch />} label="Vegetarian Only" />
          <TextField onChange={searching} value={search} label="Search by Name" />
        </div>
      </div>

      <div className="menu__items__list">
        {filterfoods.map((item) => {
          const count = cart[item.name]?.quantity || 0; // Get the current count for the item
          return (
            <Card key={item.name} sx={{ maxWidth: 345 }} className='menu__items__card'>
              <CardContent>
                <CardMedia component="img" height="200" image={item.img} alt={item.name} />
                <Typography variant='h5' sx={{ paddingTop: 2 }}>{item.name}</Typography>
                <Typography variant="caption" sx={{ color: 'grey.700' }}>{item.typeofcourse}</Typography><br />
                <Typography variant="caption" sx={{ color: 'grey.700' }}>{item.veg_or_not ? "Vegetarian" : "Non-Vegetarian"}</Typography><br />
                <Typography variant="caption" sx={{ color: 'grey.700' }}>Stock: {item.stock}</Typography>
                <Typography variant='h5' sx={{ paddingBottom: 2 }}>₹ {item.price}</Typography>
                {count > 0 ? (
                  <div style={{display:"flex"}}>
                  <IconButton size='small' sx={{ color: 'grey.700' }}  onClick={()=>subCount(item)}><RemoveIcon/></IconButton><Typography variant="body1"> {count} <IconButton size='small' sx={{ color: 'grey.700' }} onClick={()=>setCount(item)}><AddIcon/></IconButton></Typography>
                  </div>
                ) : (
                  <Button variant="contained" onClick={() => setCount(item)}>ADD TO CART</Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </>
  );
};

export default Ez_Menu;
