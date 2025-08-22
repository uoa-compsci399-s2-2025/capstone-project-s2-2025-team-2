interface AuthInputBoxProps {
  id: string
  name: string
  type: "email" | "password" | "text"
  label: string
  placeholder: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  required?: boolean
}

export default function AuthInputBox({
  id,
  name,
  type,
  label,
  placeholder,
  value,
  onChange,
  required = false
}: AuthInputBoxProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-white">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        value={value}
        onChange={onChange}
        className="mt-1 block w-full px-3 py-2 border border-muted rounded-md shadow-sm placeholder-secondary bg-primary text-white focus:outline-none focus:ring-2 focus:ring-blue-primary focus:border-blue-primary transition-colors"
        placeholder={placeholder}
      />
    </div>
  )
}
