export function SponsoredBanner({ isSponsored }: { isSponsored?: boolean }) {
  if (!isSponsored) return null;
  return (
    <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 dark:border-amber-800 dark:bg-amber-950/30">
      <p className="text-sm text-amber-800 dark:text-amber-300">
        <strong>Sponsored Content</strong> — This article was created in partnership with a sponsor. All opinions expressed are the author&apos;s own.
      </p>
    </div>
  );
}
