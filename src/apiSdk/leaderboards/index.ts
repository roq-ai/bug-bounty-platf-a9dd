import axios from 'axios';
import queryString from 'query-string';
import { LeaderboardInterface, LeaderboardGetQueryInterface } from 'interfaces/leaderboard';
import { GetQueryInterface } from '../../interfaces';

export const getLeaderboards = async (query?: LeaderboardGetQueryInterface) => {
  const response = await axios.get(`/api/leaderboards${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createLeaderboard = async (leaderboard: LeaderboardInterface) => {
  const response = await axios.post('/api/leaderboards', leaderboard);
  return response.data;
};

export const updateLeaderboardById = async (id: string, leaderboard: LeaderboardInterface) => {
  const response = await axios.put(`/api/leaderboards/${id}`, leaderboard);
  return response.data;
};

export const getLeaderboardById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/leaderboards/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteLeaderboardById = async (id: string) => {
  const response = await axios.delete(`/api/leaderboards/${id}`);
  return response.data;
};
