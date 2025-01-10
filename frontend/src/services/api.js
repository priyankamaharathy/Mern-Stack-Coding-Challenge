import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const getTransactions = async (month, search = '', page = 1) => {
  try {
    console.log('Requesting:', `${API_BASE_URL}/transactions`);
    const response = await axios.get(`${API_BASE_URL}/transactions`, {
      params: { month, search, page }
    });
    console.log('Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('API Error:', error.response || error);
    throw error;
  }
};

export const getStatistics = async (month) => {
  const response = await api.get('/statistics', { params: { month } });
  return response.data;
};

export const getBarChartData = async (month) => {
  const response = await api.get('/bar-chart', { params: { month } });
  return response.data;
};

export const getPieChartData = async (month) => {
  const response = await api.get('/pie-chart', { params: { month } });
  return response.data;
}; 