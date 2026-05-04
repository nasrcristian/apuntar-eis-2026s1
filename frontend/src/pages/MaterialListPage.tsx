import { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Alert,
  Snackbar,
  CircularProgress,
} from '@mui/material';
import type { AlertColor } from '@mui/material';
import MaterialCard from '../components/MaterialCard';
import { useMaterials } from '../hooks/useMaterials';

type NotificationState = { open: boolean; message: string; severity: AlertColor };

const MaterialListPage = () => {
  const { materials, loading, fetchAllMaterials, deleteMaterial } = useMaterials();
  const [openModal, setOpenModal] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<any | null>(null);
  const [notification, setNotification] = useState<NotificationState>({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    fetchAllMaterials();
  }, [fetchAllMaterials]);

  const handleDeleteClick = (material: any) => {
    setSelectedMaterial(material);
    setOpenModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedMaterial) return;

    const result = await deleteMaterial(selectedMaterial.id);

    if (result.success) {
      setNotification({ open: true, message: 'eliminación exitosa', severity: 'success' });
      fetchAllMaterials();
    } else {
      setNotification({
        open: true,
        message: 'No se ha podido eliminar el contenido, reinténtelo mas tarde',
        severity: 'error',
      });
    }
    setOpenModal(false);
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 4, color: '#1976d2' }}>
        Biblioteca de Apuntes
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 10 }}>
          <CircularProgress size={60} />
        </Box>
      ) : materials.length > 0 ? (
        // Contenedor simple para lista vertical
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          {materials.map((m: any) => (
            <MaterialCard 
              key={m.id} 
              material={m} 
              onDelete={() => handleDeleteClick(m)} 
            />
          ))}
        </Box>
      ) : (
        <Typography align="center" color="text.secondary">
          No hay materiales disponibles actualmente.
        </Typography>
      )}

      {/* Modal de Confirmación */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <DialogTitle>¿Eliminar material?</DialogTitle>
        <DialogContent>
          Confirmas que deseas dar de baja: <strong>{selectedMaterial?.title}</strong>?
          Esta acción impactará directamente en la base de datos.
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenModal(false)} color="inherit">Cancelar</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">Confirmar</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={() => setNotification({ ...notification, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={notification.severity} variant="filled" sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default MaterialListPage;