export const dynamic = "force-dynamic"
import { SiteShell } from "@/components/site-shell"
import { createClient } from "@supabase/supabase-js"
import Link from "next/link"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default async function CategoriesPage() {
  const { data, error } = await supabase
    .from("categories")
    .select("*")

  if (error) {
    return <div>Database error</div>
  }

  return (
    <SiteShell>
      <h1 className="mb-8 text-3xl font-bold">الفئات</h1>

      <div className="grid gap-6 md:grid-cols-3">
        {data?.map((cat) => (
          <Link
            key={cat.id}
            href={`/categories/${cat.id}`}
            className="rounded-3xl border bg-white p-8 shadow-lg transition hover:-translate-y-2 hover:shadow-2xl dark:bg-slate-900"
          >
            <h2 className="text-xl font-semibold">{cat.name}</h2>
          </Link>
        ))}
      </div>
    </SiteShell>
  )
}