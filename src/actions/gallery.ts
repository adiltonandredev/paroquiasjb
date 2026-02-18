"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import fs from "fs/promises";
import path from "path";

export interface SaveAlbumResponse {
  success: boolean;
  data?: {
    id: number;
    name: string;
    slug: string;
  };
  error?: string;
}

export async function getAlbums() {
  try {
    const albums = await prisma.album.findMany({
      include: {
        _count: {
          select: { photos: true },
        },
      },
      orderBy: { date: "desc" },
    });
    return { success: true, data: albums };
  } catch (error) {
    console.error("Erro ao buscar álbuns:", error);
    return { success: false, error: "Falha ao carregar álbuns." };
  }
}

export async function getAlbumById(id: number) {
  try {
    const album = await prisma.album.findUnique({
      where: { id: Number(id) },
      include: { photos: true },
    });

    if (!album) return { success: false, error: "Álbum não encontrado." };

    return { success: true, data: album };
  } catch (error) {
    return { success: false, error: "Erro ao buscar detalhes do álbum." };
  }
}

export async function saveAlbum(
  id: number | null,
  data: any,
): Promise<SaveAlbumResponse> {
  try {
    const slug = data.name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "");

    const albumData = {
      name: data.name,
      slug: slug,
      date: data.date ? new Date(data.date) : null,
      cover: data.coverUrl || null,
      folder: `/uploads/gallery/${slug}`,
    };

    let album;
    if (id) {
      album = await prisma.album.update({
        where: { id: Number(id) },
        data: albumData,
      });
    } else {
      album = await prisma.album.create({
        data: albumData,
      });
    }

    revalidatePath("/admin/gallery");

    return {
      success: true,
      data: {
        id: album.id,
        name: album.name,
        slug: album.slug,
      },
    };
  } catch (error) {
    console.error("Erro P1017 ou similar:", error);
    return {
      success: false,
      error: "Conexão interrompida. Tente enviar menos fotos por vez.",
    };
  }
}
export async function deleteAlbum(id: number) {
  try {
    await prisma.album.delete({
      where: { id: Number(id) },
    });
    revalidatePath("/admin/gallery");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Erro ao excluir álbum." };
  }
}

export async function deletePhoto(photoId: number) {
  try {
    const photo = await prisma.photo.findUnique({
      where: { id: photoId },
      include: { album: true },
    });

    if (!photo) return { success: false, error: "Foto não encontrada." };

    // 1. Caminho do arquivo físico
    const filePath = path.join(process.cwd(), "public", photo.url);

    // 2. Tenta remover o arquivo físico do servidor
    try {
      await fs.unlink(filePath);
    } catch (err) {
      console.error("Arquivo físico não encontrado ou já deletado:", filePath);
    }

    // 3. Remove do banco de dados
    await prisma.photo.delete({
      where: { id: photoId },
    });

    return { success: true };
  } catch (error) {
    console.error("Erro ao deletar foto:", error);
    return { success: false, error: "Erro ao excluir a foto." };
  }
}

export async function uploadSinglePhoto(
  albumId: number,
  photo: { filename: string; base64: string },
) {
  try {
    const album = await prisma.album.findUnique({
      where: { id: Number(albumId) },
    });
    if (!album) return { success: false, error: "Álbum não encontrado." };

    const uploadDir = path.join(
      process.cwd(),
      "public",
      "uploads",
      "gallery",
      album.slug,
    );
    await fs.mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, photo.filename);
    const base64Data = photo.base64.replace(/^data:image\/\w+;base64,/, "");

    await fs.writeFile(filePath, base64Data, "base64");

    // Registro individual no banco para evitar sobrecarga
    await prisma.photo.create({
      data: {
        filename: photo.filename,
        url: `/uploads/gallery/${album.slug}/${photo.filename}`,
        albumId: Number(albumId),
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Erro no upload:", error);
    return { success: false, error: `Falha: ${photo.filename}` };
  }
}
