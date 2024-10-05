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
import { Container, Typography } from '@mui/material';
import { getAuth } from "firebase/auth";
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
  const auth = getAuth();

  useEffect(() => {
    const fetchOrders = async () => {
        const userId = auth.currentUser?.uid; // Get the current user's ID

        if (userId) {
          const ordersCollection = collection(db, "orders");
          const q = query(ordersCollection, where("userId", "==", userId)); // Query to filter by userId
          const ordersSnapshot = await getDocs(q);
          const ordersList = ordersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setOrders(ordersList);
        }
    };

    fetchOrders();
  }, [auth]);

  return (
    <Container style={{ marginTop: '20px' }}>
      <Typography variant="h4" style={{marginTop:'7vh',marginBottom:'4vh', textAlign:'center'}}>Order History</Typography>
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
            {orders.length===0?
            <>
            <StyledTableRow key={0}>
            <StyledTableCell>-</StyledTableCell>
            <StyledTableCell component="th" scope="row">
              -
            </StyledTableCell>
            <StyledTableCell>
              -
            </StyledTableCell>
            <StyledTableCell>
              -
            </StyledTableCell>
            <StyledTableCell>-</StyledTableCell>
          </StyledTableRow>
          </>
            :
            <>
            {orders.map(order => (
              <StyledTableRow key={order.id}>
                <StyledTableCell>{order.createdAt.toDate().toLocaleString()}</StyledTableCell>
                <StyledTableCell component="th" scope="row">
                  {order.id}
                </StyledTableCell>
                <StyledTableCell>
                  {order.items.map(item => item.name).join(', ')} {/* Display item names */}
                </StyledTableCell>
                <StyledTableCell>
                  {order.items.map(item => item.quantity).join(', ')} {/* Display item quantities */}
                </StyledTableCell>
                <StyledTableCell>{order.totalAmount}</StyledTableCell>
              </StyledTableRow>
            ))}
            </>}
          </TableBody>
        </Table>
      </TableContainer>
      {orders.length==0 && 
      <Typography variant='h6' style={{textAlign:'center',margin:'5vh 0'}}>No orders are placed yet! <Link to={'/menu'}>Click here to Order</Link></Typography>
      }
    </Container>
  );
};

export default OrderHistory;
