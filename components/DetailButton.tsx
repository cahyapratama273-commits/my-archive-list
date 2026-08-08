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
      className={`inline-flex items-center justify-center rounded-lg bg-indigo-600/90 py-2 text-xs font-bold text-white transition-all duration-200 hover:bg-indigo-600 active:scale-[0.98] shadow-md shadow-indigo-500/10 ${className}`}
    >
      Detail
    </Link>
  );
}