import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";

function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json(
                { ok: false, error: "Email is required" },
                { status: 400 }
            );
        }

        const normalizedEmail = email.toLowerCase();
        const cooldownKey = `otp:cooldown:${normalizedEmail}`;
        const isCooldown = await redis.get(cooldownKey);

        if (isCooldown) {
            return NextResponse.json(
                { ok: false, error: "Please wait before requesting again" },
                { status: 429 }
            );
        }

        const otp = generateOTP();

        await redis.set(`otp:${normalizedEmail}`, otp, 300);

        await redis.set(cooldownKey, "1", 30);

        console.log("OTP:", otp);

        return NextResponse.json({
            ok: true,
            msg: "OTP resent successfully",
        });
    } catch (e: any) {
        return NextResponse.json(
            { ok: false, error: e.message },
            { status: 500 }
        );
    }
}