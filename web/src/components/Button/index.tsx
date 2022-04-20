import './styles.css';

export function Button({ texto, type }: { texto: string; type: 'button' | 'submit' | 'reset' }) {
  return <button type={type}>{texto}</button>;
}
