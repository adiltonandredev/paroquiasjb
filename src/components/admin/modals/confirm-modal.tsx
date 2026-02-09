// src/components/admin/modals/confirm-modal.tsx
import * as AlertDialog from "@radix-ui/react-alert-dialog"; // Recomendado para Portals

export function ConfirmModal({ onConfirm, title, description, children }: any) {
  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger asChild>{children}</AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]" />
        <AlertDialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-md bg-white rounded-xl p-6 shadow-2xl z-[101]">
          <AlertDialog.Title className="text-lg font-bold text-slate-900">{title}</AlertDialog.Title>
          <AlertDialog.Description className="text-sm text-slate-500 mt-2">
            {description}
          </AlertDialog.Description>
          <div className="flex justify-end gap-3 mt-6">
            <AlertDialog.Cancel asChild>
              <button className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg">Cancelar</button>
            </AlertDialog.Cancel>
            <AlertDialog.Action asChild>
              <button onClick={onConfirm} className="px-4 py-2 text-sm font-medium bg-red-600 text-white hover:bg-red-700 rounded-lg">Confirmar Exclusão</button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}