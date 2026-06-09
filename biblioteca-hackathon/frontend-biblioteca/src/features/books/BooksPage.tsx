import { Alert, Button, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { Book } from '../../types/domain';
import { createBook, getBooks } from './books.api';

export function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', author: '', isbn: '', totalQuantity: 1 });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function load(q = search) {
    setBooks(await getBooks(q));
  }

  useEffect(() => { void load(); }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await createBook({
        title: form.title,
        author: form.author,
        isbn: form.isbn || undefined,
        totalQuantity: form.totalQuantity,
      });
      setSuccess('Libro registrado correctamente');
      setForm({ title: '', author: '', isbn: '', totalQuantity: 1 });
      setShowForm(false);
      void load();
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Error al registrar el libro');
    }
  }

  return (
    <Stack spacing={2}>
      <Typography variant="h4">Libros</Typography>

      <Button variant="outlined" sx={{ alignSelf: 'flex-start' }} onClick={() => { setShowForm(!showForm); setError(''); setSuccess(''); }}>
        {showForm ? 'Cancelar' : 'Registrar Libro'}
      </Button>

      {showForm && (
        <Stack component="form" onSubmit={handleCreate} spacing={2} autoComplete="off" sx={{ maxWidth: 480, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
          <Typography variant="h6">Nuevo libro</Typography>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField
            label="Título *"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
            fullWidth
          />
          <TextField
            label="Autor *"
            value={form.author}
            onChange={(e) => setForm({ ...form, author: e.target.value })}
            required
            fullWidth
          />
          <TextField
            label="ISBN"
            value={form.isbn}
            onChange={(e) => setForm({ ...form, isbn: e.target.value })}
            fullWidth
          />
          <TextField
            label="Cantidad *"
            type="number"
            value={form.totalQuantity}
            onChange={(e) => setForm({ ...form, totalQuantity: Number(e.target.value) })}
            inputProps={{ min: 1 }}
            required
            fullWidth
          />
          <Stack direction="row" spacing={1}>
            <Button type="submit" variant="contained">Guardar</Button>
            <Button variant="text" onClick={() => setShowForm(false)}>Cancelar</Button>
          </Stack>
        </Stack>
      )}

      {success && <Alert severity="success">{success}</Alert>}

      <Stack direction="row" spacing={2}>
        <TextField label="Buscar por título o autor" value={search} onChange={(e) => setSearch(e.target.value)} />
        <Button variant="contained" onClick={() => load()}>Buscar</Button>
      </Stack>

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell><strong>Título</strong></TableCell>
              <TableCell><strong>Autor</strong></TableCell>
              <TableCell><strong>ISBN</strong></TableCell>
              <TableCell align="center"><strong>Disponibles</strong></TableCell>
              <TableCell align="center"><strong>Total</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {books.map((book) => (
              <TableRow key={book.id} hover>
                <TableCell>{book.title}</TableCell>
                <TableCell>{book.author}</TableCell>
                <TableCell>{book.isbn ?? '—'}</TableCell>
                <TableCell align="center">{book.availableQuantity}</TableCell>
                <TableCell align="center">{book.totalQuantity}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
}
