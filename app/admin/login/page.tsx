import Link from 'next/link'

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f6f9f4] p-6 text-[#16361a]">
      <form action="/api/auth/login" method="post" className="w-full max-w-md rounded-2xl border border-[#dce6d8] bg-white p-8 shadow-sm">
        <Link href="/" className="text-sm font-semibold uppercase tracking-[0.16em] text-[#1e4620]">NutraLive</Link>
        <h1 className="mt-4 font-display text-3xl font-semibold text-[#16361a]">Customer Administration</h1>
        <p className="mt-2 text-sm leading-6 text-[#4f5f56]">Sign in to manage products, articles, inquiries and site settings.</p>
        {error ? (
          <p role="alert" className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {error}
          </p>
        ) : null}
        <label className="mt-6 block text-sm font-medium text-[#16361a]" htmlFor="email">Email</label>
        <input id="email" name="email" type="email" required autoComplete="username" className="mt-2 min-h-12 w-full rounded-lg border border-[#cfdcc9] px-3 text-[#16361a]" />
        <label className="mt-4 block text-sm font-medium text-[#16361a]" htmlFor="password">Password</label>
        <input id="password" name="password" type="password" required autoComplete="current-password" className="mt-2 min-h-12 w-full rounded-lg border border-[#cfdcc9] px-3 text-[#16361a]" />
        <button type="submit" className="mt-6 min-h-12 w-full rounded-lg bg-[#1e4620] px-5 font-semibold text-white transition-colors hover:bg-[#16361a]">
          Sign in
        </button>
      </form>
    </main>
  )
}
