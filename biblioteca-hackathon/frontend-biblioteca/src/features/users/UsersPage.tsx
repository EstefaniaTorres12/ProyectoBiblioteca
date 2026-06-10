import { Alert, Button, Chip, Dialog, DialogContent, DialogTitle, IconButton, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { Loan, User } from '../../types/domain';
import { getLoansByUser } from '../loans/loans.api';
import { CreateUserPayload, createUser, getUsers } from './users.api';

export function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<CreateUserPayload>({ name: '', email: '', password: '', phone: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userLoans, setUserLoans] = useState<Loan[]>([]);
  const [loadingLoans, setLoadingLoans] = useState(false);

  async function load() {
    setUsers(await getUsers());
  }

  useEffect(() => { void load(); }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await createUser({
        name: form.name,
        email: form.email,
        password: form.password,
        phone: form.phone || undefined,
      });
      setSuccess('Usuario registrado correctamente');
      setForm({ name: '', email: '', password: '', phone: '' });
      setShowForm(false);
      void load();
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Error al registrar el usuario');
    }
  }

  async function handleViewLoans(user: User) {
    setSelectedUser(user);
    setLoadingLoans(true);
    try {
      setUserLoans(await getLoansByUser(user.id));
    } finally {
      setLoadingLoans(false);
    }
  }

  return (
    <Stack spacing={2}>
      <Typography variant="h4">Usuarios</Typography>

      <Button variant="outlined" sx={{ alignSelf: 'flex-start' }} onClick={() => { setShowForm(!showForm); setError(''); setSuccess(''); }}>
        {showForm ? 'Cancelar' : 'Registrar Usuario'}
      </Button>

      {showForm && (
        <Paper elevation={2} sx={{ maxWidth: 480, borderRadius: 2 }}>
          <Stack component="form" onSubmit={handleCreate} spacing={2} autoComplete="off" sx={{ p: 3 }}>
            <Typography variant="h6">Nuevo usuario</Typography>
            {error && <Alert severity="error">{error}</Alert>}
            <TextField
              label="Nombre *"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              autoComplete="off"
              required
              fullWidth
            />
            <TextField
              label="Email *"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              autoComplete="off"
              required
              fullWidth
            />
            <TextField
              label="Contraseña *"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              autoComplete="new-password"
              slotProps={{
                htmlInput: {
                  minLength: 6,
                  readOnly: true,
                  onFocus: (e: React.FocusEvent<HTMLInputElement>) =>
                    e.currentTarget.removeAttribute('readOnly'),
                },
              }}
              required
              fullWidth
            />
            <TextField
              label="Teléfono"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              autoComplete="off"
              fullWidth
            />
            <Stack direction="row" spacing={1}>
              <Button type="submit" variant="contained">Guardar</Button>
              <Button variant="text" onClick={() => setShowForm(false)}>Cancelar</Button>
            </Stack>
          </Stack>
        </Paper>
      )}

      {success && <Alert severity="success">{success}</Alert>}

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: 'primary.main' }}>
              <TableCell sx={{ color: 'white', fontWeight: 700 }}>Nombre</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 700 }}>Email</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 700 }}>Teléfono</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 700 }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ color: 'text.secondary', py: 4 }}>
                  No hay registros
                </TableCell>
              </TableRow>
            )}
            {users.map((user) => (
              <TableRow key={user.id} hover>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phone ?? '—'}</TableCell>
                <TableCell>
                  <Button size="small" variant="outlined" onClick={() => handleViewLoans(user)}>
                    Ver Préstamos
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={!!selectedUser} onClose={() => setSelectedUser(null)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Préstamos de {selectedUser?.name}
          <IconButton onClick={() => setSelectedUser(null)} size="small"><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent>
          {loadingLoans ? (
            <Typography>Cargando...</Typography>
          ) : userLoans.length === 0 ? (
            <Typography color="text.secondary" sx={{ py: 2 }}>Este usuario no tiene préstamos registrados.</Typography>
          ) : (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ backgroundColor: 'primary.main' }}>
                    <TableCell sx={{ color: 'white', fontWeight: 700 }}>Libro</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 700 }}>Fecha préstamo</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 700 }}>Vence</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 700 }}>Devolución</TableCell>
                    <TableCell align="center" sx={{ color: 'white', fontWeight: 700 }}>Estado</TableCell>
                    <TableCell align="right" sx={{ color: 'white', fontWeight: 700 }}>Multa</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {userLoans.map((loan) => (
                    <TableRow key={loan.id} hover>
                      <TableCell>{loan.book?.title ?? '—'}</TableCell>
                      <TableCell>{new Date(loan.loanDate).toLocaleDateString()}</TableCell>
                      <TableCell>{new Date(loan.expectedReturnDate).toLocaleDateString()}</TableCell>
                      <TableCell>{loan.actualReturnDate ? new Date(loan.actualReturnDate).toLocaleDateString() : '—'}</TableCell>
                      <TableCell align="center">
                        <Chip
                          label={loan.status}
                          color={loan.status === 'DEVUELTO' ? 'default' : loan.status === 'ACTIVO' ? 'success' : 'error'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="right">
                        {Number(loan.fineAmount) > 0 ? `$${Number(loan.fineAmount).toLocaleString('es-CO')}` : '—'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DialogContent>
      </Dialog>
    </Stack>
  );
}
