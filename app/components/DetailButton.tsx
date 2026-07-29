import Link from "next/link";
import { Category } from "@/app/lib/type";

interface DetailButtonProps {
  id: number | string;
  type: Category;
  className?: string;
}

export default function DetailButton({ id, type, className = "" }: DetailButtonProps) {
  return (
    <Link
      href={`/${type}/${id}`}
      className={`inline-flex items-center justify-center gap-1.5 rounded-md bg-indigo-600 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-indigo-500 active:bg-indigo-700 ${className}`}
    >
      Detail
      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
      </svg>
    </Link>
  );
}