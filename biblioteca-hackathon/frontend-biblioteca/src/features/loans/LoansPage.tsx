import { Alert, Button, ButtonGroup, Chip, MenuItem, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { Book, Loan, User } from '../../types/domain';
import { getBooks } from '../books/books.api';
import { getUsers } from '../users/users.api';
import { CreateLoanPayload, TodayLoansResponse, createLoan, getActiveLoans, getOverdueLoans, getTodayLoans, returnLoan } from './loans.api';

type LoanView = 'today' | 'active' | 'overdue' | 'search';

const VIEW_LABELS: Record<LoanView, string> = {
  today: 'Préstamos del día',
  active: 'Préstamos activos',
  overdue: 'Préstamos vencidos',
  search: 'Buscar por usuario',
};

export function LoansPage() {
  const [view, setView] = useState<LoanView>('today');
  const [loans, setLoans] = useState<Loan[]>([]);
  const [todayData, setTodayData] = useState<TodayLoansResponse>({ loans: [], total: 0 });
  const [overdueLoans, setOverdueLoans] = useState<Loan[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<CreateLoanPayload>({ userId: 0, bookId: 0, expectedReturnDate: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Loan[]>([]);
  const [searchPerformed, setSearchPerformed] = useState(false);

  async function loadToday() {
    setTodayData(await getTodayLoans());
  }

  async function loadActive() {
    setLoans(await getActiveLoans());
  }

  async function loadOverdue() {
    setOverdueLoans(await getOverdueLoans());
  }

  async function loadBooks() {
    setBooks(await getBooks());
  }

  async function switchView(newView: LoanView) {
    setView(newView);
    setError('');
    setSuccess('');
    if (newView === 'today') void loadToday();
    else if (newView === 'active') void loadActive();
    else void loadOverdue();
  }

  useEffect(() => {
    void loadToday();
    void getUsers().then(setUsers);
    void loadBooks();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await createLoan({
        userId: form.userId,
        bookId: form.bookId,
        expectedReturnDate: form.expectedReturnDate
          ? new Date(form.expectedReturnDate).toISOString()
          : undefined,
      });
      setSuccess('Préstamo registrado correctamente');
      setForm({ userId: 0, bookId: 0, expectedReturnDate: '' });
      setShowForm(false);
      void loadBooks();
      if (view === 'today') void loadToday();
      else if (view === 'active') void loadActive();
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Error al registrar el préstamo');
    }
  }

  async function handleReturn(id: number) {
    setError('');
    setSuccess('');
    try {
      const returned = await returnLoan(id);
      const fine = Number(returned.fineAmount);
      setSuccess(
        fine > 0
          ? `Devolución registrada. Multa: $${fine.toLocaleString('es-CO')}`
          : 'Devolución registrada sin multa'
      );
      void loadBooks();
      if (view === 'today') void loadToday();
      else if (view === 'active') void loadActive();
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Error al registrar la devolución');
    }
  }

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    try {
      const result = await getTodayLoans(searchQuery);
      setSearchResults(result.loans);
      setSearchPerformed(true);
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Error al buscar préstamos');
    }
  }

  function handleClearSearch() {
    setSearchQuery('');
    setSearchResults([]);
    setSearchPerformed(false);
    setError('');
  }

  const availableBooks = books.filter((b) => b.availableQuantity > 0);

  const statusColor = (status: string, expectedReturnDate: string) => {
    if (status === 'ACTIVO' && new Date(expectedReturnDate) < new Date()) return 'error';
    if (status === 'ACTIVO') return 'success';
    if (status === 'VENCIDO') return 'error';
    return 'default';
  };

  const statusLabel = (status: string, expectedReturnDate: string) => {
    if (status === 'ACTIVO' && new Date(expectedReturnDate) < new Date()) return 'VENCIDO';
    return status;
  };

  return (
    <Stack spacing={2}>
      <Typography variant="h4">{VIEW_LABELS[view]}</Typography>

      <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
        <Button
          variant="outlined"
          sx={{ alignSelf: 'flex-start' }}
          onClick={() => { setShowForm(!showForm); setError(''); setSuccess(''); }}
        >
          {showForm ? 'Cancelar' : 'Registrar Préstamo'}
        </Button>

        <ButtonGroup variant="outlined" size="small">
          <Button
            variant={view === 'today' ? 'contained' : 'outlined'}
            onClick={() => switchView('today')}
          >
            Hoy
          </Button>
          <Button
            variant={view === 'active' ? 'contained' : 'outlined'}
            onClick={() => switchView('active')}
          >
            Activos
          </Button>
          <Button
            color="warning"
            variant={view === 'overdue' ? 'contained' : 'outlined'}
            onClick={() => switchView('overdue')}
          >
            Vencidos
          </Button>
          <Button
            color="info"
            variant={view === 'search' ? 'contained' : 'outlined'}
            onClick={() => { switchView('search'); handleClearSearch(); }}
          >
            Buscar
          </Button>
        </ButtonGroup>
      </Stack>

      {showForm && (
        <Paper elevation={2} sx={{ maxWidth: 480, borderRadius: 2 }}>
          <Stack component="form" onSubmit={handleCreate} spacing={2} autoComplete="off" sx={{ p: 3 }}>
            <Typography variant="h6">Nuevo préstamo</Typography>
            {error && <Alert severity="error">{error}</Alert>}

            <TextField
              label="Usuario *"
              select
              value={form.userId || ''}
              onChange={(e) => setForm({ ...form, userId: Number(e.target.value) })}
              required
              fullWidth
            >
              {users.map((u) => (
                <MenuItem key={u.id} value={u.id}>{u.name}</MenuItem>
              ))}
            </TextField>

            <TextField
              label="Libro *"
              select
              value={form.bookId || ''}
              onChange={(e) => setForm({ ...form, bookId: Number(e.target.value) })}
              required
              fullWidth
            >
              {availableBooks.map((b) => (
                <MenuItem key={b.id} value={b.id}>{b.title} ({b.availableQuantity} disponibles)</MenuItem>
              ))}
            </TextField>

            <TextField
              label="Fecha devolución esperada"
              type="date"
              value={form.expectedReturnDate}
              onChange={(e) => setForm({ ...form, expectedReturnDate: e.target.value })}
              slotProps={{ inputLabel: { shrink: true } }}
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
      {error && !showForm && <Alert severity="error">{error}</Alert>}

      {/* ── VISTA: HOY ── */}
      {view === 'today' && (
        <Stack spacing={1}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="subtitle1">Total préstamos hoy:</Typography>
            <Chip label={todayData.total} color="primary" />
          </Stack>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ backgroundColor: 'primary.main' }}>
                  <TableCell sx={{ color: 'white', fontWeight: 700 }}>Usuario</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 700 }}>Libro</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 700 }}>Fecha préstamo</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 700 }}>Fecha devolución</TableCell>
                  <TableCell align="center" sx={{ color: 'white', fontWeight: 700 }}>Estado</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {todayData.loans.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ color: 'text.secondary', py: 4 }}>
                      No hay préstamos registrados hoy
                    </TableCell>
                  </TableRow>
                )}
                {todayData.loans.map((loan) => (
                  <TableRow key={loan.id} hover>
                    <TableCell>{loan.user?.name ?? '—'}</TableCell>
                    <TableCell>{loan.book?.title ?? '—'}</TableCell>
                    <TableCell>{new Date(loan.loanDate).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(loan.expectedReturnDate).toLocaleDateString()}</TableCell>
                    <TableCell align="center">
                      <Chip
                        label={statusLabel(loan.status, loan.expectedReturnDate)}
                        color={statusColor(loan.status, loan.expectedReturnDate)}
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Stack>
      )}

      {/* ── VISTA: ACTIVOS ── */}
      {view === 'active' && (
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: 'primary.main' }}>
                <TableCell sx={{ color: 'white', fontWeight: 700 }}>Libro</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 700 }}>Usuario</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 700 }}>Fecha préstamo</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 700 }}>Vence</TableCell>
                <TableCell align="center" sx={{ color: 'white', fontWeight: 700 }}>Estado</TableCell>
                <TableCell align="center" sx={{ color: 'white', fontWeight: 700 }}>Acción</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loans.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ color: 'text.secondary', py: 4 }}>
                    No hay registros
                  </TableCell>
                </TableRow>
              )}
              {loans.map((loan) => {
                const isOverdue = loan.status === 'ACTIVO' && new Date(loan.expectedReturnDate) < new Date();
                return (
                  <TableRow key={loan.id} hover sx={isOverdue ? { backgroundColor: '#fdecea' } : {}}>
                    <TableCell>{loan.book?.title ?? '—'}</TableCell>
                    <TableCell>{loan.user?.name ?? '—'}</TableCell>
                    <TableCell>{new Date(loan.loanDate).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(loan.expectedReturnDate).toLocaleDateString()}</TableCell>
                    <TableCell align="center">
                      <Chip
                        label={isOverdue ? 'VENCIDO' : loan.status}
                        color={isOverdue ? 'error' : loan.status === 'ACTIVO' ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      {loan.status === 'ACTIVO' && (
                        <Button size="small" variant="outlined" onClick={() => handleReturn(loan.id)}>
                          Devolver
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* ── VISTA: BUSCAR ── */}
      {view === 'search' && (
        <Stack spacing={2}>
          <Stack component="form" onSubmit={handleSearch} direction="row" spacing={1} alignItems="center" flexWrap="wrap">
            <TextField
              label="Nombre de usuario"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              size="small"
              sx={{ minWidth: 260 }}
              placeholder="Ej: Ana"
            />
            <Button type="submit" variant="contained" disabled={!searchQuery.trim()}>
              Buscar
            </Button>
            {searchPerformed && (
              <Button variant="outlined" onClick={handleClearSearch}>
                Limpiar
              </Button>
            )}
          </Stack>

          {searchPerformed && searchResults.length === 0 && (
            <Alert severity="info">No se encontraron préstamos para ese usuario</Alert>
          )}

          {searchResults.length > 0 && (
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ backgroundColor: 'info.main' }}>
                    <TableCell sx={{ color: 'white', fontWeight: 700 }}>Usuario</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 700 }}>Libro</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 700 }}>Fecha préstamo</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 700 }}>Fecha devolución</TableCell>
                    <TableCell align="center" sx={{ color: 'white', fontWeight: 700 }}>Estado</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {searchResults.map((loan) => (
                    <TableRow key={loan.id} hover>
                      <TableCell>{loan.user?.name ?? '—'}</TableCell>
                      <TableCell>{loan.book?.title ?? '—'}</TableCell>
                      <TableCell>{new Date(loan.loanDate).toLocaleDateString()}</TableCell>
                      <TableCell>{new Date(loan.expectedReturnDate).toLocaleDateString()}</TableCell>
                      <TableCell align="center">
                        <Chip
                          label={statusLabel(loan.status, loan.expectedReturnDate)}
                          color={statusColor(loan.status, loan.expectedReturnDate)}
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Stack>
      )}

      {/* ── VISTA: VENCIDOS ── */}
      {view === 'overdue' && (
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: 'error.main' }}>
                <TableCell sx={{ color: 'white', fontWeight: 700 }}>Libro</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 700 }}>Usuario</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 700 }}>Fecha préstamo</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 700 }}>Venció</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 700 }}>Días vencido</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {overdueLoans.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ color: 'text.secondary', py: 4 }}>
                    No hay préstamos vencidos
                  </TableCell>
                </TableRow>
              )}
              {overdueLoans.map((loan) => {
                const diasVencido = Math.floor(
                  (Date.now() - new Date(loan.expectedReturnDate).getTime()) / (1000 * 60 * 60 * 24)
                );
                return (
                  <TableRow key={loan.id} hover sx={{ backgroundColor: '#fdecea' }}>
                    <TableCell>{loan.book?.title ?? '—'}</TableCell>
                    <TableCell>{loan.user?.name ?? '—'}</TableCell>
                    <TableCell>{new Date(loan.loanDate).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(loan.expectedReturnDate).toLocaleDateString()}</TableCell>
                    <TableCell sx={{ color: 'error.main', fontWeight: 700 }}>{diasVencido} días</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Stack>
  );
}
