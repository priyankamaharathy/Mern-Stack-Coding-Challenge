import React, { useState, useEffect } from 'react';
import * as api from '../services/api';
import {
  Box,
  Container,
  Grid,
  Pagination,
  Paper,
  TextField,
  Select,
  MenuItem,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Avatar,
  Chip
} from '@mui/material';
import BarChartComponent from './BarChart';
import PieChartComponent from './PieChart';

const TransactionDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [month, setMonth] = useState('March');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [transactions, setTransactions] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [statistics, setStatistics] = useState({
    totalSaleAmount: 0,
    soldItems: 0,
    notSoldItems: 0
  });
  const [barChartData, setBarChartData] = useState([]);
  const [pieChartData, setPieChartData] = useState([]);

  const fetchData = async (selectedMonth = month, searchText = search, currentPage = page) => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('Fetching data for month:', selectedMonth, 'search:', searchText);

      const [transactionsRes, statsRes, barChartRes, pieChartRes] = await Promise.all([
        api.getTransactions(selectedMonth, searchText, currentPage),
        api.getStatistics(selectedMonth),
        api.getBarChartData(selectedMonth),
        api.getPieChartData(selectedMonth)
      ]);

      setTransactions(transactionsRes.transactions);
      setTotalPages(transactionsRes.pagination.totalPages);
      setStatistics(statsRes);
      setBarChartData(barChartRes);
      setPieChartData(pieChartRes);
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Failed to fetch data: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  
  const handleMonthChange = async (event) => {
    const newMonth = event.target.value;
    setMonth(newMonth);
    setPage(1);
    setSearch('');
    await fetchData(newMonth, '', 1);
  };

  const handleSearch = async (event) => {
    const searchText = event.target.value;
    setSearch(searchText);
    setPage(1);
    await fetchData(month, searchText, 1);
  };

 
  useEffect(() => {
    fetchData();
  }, []);

  const darkThemeStyles = {
    backgroundColor: '#0a192f',
    color: '#64ffda'
  };

  const paperStyle = {
    backgroundColor: '#112240',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
    transition: 'all 0.3s ease-in-out',
    border: '1px solid rgba(100, 255, 218, 0.1)',
    '&:hover': {
      boxShadow: '0 8px 30px rgba(100, 255, 218, 0.1)',
      transform: 'translateY(-2px)'
    }
  };

  const statisticsCardStyle = {
    ...paperStyle,
    p: 4,
    textAlign: 'center',
    height: '100%',
    minHeight: '160px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 2
  };

  const selectStyles = {
    backgroundColor: '#1d2d50',
    color: '#64ffda',
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: 'rgba(100, 255, 218, 0.2)',
    },
    '& .MuiSvgIcon-root': {
      color: '#64ffda',
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: '#64ffda',
    }
  };

  const menuItemStyles = {
    '&.MuiMenuItem-root': {
      backgroundColor: '#3d3d3d',
      color: '#ffffff',
      '&:hover': {
        backgroundColor: '#4d4d4d'
      },
      '&.Mui-selected': {
        backgroundColor: '#4d4d4d',
        '&:hover': {
          backgroundColor: '#5d5d5d'
        }
      }
    }
  };

  return (
    <Box sx={{ ...darkThemeStyles, minHeight: '100vh', py: 6 }}>
      <Container maxWidth="xl">
        <Typography 
          variant="h3" 
          sx={{ 
            mb: 5, 
            color: '#ccd6f6',
            fontWeight: 600,
            textAlign: 'center'
          }}
        >
          Transaction Analytics
        </Typography>

        <Grid container spacing={3}>
         
          <Grid item xs={12}>
            <Paper sx={{ ...paperStyle, p: 2 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={6}>
                  <Select
                    fullWidth
                    value={month}
                    onChange={handleMonthChange}
                    disabled={isLoading}
                    sx={selectStyles}
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          backgroundColor: '#3d3d3d',
                          borderRadius: '8px',
                          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                          '& .MuiList-root': {
                            padding: '8px',
                          },
                          '& .MuiMenuItem-root': {
                            borderRadius: '4px',
                            margin: '2px 0',
                          }
                        }
                      }
                    }}
                  >
                    {[
                      'January', 'February', 'March', 'April', 'May', 'June',
                      'July', 'August', 'September', 'October', 'November', 'December'
                    ].map(m => (
                      <MenuItem 
                        key={m} 
                        value={m}
                        sx={menuItemStyles}
                      >
                        {m}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    placeholder="Search by title, description, or price..."
                    value={search}
                    onChange={handleSearch}
                    disabled={isLoading}
                    sx={{
                      backgroundColor: '#3d3d3d',
                      borderRadius: 1,
                      '& .MuiOutlinedInput-root': {
                        color: '#ffffff',
                      },
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255, 255, 255, 0.2)',
                      },
                      '& .MuiInputBase-input::placeholder': {
                        color: 'rgba(255, 255, 255, 0.5)',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                      }
                    }}
                    InputProps={{
                      endAdornment: search && (
                        <Box
                          component="button"
                          onClick={() => {
                            setSearch('');
                            fetchData(month, '');
                          }}
                          sx={{
                            border: 'none',
                            background: 'none',
                            cursor: 'pointer',
                            p: 1,
                            color: 'rgba(255, 255, 255, 0.7)',
                            '&:hover': {
                              color: '#ffffff'
                            }
                          }}
                        >
                          ✕
                        </Box>
                      )
                    }}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Paper sx={statisticsCardStyle}>
                  <Typography variant="subtitle1" color="rgba(255, 255, 255, 0.7)" gutterBottom>
                    Total Sales
                  </Typography>
                  <Typography variant="h4" color="#ffffff" sx={{ fontWeight: 500 }}>
                    ${statistics.totalSaleAmount?.toFixed(2) || '0.00'}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={4}>
                <Paper sx={statisticsCardStyle}>
                  <Typography variant="subtitle1" color="rgba(255, 255, 255, 0.7)" gutterBottom>
                    Sold Items
                  </Typography>
                  <Typography variant="h4" color="#ffffff" sx={{ fontWeight: 500 }}>
                    {statistics.soldItems || 0}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={4}>
                <Paper sx={statisticsCardStyle}>
                  <Typography variant="subtitle1" color="rgba(255, 255, 255, 0.7)" gutterBottom>
                    Not Sold Items
                  </Typography>
                  <Typography variant="h4" color="#ffffff" sx={{ fontWeight: 500 }}>
                    {statistics.notSoldItems || 0}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ ...paperStyle, p: 3, minHeight: '400px' }}>
              <Typography variant="h6" sx={{ color: '#ffffff', mb: 2 }}>
                Price Range Distribution
              </Typography>
              {isLoading ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="300px">
                  <CircularProgress sx={{ color: '#ffffff' }} />
                </Box>
              ) : (
                <Box height="300px">
                  <BarChartComponent 
                    data={barChartData} 
                    isDarkMode={true}
                  />
                </Box>
              )}
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ ...paperStyle, p: 3, minHeight: '400px' }}>
              <Typography variant="h6" sx={{ color: '#ffffff', mb: 2 }}>
                Category Distribution
              </Typography>
              {isLoading ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="300px">
                  <CircularProgress sx={{ color: '#ffffff' }} />
                </Box>
              ) : (
                <Box height="300px">
                  <PieChartComponent 
                    data={pieChartData} 
                    isDarkMode={true}
                  />
                </Box>
              )}
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper sx={{ ...paperStyle, p: 3 }}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ 
                        color: '#64ffda', 
                        fontWeight: 600,
                        borderBottom: '2px solid rgba(100, 255, 218, 0.2)'
                      }}>ID</TableCell>
                      <TableCell sx={{ 
                        color: '#64ffda', 
                        fontWeight: 600,
                        borderBottom: '2px solid rgba(100, 255, 218, 0.2)'
                      }}>Image</TableCell>
                      <TableCell sx={{ 
                        color: '#64ffda', 
                        fontWeight: 600,
                        borderBottom: '2px solid rgba(100, 255, 218, 0.2)'
                      }}>Title</TableCell>
                      <TableCell sx={{ 
                        color: '#64ffda', 
                        fontWeight: 600,
                        borderBottom: '2px solid rgba(100, 255, 218, 0.2)'
                      }}>Description</TableCell>
                      <TableCell sx={{ 
                        color: '#64ffda', 
                        fontWeight: 600,
                        borderBottom: '2px solid rgba(100, 255, 218, 0.2)'
                      }}>Price</TableCell>
                      <TableCell sx={{ 
                        color: '#64ffda', 
                        fontWeight: 600,
                        borderBottom: '2px solid rgba(100, 255, 218, 0.2)'
                      }}>Category</TableCell>
                      <TableCell sx={{ 
                        color: '#64ffda', 
                        fontWeight: 600,
                        borderBottom: '2px solid rgba(100, 255, 218, 0.2)'
                      }}>Sold</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {transactions.map((transaction) => (
                      <TableRow 
                        key={transaction.id}
                        sx={{ 
                          '&:hover': { 
                            backgroundColor: 'rgba(100, 255, 218, 0.05)'
                          },
                          '& td': {
                            color: '#8892b0',
                            borderBottom: '1px solid rgba(100, 255, 218, 0.1)'
                          }
                        }}
                      >
                        <TableCell>{transaction.id}</TableCell>
                        <TableCell>
                          <Avatar
                            src={transaction.image}
                            alt={transaction.title}
                            variant="rounded"
                            sx={{ 
                              width: 60, 
                              height: 60,
                              border: '1px solid rgba(255, 255, 255, 0.1)'
                            }}
                          >
                            {transaction.title.charAt(0)}
                          </Avatar>
                        </TableCell>
                        <TableCell>{transaction.title}</TableCell>
                        <TableCell>{transaction.description}</TableCell>
                        <TableCell>${transaction.price}</TableCell>
                        <TableCell>
                          <Chip
                            label={transaction.category}
                            size="small"
                            sx={{
                              backgroundColor: 'rgba(255, 255, 255, 0.1)',
                              color: '#ffffff'
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={transaction.sold ? 'Sold' : 'Not Sold'}
                            size="small"
                            sx={{
                              backgroundColor: transaction.sold 
                                ? 'rgba(76, 175, 80, 0.2)' 
                                : 'rgba(244, 67, 54, 0.2)',
                              color: transaction.sold 
                                ? '#81c784' 
                                : '#e57373'
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={(e, value) => setPage(value)}
                  sx={{
                    '& .MuiPaginationItem-root': {
                      color: '#64ffda',
                      '&.Mui-selected': {
                        backgroundColor: 'rgba(100, 255, 218, 0.2)'
                      }
                    }
                  }}
                />
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default TransactionDashboard;