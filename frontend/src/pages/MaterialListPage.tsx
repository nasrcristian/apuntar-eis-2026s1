import { useEffect, useState } from "react";
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
  TextField,
  Stack,
} from "@mui/material";
import type { AlertColor } from "@mui/material";
import FindInPageIcon from "@mui/icons-material/FindInPage";
import MaterialCard from "../components/MaterialCard";
import { useMaterials } from "../hooks/useMaterials";
import { enqueueSnackbar } from "notistack";

type NotificationState = {
  open: boolean;
  message: string;
  severity: AlertColor;
};

const MaterialListPage = () => {
  const { materials, loading, fetchAllMaterials, deleteMaterial, getMaterial } =
    useMaterials();
  const [openModal, setOpenModal] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<any | null>(null);
  const [inputBusqueda, setInputBusqueda] = useState<string>("");
  const [notification, setNotification] = useState<NotificationState>({
    open: false,
    message: "",
    severity: "success",
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
      setNotification({
        open: true,
        message: "eliminación exitosa",
        severity: "success",
      });
      fetchAllMaterials();
    } else {
      setNotification({
        open: true,
        message: "No se ha podido eliminar el contenido, reinténtelo mas tarde",
        severity: "error",
      });
    }
    setOpenModal(false);
  };

  const handleSearch = async (type: number) => {
    if (inputBusqueda.length < 1) {
      enqueueSnackbar("Tenes que ingresar algo para buscar", {
        variant: "error",
      });
    } else {
      const busquedaObj = {
        type,
        detalle: inputBusqueda,
      };
      await getMaterial(busquedaObj);
    }
  };

  /* 
   1 es busqueda por nombre
   2 por tema
   3 .....
  
  */

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography
        variant="h4"
        sx={{ fontWeight: "bold", mb: 4, color: "#1976d2" }}
      >
        Biblioteca de Apuntes
      </Typography>
      <Stack
        direction="row"
        spacing={2}
        sx={{
          display: "flex",
          justifyContent: "center",
          mb: 3,
        }}
      >
        <TextField
          placeholder="Escribi lo que necesitas buscar..."
          onChange={(e) => setInputBusqueda(e.target.value)}
          disabled={loading}
          variant="outlined"
          fullWidth
          value={inputBusqueda}
        />
        <Button
          variant="contained"
          onClick={() => handleSearch(1)}
          disabled={loading}
          startIcon={<FindInPageIcon />}
        >
          Buscar
        </Button>
      </Stack>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", my: 10 }}>
          <CircularProgress size={60} />
        </Box>
      ) : [1].length > 0 ? (
        // Contenedor simple para lista vertical
        <>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            {materials.map((m: any) => (
              <MaterialCard
                key={m.id}
                material={m}
                onDelete={() => handleDeleteClick(m)}
              />
            ))}
          </Box>
        </>
      ) : (
        <Typography align="center" color="text.secondary">
          No hay materiales disponibles actualmente.
        </Typography>
      )}

      {/* Modal de Confirmación */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <DialogTitle>¿Eliminar material?</DialogTitle>
        <DialogContent>
          Confirmas que deseas dar de baja:{" "}
          <strong>{selectedMaterial?.title}</strong>? Esta acción impactará
          directamente en la base de datos.
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenModal(false)} color="inherit">
            Cancelar
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
          >
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={() => setNotification({ ...notification, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={notification.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default MaterialListPage;
