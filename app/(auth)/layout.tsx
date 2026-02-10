export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen w-full max-w-lg items-center justify-center px-6 py-16">
        {children}
      </div>
    </div>
  );
}
