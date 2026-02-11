import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    console.log("📊 Dashboard stats API called");

    const [competitions, warranties, contracts, expenses] = await Promise.all([
      prisma.competition.count(),
      prisma.warranty.count(),
      prisma.contract.count(),
      prisma.expense.count(),
    ]);

    const stats = {
      competitions,
      warranties,
      contracts,
      expenses,
    };

    console.log("✅ Stats calculated:", stats);

    return NextResponse.json(stats);
  } catch (error) {
    console.error("💥 Error calculating stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
