"use client";

import Image from "next/image";
import { DEFAULT_AVATAR_URL } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface AvatarProps {
  src?: string;
  alt: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  borderColor?: string;
}

const sizeClasses = {
  sm: "w-12 h-12",
  md: "w-16 h-16",
  lg: "w-20 h-20",
  xl: "w-24 h-24",
};

// Permite sobrescrever tamanho com className
const getSizeClass = (size: string, className?: string) => {
  if (className?.includes("w-") || className?.includes("h-")) {
    return ""; // Se className tem tamanho, não aplica sizeClasses
  }
  return sizeClasses[size as keyof typeof sizeClasses] || sizeClasses.md;
};

const borderClasses = {
  default: "border-2 border-white/90",
  primary: "border-2 border-primary/30",
  strong: "border-4 border-white/90",
};

export function Avatar({ 
  src, 
  alt, 
  size = "md", 
  className,
  borderColor = "default"
}: AvatarProps) {
  const avatarUrl = src || DEFAULT_AVATAR_URL;
  
  return (
    <div
      className={cn(
        "relative rounded-full overflow-hidden bg-muted flex-shrink-0",
        getSizeClass(size, className),
        borderClasses[borderColor as keyof typeof borderClasses] || borderClasses.default,
        "shadow-lg",
        className
      )}
    >
      <Image
        src={avatarUrl}
        alt={alt}
        fill
        className="object-cover"
        unoptimized
        onError={(e) => {
          // Fallback para placeholder se a imagem falhar
          e.currentTarget.src = DEFAULT_AVATAR_URL;
        }}
      />
    </div>
  );
}

