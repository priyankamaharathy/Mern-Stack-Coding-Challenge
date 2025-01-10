import React from 'react';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import TransactionDashboard from './components/TransactionDashboard';

const theme = createTheme();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <TransactionDashboard />
    </ThemeProvider>
  );
}

export default App;
