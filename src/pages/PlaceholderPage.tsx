export function PlaceholderPage({ title }: { title: string }) {
  return (
    <main className="flex flex-col gap-2 px-5 pt-7">
      <h1 className="font-display text-[30px] font-bold tracking-tight">{title}</h1>
      <p className="text-muted">Próximamente</p>
    </main>
  );
}
