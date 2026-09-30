interface Props {
  onClick: () => void;
  label?: string;
}

export function BackButton({ onClick, label = 'Назад' }: Props) {
  return (
    <button className="back-button" onClick={onClick} aria-label={label}>
      ← {label}
    </button>
  );
}
