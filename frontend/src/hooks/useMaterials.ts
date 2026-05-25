// hooks/useMaterials.js
import { useState, useCallback } from "react";
import {
  getAllMaterials,
  deleteMaterial,
  getMaterialFiltrado,
  reactToMaterial,
  removeReaction,
  addComment,
  deleteComment,
} from "../service/api";
import type { AddCommentDTO, MaterialDTO } from "../types/material";
import { enqueueSnackbar } from "notistack";

export const useMaterials = () => {
  const [materials, setMaterials] = useState<MaterialDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // const token = localStorage.getItem("jwt");
  // comentado por el warning nomas

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

  const getMaterial = async (detalle: string) => {
    setLoading(true);
    try {
      const response = await getMaterialFiltrado(detalle);
      if (response.data.length < 1) {
        enqueueSnackbar(
          `No se encontraron resultados para ${detalle}. Probá con otras palabras.`,
          { variant: "error" },
        );
      } else {
        setMaterials(response.data);
      }
    } catch (error) {
      enqueueSnackbar(
        `No se encontraron resultados para ${detalle}. Probá con otras palabras.`,
        { variant: "error" },
      );
    }
    setLoading(false);
  };

  const valueMaterial = async (type: "LIKE" | "DISLIKE", materialId: any) => {
    setLoading(true);
    try {
      await reactToMaterial(materialId, type);
      enqueueSnackbar("Material valorado con exito", { variant: "success" });
    } catch (error) {
      enqueueSnackbar(`Error al valorar el material. Pruebe mas tarde`, {
        variant: "error",
      });
    }
    setLoading(false);
  };

  const unvalueMaterial = async (materialId: any) => {
    setLoading(true);
    try {
      await removeReaction(materialId);
      enqueueSnackbar("Material valorado con exito", { variant: "success" });
    } catch (error) {
      enqueueSnackbar(`Error al valorar el material. Pruebe mas tarde`, {
        variant: "error",
      });
    }
    setLoading(false);
  };

  const saveComment = async (materialId: any, comment: AddCommentDTO) => {
    setLoading(true);
    try {
      await addComment(materialId, comment.text, comment.authorName);
      enqueueSnackbar("Comentario guardado con exito", { variant: "success" });
    } catch (error) {
      enqueueSnackbar(`Error al comentar el material. Pruebe mas tarde`, {
        variant: "error",
      });
    }
    setLoading(false);
  };

  const delComment = async (materialId: any, commentId: string) => {
    setLoading(true);
    try {
      await deleteComment(materialId, commentId);
      enqueueSnackbar("Comentario eliminado con exito", { variant: "success" });
    } catch (error) {
      enqueueSnackbar(`Error al comentar el material. Pruebe mas tarde`, {
        variant: "error",
      });
    }
    setLoading(false);
  };

  return {
    materials,
    loading,
    error,
    fetchAllMaterials,
    delMaterial,
    getMaterial,
    valueMaterial,
    unvalueMaterial,
    saveComment,
    delComment,
  };
};
