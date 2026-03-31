const packages = [
  {
    name: "Мини",
    price: "15 000 ₽",
    features: [
      "1 час съёмки",
      "50 фото в обработке",
      "Онлайн-галерея",
      "Срок — 5 дней",
    ],
  },
  {
    name: "Стандарт",
    price: "25 000 ₽",
    features: [
      "2 часа съёмки",
      "100 фото в обработке",
      "Онлайн-галерея",
      "Предварительная консультация",
      "Срок — 7 дней",
    ],
  },
  {
    name: "Премиум",
    price: "40 000 ₽",
    features: [
      "3 часа съёмки",
      "150+ фото в обработке",
      "Онлайн-галерея",
      "Предварительная консультация",
      "Фотоальбом 20×20 см",
      "Срок — 10 дней",
    ],
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className="py-20 px-6 max-w-5xl mx-auto overflow-x-hidden">
      <h2 className="text-xl font-medium text-center mb-10">Стоимость</h2>
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
