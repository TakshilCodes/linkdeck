"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

type UpdateProfileInput = {
    displayName?: string;
    bio?: string;
};

export async function updateProfileAction(data: UpdateProfileInput) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return {
                success: false,
                message: "Unauthorized",
            }
        }

        const userId = session.user.id;

        const displayName =
            data.displayName?.trim().length
                ? data.displayName.trim()
                : null;

        const bio =
            data.bio?.trim().length
                ? data.bio.trim()
                : null;

        if (displayName && displayName.length > 30) {
            return {
                success: false,
                message: "Title must be less than 30 characters",
            }
        }

        if (bio && bio.length > 160) {
            return {
                success: false,
                message: "Bio must be less than 160 characters",
            }
        }

        await prisma.user.update({
            where: { id: userId },
            data: {
                displayName,
                bio,
            },
        });

        revalidatePath("/dashboard/links");

        return { success: true };
    } catch (err) {
        console.error("Update Profile Error:", err);

        return {
            success: false,
            message:
                err instanceof Error ? err.message : "Something went wrong",
        };
    }
}