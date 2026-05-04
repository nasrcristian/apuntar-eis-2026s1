// hooks/useMaterials.js
import { useState, useCallback } from 'react';

export const useMaterials = () => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAllMaterials = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:8080/materiales`);
      if (!response.ok) throw new Error('Error al cargar materiales');
      
      const data = await response.json();
      
      setMaterials(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteMaterial = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/materiales/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('No se ha podido eliminar el contenido');
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  return { materials, loading, error, fetchAllMaterials, deleteMaterial };
};