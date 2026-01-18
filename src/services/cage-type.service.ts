import { api } from "@/lib/api-client";
import { PaginatedResponse, ApiResponse } from "@/types/api";
import { CageTypeFormValues } from "@/types/schemas/cage-type.schema";

// --- Types untuk Response Data ---
export interface CageTypeListItem {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface CageTypeDetail extends CageTypeListItem {
  cage_type_details_info?: string;
}

// --- Service Class ---
class CageTypeService {
  /**
   * Fetch daftar cage type dengan pagination dan search
   */
  async getList(params: {
    page?: number;
    limit?: number;
    keyword?: string;
  }): Promise<PaginatedResponse<CageTypeListItem>> {
    const { page = 1, limit = 20, keyword = "" } = params;

    const response = await api.get<PaginatedResponse<CageTypeListItem>>(
      "/cage/type",
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
  async getById(id: string): Promise<ApiResponse<CageTypeDetail>> {
    const response = await api.get<ApiResponse<CageTypeDetail>>(
      `/cage/type/${id}`,
    );
    return response.data;
  }

  /**
   * Create baru
   */
  async create(data: CageTypeFormValues): Promise<ApiResponse<CageTypeDetail>> {
    const response = await api.post<ApiResponse<CageTypeDetail>>(
      "/cage/type",
      data,
    );
    return response.data;
  }

  /**
   * Update
   */
  async update(
    id: string,
    data: CageTypeFormValues,
  ): Promise<ApiResponse<CageTypeDetail>> {
    const response = await api.put<ApiResponse<CageTypeDetail>>(
      `/cage/type/${id}`,
      data,
    );
    return response.data;
  }

  /**
   * Delete
   */
  async delete(id: string): Promise<ApiResponse<void>> {
    const response = await api.delete<ApiResponse<void>>(`/cage/type/${id}`);
    return response.data;
  }
}

export const cageTypeService = new CageTypeService();
