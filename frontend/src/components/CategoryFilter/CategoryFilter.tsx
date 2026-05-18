import { TextField, MenuItem, Button, Box } from '@mui/material'
import { categorias } from '../../constants/materialOptions'
import './CategoryFilter.css'

interface CategoryFilterProps {
  value: string
  onChange: (value: string) => void
}

export default function CategoryFilter({ value, onChange }: CategoryFilterProps) {
  return (
    <Box className="category-filter">
      <TextField
        select
        label="Categoría"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="category-filter__select"
      >
        <MenuItem key="" value="">Ver todos</MenuItem>
        {categorias.map((c) => (
          <MenuItem key={c.value} value={c.value}>
            {c.label}
          </MenuItem>
        ))}
      </TextField>
      {value && (
        <Button variant="outlined" size="small" onClick={() => onChange('')}>
          Limpiar filtro
        </Button>
      )}
    </Box>
  )
}
