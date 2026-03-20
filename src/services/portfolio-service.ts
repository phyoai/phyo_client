/**
 * Portfolio Service
 * Handles portfolio and client management for service providers
 */

import { apiClient, APIResponse } from "./api-client";
import { PORTFOLIO_ENDPOINTS } from "@/utils/api-endpoints";

export interface IPortfolioClient {
  _id: string;
  projectTitle: string;
  clientName: string;
  servicesProvided: string[];
  projectStatus: string;
  budget: number;
  startDate: string;
  endDate?: string;
  images?: string[];
}

export interface IPortfolio {
  _id: string;
  userId: string;
  title: string;
  description: string;
  clients: IPortfolioClient[];
  createdAt: string;
  updatedAt: string;
}

export interface CreatePortfolioPayload {
  title: string;
  description: string;
}

export interface UpdatePortfolioPayload {
  title?: string;
  description?: string;
}

export interface CreateClientPayload {
  projectTitle: string;
  clientName: string;
  servicesProvided: string[];
  budget: number;
  projectStatus: string;
  startDate: string;
  endDate?: string;
  images?: string[];
}

export class PortfolioService {
  /**
   * Create a new portfolio
   */
  static async createPortfolio(
    payload: CreatePortfolioPayload
  ): Promise<APIResponse<IPortfolio>> {
    return apiClient.post(PORTFOLIO_ENDPOINTS.CREATE, payload);
  }

  /**
   * Get all portfolios
   */
  static async getPortfolios(
    page = 1,
    limit = 10
  ): Promise<APIResponse<{ data: IPortfolio[]; pagination: any }>> {
    return apiClient.get(PORTFOLIO_ENDPOINTS.GET_ALL, {
      params: { page, limit },
    });
  }

  /**
   * Get specific portfolio
   */
  static async getPortfolioById(
    portfolioId: string
  ): Promise<APIResponse<IPortfolio>> {
    return apiClient.get(PORTFOLIO_ENDPOINTS.GET_BY_ID(portfolioId));
  }

  /**
   * Update portfolio
   */
  static async updatePortfolio(
    portfolioId: string,
    payload: UpdatePortfolioPayload
  ): Promise<APIResponse<IPortfolio>> {
    return apiClient.put(PORTFOLIO_ENDPOINTS.UPDATE(portfolioId), payload);
  }

  /**
   * Delete portfolio
   */
  static async deletePortfolio(
    portfolioId: string
  ): Promise<APIResponse<{ message: string }>> {
    return apiClient.delete(PORTFOLIO_ENDPOINTS.DELETE(portfolioId));
  }

  /**
   * Add client to portfolio
   */
  static async addClient(
    portfolioId: string,
    payload: CreateClientPayload
  ): Promise<APIResponse<IPortfolio>> {
    return apiClient.post(
      PORTFOLIO_ENDPOINTS.ADD_CLIENT(portfolioId),
      payload
    ) as Promise<APIResponse<IPortfolio>>;
  }

  /**
   * Update client in portfolio
   */
  static async updateClient(
    portfolioId: string,
    clientId: string,
    payload: Partial<CreateClientPayload>
  ): Promise<APIResponse<IPortfolio>> {
    return apiClient.put(
      PORTFOLIO_ENDPOINTS.UPDATE_CLIENT(portfolioId, clientId),
      payload
    ) as Promise<APIResponse<IPortfolio>>;
  }

  /**
   * Remove client from portfolio
   */
  static async removeClient(
    portfolioId: string,
    clientId: string
  ): Promise<APIResponse<{ message: string }>> {
    return apiClient.delete(
      PORTFOLIO_ENDPOINTS.REMOVE_CLIENT(portfolioId, clientId)
    ) as Promise<APIResponse<{ message: string }>>;
  }

  /**
   * Get portfolio statistics
   */
  static async getPortfolioStats(portfolioId: string): Promise<APIResponse<any>> {
    return apiClient.get(PORTFOLIO_ENDPOINTS.GET_STATS(portfolioId));
  }
}
