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
  FormControl,
  OutlinedInput,
  Stack,
  IconButton,
  InputAdornment,
} from "@mui/material";
import type { AlertColor } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import MaterialCard from "../components/MaterialCard";
import { useMaterials } from "../hooks/useMaterials";
import { enqueueSnackbar } from "notistack";

type NotificationState = {
  open: boolean;
  message: string;
  severity: AlertColor;
};

const MaterialListPage = () => {
  const { materials, loading, fetchAllMaterials, delMaterial, getMaterial } =
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

    const result = await delMaterial(selectedMaterial.id);

    if (result.success) {
      fetchAllMaterials();
    }
    setOpenModal(false);
  };

  const handleSearch = async () => {
    if (inputBusqueda.length > 99) {
      enqueueSnackbar(
        `La búsqueda es demasiado larga. Usá menos de 100 caracteres.`,
        { variant: "error" },
      );
    } else if (inputBusqueda.length < 1) {
      await fetchAllMaterials();
    } else {
      await getMaterial(inputBusqueda.trim());
    }
  };

  const handleCleanText = async () => {
    setInputBusqueda("");
    await fetchAllMaterials();
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
        <FormControl variant="outlined" fullWidth>
          <OutlinedInput
            placeholder="Buscar por nombre, descripción o título de archivo..."
            onChange={(e) => setInputBusqueda(e.target.value)}
            disabled={loading}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
            fullWidth
            value={inputBusqueda}
            endAdornment={
              <InputAdornment position="end">
                <IconButton onClick={handleCleanText} edge="end">
                  <CloseIcon />
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>
        <IconButton onClick={handleSearch} disabled={loading}>
          <SearchIcon />
        </IconButton>
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
