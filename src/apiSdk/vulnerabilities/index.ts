import axios from 'axios';
import queryString from 'query-string';
import { VulnerabilityInterface, VulnerabilityGetQueryInterface } from 'interfaces/vulnerability';
import { GetQueryInterface } from '../../interfaces';

export const getVulnerabilities = async (query?: VulnerabilityGetQueryInterface) => {
  const response = await axios.get(`/api/vulnerabilities${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createVulnerability = async (vulnerability: VulnerabilityInterface) => {
  const response = await axios.post('/api/vulnerabilities', vulnerability);
  return response.data;
};

export const updateVulnerabilityById = async (id: string, vulnerability: VulnerabilityInterface) => {
  const response = await axios.put(`/api/vulnerabilities/${id}`, vulnerability);
  return response.data;
};

export const getVulnerabilityById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/vulnerabilities/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteVulnerabilityById = async (id: string) => {
  const response = await axios.delete(`/api/vulnerabilities/${id}`);
  return response.data;
};
