import Link from "next/link"

export default function ContactPage() {

  const phone = "967770498620" // عدلي رقمك هنا
  const whatsappUrl = `https://wa.me/${phone}`

  return (
    <div className="mx-auto max-w-4xl px-4 py-16">

      {/* Title */}
      <div className="text-center mb-14">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
          تواصل معنا
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-lg">
          نحن هنا لخدمتك والرد على جميع استفساراتك
        </p>
      </div>

      {/* Contact Card */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 shadow-2xl p-10 ring-1 ring-black/5 dark:ring-white/10">

        <div className="grid gap-8 md:grid-cols-2">

          {/* Phone */}
          <div className="space-y-4">
            <div className="text-xl font-bold">رقم الهاتف</div>

            <div className="text-2xl font-extrabold text-indigo-600">
              +{phone}
            </div>

            <a
              href={`tel:+${phone}`}
              className="inline-block rounded-2xl bg-indigo-600 px-6 py-3 text-white font-bold hover:scale-105 transition"
            >
              اتصال مباشر
            </a>
          </div>

          {/* WhatsApp */}
          <div className="space-y-4">
            <div className="text-xl font-bold">واتساب</div>

            <div className="text-2xl font-extrabold text-green-600">
              تواصل عبر واتساب
            </div>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-block rounded-2xl bg-green-600 px-6 py-3 text-white font-bold hover:scale-105 transition"
            >
              فتح واتساب
            </a>
          </div>

        </div>

      </div>

      {/* Back */}
      <div className="mt-10 text-center">
        <Link
          href="/"
          className="text-indigo-600 font-bold hover:underline"
        >
          العودة للرئيسية
        </Link>
      </div>

    </div>
  )
}