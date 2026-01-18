import { api } from "@/lib/api-client";
import { PaginatedResponse, ApiResponse } from "@/types/api";
import { UnitAreaFormValues } from "@/types/schemas/unit-area.schema";

// --- Types untuk Response Data ---

export interface UnitAreaListItem {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface UnitAreaDetail extends UnitAreaListItem {
  detail_info?: string;
  // Bisa tambah fields lain jika diperlukan
}

// --- Service Class ---
class UnitAreaService {
  /**
   * Fetch daftar unit area dengan pagination dan search
   * @param params - { page, limit, keyword }
   */
  async getList(params: {
    page?: number;
    limit?: number;
    keyword?: string;
  }): Promise<PaginatedResponse<UnitAreaListItem>> {
    const { page = 1, limit = 20, keyword = "" } = params;

    const response = await api.get<PaginatedResponse<UnitAreaListItem>>(
      "/area-unit/all",
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
   * Fetch detail unit area by ID
   */
  async getById(id: string): Promise<ApiResponse<UnitAreaDetail>> {
    const response = await api.get<ApiResponse<UnitAreaDetail>>(
      `/area-unit/${id}`,
    );
    return response.data;
  }

  /**
   * Create unit area baru
   */
  async create(data: UnitAreaFormValues): Promise<ApiResponse<UnitAreaDetail>> {
    const response = await api.post<ApiResponse<UnitAreaDetail>>(
      "/area-unit",
      data,
    );
    return response.data;
  }

  /**
   * Update unit area
   */
  async update(
    id: string,
    data: UnitAreaFormValues,
  ): Promise<ApiResponse<UnitAreaDetail>> {
    const response = await api.put<ApiResponse<UnitAreaDetail>>(
      `/area-unit/${id}`,
      data,
    );
    return response.data;
  }

  /**
   * Delete unit area
   */
  async delete(id: string): Promise<ApiResponse<void>> {
    const response = await api.delete<ApiResponse<void>>(`/area-unit/${id}`);
    return response.data;
  }
}

export const unitAreaService = new UnitAreaService();
