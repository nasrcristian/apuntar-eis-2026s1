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
import MaterialCard from "../components/MaterialCard";
import CategoryFilter from "../components/CategoryFilter/CategoryFilter";
import type { AlertColor } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import { useMaterials } from "../hooks/useMaterials";
import { enqueueSnackbar } from "notistack";
import { categorias } from "../constants/materialOptions";
import type { ResolvedResponse } from "../service/api";
import type { MaterialDTO } from "../types/material";
import InfiniteScroll from "react-infinite-scroll-component";

type NotificationState = {
  open: boolean;
  message: string;
  severity: AlertColor;
};

const PAGE_SIZE = 4;

interface MaterialListPageProps {
  title?: string;
  fetchFn?: () => Promise<ResolvedResponse<MaterialDTO[]>>;
  emptyMessage?: string;
  emptyAction?: { label: string; onClick: () => void };
}

const MaterialListPage = ({
  title = "Biblioteca de Apuntes",
  fetchFn,
  emptyMessage = "No hay materiales disponibles actualmente.",
  emptyAction,
}: MaterialListPageProps = {}) => {
  const { materials, loading, fetchAllMaterials, delMaterial, getMaterial } =
    useMaterials(fetchFn);
  const [openModal, setOpenModal] = useState(false);
  const [snackOpen, setSnackOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<any | null>(null);
  const [inputBusqueda, setInputBusqueda] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [notification, setNotification] = useState<NotificationState>({
    open: false,
    message: "",
    severity: "success",
  });

  const filteredMaterials = selectedCategory
    ? materials.filter((m: any) => m.category === selectedCategory)
    : materials;

  useEffect(() => {
    fetchAllMaterials();
  }, [fetchAllMaterials]);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [selectedCategory]);

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

  const loadMore = () => {
      setVisibleCount((c) => Math.min(c + PAGE_SIZE, filteredMaterials.length));
  }

  const handleSearch = async () => {
    setVisibleCount(PAGE_SIZE);
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
    setVisibleCount(PAGE_SIZE);
    setInputBusqueda("");
    await fetchAllMaterials();
  };

  const selectedCategoryLabel =
    categorias.find((c) => c.value === selectedCategory)?.label ?? "";

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography
        variant="h4"
        sx={{ fontWeight: "bold", mb: 2, color: "#1976d2" }}
      >
        {title}
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

      <CategoryFilter value={selectedCategory} onChange={setSelectedCategory} />

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", my: 10 }}>
          <CircularProgress size={60} />
        </Box>
      ) : filteredMaterials.length > 0 ? (
        <InfiniteScroll
          dataLength={Math.min(visibleCount, filteredMaterials.length)}
          next={loadMore}
          hasMore={visibleCount < filteredMaterials.length}
          loader={
            <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
              <CircularProgress size={30} />
            </Box>
          }
          style={{ overflow: "visible" }}
        >
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            {filteredMaterials.slice(0, visibleCount).map((m: any) => (
              <MaterialCard
                key={m.id}
                material={m}
                onDelete={() => handleDeleteClick(m)}
                onEditSuccess={() => {
                  setNotification({
                    open: true,
                    message: "Cambios guardados correctamente",
                    severity: "success",
                  });
                  fetchAllMaterials();
                }}
              />
            ))}
          </Box>
        </InfiniteScroll>
      ) : selectedCategory ? (
        <Typography align="center" color="text.secondary">
          No hay materiales para la categoria {selectedCategoryLabel}. Probá con
          otra categoria o subi nuevo material.
        </Typography>
      ) : (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            {emptyMessage}
          </Typography>
          {emptyAction && (
            <Button variant="contained" onClick={emptyAction.onClick}>
              {emptyAction.label}
            </Button>
          )}
        </Box>
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