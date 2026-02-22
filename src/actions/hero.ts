"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import fs from "fs/promises";
import path from "path";

interface HeroData {
    title: string;
    slug?: string;
    base64?: string;
    primaryButtonText?: string;
    primaryButtonUrl?: string;
}

export async function getHeroSlides() {
    try {
        const slides = await prisma.post.findMany({
            where: { isHighlight: true },
            orderBy: { order: 'asc' }
        });

        return {
            success: true,
            data: slides as any[]
        };
    } catch (error) {
        return { success: false, error: "Erro ao buscar slides." };
    }
}

// 2. SALVAR (Atualizado com novos campos)
export async function saveHeroSlide(data: HeroData) {
    try {
        const uploadDir = path.join(process.cwd(), "public/uploads/hero");
        await fs.mkdir(uploadDir, { recursive: true });

        const filename = `hero-${Date.now()}.webp`;
        const filePath = path.join(uploadDir, filename);
        const base64Data = data.base64!.replace(/^data:image\/\w+;base64,/, "");
        await fs.writeFile(filePath, base64Data, "base64");


        const finalSlug = data.slug || data.title.toLowerCase()
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            .replace(/[^\w\s-]/g, "")
            .replace(/\s+/g, "-");

        await prisma.post.create({
            data: {
                title: data.title,
                coverImage: `/uploads/hero/${filename}`,
                content: data.primaryButtonText || "Saiba Mais",
                summary: data.primaryButtonUrl || "",
                slug: finalSlug,
                isHighlight: true,
                category: "hero",
                status: "published",
            },
        });

        revalidatePath("/admin/hero");
        return { success: true };
    } catch (error) {
        return { success: false, error: "Erro ao salvar banner." };
    }
}
// 3. EXCLUIR
export async function deleteHeroSlide(id: number) {
    try {
        await prisma.post.update({
            where: { id: Number(id) },
            data: { isHighlight: false }
        });
        revalidatePath("/admin/hero");
        return { success: true };
    } catch (error) {
        return { success: false, error: "Erro ao remover slide." };
    }
}

// 4. ATUALIZAR (Atualizado com novos campos)
export async function updateHeroSlide(id: number, data: HeroData) {
    try {
        let publicUrl = undefined;
        if (data.base64 && data.base64.startsWith("data:image")) {
            const uploadDir = path.join(process.cwd(), "public/uploads/hero");
            await fs.mkdir(uploadDir, { recursive: true });
            const filename = `hero-${Date.now()}.webp`;
            const filePath = path.join(uploadDir, filename);
            const base64Data = data.base64.replace(/^data:image\/\w+;base64,/, "");
            await fs.writeFile(filePath, base64Data, "base64");
            publicUrl = `/uploads/hero/${filename}`;
        }

        await prisma.post.update({
            where: { id: Number(id) },
            data: {
                title: data.title,
                slug: data.slug, // <--- ADICIONADO PARA ATUALIZAR TAMBÉM
                content: data.primaryButtonText,
                summary: data.primaryButtonUrl,
                ...(publicUrl && { coverImage: publicUrl }),
            },
        });

        revalidatePath("/admin/hero");
        return { success: true };
    } catch (error) {
        return { success: false, error: "Erro ao atualizar slide." };
    }
}

export async function updateSlidesOrder(ids: number[]) {
    try {
        await prisma.$transaction(
            ids.map((id, index) =>
                prisma.post.update({
                    where: { id },
                    data: { order: index },
                })
            )
        );
        revalidatePath("/admin/hero");
        return { success: true };
    } catch (error) {
        return { success: false, error: "Erro ao salvar ordenação." };
    }
}