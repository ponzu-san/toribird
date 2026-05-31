import { BirdSilhouette, Footprints } from "@/components/icons/BirdDecor";

interface LoadingStateProps {
  message?: string;
  className?: string;
}

export default function LoadingState({ message = "読み込み中...", className = "" }: LoadingStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-16 ${className}`}>
      <div className="relative mb-4">
        <BirdSilhouette className="h-16 w-16 text-primary" />
        <Footprints className="absolute -bottom-2 left-1/2 h-5 w-10 -translate-x-1/2 text-fields animate-footprint" />
      </div>
      <p className="text-sm font-medium text-muted">{message}</p>
    </div>
  );
}
