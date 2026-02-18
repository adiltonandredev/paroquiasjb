import { redirect } from "next/navigation";

export default function AdminPage() {
  redirect("/admin/dashboard");
  
  // O return nunca é alcançado, mas satisfaz o React/Typescript
  return null; 
}