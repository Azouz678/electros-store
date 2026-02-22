export function baseSlug(name: string) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
}

export async function uniqueSlug(
  table: "categories" | "products",
  name: string,
  supabase: any,
  excludeId?: string
) {
  const base = baseSlug(name)
  let slug = base
  let i = 1

  while (true) {
    let query = supabase.from(table).select("id").eq("slug", slug)
    if (excludeId) query = query.neq("id", excludeId)

    const { data } = await query
    if (!data || data.length === 0) break

    slug = `${base}-${i}`
    i++
  }

  return slug
}