import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    // Verifique se no seu prisma/schema.prisma o modelo é MassSchedule
    // Se for, o correto aqui é prisma.massSchedule
    const masses = await prisma.massSchedule.findMany({
        orderBy: [{ dayOfWeek: 'asc' }, { time: 'asc' }]
    });
    return NextResponse.json(masses);
}

export async function POST(req: Request) {
    const body = await req.json();
    const mass = await prisma.massSchedule.create({
        data: {
            dayOfWeek: Number(body.dayOfWeek),
            time: body.time,
            location: body.location
        }
    });
    return NextResponse.json(mass);
}

export async function DELETE(req: Request) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    await prisma.massSchedule.delete({
        where: { id: Number(id) }
    });
    return NextResponse.json({ success: true });
}

export async function PUT(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        const body = await req.json();

        if (!id) return NextResponse.json({ error: "ID não fornecido" }, { status: 400 });

        const updated = await prisma.massSchedule.update({
            where: { id: Number(id) },
            data: {
                title: body.title,
                dayOfWeek: Number(body.dayOfWeek),
                time: body.time,
                location: body.location
            }
        });

        return NextResponse.json(updated);
    } catch (error) {
        return NextResponse.json({ error: "Erro ao atualizar" }, { status: 500 });
    }
}