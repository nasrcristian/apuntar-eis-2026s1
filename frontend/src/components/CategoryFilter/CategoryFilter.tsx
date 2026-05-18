import { TextField, MenuItem, Button, Box } from '@mui/material'
import { categorias } from '../../constants/materialOptions'
import './CategoryFilter.css'
import { useState } from 'react'

interface CategoryFilterProps {
  value: string
  onChange: (value: string) => void
}

export default function CategoryFilter({value, onChange}: CategoryFilterProps) {

  const [label, setLabel] = useState("")

  const defaultValue = "Ver todos";

  function setValueAndLabel(value: string){
    setLabel(value)
    onChange(value === defaultValue? "" : value)
  }


  return (
    <Box className="category-filter">
      <TextField
        select
        label="Categoría"
        value={label}
        onChange={(e) => setValueAndLabel(e.target.value)}
        className="category-filter__select"
      >
        <MenuItem key="" value={defaultValue}>Ver todos</MenuItem>
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
