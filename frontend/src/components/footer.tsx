export default function Footer({ year }: { year: number }) {
  return (
    <footer className="border-t bg-slate-600 dark:bg-slate-900 shadow-md p-4 text-sm text-white flex justify-between">
      <div className="flex-1/2 text-left p-4">
        &copy; {year} Accounting. All rights reserved.
      </div>
    </footer>
  )
}
