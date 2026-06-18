import { categorias } from '../../constants/materialOptions'
import SelectFilter from '../SelectFilter/SelectFilter'

interface CategoryFilterProps {
  value: string
  onChange: (value: string) => void
}

export default function CategoryFilter({ value, onChange }: CategoryFilterProps) {
  return (
    <SelectFilter
      label="Filtrar por categoría"
      options={categorias}
      value={value}
      onChange={onChange}
    />
  )
}
