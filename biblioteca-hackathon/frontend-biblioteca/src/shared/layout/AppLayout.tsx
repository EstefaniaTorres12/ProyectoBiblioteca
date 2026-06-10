import { AppBar, Box, Button, Container, Toolbar, Typography } from '@mui/material';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';

const navLinkSx = { '&.active': { borderBottom: '2px solid white', borderRadius: 0 } };

export function AppLayout() {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  }

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Biblioteca Comunitaria
          </Typography>
          <Button color="inherit" component={NavLink} to="/" end sx={navLinkSx}>Inicio</Button>
          <Button color="inherit" component={NavLink} to="/books" sx={navLinkSx}>Libros</Button>
          <Button color="inherit" component={NavLink} to="/users" sx={navLinkSx}>Usuarios</Button>
          <Button color="inherit" component={NavLink} to="/loans" sx={navLinkSx}>Préstamos</Button>
          <Button color="inherit" onClick={handleLogout}>Salir</Button>
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 4 }}>
        <Outlet />
      </Container>
    </Box>
  );
}
