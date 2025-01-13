import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

export default function CircularIndeterminate() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '8px' }}>
      <Box sx={{ display: 'flex' }}>
        <CircularProgress color="success" size={60} />
      </Box>
    </div>
  );
}
