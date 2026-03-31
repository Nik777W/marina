const packages = [
  {
    name: "Mini",
    price: "200 €",
    features: [
      "1 hora de sesión",
      "50 fotos editadas",
      "Galería online",
      "Entrega — 5 días",
    ],
  },
  {
    name: "Estándar",
    price: "350 €",
    features: [
      "2 horas de sesión",
      "100 fotos editadas",
      "Galería online",
      "Consulta previa",
      "Entrega — 7 días",
    ],
  },
  {
    name: "Premium",
    price: "500 €",
    features: [
      "3 horas de sesión",
      "150+ fotos editadas",
      "Galería online",
      "Consulta previa",
      "Álbum 20×20 cm",
      "Entrega — 10 días",
    ],
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className="py-20 px-6 max-w-5xl mx-auto overflow-x-hidden">
      <h2 className="text-xl font-medium text-center mb-10 pt-[1.4rem]">Precios</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {packages.map((p, index) => (
          <div
            key={index}
            className="border border-black/10 rounded-2xl p-6 hover:border-black/20 transition-colors"
          >
            <p className="text-sm text-black/40 mb-1">{p.name}</p>
            <p className="text-2xl font-medium mb-4">{p.price}</p>
            <ul className="text-sm text-black/60 space-y-2">
              {p.features.map((f, i) => (
                <li key={i}>— {f}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
