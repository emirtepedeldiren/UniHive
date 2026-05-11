import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ message: "Giriş yapmalısınız." }, { status: 401 });
  }
  const userId = (session.user as { id: string }).id;

  const body = await req.json();
  const { name, university, department, country, avatarUrl, bio } = body as {
    name?: string;
    university?: string;
    department?: string;
    country?: string;
    avatarUrl?: string;
    bio?: string;
  };

  const updated = await prisma.user.update({
    where: { id: userId },
    data: {
      ...(name !== undefined && { name: name.trim() || null }),
      ...(university !== undefined && { university: university.trim() }),
      ...(department !== undefined && { department: department.trim() || null }),
      ...(country !== undefined && { country: country.trim() || null }),
      ...(avatarUrl !== undefined && { avatarUrl: avatarUrl.trim() || null }),
      ...(bio !== undefined && { bio: bio.trim().slice(0, 200) || null }),
    },
    select: { id: true, name: true, university: true, department: true, country: true, avatarUrl: true, bio: true },
  });

  return NextResponse.json(updated);
}
