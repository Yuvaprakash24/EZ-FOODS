import { useEffect, useState } from 'react';
import { db } from '../firebaseConfig'; // Adjust the import according to your file structure
import { collection, getDocs, query, where } from "firebase/firestore";
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Container, Typography, CircularProgress, Box } from '@mui/material';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Link } from 'react-router-dom';

// Styled components
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userId = user.uid; // Get the current user's ID
        console.log("User ID:", userId); // Debugging line

        const ordersCollection = collection(db, "orders");
        const q = query(ordersCollection, where("userId", "==", userId)); // Query to filter by userId
        const ordersSnapshot = await getDocs(q);
        const ordersList = ordersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        console.log("Fetched Orders:", ordersList); // Debugging line
        setOrders(ordersList);
      } else {
        console.log("User is not authenticated."); // Debugging line
      }
      setLoading(false); // Set loading to false after fetching data
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, [auth]);

  if (loading) {
    return (
        <Container maxWidth="sm">
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <CircularProgress />
          </Box>
        </Container>
      );
  }

  return (
    <Container style={{ marginTop: '20px' }}>
      <Typography variant="h4" style={{ marginTop: '7vh', marginBottom: '4vh', textAlign: 'center' }}>Order History</Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Ordered Date</StyledTableCell>
              <StyledTableCell>Order ID</StyledTableCell>
              <StyledTableCell>Items</StyledTableCell>
              <StyledTableCell>Quantities</StyledTableCell>
              <StyledTableCell>Total Amount (₹)</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.length === 0 ? (
              <StyledTableRow>
                <StyledTableCell>-</StyledTableCell>
                <StyledTableCell component="th" scope="row">-</StyledTableCell>
                <StyledTableCell>-</StyledTableCell>
                <StyledTableCell>-</StyledTableCell>
                <StyledTableCell>-</StyledTableCell>
              </StyledTableRow>
            ) : (
              orders.map(order => (
                <StyledTableRow key={order.id}>
                  <StyledTableCell>{order.createdAt.toDate().toLocaleString()}</StyledTableCell>
                  <StyledTableCell component="th" scope="row">{order.id}</StyledTableCell>
                  <StyledTableCell>{order.items.map(item => item.name).join(', ')}</StyledTableCell>
                  <StyledTableCell>{order.items.map(item => item.quantity).join(', ')}</StyledTableCell>
                  <StyledTableCell>{order.totalAmount}</StyledTableCell>
                </StyledTableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {orders.length === 0 && (
        <Typography variant='h6' style={{ textAlign: 'center', margin: '5vh 0' }}>
          No orders are placed yet! <Link to={'/menu'}>Click here to Order</Link>
        </Typography>
      )}
    </Container>
  );
};

export default OrderHistory;
