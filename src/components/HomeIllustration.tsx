// Декоративная заставка главного экрана.
// Это простой плоский рисунок собственного изготовления (горы, фонарики,
// кофе с фильтром phin) — не копия и не имитация присланного макета.
// Если позже появятся настоящие иллюстрации (например, акварельная сцена
// в стиле макета), эту заставку можно будет заменить на <img>, не трогая
// остальной интерфейс.
export function HomeIllustration() {
  return (
    <svg viewBox="0 0 400 150" xmlns="http://www.w3.org/2000/svg" role="presentation" aria-hidden="true">
      {/* Дальние горы */}
      <path
        d="M0 130 L60 72 L100 106 L150 58 L210 110 L260 82 L320 118 L400 92 L400 150 L0 150 Z"
        fill="var(--color-primary)"
        opacity="0.16"
      />
      {/* Ближние горы */}
      <path
        d="M0 150 L40 112 L90 140 L140 98 L190 140 L250 108 L300 140 L360 116 L400 138 L400 150 L0 150 Z"
        fill="var(--color-primary)"
        opacity="0.3"
      />

      {/* Фонарик слева */}
      <g stroke="#b0524a" strokeWidth="1.6" fill="none" opacity="0.85">
        <line x1="66" y1="4" x2="66" y2="16" />
        <rect x="56" y="16" width="20" height="26" rx="9" fill="#fdf1ec" stroke="#b0524a" />
        <line x1="66" y1="42" x2="66" y2="50" />
      </g>

      {/* Фонарик справа */}
      <g stroke="#b0524a" strokeWidth="1.6" fill="none" opacity="0.85">
        <line x1="332" y1="10" x2="332" y2="20" />
        <rect x="322" y="20" width="20" height="26" rx="9" fill="#fdf1ec" stroke="#b0524a" />
        <line x1="332" y1="46" x2="332" y2="54" />
      </g>

      {/* Кофе с фильтром phin, нижний правый угол */}
      <g transform="translate(178,98)" stroke="var(--color-primary-dark)" strokeWidth="1.7" fill="none" opacity="0.9">
        <ellipse cx="16" cy="40" rx="17" ry="5" />
        <path d="M2 40 L6 16 A10 10 0 0 1 26 16 L30 40" />
        <rect x="3" y="4" width="26" height="10" rx="3" />
        <line x1="16" y1="14" x2="16" y2="20" />
      </g>
    </svg>
  );
}
