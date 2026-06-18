import { useNavigate } from 'react-router-dom';
import MaterialListPage from './MaterialListPage';
import { getMyFavorites } from '../service/api';

export default function FavoritesPage() {
  const navigate = useNavigate();

  return (
    <MaterialListPage
      title="Mis favoritos"
      fetchFn={getMyFavorites}
      emptyMessage="Aún no has marcado como favorita ninguna publicación."
      emptyAction={{
        label: 'Explorar materiales',
        onClick: () => navigate('/library'),
      }}
    />
  );
}
