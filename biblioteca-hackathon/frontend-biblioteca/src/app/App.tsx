import { Box, CssBaseline, ThemeProvider, Typography, createTheme } from '@mui/material';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
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

function Home() {
  return (
    <Box sx={{ textAlign: 'center', mt: 6 }}>
      <Typography variant="h3" gutterBottom>Biblioteca Comunitaria</Typography>
      <Typography variant="subtitle1" color="text.secondary">
        Sistema de gestión de préstamos — selecciona una sección del menú para comenzar.
      </Typography>
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
