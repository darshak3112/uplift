import { dbConnect } from '@/_lib/db';
import Tester from '@/model/testerModel';
import Creator from '@/model/creatorModel';
import { sendResetPasswordEmail } from '@/_lib/mail';
import crypto from 'crypto';
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { z } from 'zod';

dbConnect();

export async function POST(req) {
  const session = await mongoose.startSession();
  
  try {
    // Start a transaction
    session.startTransaction();

    const forgotPasswordSchema = z.object({
      email: z.string().email(),
      role: z.enum(['tester', 'creator']),
    });

    const reqBody = await req.json();
    const parsedData = forgotPasswordSchema.safeParse(reqBody);

    if (!parsedData.success) {
      await session.abortTransaction();
      session.endSession();
      return NextResponse.json({ message: 'Invalid request body', errors: parsedData?.error?.issues }, { status: 400 });
    }

    const { email, role } = parsedData.data;

    if(!email || !role) {
      await session.abortTransaction();
      session.endSession();
      return NextResponse.json({ message : 'Invalid request body',reqBody},{status : 400})
    }

    let user;
    if (role === 'tester') {
      user = await Tester.findOne({ email }).session(session);
    } else if (role === 'creator') {
      user = await Creator.findOne({ email }).session(session);
    }

    if (!user) {
      await session.abortTransaction();
      session.endSession();
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

    // Save the user changes with the session
    await user.save({ session });

    // Send email (could be outside the transaction, as email sending isn't transactional)
    await sendResetPasswordEmail(user.email, resetToken, role);

    // Commit the transaction if everything is successful
    await session.commitTransaction();
    session.endSession();

    return NextResponse.json({ message: 'Password reset email sent' }, { status: 200 });
    
  } catch (error) {
    // If there's any error, rollback the transaction
    await session.abortTransaction();
    session.endSession();
    console.error('Error during password reset:', error);
    
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
