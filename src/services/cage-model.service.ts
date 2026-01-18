import { api } from "@/lib/api-client";
import { PaginatedResponse, ApiResponse } from "@/types/api";
import { CageModelFormValues } from "@/types/schemas/cage-model.schema";

// --- Types untuk Response Data ---
export interface CageModelListItem {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface CageModelDetail extends CageModelListItem {
  cage_details_info?: string;
}

// --- Service Class ---
class CageModelService {
  /**
   * Fetch daftar cage model dengan pagination dan search
   */
  async getList(params: {
    page?: number;
    limit?: number;
    keyword?: string;
  }): Promise<PaginatedResponse<CageModelListItem>> {
    const { page = 1, limit = 20, keyword = "" } = params;

    const response = await api.get<PaginatedResponse<CageModelListItem>>(
      "/cage/model",
      {
        params: {
          page,
          page_size: limit,
          keyword: keyword || undefined,
        },
      },
    );

    return response.data;
  }

  /**
   * Fetch detail by ID
   */
  async getById(id: string): Promise<ApiResponse<CageModelDetail>> {
    const response = await api.get<ApiResponse<CageModelDetail>>(
      `/cage/model/${id}`,
    );
    return response.data;
  }

  /**
   * Create baru
   */
  async create(
    data: CageModelFormValues,
  ): Promise<ApiResponse<CageModelDetail>> {
    const response = await api.post<ApiResponse<CageModelDetail>>(
      "/cage/model",
      data,
    );
    return response.data;
  }

  /**
   * Update
   */
  async update(
    id: string,
    data: CageModelFormValues,
  ): Promise<ApiResponse<CageModelDetail>> {
    const response = await api.put<ApiResponse<CageModelDetail>>(
      `/cage/model/${id}`,
      data,
    );
    return response.data;
  }

  /**
   * Delete
   */
  async delete(id: string): Promise<ApiResponse<void>> {
    const response = await api.delete<ApiResponse<void>>(`/cage/model/${id}`);
    return response.data;
  }
}

export const cageModelService = new CageModelService();
