// hooks/useMaterials.js
import { useState, useCallback } from "react";
import {
  getAllMaterials,
  deleteMaterial,
  getMaterialFiltrado,
} from "../service/api";
import type { MaterialDTO } from "../types/material";
import { enqueueSnackbar } from "notistack";

export const useMaterials = () => {
  const [materials, setMaterials] = useState<MaterialDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // const token = localStorage.getItem("jwt");
  // comentado por el warning nomas

  interface busquedaObj {
    detalle: string;
    type: number;
  }

  const fetchAllMaterials = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAllMaterials();

      setMaterials(response.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const delMaterial = async (id: any) => {
    try {
      await deleteMaterial(id);

      enqueueSnackbar("Material eliminado con exito", { variant: "success" });
      return { success: true };
    } catch (err: any) {
      enqueueSnackbar(err.message, { variant: "error" });
      return { success: false, message: err.message };
    }
  };

  const getMaterial = async (input: busquedaObj) => {
    setLoading(true);
    try {
      const response = await getMaterialFiltrado(input.detalle, input.type);
      setMaterials(response.data);
    } catch (error) {}
    setLoading(false);
  };

  return {
    materials,
    loading,
    error,
    fetchAllMaterials,
    delMaterial,
    getMaterial,
  };
};
