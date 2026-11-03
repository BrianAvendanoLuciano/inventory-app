export const ListIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={20}
      height={20}
      viewBox="0 0 20 20"
      fill="none"
    >
      <path
        d="M7.5 5H16.6667"
        stroke="#52525B"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.5 10H16.6667"
        stroke="#52525B"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.5 15H16.6667"
        stroke="#52525B"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.16669 5V5.00667"
        stroke="#52525B"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.16669 10V10.0067"
        stroke="#52525B"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.16669 15V15.0067"
        stroke="#52525B"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const TagIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={20}
      height={20}
      viewBox="0 0 20 20"
      fill="none"
    >
      <path
        d="M9.16667 2.5L16.6667 10C17.0911 10.4745 17.0911 11.1922 16.6667 11.6667L11.6667 16.6667C11.1922 17.0911 10.4745 17.0911 10 16.6667L2.5 9.16667V5.83333C2.5 3.99238 3.99238 2.5 5.83333 2.5H9.16667"
        stroke="#52525B"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx="7.50004"
        cy="7.49967"
        r="1.66667"
        stroke="#52525B"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const ProductIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={22}
      height={22}
      viewBox="0 0 22 22"
      fill="none"
      stroke="#52525B"
      stroke-width="1.25"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M21 8L12 3L3 8L12 13L21 8Z" />
      <path d="M3 8V16L12 21L21 16V8" />
      <path d="M12 13V21" />
    </svg>
  );
};

type DeleteIconProps = {
  className?: string
  width?: number
  height?: number
}

export const DeleteIcon = ({
  className = '',
  width = 20,
  height = 20,
}: DeleteIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* lid */}
      <path d="M3 6h18" />
      {/* handle */}
      <path d="M8 6V4h8v2" />
      {/* bin */}
      <path d="M6 6l1 14h10l1-14" />
      {/* lines */}
      <path d="M10 11v6" />
      <path d="M14 11v6" />
    </svg>
  )
}

type AddIconProps = {
  className?: string
  width?: number
  height?: number
}

export const AddIcon = ({
  className = '',
  width = 20,
  height = 20,
}: AddIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  )
}

export const PreviewIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.8}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.25 12s3.75-7.5 9.75-7.5S21.75 12 21.75 12s-3.75 7.5-9.75 7.5S2.25 12 2.25 12z"
    />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export const PrintIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.8}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 9V4h12v5M6 18h12v2H6v-2zM6 14h12"
    />
    <rect x="4" y="9" width="16" height="9" rx="2" />
  </svg>
);