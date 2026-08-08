interface EmptyStateProps {
  message?: string;
}

export default function EmptyState({ message = "Data tidak ditemukan." }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
      <svg className="h-10 w-10 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
        />
      </svg>
      <p className="text-sm text-zinc-400">{message}</p>
    </div>
  );
}