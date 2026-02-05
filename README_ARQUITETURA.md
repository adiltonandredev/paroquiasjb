# ⛪ Manifesto do Projeto: Paróquia SJB

**Versão da Arquitetura:** 1.0 (Next.js 14+ / Tailwind / TypeScript)
**Objetivo:** Desenvolvimento de Site Institucional + Sistema Admin com foco total em reutilização e manutenção centralizada.

---

## 1. As Regras de Ouro (Golden Rules)
Todo código escrito neste projeto deve obedecer a estes 4 mandamentos:

1.  **Mobile First:** O design e o CSS devem funcionar primeiro no celular. Telas grandes são consequência.
2.  **Identidade Centralizada:** **NUNCA** use cores fixas (ex: `bg-blue-600`) ou fontes manuais. Use sempre as variáveis semânticas (`bg-primary`, `text-destructive`). Se mudar no global, tem que mudar em tudo.
3.  **Separação de Poderes:** O que é do Site fica em `(site)`. O que é do Admin fica em `(admin)`. Nunca misture os layouts.
4.  **Componentização Inteligente:** Se um elemento aparece mais de duas vezes (botão, card, modal), ele deve virar um componente em `src/components/ui`.

---

## 2. Estrutura de Pastas (O Mapa)

plaintext
src/
├── app/
│   ├── (site)/             <-- ÁREA PÚBLICA (Fiel)
│   │   ├── layout.tsx      <-- Contém Navbar e Footer do Site
│   │   └── page.tsx        <-- Home do Site
│   │
│   ├── (admin)/            <-- ÁREA RESTRITA (Gestão)
│   │   ├── layout.tsx      <-- Contém Sidebar e Proteção de Login
│   │   └── dashboard/      <-- Páginas do sistema
│   │
│   ├── globals.css         <-- ONDE MUDAMOS AS CORES DE TUDO
│   └── layout.tsx          <-- Onde carregamos as Fontes e CSS base
│
├── components/
│   ├── ui/                 <-- COMPONENTES GLOBAIS (Botões, Inputs, Modais)
│   ├── site/               <-- Específicos do Site (Hero, Cards de Missa)
│   └── admin/              <-- Específicos do Admin (Tabelas, Gráficos)
│
└── lib/
    ├── utils.ts            <-- Ferramenta 'cn' (Obrigatória para estilos)
    └── masks.ts            <-- Todas as máscaras (CPF, Tel) ficam aqui


---

## 3. Design System (A Paleta)
Para manter a identidade visual, consulte esta tabela. **Não invente cores fora daqui.**

| Nome Semântico | O que faz? | Onde usar? |
| :--- | :--- | :--- |
| **Primary** | Cor Principal (Azul Paróquia) | Botões principais, Links ativos, Títulos destaque. |
| **Destructive** | Cor de Perigo (Vermelho) | Botão excluir, Mensagens de erro, Ícones de alerta. |
| **Success** | Cor de Sucesso (Verde) | Botão salvar, Toast de "Salvo com sucesso". |
| **Warning** | Cor de Atenção (Amarelo) | Avisos que não bloqueiam o fluxo. |
| **Background** | Fundo (Branco/Cinza claro) | Fundo das páginas. |
| **Foreground** | Texto (Azul Escuro/Preto) | Textos corridos. |

* **Para alterar:** Edite apenas o `:root` em `src/app/globals.css`.
* **Fontes:**
    * Títulos: `font-serif` (Roboto Slab)
    * Texto: `font-sans` (Inter)

---

## 4. Caixa de Ferramentas (O que já temos pronto)

Antes de criar algo do zero, verifique se já não existe:

### A. Botões (`<Button />`)
Local: `src/components/ui/button.tsx`
* Use `variant="primary"` para ações normais.
* Use `variant="destructive"` para deletar.
* Use `variant="outline"` para cancelar/voltar.
* Use `isLoading={true}` para travar o clique durante envios.

### B. Modais (`<Modal />`)
Local: `src/components/ui/modal.tsx`
* Abre em cima de tudo (Portal).
* Já tem cores automáticas baseadas no `type` (success, danger, default).

### C. Máscaras (`masks`)
Local: `src/lib/masks.ts`
* Importe `masks` e use: `masks.cpf(valor)`, `masks.phone(valor)`.
* Nunca crie máscaras soltas dentro dos componentes.

### D. Utilitário de Estilo (`cn`)
Local: `src/lib/utils.ts`
* Sempre que criar um componente novo que aceita `className`, use `cn()` para mesclar as classes.

---

## 5. Protocolo de "Recalcular Rota"
**"Me perdi! O CSS quebrou ou o projeto não roda."**

Se algo der errado, siga este checklist de resgate:

1.  **O CSS "quebrou" ou variáveis sumiram?**
    * Verifique se o servidor está rodando (`npm run dev`).
    * Verifique se `tailwind.config.ts` está apontando para as pastas certas em `content`.
    * Verifique se `src/app/globals.css` tem as variáveis definidas no `:root`.
    * **Ação:** Pare o terminal (`Ctrl+C`) e rode `npm run dev` novamente.
2.  **Criei uma página e ela não pega o Layout certo.**
    * Você colocou ela dentro da pasta correta?
    * Site vai em `(site)`.
    * Admin vai em `(admin)`.
    * Se estiver solta na raiz de `app`, ela não terá layout específico.