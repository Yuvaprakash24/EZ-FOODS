import { Button, Container, Typography } from '@mui/material'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
const Success = () => {
    useEffect(()=>{
        localStorage.removeItem('cart');
        window.dispatchEvent(new Event('cartUpdated'));
    })
  return (
    <div>
        <Container style={{textAlign:'center',margin:'7vh 0',marginLeft:'auto',marginRight:'auto'}}>
        <Typography variant='h4'>Payment Successful!</Typography>
        <Typography style={{margin:'2vh 0'}}> Thank you for your purchase. Your payment was successfully processed.</Typography>
        <Link to="/"><Button variant='contained'>GO TO HOME</Button></Link>
        </Container>
    </div>
  )
}

export default Success