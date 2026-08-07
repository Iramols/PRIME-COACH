export default function MaxAerobeTestenPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-lg font-semibold text-neutral-900">Max aerobe testen</h1>
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-neutral-300 bg-white py-20 text-center">
        <p className="text-sm text-neutral-500">
          De metingen voor deze test zijn nog niet gedefinieerd.
        </p>
        <p className="mt-1 text-xs text-neutral-400">
          Deze tab wordt ingevuld zodra de te loggen metingen zijn bepaald.
        </p>
      </div>
    </div>
  );
}
