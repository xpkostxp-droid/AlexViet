// Простые линейные иконки без внешних зависимостей.
// Цвет наследуется от текста (currentColor), поэтому иконки подстраиваются
// под цвет плитки, на которой находятся.

interface IconProps {
  className?: string;
}

export function BookIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path
        d="M4 5.5C4 4.67 4.67 4 5.5 4H11a1 1 0 0 1 1 1v15a1 1 0 0 0-1-1H5.5A1.5 1.5 0 0 1 4 17.5v-12Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M20 5.5c0-.83-.67-1.5-1.5-1.5H13a1 1 0 0 0-1 1v15a1 1 0 0 1 1-1h5.5a1.5 1.5 0 0 0 1.5-1.5v-12Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CardsIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect
        x="6.5"
        y="3.5"
        width="12"
        height="15"
        rx="2.2"
        transform="rotate(6 12.5 11)"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <rect x="4.5" y="5.5" width="12" height="15" rx="2.2" fill="var(--color-surface, #fff)" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8 11h6M8 14.5h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function SpeakerOnIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path
        d="M4 9.5v5a1 1 0 0 0 1 1h2.7l4.3 3.4a.6.6 0 0 0 .97-.47V6.57a.6.6 0 0 0-.97-.47L7.7 9.5H5a1 1 0 0 0-1 1Z"
        fill="currentColor"
      />
      <path
        d="M16.2 8.2a5.5 5.5 0 0 1 0 7.6M18.6 5.8a9 9 0 0 1 0 12.4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function SpeakerOffIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path
        d="M4 9.5v5a1 1 0 0 0 1 1h2.7l4.3 3.4a.6.6 0 0 0 .97-.47V6.57a.6.6 0 0 0-.97-.47L7.7 9.5H5a1 1 0 0 0-1 1Z"
        fill="currentColor"
      />
      <path d="M16 9.5l4.5 5M20.5 9.5 16 14.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function ChevronRightIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
