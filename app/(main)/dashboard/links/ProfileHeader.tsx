"use client";

import Image from "next/image";
import Link from "next/link";
import { Instagram, Linkedin, Github, Plus, FolderClosed, Pencil } from "lucide-react";
import { FaXTwitter } from "react-icons/fa6";
import { getIconByType, resolveSocialUrl } from "@/lib/social-icons";
import EditTitleBioModal from "./EditTitleBioModal";
import AddSocialIconModal from "./AddSocialIconModal";
import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateSocialIconVisibilityAction, reorderSocialIconsAction, deleteSocialIconAction } from "@/actions/dashboard/social-icon";
import ManageSocialIconsModal from "./ManageSocialIconModal";
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
    const [manageSocialOpen, setManageSocialOpen] = useState(false);

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
        setInitialSocialType(null);
        setSocialModalOpen(true);
    };

    const openDirectSocialInput = (type: SocialType) => {
        setInitialSocialType(type);
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

            <AddSocialIconModal
                open={socialModalOpen}
                onClose={() => {
                    setSocialModalOpen(false);
                    setInitialSocialType(null);
                }}
                initialType={initialSocialType}
            />

            <ManageSocialIconsModal
                open={manageSocialOpen}
                icons={socialIcons}
                onClose={() => setManageSocialOpen(false)}
                onAddIcon={() => {
                    setManageSocialOpen(false);
                    openSocialPicker();
                }}
                onEditIcon={(type) => {
                    setManageSocialOpen(false);
                    openDirectSocialInput(type);
                }}
                onToggleIcon={handleToggleSocialIcon}
                onReorder={handleReorderSocialIcons}
                onDeleteIcon={handleDeleteSocialIcon}
            />

            <AddItemModal
                open={addItemOpen}
                onClose={() => setAddItemOpen(false)}
            />

            <div className="mx-auto w-full max-w-140 py-10">
                <div className="flex items-center gap-4">
                    <div className="relative h-16 w-16 overflow-hidden rounded-full border border-white/20 bg-white/10">
                        {profileImgUrl ? (
                            <Image
                                src={profileImgUrl}
                                alt={username}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center text-xl text-white/60">
                                {username?.charAt(0).toUpperCase()}
                            </div>
                        )}
                    </div>

                    <div className="min-w-0 flex-1">
                        <h2
                            onClick={() => setOpen(true)}
                            className="cursor-pointer truncate text-[15px] font-semibold leading-none text-white hover:text-white/90 hover:underline"
                            title={title && title.trim() !== "" ? title : `@${username}`}
                        >
                            {title && title.trim() !== "" ? title : `@${username}`}
                        </h2>

                        {newBio ? (
                            <p
                                onClick={() => setOpen(true)}
                                className="my-1 cursor-pointer wrap-break-word text-sm leading-5 text-white/50 hover:text-white/70"
                            >
                                {newBio}
                            </p>
                        ) : (
                            <button
                                onClick={() => setOpen(true)}
                                className="mt-1 cursor-pointer text-sm text-white/50 transition hover:text-white hover:underline"
                            >
                                Add bio
                            </button>
                        )}

                        <div className="mt-1 flex items-center gap-2">
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
                                                className="flex h-6 w-6 items-center justify-center text-white/60 transition hover:text-white"
                                            >
                                                <Icon className="h-4 w-4" />
                                            </Link>
                                        );
                                    })}

                                    <button
                                        type="button"
                                        onClick={openManageSocialIcons}
                                        className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-white transition hover:bg-white/30"
                                    >
                                        <Pencil className="h-3 w-3" />
                                    </button>
                                </>
                            ) : (
                                <>
                                    {EMPTY_ICONS.map(({ Icon, key, type }) => (
                                        <button
                                            key={key}
                                            type="button"
                                            onClick={() => openDirectSocialInput(type)}
                                            className="relative h-8 w-8"
                                        >
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/70 transition hover:bg-white/15 hover:text-white">
                                                <Icon className="h-4 w-4" />
                                            </div>

                                            <div className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-white text-black shadow">
                                                <Plus className="h-3 w-3" strokeWidth={3} />
                                            </div>
                                        </button>
                                    ))}

                                    <button
                                        type="button"
                                        onClick={openSocialPicker}
                                        className="ml-1 flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white transition hover:bg-white/30"
                                    >
                                        <Plus className="h-4 w-4" />
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={() => setAddItemOpen(true)}
                    className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-cyan-500 font-medium text-[#03111f] shadow-lg transition hover:bg-cyan-400"
                >
                    <Plus size={18} />
                    Add
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
                    className="mt-5 flex cursor-pointer items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    <FolderClosed size={16} />
                    {isPending ? "Creating..." : "Add collection"}
                </button>
            </div>
        </>
    );
}