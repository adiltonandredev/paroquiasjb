import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    const masses = await prisma.massSchedule.findMany({
        orderBy: [{ dayOfWeek: 'asc' }, { time: 'asc' }]
    });
    return NextResponse.json(masses);
}

export async function POST(req: Request) {
    const body = await req.json();
    const mass = await prisma.massSchedule.create({
        data: {
            title: body.title,
            dayOfWeek: Number(body.dayOfWeek),
            time: body.time,
            location: body.location
        }
    });
    return NextResponse.json(mass);
}

export async function DELETE(req: Request) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id"); // Padrão que você usa na linha 58

    if (!id) return NextResponse.json({ error: "ID não fornecido" }, { status: 400 });

    await prisma.massSchedule.delete({
        where: { id: Number(id) }
    });
    return NextResponse.json({ success: true });
}