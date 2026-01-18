import { api } from "@/lib/api-client";
import { PaginatedResponse, ApiResponse } from "@/types/api";
import { FeedCategoryFormValues } from "@/types/schemas/feed-category.schema";

// --- Types untuk Response Data ---
export interface FeedCategoryListItem {
  id: string;
  category_name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface FeedCategoryDetail extends FeedCategoryListItem {
  feed_category_details_info?: string;
}

// --- Service Class ---
class FeedCategoryService {
  /**
   * Fetch daftar feed category dengan pagination dan search
   */
  async getList(params: {
    page?: number;
    limit?: number;
    keyword?: string;
  }): Promise<PaginatedResponse<FeedCategoryListItem>> {
    const { page = 1, limit = 20, keyword = "" } = params;

    const response = await api.get<PaginatedResponse<FeedCategoryListItem>>(
      "/feed/categories",
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
  async getById(id: string): Promise<ApiResponse<FeedCategoryDetail>> {
    const response = await api.get<ApiResponse<FeedCategoryDetail>>(
      `/feed/categories/${id}`,
    );
    return response.data;
  }

  /**
   * Create baru
   */
  async create(
    data: FeedCategoryFormValues,
  ): Promise<ApiResponse<FeedCategoryDetail>> {
    const response = await api.post<ApiResponse<FeedCategoryDetail>>(
      "/feed/categories",
      data,
    );
    return response.data;
  }

  /**
   * Update
   */
  async update(
    id: string,
    data: FeedCategoryFormValues,
  ): Promise<ApiResponse<FeedCategoryDetail>> {
    const response = await api.put<ApiResponse<FeedCategoryDetail>>(
      `/feed/categories/${id}`,
      data,
    );
    return response.data;
  }

  /**
   * Delete
   */
  async delete(id: string): Promise<ApiResponse<void>> {
    const response = await api.delete<ApiResponse<void>>(
      `/feed/categories/${id}`,
    );
    return response.data;
  }
}

export const feedCategoryService = new FeedCategoryService();
