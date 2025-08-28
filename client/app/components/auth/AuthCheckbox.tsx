interface AuthCheckboxProps {
  id: string
  name: string
  label: string
  checked?: boolean
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export default function AuthCheckbox({
  id,
  name,
  label,
  checked,
  onChange,
}: AuthCheckboxProps) {
  return (
    <div className="flex items-center">
      <input
        id={id}
        name={name}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 text-blue-primary focus:ring-blue-primary border-muted rounded"
      />
      <label htmlFor={id} className="ml-2 block text-sm text-secondary">
        {label}
      </label>
    </div>
  )
}
