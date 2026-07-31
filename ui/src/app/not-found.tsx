import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-start justify-end gap-4 p-4">
      <h1 className="text-[2rem]">Page not found</h1>
      <Link href="/" className="opacity-30 transition-opacity duration-300 hover:opacity-100">
        Back to Sica Thai
      </Link>
    </main>
  )
}
