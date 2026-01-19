import { api } from "@/lib/api-client";
import { PaginatedResponse, ApiResponse } from "@/types/api";
import { FeedTypeFormValues } from "@/types/schemas/feed-type.schema";

// --- Types untuk Response Data ---
export interface FeedTypeListItem {
  id: string;
  feed_type_name: string;
  description: string;
  minimum_stock: number;
  warning_stock: number;
  waste_ratio: number;
  feed_category_id: number;
  unit_id: number;
  created_at: string;
  updated_at: string;
}

export interface FeedTypeDetail extends FeedTypeListItem {
  feed_category?: {
    id: string;
    category_name: string;
  };
  unit?: {
    id: string;
    name: string;
  };
}

// --- Service Class ---
class FeedTypeService {
  /**
   * Fetch daftar feed type dengan pagination dan search
   */
  async getList(params: {
    page?: number;
    limit?: number;
    keyword?: string;
  }): Promise<PaginatedResponse<FeedTypeListItem>> {
    const { page = 1, limit = 20, keyword = "" } = params;

    const response = await api.get<PaginatedResponse<FeedTypeListItem>>(
      "/feed/type",
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
  async getById(id: string): Promise<ApiResponse<FeedTypeDetail>> {
    const response = await api.get<ApiResponse<FeedTypeDetail>>(
      `/feed/type/${id}`,
    );
    return response.data;
  }

  /**
   * Create baru
   */
  async create(data: FeedTypeFormValues): Promise<ApiResponse<FeedTypeDetail>> {
    const response = await api.post<ApiResponse<FeedTypeDetail>>(
      "/feed/type",
      data,
    );
    return response.data;
  }

  /**
   * Update
   */
  async update(
    id: string,
    data: FeedTypeFormValues,
  ): Promise<ApiResponse<FeedTypeDetail>> {
    const response = await api.put<ApiResponse<FeedTypeDetail>>(
      `/feed/type/${id}`,
      data,
    );
    return response.data;
  }

  /**
   * Delete
   */
  async delete(id: string): Promise<ApiResponse<void>> {
    const response = await api.delete<ApiResponse<void>>(`/feed/type/${id}`);
    return response.data;
  }
}

export const feedTypeService = new FeedTypeService();
