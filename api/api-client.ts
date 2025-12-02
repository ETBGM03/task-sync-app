// src/services/api.ts
import axios, { AxiosError, AxiosInstance } from "axios";
import { Task } from "../store/types";

// Reemplaza con la URL de tu API
const API_BASE_URL = "https://tu-api.com/api";

class ApiService {
  private client: AxiosInstance;
  private maxRetries = 3;
  private retryDelay = 1000;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      (error) => this.handleError(error)
    );
  }

  private async handleError(error: AxiosError) {
    if (error.response) {
      // Server responded with error
      console.error("API Error:", error.response.status, error.response.data);
    } else if (error.request) {
      // Request made but no response
      console.error("Network Error:", error.message);
    }
    return Promise.reject(error);
  }

  private async retryRequest<T>(
    requestFn: () => Promise<T>,
    retries = this.maxRetries
  ): Promise<T> {
    try {
      return await requestFn();
    } catch (error) {
      if (retries > 0 && this.shouldRetry(error)) {
        await this.delay(this.retryDelay);
        return this.retryRequest(requestFn, retries - 1);
      }
      throw error;
    }
  }

  private shouldRetry(error: any): boolean {
    // Retry on network errors or 5xx server errors
    return (
      !error.response ||
      (error.response.status >= 500 && error.response.status < 600)
    );
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // Get all tasks
  async getTasks(): Promise<Task[]> {
    return this.retryRequest(async () => {
      const response = await this.client.get<Task[]>("/tasks");
      return response.data;
    });
  }

  // Get single task
  async getTask(id: string): Promise<Task> {
    return this.retryRequest(async () => {
      const response = await this.client.get<Task>(`/tasks/${id}`);
      return response.data;
    });
  }

  // Create task
  async createTask(
    task: Omit<Task, "id" | "createdAt" | "updatedAt">
  ): Promise<Task> {
    return this.retryRequest(async () => {
      const response = await this.client.post<Task>("/tasks", task);
      return response.data;
    });
  }

  // Update task
  async updateTask(id: string, updates: Partial<Task>): Promise<Task> {
    return this.retryRequest(async () => {
      const response = await this.client.put<Task>(`/tasks/${id}`, updates);
      return response.data;
    });
  }

  // Delete task
  async deleteTask(id: string): Promise<void> {
    return this.retryRequest(async () => {
      await this.client.delete(`/tasks/${id}`);
    });
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      await this.client.get("/health");
      return true;
    } catch {
      return false;
    }
  }
}

export const apiService = new ApiService();
