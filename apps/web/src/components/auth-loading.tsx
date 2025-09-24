export function AuthLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="relative">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-neutral-800 border-t-neutral-100"></div>
        <div className="absolute inset-0 h-12 w-12 animate-ping rounded-full border-4 border-neutral-800 opacity-20"></div>
      </div>
    </div>
  );
}
