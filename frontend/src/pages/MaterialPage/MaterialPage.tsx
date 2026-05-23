import { useParams } from "react-router-dom";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useMaterialDetail } from "../../hooks/useMaterialDetail";
import MaterialDetail from "../../components/MaterialDetail/MaterialDetail";
import "./MaterialPage.css";

export default function MaterialPage() {
  const { id } = useParams<{ id: string }>();
  const materialId = Number(id);
  const { data, loading, reactions } = useMaterialDetail(materialId);

  if (loading) {
    return (
      <Box className="material-page__loading">
        <CircularProgress />
      </Box>
    );
  }

  if (!data) {
    return (
      <Box className="material-page__empty">
        <Typography>Material no encontrado</Typography>
      </Box>
    );
  }

  return <MaterialDetail material={data} reactions={reactions} />;
}
