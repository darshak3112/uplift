import Tester from "@/model/testerModel";
import Creator from "@/model/creatorModel";
import { NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
export async function POST(req) {
    try {
        const reqBody = await req.json();
        const { email, otp ,password} = reqBody;
        const finduser = await Tester.findOne({
            email: email,
            forgotPasswordToken: otp,
            forgotPasswordTokenExpiry: { $gt: Date.now() }
        });
        const findcreator = await Creator.findOne({
            email: email,
            forgotPasswordToken: otp,
            forgotPasswordTokenExpiry: { $gt: Date.now() }
        });
        if (!finduser && !findcreator) {
            return NextResponse.json({ message: "Invalid OTP" });
        }
        if(finduser){
            const salt = await bcryptjs.genSalt(10);
            const hashedPassword = await bcryptjs.hash(password, salt);
            await Tester.findOneAndUpdate
            ({
                email: email
            },
            {
                password: hashedPassword,
                forgotPasswordToken: null,
                forgotPasswordTokenExpiry: null
            });
        }
        if(findcreator){
            const salt = await bcryptjs.genSalt(10);
            const hashedPassword = await bcryptjs.hash(password, salt);
            await Creator.findOneAndUpdate
            ({
                email: email
            },
            {
                password: hashedPassword,
                forgotPasswordToken: null,
                forgotPasswordTokenExpiry: null
            });
        }
        return NextResponse.json({ message: "Password reset successfully" });
    } catch (error) {
        console.log('Error:', error);
    }
}