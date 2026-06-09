import { Button, Stack, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { Book } from '../../types/domain';
import { getBooks } from './books.api';

export function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [search, setSearch] = useState('');

  async function load() {
    setBooks(await getBooks(search));
  }

  useEffect(() => { void load(); }, []);

  return (
    <Stack spacing={2}>
      <Typography variant="h4">Libros</Typography>
      <Stack direction="row" spacing={2}>
        <TextField label="Buscar por título o autor" value={search} onChange={(e) => setSearch(e.target.value)} />
        <Button variant="contained" onClick={load}>Buscar</Button>
      </Stack>
      {books.map((book) => (
        <div key={book.id}>{book.title} - {book.author} | Disponibles: {book.availableQuantity}</div>
      ))}
    </Stack>
  );
}
