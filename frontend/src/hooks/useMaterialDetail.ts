import { useState, useEffect } from "react";
import type { MaterialDTO } from "../types/material";
import { getMaterial } from "../service/api";

interface UseMaterialDetailReturn {
  data: MaterialDTO | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useMaterialDetail(id: number): UseMaterialDetailReturn {
  const [data, setData] = useState<MaterialDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getMaterial(id);
      setData(res.data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al cargar el material",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  return { data, loading, error, refetch: fetchData };
}
