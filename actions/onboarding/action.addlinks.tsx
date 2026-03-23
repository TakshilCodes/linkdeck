"use server";

import { z } from "zod";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

const platformLinkSchema = z.object({
    platform: z.string().min(1),
    value: z.string().min(1).max(300),
});

const saveLinksSchema = z.object({
    platformLinks: z.array(platformLinkSchema),
    customLinks: z.array(z.string().url().max(500)).max(10),
});

function normalizeValue(platform: string, value: string) {
    const trimmed = value.trim();

    if (!trimmed) return "";

    if (platform === "INSTAGRAM") {
        return trimmed.startsWith("@") ? trimmed : `@${trimmed}`;
    }

    return trimmed;
}

export async function savePlatformLinksAction(input: {
    platformLinks: { platform: string; value: string }[];
    customLinks: string[];
}) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        throw new Error("Unauthorized");
    }

    const parsed = saveLinksSchema.safeParse(input);

    if (!parsed.success) {
        throw new Error("Invalid links data.");
    }

    const userId = session.user.id;

    await prisma.$transaction(async (tx) => {
        await tx.socialIcon.deleteMany({
            where: { userId },
        });

        const cleanedPlatformLinks = parsed.data.platformLinks
            .map((item) => ({
                platform: item.platform,
                value: normalizeValue(item.platform, item.value),
            }))
            .filter((item) => item.value.length > 0);

        if (cleanedPlatformLinks.length > 0) {
            await tx.socialIcon.createMany({
                data: cleanedPlatformLinks.map((item, index) => ({
                    userId,
                    type: item.platform as any,
                    url: item.value,
                    position: index + 1,
                })),
            });
        }

        if (parsed.data.customLinks.length > 0) {
            const basePosition = cleanedPlatformLinks.length;

            await tx.socialIcon.createMany({
                data: parsed.data.customLinks.map((url, index) => ({
                    userId,
                    type: "PERSONAL_WEBSITE" as any,
                    url,
                    position: basePosition + index + 1,
                })),
            });
        }

        await tx.user.update({
            where: { id: userId },
            data: {
                onboardingStep: "LINKS",
            },
        });
    });

    redirect("/onboarding?step=profile");
}

export async function skipLinksAction() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        throw new Error("Unauthorized");
    }

    await prisma.user.update({
        where: { id: session.user.id },
        data: {
            onboardingStep: "LINKS",
        },
    });

    redirect("/onboarding?step=profile");
}