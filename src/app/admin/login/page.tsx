"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AlertModal } from "@/components/admin/modals/alert-modal";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const [successModal, setSuccessModal] = useState(false);

  useEffect(() => {
    // Se detectar o parâmetro de logout, abre o modal de sucesso
    if (searchParams.get("logout") === "success") {
      setSuccessModal(true);
    }
  }, [searchParams]);

  return (
    <>
      {/* ... seu código de login existente ... */}

      <AlertModal 
        isOpen={successModal}
        onClose={() => setSuccessModal(false)}
        title="Sessão Encerrada"
        message="Você saiu do painel administrativo da Paróquia com segurança. Até logo!"
        type="info" // Usando o tipo info para mensagens positivas
      />
    </>
  );
}