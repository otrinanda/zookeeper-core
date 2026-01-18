import { api } from "@/lib/api-client";
import { PaginatedResponse, ApiResponse } from "@/types/api";
import { ZoneAreaFormValues } from "@/types/schemas/zone-area.schema";

// --- Types untuk Response Data ---
export interface ZoneAreaListItem {
  id: string;
  name: string;
  description: string;
  unit_id: string;
  unit_name?: string;
  created_at: string;
  updated_at: string;
}

export type ZoneAreaDetail = ZoneAreaListItem;

// --- Service Class ---
class ZoneAreaService {
  /**
   * Fetch daftar zone area dengan pagination dan search
   */
  async getList(params: {
    page?: number;
    limit?: number;
    keyword?: string;
  }): Promise<PaginatedResponse<ZoneAreaListItem>> {
    const { page = 1, limit = 20, keyword = "" } = params;

    const response = await api.get<PaginatedResponse<ZoneAreaListItem>>(
      "/area-zona",
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
   * Fetch detail zone area by ID
   */
  async getById(id: string): Promise<ApiResponse<ZoneAreaDetail>> {
    const response = await api.get<ApiResponse<ZoneAreaDetail>>(
      `/area-zona/${id}`,
    );
    return response.data;
  }

  /**
   * Create zone area baru
   */
  async create(data: ZoneAreaFormValues): Promise<ApiResponse<ZoneAreaDetail>> {
    const response = await api.post<ApiResponse<ZoneAreaDetail>>(
      "/area-zona",
      data,
    );
    return response.data;
  }

  /**
   * Update zone area
   */
  async update(
    id: string,
    data: ZoneAreaFormValues,
  ): Promise<ApiResponse<ZoneAreaDetail>> {
    const response = await api.put<ApiResponse<ZoneAreaDetail>>(
      `/area-zona/${id}`,
      data,
    );
    return response.data;
  }

  /**
   * Delete zone area
   */
  async delete(id: string): Promise<ApiResponse<void>> {
    const response = await api.delete<ApiResponse<void>>(`/area-zona/${id}`);
    return response.data;
  }
}

export const zoneAreaService = new ZoneAreaService();
