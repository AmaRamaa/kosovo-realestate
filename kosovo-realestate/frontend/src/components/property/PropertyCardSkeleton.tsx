export default function PropertyCardSkeleton() {
  return (
    <div className="card overflow-hidden">
      <div className="skeleton aspect-[4/3] rounded-none" />
      <div className="p-4 space-y-3">
        <div className="skeleton h-4 w-20 rounded-full" />
        <div className="skeleton h-5 w-3/4" />
        <div className="skeleton h-4 w-1/2" />
        <div className="flex gap-4 pt-3 border-t border-neutral-100 dark:border-neutral-700">
          <div className="skeleton h-4 w-10" />
          <div className="skeleton h-4 w-10" />
          <div className="skeleton h-4 w-16" />
        </div>
      </div>
    </div>
  );
}
