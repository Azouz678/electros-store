import { SiteShell } from "@/components/site-shell";

const products = [
  {
    id: 1,
    name: "ثلاجة سامسونج 18 قدم",
    price: "450,000 ريال",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e8b1",
    badge: "جديد",
  },
  {
    id: 2,
    name: "غسالة LG أوتوماتيك",
    price: "320,000 ريال",
    image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db",
    badge: "خصم",
  },
  {
    id: 3,
    name: "شاشة 55 بوصة 4K",
    price: "390,000 ريال",
    image: "https://images.unsplash.com/photo-1593784991095-a205069470b6",
    badge: "",
  },
];

export default function ProductsPage() {
  return (
    <SiteShell>
      <h1 className="mb-8 text-3xl font-bold">كل المنتجات</h1>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <div
            key={product.id}
            className="group relative overflow-hidden rounded-3xl border bg-white shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl dark:bg-slate-900"
          >
            {/* Badge */}
            {product.badge && (
              <div className="absolute left-4 top-4 z-10 rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white">
                {product.badge}
              </div>
            )}

            {/* Image */}
            <div className="overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="h-64 w-full object-cover transition duration-500 group-hover:scale-110"
              />
            </div>

            {/* Content */}
            <div className="p-6">
              <h2 className="text-lg font-semibold">{product.name}</h2>
              <p className="mt-2 text-indigo-600 font-bold">
                {product.price}
              </p>

              <a
                href={`https://wa.me/967770498620?text=السلام عليكم، أريد الاستفسار عن ${product.name}`}
                target="_blank"
                className="mt-4 inline-block w-full rounded-2xl bg-black py-3 text-center text-white transition hover:bg-indigo-600 dark:bg-white dark:text-black"
              >
                استفسار عبر واتساب
              </a>
            </div>
          </div>
        ))}
      </div>
    </SiteShell>
  );
}