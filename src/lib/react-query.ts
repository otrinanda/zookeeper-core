import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Data dianggap "fresh" selama 1 menit (tidak refetch otomatis)
      staleTime: 1000 * 60 * 1, 
      
      // Jika error, retry 1 kali saja sebelum gagal total
      retry: 1, 
      
      // Matikan refetch saat pindah window (opsional, biar tidak ganggu saat debug)
      refetchOnWindowFocus: false,
    },
  },
});