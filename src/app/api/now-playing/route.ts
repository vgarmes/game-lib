import { NextResponse } from "next/server";
import prisma from "@/server/prisma";

// Public: no session check, so other sites can show what I'm playing.
export const dynamic = "force-dynamic";

const headers = { "Access-Control-Allow-Origin": "*" };

export async function GET() {
  const game = await prisma.game.findFirst({
    where: { status: "in_progress" },
    select: { title: true, cover: { select: { secureUrl: true } } },
    orderBy: { updatedAt: "desc" },
  });

  if (!game) {
    return NextResponse.json(null, { headers });
  }

  return NextResponse.json(
    { title: game.title, coverUrl: game.cover?.secureUrl ?? null },
    { headers },
  );
}
