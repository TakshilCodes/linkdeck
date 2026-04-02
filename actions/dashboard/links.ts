"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { fallbackTitleFromUrl, fetchPageTitle, normalizeUrl } from "@/lib/links";

export async function createLinkAction(rawUrl: string) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return { success: false, message: "Unauthorized" };
        }

        const userId = session.user.id;
        const normalized = normalizeUrl(rawUrl);

        if (!normalized.success) {
            return {
                success: false,
                message: normalized.error,
            };
        }

        const url = normalized.url;

        const lastLink = await prisma.link.findFirst({
            where: { userId },
            orderBy: { position: "desc" },
            select: { position: true },
        });

        const nextPosition = lastLink ? lastLink.position + 1 : 0;

        const fetchedTitle = await fetchPageTitle(url);
        const name = fetchedTitle || fallbackTitleFromUrl(url);

        await prisma.link.create({
            data: {
                userId,
                name,
                url,
                isVisible: true,
                position: nextPosition,
            },
        });

        return {
            success: true,
            message: "Link added",
        };
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : "Failed to add link",
        };
    }
}

export async function createCollectionAction() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return { success: false, message: "Unauthorized" };
        }

        const userId = session.user.id;

        const lastCollection = await prisma.collection.findFirst({
            where: { userId },
            orderBy: { position: "desc" },
            select: { position: true },
        });

        const totalCollections = await prisma.collection.count({
            where: { userId },
        });

        const nextPosition = lastCollection ? lastCollection.position + 1 : 0;
        const defaultName = `Collection ${totalCollections + 1}`;

        await prisma.collection.create({
            data: {
                userId,
                name: defaultName,
                isVisible: true,
                position: nextPosition,
            },
        });

        return {
            success: true,
            message: "Collection added",
        };
    } catch {
        return {
            success: false,
            message: "Failed to add collection",
        };
    }
}