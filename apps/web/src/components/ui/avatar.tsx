import { cn } from "@/lib/cn";

interface AvatarProps {
  name?: string;
  email?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Avatar({ name, email, size = "md", className }: AvatarProps) {
  const getInitials = (name?: string, email?: string) => {
    if (name) {
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    if (email) {
      return email[0].toUpperCase();
    }
    return "U";
  };

  const sizeClasses = {
    sm: "h-6 w-6 text-xs",
    md: "h-8 w-8 text-sm",
    lg: "h-12 w-12 text-lg",
  };

  const initials = getInitials(name, email);

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 font-semibold text-white",
        sizeClasses[size],
        className
      )}
    >
      {initials}
    </div>
  );
}
