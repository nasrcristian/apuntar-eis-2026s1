import { useNavigate } from 'react-router-dom';
import MaterialListPage from './MaterialListPage';
import { getMyMaterials } from '../service/api';

export default function MyMaterialsPage() {
  const navigate = useNavigate();

  return (
    <MaterialListPage
      title="Mis publicaciones"
      fetchFn={getMyMaterials}
      emptyMessage="Aún no has publicado nada. Subí tu primera publicación haciendo click en 'Subir publicación'."
      emptyAction={{
        label: 'Subir publicación',
        onClick: () => navigate('/create')
      }}
    />
  );
}