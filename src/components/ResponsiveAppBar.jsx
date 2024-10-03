import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import Badge from '@mui/material/Badge';
import { Link } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { getAuth, signOut, signInWithPopup, GoogleAuthProvider } from "firebase/auth";


const pages = [
  { label: 'Menu', link: '/menu' },
  { label: 'About', link: '/about' },
  { label: 'Contact', link: '/contact' },
];

const StyledBadge = styled(Badge)(() => ({
  '& .MuiBadge-badge': {
    right: -1,
    top: 1,
    padding: '0 4px',
  },
}));

function ResponsiveAppBar() {
  const provider = new GoogleAuthProvider();
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const auth = getAuth();
  const [name, setName] = React.useState({ displayName: '', photoURL: '' });
  const [cartQuantity, setCartQuantity] = React.useState(0);

  const signup = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        setName({ displayName: user.displayName, photoURL: user.photoURL });
        localStorage.setItem("user", JSON.stringify(user));
      })
      .catch((error) => {
        console.log(error.message);
      });
  }

  const logout = () => {
    signOut(auth).then(() => {
      localStorage.removeItem('user');
      setName({ displayName: '', photoURL: '' });
    }).catch((error) => {
      console.log(error);
    });
  }

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const updateCartQuantity = () => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      const cartItems = JSON.parse(storedCart);
      const totalQuantity = Object.values(cartItems).reduce((sum, item) => sum + item.quantity, 0);
      setCartQuantity(totalQuantity);
    } else {
      setCartQuantity(0); // Set to 0 if cart is empty
    }
  };

  React.useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const name = JSON.parse(storedUser);
      setName({ displayName: name.displayName, photoURL: name.photoURL });
    }
    // updateCartQuantity(); // Initial cart quantity check

    // // Set up a storage event listener to update cart quantity
    // const handleStorageChange = (event) => {
    //   if (event.key === 'cart') {
    //     updateCartQuantity();
    //   }
    // };

    // window.addEventListener('storage', handleStorageChange);

    // // Clean up the event listener on unmount
    // return () => {
    //   window.removeEventListener('storage', handleStorageChange);
    // };
    updateCartQuantity(); // Initial cart quantity check

    // Set up event listeners
    window.addEventListener('cartUpdated', updateCartQuantity);
    window.addEventListener('storage', (event) => {
      if (event.key === 'cart') {
        updateCartQuantity();
      }
    });

    // Clean up event listeners on unmount
    return () => {
      window.removeEventListener('cartUpdated', updateCartQuantity);
      window.removeEventListener('storage', updateCartQuantity);
    };
  }, []);

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <FastfoodIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            <Link to="/" className="hrefs" style={{ color: 'inherit', textDecoration: 'none' }}>
              EZFOODS
            </Link>
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: 'block', md: 'none' } }}
            >
              {pages.map((page) => (
                <MenuItem key={page.label} onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">
                    <Link to={page.link} style={{ color: 'inherit', textDecoration: 'none' }}>
                      {page.label}
                    </Link>
                  </Typography>
                </MenuItem>
              ))}
              {name.displayName && (
              <Button
                key="AdminDashboard"
                component={Link}
                to="/admin-dashboard"
                onClick={handleCloseNavMenu}
                size='small'
                style={{ color: 'black', textDecoration: 'none', display: "flex", justifyContent: 'center' }}
              >
                Admin
              </Button>
            )}
            </Menu>
          </Box>
          <FastfoodIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="div"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            EZFOODS
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page.label}
                component={Link}
                to={page.link}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {page.label}
              </Button>
            ))}
            {name.displayName && (
              <Button
                key="AdminDashboard"
                component={Link}
                to="/admin-dashboard"
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                Admin
              </Button>
            )}
          </Box>
          {name.displayName ? (
            <div style={{ display: "flex" }}>
              <IconButton aria-label="cart" style={{ marginRight: "15px" }}>
                <StyledBadge badgeContent={cartQuantity} color="error">
                  <Link to="/cart"><ShoppingCartIcon style={{ color: "whitesmoke", textDecoration: "none" }} /></Link>
                </StyledBadge>
              </IconButton>
              <Box sx={{ flexGrow: 0 }}>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar alt={name.displayName} src={name.photoURL} />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: '45px' }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  <MenuItem onClick={handleCloseUserMenu}>
                    <Typography textAlign="center">Profile</Typography>
                  </MenuItem>
                  <MenuItem onClick={handleCloseUserMenu}>
                    <Typography textAlign="center">Account</Typography>
                  </MenuItem>
                  <MenuItem onClick={handleCloseUserMenu}>
                    <Typography textAlign="center">Dashboard</Typography>
                  </MenuItem>
                  <MenuItem onClick={handleCloseUserMenu}>
                    <Button onClick={logout} variant='contained' size='medium' color="error">LOGOUT</Button>
                  </MenuItem>
                </Menu>
              </Box>
            </div>
          ) : (
            <Button variant='contained' onClick={signup}>LOGIN</Button>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default ResponsiveAppBar;
