import React from 'react';

export default function TermosDeUso() {
  const dataAtual = new Date().getFullYear();

  return (
    <main className="min-h-screen bg-white py-12 px-4 md:px-0">
      <div className="container mx-auto max-w-3xl">
        {/* Cabeçalho */}
        <header className="mb-12 border-b border-[#C4A45F]/20 pb-8 text-center md:text-left">
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-[#23140c] mb-4">
            Termos de Uso
          </h1>
          <p className="text-sm text-gray-500 uppercase tracking-widest">
            Paróquia São João Batista • Atualizado em {dataAtual}
          </p>
        </header>

        {/* Conteúdo - Mobile First (Margens Compactas) */}
        <article className="prose prose-brown max-w-none text-gray-700 leading-relaxed space-y-8">
          
          <section>
            <h2 className="text-xl font-bold text-[#23140c] mb-3 flex items-center">
              <span className="w-1.5 h-6 bg-[#C4A45F] mr-3 rounded-full"></span>
              1. Finalidade do Site
            </h2>
            <p>
              Este portal é um instrumento de evangelização e comunicação da Paróquia São João Batista. Todo o conteúdo visa informar os fiéis sobre horários de missas, eventos, formação cristã e prestação de contas comunitária.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#23140c] mb-3 flex items-center">
              <span className="w-1.5 h-6 bg-[#C4A45F] mr-3 rounded-full"></span>
              2. Uso de Imagens e Conteúdo
            </h2>
            <p>
              As imagens de celebrações, pastorais e movimentos publicadas aqui buscam registrar a vida comunitária. É proibida a reprodução dessas imagens para fins comerciais ou que firam a dignidade da Igreja Católica.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#23140c] mb-3 flex items-center">
              <span className="w-1.5 h-6 bg-[#C4A45F] mr-3 rounded-full"></span>
              3. Privacidade e Proteção de Dados
            </h2>
            <p>
              Em conformidade com a LGPD, os dados fornecidos em formulários (Dízimo, Intenções de Missa ou Contato) são utilizados exclusivamente para o fim solicitado e não são compartilhados com terceiros sem consentimento.
            </p>
          </section>

          <section className="bg-[#23140c]/5 p-6 rounded-2xl border-l-4 border-[#C4A45F]">
            <h2 className="text-lg font-bold text-[#23140c] mb-2">Dúvidas?</h2>
            <p className="text-sm">
              Para questões sobre o uso do site ou para solicitar a remoção de uma imagem onde você apareça, entre em contato com a Secretaria Paroquial - whatsApp: (69) 93300-5360.
            </p>
          </section>

        </article>

        <footer className="mt-16 text-center text-xs text-gray-400">
          © {dataAtual} Paróquia São João Batista - Todos os direitos reservados.
        </footer>
      </div>
    </main>
  );
}