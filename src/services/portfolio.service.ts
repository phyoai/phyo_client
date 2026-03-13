import apiClient from './api';
import {
  Portfolio,
  CreatePortfolioRequest,
  PortfolioClient,
  AddClientRequest,
  PaginationParams
} from './types';

export const portfolioService = {
  // POST /api/portfolios
  createPortfolio: async (data: CreatePortfolioRequest): Promise<Portfolio> => {
    const response = await apiClient.post('/portfolios', data);
    return response.data.data;
  },

  // GET /api/portfolios
  getPortfolios: async (params?: PaginationParams): Promise<any> => {
    const response = await apiClient.get('/portfolios', { params });
    return response.data;
  },

  // GET /api/portfolios/stats/:id
  getPortfolioStats: async (id: string): Promise<any> => {
    const response = await apiClient.get(`/portfolios/stats/${id}`);
    return response.data.data;
  },

  // GET /api/portfolios/:id
  getPortfolioById: async (id: string): Promise<Portfolio> => {
    const response = await apiClient.get(`/portfolios/${id}`);
    return response.data.data;
  },

  // PUT /api/portfolios/:id
  updatePortfolio: async (id: string, data: Partial<CreatePortfolioRequest>): Promise<Portfolio> => {
    const response = await apiClient.put(`/portfolios/${id}`, data);
    return response.data.data;
  },

  // DELETE /api/portfolios/:id
  deletePortfolio: async (id: string): Promise<any> => {
    const response = await apiClient.delete(`/portfolios/${id}`);
    return response.data;
  },

  // Client management endpoints

  // POST /api/portfolios/:id/clients
  addClient: async (portfolioId: string, data: AddClientRequest): Promise<PortfolioClient> => {
    const response = await apiClient.post(`/portfolios/${portfolioId}/clients`, data);
    return response.data.data;
  },

  // PUT /api/portfolios/:id/clients/:clientId
  updateClient: async (
    portfolioId: string,
    clientId: string,
    data: Partial<AddClientRequest>
  ): Promise<PortfolioClient> => {
    const response = await apiClient.put(
      `/portfolios/${portfolioId}/clients/${clientId}`,
      data
    );
    return response.data.data;
  },

  // DELETE /api/portfolios/:id/clients/:clientId
  removeClient: async (portfolioId: string, clientId: string): Promise<any> => {
    const response = await apiClient.delete(`/portfolios/${portfolioId}/clients/${clientId}`);
    return response.data;
  },

  // GET /api/portfolios/:id/clients
  getClients: async (portfolioId: string): Promise<PortfolioClient[]> => {
    const response = await apiClient.get(`/portfolios/${portfolioId}/clients`);
    return response.data.data;
  }
};
