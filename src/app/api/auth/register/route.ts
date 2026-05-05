import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { isEduEmail } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, country, university, department } = await req.json();

    if (!email || !password || !university || !country) {
      return NextResponse.json(
        { message: "Zorunlu alanlar eksik." },
        { status: 400 }
      );
    }

    if (!isEduEmail(email)) {
      return NextResponse.json(
        { message: "Geçerli bir .edu e-posta adresi gereklidir." },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { message: "Şifre en az 8 karakter olmalıdır." },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { message: "Bu e-posta adresi zaten kullanımda." },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        country,
        university,
        department: department || null,
        role: "USER",
        score: 0,
        badge: "Drone",
      },
    });

    return NextResponse.json(
      { id: user.id, email: user.email },
      { status: 201 }
    );
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { message: "Sunucu hatası. Lütfen tekrar deneyin." },
      { status: 500 }
    );
  }
}
