import Image from "next/image";

export function AboutSection() {
  return (
    <section id="about" className="py-20 md:px-6 max-w-3xl md:max-w-none mx-auto md:mx-0 overflow-x-hidden">
      <div className="clearfix">
        <img
          src="/marina.webp?v=2"
          alt="Марина Коптякова"
          className="float-left ml-[8%] mt-[4%] mr-6 mb-4 w-48 h-48 rounded-full object-cover"
        />
        <h2 className="text-3xl font-medium mb-4 font-handwriting pt-[1.4rem] ml-6">Hola, soy Marina</h2>
        <p className="text-black/60 leading-relaxed font-handwriting text-3xl ml-6">
          Fotografío familias, niños y momentos auténticos desde hace 7 años. Creo que la verdadera emoción 
          está en las cosas simples: en los abrazos, las risas, el baile bajo la lluvia. Mi trabajo es capturar 
          estos instantes para que puedas volver a ellos una y otra vez.
        </p>
      </div>
    </section>
  );
}
