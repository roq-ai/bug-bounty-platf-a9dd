import axios from 'axios';
import queryString from 'query-string';
import { BountyInterface, BountyGetQueryInterface } from 'interfaces/bounty';
import { GetQueryInterface } from '../../interfaces';

export const getBounties = async (query?: BountyGetQueryInterface) => {
  const response = await axios.get(`/api/bounties${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createBounty = async (bounty: BountyInterface) => {
  const response = await axios.post('/api/bounties', bounty);
  return response.data;
};

export const updateBountyById = async (id: string, bounty: BountyInterface) => {
  const response = await axios.put(`/api/bounties/${id}`, bounty);
  return response.data;
};

export const getBountyById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/bounties/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteBountyById = async (id: string) => {
  const response = await axios.delete(`/api/bounties/${id}`);
  return response.data;
};
