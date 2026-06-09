import { Button, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { Loan } from '../../types/domain';
import { getActiveLoans, returnLoan } from './loans.api';

export function LoansPage() {
  const [loans, setLoans] = useState<Loan[]>([]);

  async function load() {
    setLoans(await getActiveLoans());
  }

  async function handleReturn(id: number) {
    await returnLoan(id);
    await load();
  }

  useEffect(() => { void load(); }, []);

  return (
    <Stack spacing={2}>
      <Typography variant="h4">Préstamos activos</Typography>
      {loans.map((loan) => (
        <div key={loan.id}>
          {loan.book?.title} prestado a {loan.user?.name} - vence {new Date(loan.expectedReturnDate).toLocaleDateString()}
          <Button sx={{ ml: 2 }} size="small" variant="outlined" onClick={() => handleReturn(loan.id)}>Devolver</Button>
        </div>
      ))}
    </Stack>
  );
}
