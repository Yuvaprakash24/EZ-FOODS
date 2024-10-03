import { Button, Container, Typography } from '@mui/material'
import { Link } from 'react-router-dom'
const Cancel = () => {
  return (
    <div>
      <Container style={{textAlign:'center',margin:'7vh 0',marginLeft:'auto',marginRight:'auto'}}>
        <Typography variant='h4'>Payment Cancelled</Typography>
        <Typography style={{margin:'2vh 0'}}>Your payment was cancelled. Please try again if you wish to complete the purchase.</Typography>
        <Link to="/cart"><Button variant='contained'>GO TO CART</Button></Link>
        </Container>
    </div>
  )
}

export default Cancel
