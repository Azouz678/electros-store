import { Navbar } from "@/components/navbar";

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-8 md:py-10">{children}</main>

 <footer className="mt-16 bg-gradient-to-br from-slate-900 via-slate-950 to-black text-white">

  <div className="mx-auto max-w-6xl px-4 py-14 grid md:grid-cols-3 gap-10">

    {/* معلومات المتجر */}
    <div className="space-y-4">
      <h3 className="text-xl font-bold">إلكترو البيت الحديث</h3>
      <p className="text-slate-400 leading-relaxed">
        متجر متخصص في الأجهزة المنزلية ومنظومات الطاقة الشمسية بأفضل الأسعار وجودة مضمونة.
      </p>

      <div className="space-y-2 text-sm text-slate-300">
        <p>📍 إب – شارع السبل – جوار مستشفى الأمين</p>
        <p>📞 772667213</p>
      </div>

      {/* أزرار التواصل */}
      <div className="flex gap-3 pt-2">

        <a
          href="https://wa.me/967770498620"
          target="_blank"
          className="bg-green-600 hover:bg-green-700 transition px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-semibold shadow-lg"
        >
          WhatsApp
        </a>

        <a
          href="https://instagram.com/yourusername"
          target="_blank"
          className="bg-pink-600 hover:bg-pink-700 transition px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-semibold shadow-lg"
        >
          Instagram
        </a>

      </div>
    </div>

    {/* خريطة جوجل */}
    <div className="md:col-span-2">
        <div className="rounded-2xl overflow-hidden shadow-lg border">
          <iframe
            src="https://www.google.com/maps?q=13.97128392551577,44.15022606018843&z=15&output=embed"
            width="50%"
            height="200"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
          ></iframe>
        </div>

      {/* زر فتح في الخرائط */}
      <div className="mt-4">
        <a
          href="https://www.google.com/maps?q=13.97128392551577,44.15022606018843"
          target="_blank"
          className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl hover:scale-105 transition"
        >
           افتح الموقع في الخرائط📍
        </a>
      </div>
    </div>

  </div>

  {/* حقوق النشر */}
  <div className="border-t border-white/10 py-6 text-center text-slate-400 text-sm">
     {new Date().getFullYear()} إلكترو البيت الحديث – جميع الحقوق محفوظة ©
  </div>

</footer>
    </div>
  );
}