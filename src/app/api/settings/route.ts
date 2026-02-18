import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const settings = await prisma.setting.findFirst();
    return NextResponse.json(settings || {});
  } catch (error) {
    return NextResponse.json({}, { status: 500 });
  }
}