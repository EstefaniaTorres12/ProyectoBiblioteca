import { LibraryBooks, PeopleAlt, SwapHoriz } from '@mui/icons-material';
import { Box, Button, Card, CardActions, CardContent, CssBaseline, ThemeProvider, Typography, createTheme } from '@mui/material';
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { LoginPage } from '../features/auth/LoginPage';
import { BooksPage } from '../features/books/BooksPage';
import { LoansPage } from '../features/loans/LoansPage';
import { UsersPage } from '../features/users/UsersPage';
import { AppLayout } from '../shared/layout/AppLayout';

const theme = createTheme({
  palette: {
    primary: { main: '#1565c0' },
    secondary: { main: '#f9a825' },
  },
  shape: { borderRadius: 8 },
});

const dashboardCards = [
  {
    icon: <LibraryBooks sx={{ fontSize: 60, color: 'primary.main' }} />,
    title: 'Libros',
    description: 'Gestiona el catálogo de libros disponibles.',
    label: 'Ir a Libros',
    path: '/books',
  },
  {
    icon: <PeopleAlt sx={{ fontSize: 60, color: 'primary.main' }} />,
    title: 'Usuarios',
    description: 'Administra los usuarios registrados.',
    label: 'Ir a Usuarios',
    path: '/users',
  },
  {
    icon: <SwapHoriz sx={{ fontSize: 60, color: 'primary.main' }} />,
    title: 'Préstamos',
    description: 'Gestiona préstamos y devoluciones.',
    label: 'Ir a Préstamos',
    path: '/loans',
  },
];

function Home() {
  const navigate = useNavigate();
  return (
    <Box sx={{ textAlign: 'center', mt: 4 }}>
      <Typography variant="h3" gutterBottom sx={{ fontWeight: 700 }}>
        Biblioteca Comunitaria
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 5 }}>
        Sistema de gestión de préstamos — selecciona una sección para comenzar.
      </Typography>

      <Box
        sx={{
          display: 'flex',
          gap: 3,
          justifyContent: 'center',
          flexWrap: 'wrap',
          px: { xs: 1, sm: 3 },
        }}
      >
        {dashboardCards.map((card) => (
          <Card
            key={card.path}
            sx={{
              width: { xs: '100%', sm: 260, md: 280 },
              borderRadius: 3,
              boxShadow: 3,
              transition: 'box-shadow 0.25s ease, transform 0.25s ease',
              '&:hover': {
                boxShadow: 8,
                transform: 'translateY(-6px)',
              },
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <CardContent sx={{ textAlign: 'center', pt: 4, pb: 1, flexGrow: 1, width: '100%' }}>
              {card.icon}
              <Typography variant="h5" sx={{ mt: 2, mb: 1, fontWeight: 600 }}>
                {card.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {card.description}
              </Typography>
            </CardContent>
            <CardActions sx={{ pb: 3, justifyContent: 'center' }}>
              <Button variant="contained" size="large" onClick={() => navigate(card.path)}>
                {card.label}
              </Button>
            </CardActions>
          </Card>
        ))}
      </Box>
    </Box>
  );
}

function RequireAuth({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  if (!token) return <Navigate to="/login" replace />;
  if (role !== 'ADMIN') {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

export function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            element={
              <RequireAuth>
                <AppLayout />
              </RequireAuth>
            }
          >
            <Route path="/" element={<Home />} />
            <Route path="/books" element={<BooksPage />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/loans" element={<LoansPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
