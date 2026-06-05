import { materias } from '../../constants/materialOptions'
import SelectFilter from '../SelectFilter/SelectFilter'

interface SubjectFilterProps {
  value: string
  onChange: (value: string) => void
}

export default function SubjectFilter({ value, onChange }: SubjectFilterProps) {
  return (
    <SelectFilter
      label="Filtrar por materia"
      options={materias}
      value={value}
      onChange={onChange}
    />
  )
}
