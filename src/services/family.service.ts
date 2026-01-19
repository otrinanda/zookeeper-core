import { api } from "@/lib/api-client";
import { PaginatedResponse, ApiResponse } from "@/types/api";
import { FamilyFormValues } from "@/types/schemas/family.schema";

// --- Types untuk Response Data ---
export interface FamilyListItem {
  id: string;
  family_name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface FamilyDetail extends FamilyListItem {
  // Add more details if needed
  family_detail_info?: string;
}

// --- Service Class ---
class FamilyService {
  /**
   * Fetch daftar family dengan pagination dan search
   */
  async getList(params: {
    page?: number;
    limit?: number;
    keyword?: string;
  }): Promise<PaginatedResponse<FamilyListItem>> {
    const { page = 1, limit = 20, keyword = "" } = params;

    const response = await api.get<PaginatedResponse<FamilyListItem>>(
      "/animal/family",
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
  async getById(id: string): Promise<ApiResponse<FamilyDetail>> {
    const response = await api.get<ApiResponse<FamilyDetail>>(
      `/animal/family/${id}`,
    );
    return response.data;
  }

  /**
   * Create baru
   */
  async create(data: FamilyFormValues): Promise<ApiResponse<FamilyDetail>> {
    const response = await api.post<ApiResponse<FamilyDetail>>(
      "/animal/family",
      data,
    );
    return response.data;
  }

  /**
   * Update
   */
  async update(
    id: string,
    data: FamilyFormValues,
  ): Promise<ApiResponse<FamilyDetail>> {
    const response = await api.put<ApiResponse<FamilyDetail>>(
      `/animal/family/${id}`,
      data,
    );
    return response.data;
  }

  /**
   * Delete
   */
  async delete(id: string): Promise<ApiResponse<void>> {
    const response = await api.delete<ApiResponse<void>>(
      `/animal/family/${id}`,
    );
    return response.data;
  }
}

export const familyService = new FamilyService();
