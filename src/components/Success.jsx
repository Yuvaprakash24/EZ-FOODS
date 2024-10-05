import { Button, Container, Typography } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebaseConfig'; // Adjust the import according to your file structure
import { collection, addDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth"; // Import Firebase Auth

const Success = () => {
  const orderProcessed = useRef(false); // Ref to track if the order has been processed
  const [userId, setUserId] = useState(null); // State to hold the user ID
  const auth = getAuth(); // Get the Firebase Auth instance

  useEffect(() => {
    // Set up an auth state listener
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid); // Set the user ID if authenticated
      } else {
        console.error("User is not authenticated."); // Log if user is not authenticated
      }
    });

    // Clean up the listener on unmount
    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    if (userId && !orderProcessed.current) {
      saveOrderToFirebase(userId); // Pass userId to saveOrderToFirebase
      orderProcessed.current = true; // Mark as processed after saving the order
    }
  }, [userId]);

  const saveOrderToFirebase = async (userId) => {
    const data = localStorage.getItem('cart');
    if (data) {
      const food = Object.values(JSON.parse(data)); // Convert the object to an array

      try {
        const orderData = {
          items: food,
          totalAmount: food.reduce((total, item) => total + (item.quantity * item.price), 0),
          createdAt: new Date(),
          userId: userId, // Include the userId in the order data
        };
        await addDoc(collection(db, "orders"), orderData);
        console.log("Order saved to Firebase:", orderData);
      } catch (error) {
        console.error("Error saving order:", error);
      }

      // Clear cart after saving
      localStorage.removeItem('cart');
      window.dispatchEvent(new Event('cartUpdated'));
    }
  };

  return (
    <div>
      <Container style={{ textAlign: 'center', margin: '7vh 0', marginLeft: 'auto', marginRight: 'auto' }}>
        <Typography variant='h4'>Payment Successful!</Typography>
        <Typography style={{ margin: '2vh 0' }}>
          Thank you for your purchase. Your payment was successfully processed.
        </Typography>
        <Link to="/">
          <Button variant='contained'>GO TO HOME</Button>
        </Link>
      </Container>
    </div>
  );
}

export default Success;
