import fs from "fs/promises";
import path from "path";

/**
 * Converte base64 em arquivo físico no servidor
 */
export async function saveBase64Image(base64: string, folderPath: string, filename: string) {
  try {
    const uploadDir = path.join(process.cwd(), "public", folderPath);
    
    // Garante que a pasta existe (usando recursive: true)
    await fs.mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, filename);
    const base64Data = base64.replace(/^data:image\/\w+;base64,/, "");
    
    await fs.writeFile(filePath, base64Data, "base64");
    
    return { 
      success: true, 
      url: `${folderPath}/${filename}` 
    };
  } catch (error) {
    console.error("Erro no upload físico:", error);
    return { success: false, error: "Falha ao salvar arquivo no servidor." };
  }
}