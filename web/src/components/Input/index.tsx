import './styles.css';

export function Input({
  placeholder,
  type,
  name,
  value,
  onChange,
}: {
  placeholder: string;
  type: string;
  name: string;
  value: string;
  onChange: any;
}) {
  return (
    <input
      placeholder={placeholder}
      type={type}
      name={name}
      value={value}
      onChange={onChange}
    ></input>
  );
}
