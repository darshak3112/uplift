import { dbConnect } from '@/_lib/db';
import Tester from '@/model/testerModel';
import Creator from '@/model/creatorModel';
import { sendResetPasswordEmail } from '@/_lib/mail';
import crypto from 'crypto';
import { NextResponse } from 'next/server';
import { z } from 'zod';

dbConnect();

export async function POST(req) {
  try {
    const forgotPasswordSchema = z.object({
      email: z.string().email(),
      role: z.enum(['tester', 'creator']),
    });

    const reqBody = await req.json();
    const parsedData = forgotPasswordSchema.safeParse(reqBody);

    if (!parsedData.success) {
      return NextResponse.json({ message: 'Invalid request body', errors: parsedData?.error?.issues }, { status: 400 });
    }

    const { email, role } = parsedData.data;

    let user;
    if (role === 'tester') {
      user = await Tester.findOne({ email });
    } else if (role === 'creator') {
      user = await Creator.findOne({ email });
    }

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

    await user.save();

    await sendResetPasswordEmail(user.email, resetToken, role);

    return NextResponse.json({ message: 'Password reset email sent' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
