import { Alert, Button, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { User } from '../../types/domain';
import { CreateUserPayload, createUser, getUsers } from './users.api';

export function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<CreateUserPayload>({ name: '', email: '', password: '', phone: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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

  return (
    <Stack spacing={2}>
      <Typography variant="h4">Usuarios</Typography>

      <Button variant="outlined" sx={{ alignSelf: 'flex-start' }} onClick={() => { setShowForm(!showForm); setError(''); setSuccess(''); }}>
        {showForm ? 'Cancelar' : 'Registrar Usuario'}
      </Button>

      {showForm && (
        <Stack component="form" onSubmit={handleCreate} spacing={2} autoComplete="off" sx={{ maxWidth: 480, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
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
            inputProps={{
              minLength: 6,
              readOnly: true,
              onFocus: (e: React.FocusEvent<HTMLInputElement>) =>
                e.currentTarget.removeAttribute('readOnly'),
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
      )}

      {success && <Alert severity="success">{success}</Alert>}

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell><strong>Nombre</strong></TableCell>
              <TableCell><strong>Email</strong></TableCell>
              <TableCell><strong>Teléfono</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id} hover>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phone ?? '—'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
}
