import { Autocomplete, TextField } from '@mui/material'

export interface FilterOption {
  value: string
  label: string
}

interface SelectFilterProps {
  label: string
  options: FilterOption[]
  value: string
  onChange: (value: string) => void
}

export default function SelectFilter({
  label,
  options,
  value,
  onChange,
}: SelectFilterProps) {
  const selectedOption = options.find((o) => o.value === value) ?? null

  return (
    <Autocomplete
      options={options}
      value={selectedOption}
      onChange={(_, newValue) => onChange(newValue?.value ?? '')}
      getOptionLabel={(option) => option.label}
      isOptionEqualToValue={(option, val) => option.value === val.value}
      sx={{ minWidth: 220 }}
      renderInput={(params) => <TextField {...params} label={label} />}
    />
  )
}
