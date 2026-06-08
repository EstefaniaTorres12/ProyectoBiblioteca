import { Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { User } from '../../types/domain';
import { getUsers } from './users.api';

export function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => { void getUsers().then(setUsers); }, []);

  return (
    <Stack spacing={2}>
      <Typography variant="h4">Usuarios</Typography>
      {users.map((user) => <div key={user.id}>{user.name} - {user.email}</div>)}
    </Stack>
  );
}
