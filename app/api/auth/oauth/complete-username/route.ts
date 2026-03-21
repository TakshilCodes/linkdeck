import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { UsernameZod } from "@/lib/validators/auth";
import { getServerSession } from "next-auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { ok: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const parsed = UsernameZod.safeParse(body?.username);

    if (!parsed.success) {
      return NextResponse.json(
        {
          ok: false,
          error: parsed.error.flatten().formErrors[0] ?? "Invalid username",
        },
        { status: 400 }
      );
    }

    const username = parsed.data;

    const taken = await prisma.user.findUnique({
      where: { username },
      select: { id: true },
    });

    if (taken) {
      return NextResponse.json(
        { ok: false, error: "Username already taken" },
        { status: 409 }
      );
    }

    await prisma.user.update({
      where: { email: session.user.email.toLowerCase() },
      data: { username },
    });

    return NextResponse.json({
      ok: true,
      message: "Username saved",
    });
  } catch (error) {
    console.error("oauth/complete-username error", error);
    return NextResponse.json(
      { ok: false, error: "Something went wrong" },
      { status: 500 }
    );
  }
}