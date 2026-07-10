"use client";

import Image from "next/image";
import Link from "next/link";
import { Instagram, Linkedin, Github, Plus, FolderClosed, Pencil, ExternalLink } from "lucide-react";
import { FaXTwitter } from "react-icons/fa6";
import { getIconByType, resolveSocialUrl } from "@/lib/social-icons";
import EditTitleBioModal from "./EditTitleBioModal";
import AddSocialIconModal from "./AddSocialIconModal";
import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateSocialIconVisibilityAction, reorderSocialIconsAction, deleteSocialIconAction } from "@/actions/dashboard/social-icon";
import ManageSocialIconsModal from "./ManageSocialIconModal";
import ManageProfilePictureModal from "./ManageProfilePictureModal";
import AddItemModal from "@/components/dashboard/links/AddItemModal";
import { toast } from "sonner";
import { createCollectionAction } from "@/actions/dashboard/links";

type Props = {
    username: string;
    bio?: string | null;
    profileImgUrl?: string | null;
    icons: SocialIconItem[];
    displayName?: string | null;
};

type SocialType =
    | "INSTAGRAM"
    | "X"
    | "LINKEDIN"
    | "FACEBOOK"
    | "YOUTUBE"
    | "GITHUB"
    | "PERSONAL_WEBSITE"
    | "PATREON"
    | "KICK"
    | "DISCORD"
    | "PINTEREST"
    | "TWITCH"
    | "TELEGRAM"
    | "THREADS"
    | "SNAPCHAT";

type SocialIconItem = {
    id: string;
    type: SocialType;
    value: string;
    label?: string | null;
    isVisible: boolean;
    position: number;
};

export default function ProfileHeader({
    username,
    bio,
    profileImgUrl,
    icons,
    displayName,
}: Props) {

    const EMPTY_ICONS = [
        { Icon: Github, key: "github", type: "GITHUB" },
        { Icon: Instagram, key: "instagram", type: "INSTAGRAM" },
        { Icon: FaXTwitter, key: "x", type: "X" },
        { Icon: Linkedin, key: "linkedin", type: "LINKEDIN" },
    ] as const;

    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState(displayName ?? "");
    const [newBio, setNewBio] = useState(bio ?? "");
    const [socialModalOpen, setSocialModalOpen] = useState(false);
    const [initialSocialType, setInitialSocialType] = useState<SocialType | null>(null);
    const [editingSocialIcon, setEditingSocialIcon] = useState<SocialIconItem | null>(null);
    const [manageSocialOpen, setManageSocialOpen] = useState(false);
    const [profileModalOpen, setProfileModalOpen] = useState(false);

    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [socialIcons, setSocialIcons] = useState<SocialIconItem[]>(icons);
    const [addItemOpen, setAddItemOpen] = useState(false);

    const visibleIcons = [...socialIcons]
        .filter((icon) => icon.isVisible)
        .sort((a, b) => a.position - b.position);

    useEffect(() => {
        setSocialIcons(icons);
    }, [icons]);

    const openManageSocialIcons = () => {
        setManageSocialOpen(true);
    };


    const openSocialPicker = () => {
        setEditingSocialIcon(null);
        setInitialSocialType(null);
        setSocialModalOpen(true);
    };

    const openDirectSocialInput = (type: SocialType) => {
        setEditingSocialIcon(null);
        setInitialSocialType(type);
        setSocialModalOpen(true);
    };

    const openEditSocialInput = (icon: SocialIconItem) => {
        setInitialSocialType(null);
        setEditingSocialIcon(icon);
        setSocialModalOpen(true);
    };

    const handleDeleteSocialIcon = (id: string) => {
        const previousIcons = socialIcons;

        setSocialIcons((prev) => prev.filter((icon) => icon.id !== id));

        startTransition(async () => {
            const res = await deleteSocialIconAction(id);

            if (!res.success) {
                setSocialIcons(previousIcons);
                toast.error(res.message || "Failed to delete social icon");
                return;
            }

            toast.success("Social icon deleted");
            router.refresh();
        });
    };

    const handleToggleSocialIcon = (id: string, nextVisible: boolean) => {
        const previousIcons = socialIcons;

        setSocialIcons((prev) =>
            prev.map((icon) =>
                icon.id === id ? { ...icon, isVisible: nextVisible } : icon
            )
        );

        startTransition(async () => {
            const res = await updateSocialIconVisibilityAction({
                id,
                isVisible: nextVisible,
            });

            if (!res.success) {
                setSocialIcons(previousIcons);
                return;
            }

            router.refresh();
        });
    };

    const handleReorderSocialIcons = (reorderedIcons: SocialIconItem[]) => {
        const previousIcons = socialIcons;

        setSocialIcons(reorderedIcons);

        startTransition(async () => {
            const payload = reorderedIcons.map((item, index) => ({
                id: item.id,
                position: index,
            }));

            const res = await reorderSocialIconsAction(payload);

            if (!res.success) {
                setSocialIcons(previousIcons);
                return;
            }

            router.refresh();
        });
    };

    return (
        <>
            <EditTitleBioModal
                open={open}
                title={title}
                bio={newBio}
                onClose={() => setOpen(false)}
                onSave={() => {
                    setOpen(false);
                }}
                onTitleChange={setTitle}
                onBioChange={setNewBio}
            />

            <ManageProfilePictureModal
                open={profileModalOpen}
                currentImgUrl={profileImgUrl}
                username={username}
                onClose={() => setProfileModalOpen(false)}
            />

            <AddSocialIconModal
                open={socialModalOpen}
                onClose={() => {
                    setSocialModalOpen(false);
                    setInitialSocialType(null);
                    setEditingSocialIcon(null);
                }}
                initialType={initialSocialType}
                editingIcon={editingSocialIcon}
                onSaved={(savedIcon) => {
                    const nextIcon = savedIcon as SocialIconItem;
                    setSocialIcons((prev) => {
                        const existingIndex = prev.findIndex((icon) => icon.id === nextIcon.id);

                        if (existingIndex === -1) {
                            return [...prev, nextIcon].sort((a, b) => a.position - b.position);
                        }

                        return prev.map((icon) => icon.id === nextIcon.id ? nextIcon : icon);
                    });
                    router.refresh();
                }}
            />

            <ManageSocialIconsModal
                open={manageSocialOpen}
                icons={socialIcons}
                onClose={() => setManageSocialOpen(false)}
                onAddIcon={() => {
                    setManageSocialOpen(false);
                    openSocialPicker();
                }}
                onEditIcon={(icon) => {
                    setManageSocialOpen(false);
                    openEditSocialInput(icon);
                }}
                onToggleIcon={handleToggleSocialIcon}
                onReorder={handleReorderSocialIcons}
                onDeleteIcon={handleDeleteSocialIcon}
            />

            <AddItemModal
                open={addItemOpen}
                onClose={() => setAddItemOpen(false)}
            />

            <div className="mx-auto w-full max-w-4xl py-5 sm:py-6">
                <div className="rounded-2xl border border-white/10 bg-[#0d1725]/80 p-4 shadow-[0_16px_40px_rgba(0,0,0,0.16)] sm:p-5">
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex min-w-0 items-center gap-3.5">
                            <button
                                type="button"
                                onClick={() => setProfileModalOpen(true)}
                                className="group relative h-14 w-14 shrink-0 overflow-hidden rounded-full border border-white/20 bg-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-400/60"
                                aria-label="Edit profile picture"
                            >
                                {profileImgUrl ? (
                                    <Image
                                        src={profileImgUrl}
                                        alt={username}
                                        fill
                                        sizes="56px"
                                        className="object-cover transition-all duration-300 group-hover:blur-sm"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center text-lg text-white/60 transition-all duration-300 group-hover:blur-sm">
                                        {username?.charAt(0).toUpperCase()}
                                    </div>
                                )}
                                <span className="absolute inset-0 flex items-center justify-center bg-black/35 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                    <Pencil className="h-4 w-4 text-white" />
                                </span>
                            </button>

                            <div className="min-w-0">
                                <button
                                    type="button"
                                    onClick={() => setOpen(true)}
                                    className="flex max-w-full items-center gap-1.5 text-left text-base font-semibold text-white transition hover:text-cyan-100"
                                    title={title && title.trim() !== "" ? title : `@${username}`}
                                >
                                    <span className="truncate">{title && title.trim() !== "" ? title : `@${username}`}</span>
                                    <Pencil className="h-3.5 w-3.5 shrink-0 text-white/35" />
                                </button>

                                {newBio ? (
                                    <button
                                        type="button"
                                        onClick={() => setOpen(true)}
                                        className="mt-0.5 block max-w-full truncate text-left text-sm text-white/50 transition hover:text-white/75"
                                    >
                                        {newBio}
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => setOpen(true)}
                                        className="mt-0.5 text-sm text-white/45 transition hover:text-white/75"
                                    >
                                        Add a short bio
                                    </button>
                                )}

                                <div className="mt-2 flex items-center gap-1.5">
                                    {visibleIcons.length > 0 ? (
                                        <>
                                            {visibleIcons.map((item) => {
                                                const iconMeta = getIconByType(item.type);
                                                if (!iconMeta) return null;
                                                const Icon = iconMeta.icon;

                                                return (
                                                    <Link
                                                        key={item.id}
                                                        href={resolveSocialUrl(item.type, item.value)}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="flex h-7 w-7 items-center justify-center rounded-lg text-white/55 transition hover:bg-white/[0.06] hover:text-white"
                                                        aria-label={`Open ${item.label || item.type}`}
                                                    >
                                                        <Icon className="h-4 w-4" />
                                                    </Link>
                                                );
                                            })}
                                            <button
                                                type="button"
                                                onClick={openManageSocialIcons}
                                                className="flex h-7 w-7 items-center justify-center rounded-lg text-white/45 transition hover:bg-white/[0.06] hover:text-white"
                                                aria-label="Manage social links"
                                            >
                                                <Pencil className="h-3.5 w-3.5" />
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            {EMPTY_ICONS.map(({ Icon, key, type }) => (
                                                <button
                                                    key={key}
                                                    type="button"
                                                    onClick={() => openDirectSocialInput(type)}
                                                    className="flex h-7 w-7 items-center justify-center rounded-lg border border-dashed border-white/10 text-white/45 transition hover:border-cyan-400/35 hover:text-cyan-200"
                                                    aria-label={`Add ${key}`}
                                                >
                                                    <Icon className="h-3.5 w-3.5" />
                                                </button>
                                            ))}
                                            <button
                                                type="button"
                                                onClick={openSocialPicker}
                                                className="flex h-7 w-7 items-center justify-center rounded-lg text-white/55 transition hover:bg-white/[0.06] hover:text-white"
                                                aria-label="Add social link"
                                            >
                                                <Plus className="h-4 w-4" />
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            <button
                                type="button"
                                onClick={() => setAddItemOpen(true)}
                                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-cyan-400 px-4 text-sm font-semibold text-[#03111f] transition hover:bg-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-300/70"
                            >
                                <Plus className="h-4 w-4" />
                                Add link
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    startTransition(async () => {
                                        const res = await createCollectionAction();
                                        if (!res.success) {
                                            toast.error(res.message || "Failed to create collection");
                                            return;
                                        }
                                        toast.success("Collection created successfully");
                                        router.refresh();
                                    });
                                }}
                                disabled={isPending}
                                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.06] px-3.5 text-sm font-medium text-white transition hover:border-cyan-400/30 hover:bg-cyan-400/10 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                <FolderClosed className="h-4 w-4" />
                                {isPending ? "Creating..." : "Add collection"}
                            </button>

                            <Link
                                href={`/${username}`}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-white/55 transition hover:border-cyan-400/30 hover:bg-cyan-400/10 hover:text-cyan-200"
                                aria-label="Open public profile"
                                title="Open public profile"
                            >
                                <ExternalLink className="h-4 w-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
