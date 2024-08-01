import { dbConnect } from '@/_lib/db';
import Tester from '@/model/testerModel';
import Creator from '@/model/creatorModel';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import { z } from 'zod';

dbConnect();

export async function POST(req) {
    try {
        const resetPasswordSchema = z.object({
            password: z.string().min(8),
            token: z.string(),
            role: z.enum(['tester', 'creator']),
        });

        const reqBody = await req.json();
        const parsedData = resetPasswordSchema.safeParse(reqBody);

        if (!parsedData.success) {
            return NextResponse.json({ message: 'Invalid request body', errors: parsedData?.error?.issues }, { status: 400 });
        }
        const { token, password, role } = parsedData.data;

        let user;
        if (role === 'tester') {
            user = await Tester.findOne({
                resetPasswordToken: token,
                resetPasswordExpires: { $gt: Date.now() },
            });
        } else if (role === 'creator') {
            user = await Creator.findOne({
                resetPasswordToken: token,
                resetPasswordExpires: { $gt: Date.now() },
            });
        }

        if (!user) {
            return NextResponse.json({ message: 'Password reset token is invalid or has expired' }, { status: 400 });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        return NextResponse.json({ message: 'Password has been reset' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
