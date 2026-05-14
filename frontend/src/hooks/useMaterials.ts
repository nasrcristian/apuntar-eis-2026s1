// hooks/useMaterials.js
import { useState, useCallback } from "react";

export const useMaterials = () => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // const token = localStorage.getItem("jwt");
  // comentado por el warning nomas

  interface busquedaObj {
    detalle: string;
    type: number;
  }

  /* 
    To do:
    Refactorizar con axios ver como lo hizo cris antes
  */

  const fetchAllMaterials = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:8080/materiales`);
      if (!response.ok) throw new Error("Error al cargar materiales");

      const data = await response.json();

      setMaterials(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteMaterial = async (id: any) => {
    try {
      const response = await fetch(`http://localhost:8080/materiales/${id}`, {
        method: "DELETE",
      });
      if (!response.ok)
        throw new Error("No se ha podido eliminar el contenido");
      return { success: true };
    } catch (err: any) {
      return { success: false, message: err.message };
    }
  };

  const getMaterial = async (input: busquedaObj) => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8080/materiales/${input}`,
        {
          method: "GET",
        },
      );
      return {
        success: true,
        materiales: response,
      };
    } catch (error) {}
    setLoading(false);
  };

  return {
    materials,
    loading,
    error,
    fetchAllMaterials,
    deleteMaterial,
    getMaterial,
  };
};
