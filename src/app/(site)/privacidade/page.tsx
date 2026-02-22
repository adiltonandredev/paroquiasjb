import React from 'react';

export default function PoliticaPrivacidade() {
  const dataAtual = new Date().getFullYear();

  return (
    <main className="min-h-screen bg-white py-12 px-4 md:px-0">
      <div className="container mx-auto max-w-3xl">
        {/* Cabeçalho */}
        <header className="mb-12 border-b border-[#C4A45F]/20 pb-8 text-center md:text-left">
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-[#23140c] mb-4">
            Política de Privacidade
          </h1>
          <p className="text-sm text-gray-500 uppercase tracking-widest">
            Paróquia São João Batista • LGPD Compliance • {dataAtual}
          </p>
        </header>

        {/* Conteúdo Mobile First */}
        <article className="prose prose-brown max-w-none text-gray-700 leading-relaxed space-y-8">
          
          <section>
            <h2 className="text-xl font-bold text-[#23140c] mb-3 flex items-center">
              <span className="w-1.5 h-6 bg-[#C4A45F] mr-3 rounded-full"></span>
              1. Coleta de Informações
            </h2>
            <p>
              Coletamos informações básicas quando você interage com nossa comunidade digital, seja ao solicitar uma intenção de missa, realizar o cadastro do dízimo ou inscrever-se em eventos paroquiais. Os dados podem incluir nome, e-mail, telefone e endereço.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#23140c] mb-3 flex items-center">
              <span className="w-1.5 h-6 bg-[#C4A45F] mr-3 rounded-full"></span>
              2. Finalidade do Tratamento
            </h2>
            <p>
              Seus dados são utilizados exclusivamente para fins pastorais e administrativos da Paróquia São João Batista, tais como:
            </p>
            <ul className="list-disc ml-6 space-y-2 mt-2">
              <li>Envio de informativos e horários de celebrações;</li>
              <li>Gestão e emissão de comprovantes de dízimo;</li>
              <li>Organização de sacramentos (Batismo, Crisma, Casamento);</li>
              <li>Atendimento a pedidos de oração.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#23140c] mb-3 flex items-center">
              <span className="w-1.5 h-6 bg-[#C4A45F] mr-3 rounded-full"></span>
              3. Segurança dos Dados
            </h2>
            <p>
              Empregamos medidas técnicas de segurança para proteger seus dados contra acessos não autorizados. Não comercializamos, alugamos ou compartilhamos suas informações pessoais com terceiros para fins de marketing.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#23140c] mb-3 flex items-center">
              <span className="w-1.5 h-6 bg-[#C4A45F] mr-3 rounded-full"></span>
              4. Seus Direitos
            </h2>
            <p>
              Conforme a LGPD, você tem o direito de solicitar a atualização, correção ou exclusão de seus dados de nossa base a qualquer momento. Para isso, basta entrar em contato com nossa Secretaria Paroquial.
            </p>
          </section>

          <section className="bg-[#23140c]/5 p-6 rounded-2xl border-l-4 border-[#C4A45F]">
            <h2 className="text-lg font-bold text-[#23140c] mb-2">Contato Encarregado</h2>
            <p className="text-sm">
              Para assuntos relacionados à privacidade, envie um e-mail para a secretaria ou visite-nos presencialmente no endereço da Paróquia.
            </p>
          </section>

        </article>

        <footer className="mt-16 text-center text-xs text-gray-400">
          Esta política pode ser atualizada conforme as necessidades da comunidade e exigências legais.
        </footer>
      </div>
    </main>
  );
}