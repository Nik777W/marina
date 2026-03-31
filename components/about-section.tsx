import Image from "next/image";

export function AboutSection() {
  return (
    <section id="about" className="py-20 px-6 max-w-2xl mx-auto text-center overflow-x-hidden">
      <div className="relative w-32 h-32 mx-auto mb-6">
        <Image
          src="/marina.jpg"
          alt="Марина Коптякова"
          fill
          className="rounded-full object-cover"
          unoptimized
          priority
        />
      </div>
      <h2 className="text-xl font-medium mb-4">Привет, я Марина</h2>
      <p className="text-black/60 leading-relaxed">
        Снимаю семьи, детей и живые моменты уже 7 лет. Верю, что настоящая эмоция — 
        в простых вещах: в объятиях, смехе, танце под дождём. Моя задача — поймать 
        эти мгновения, чтобы вы могли возвращаться к ним снова и снова.
      </p>
    </section>
  );
}
