import { SiteShell } from "@/components/site-shell"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default async function ProductPage(
  { params }: { params: Promise<{ id: string }> }
) {

  const { id } = await params

 const { data: product, error } = await supabase
  .from("products")
  .select("*")
  .eq("id", id)
  .eq("is_active", true)
  .single()

  if (!product) {
    return <div>Product not found</div>
  }

  const whatsappUrl = `https://wa.me/967770498620?text=${encodeURIComponent(
    `مرحبًا، أريد الاستفسار عن المنتج: ${product.name}`
  )}`

  return (
    <SiteShell>
      <div className="grid md:grid-cols-2 gap-10">
        <img
          src={product.image}
          alt={product.name}
          className="rounded-3xl w-full object-cover"
        />

        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-xl text-green-600 mb-6">{product.price}</p>

          <p className="mb-6 text-gray-600 dark:text-gray-300">
            {product.description}
          </p>

          <a
            href={whatsappUrl}
            target="_blank"
            className="inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl transition"
          >
            استفسار عبر واتساب
          </a>
        </div>
      </div>
    </SiteShell>
  )
}