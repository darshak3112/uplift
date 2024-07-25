import nodemailer from 'nodemailer';
import randomstring from 'randomstring';
import Tester from '@/model/testerModel';
import Creator from '@/model/creatorModel';
import { NextResponse } from 'next/server';

function generateOTP() {
  return randomstring.generate({ length: 4, charset: 'numeric' });
}

function sendOTP(email, otp) {
    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: 'OTP Verification',
        text: `Your OTP for verification is:${otp}`
    };
  
    let transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL, 
            pass: process.env.EMAIL_PASSWORD 
        },
        tls:{
                rejectUnauthorized: false // Disable certificate validation (if necessary)
            }
    });
  
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error occurred:', error);
        } else {
            console.log('OTP Email sent successfully:', info.response);
        }
    });
  }

export async function POST(req) {
    try {
        const reqBody = await req.json();
        const { email } = reqBody;
    const otp = generateOTP();
    const finduser = await Tester.findOne({email: email});
    const findcreator = await Creator.findOne({email: email});
    if (!finduser && !findcreator) {
        return NextResponse.json({ message: "User not found" ,user:email,creator:findcreator});
    }
    if(finduser){
        await Tester.findOneAndUpdate
        ({
            email: email
        },
        {
            forgotPasswordToken: otp,
            forgotPasswordTokenExpiry: Date.now() + 5 * 60 * 1000
        });
    }
    if(findcreator){
        await Creator.findOneAndUpdate
        ({
            email: email
        },
        {
            forgotPasswordToken: otp,
            forgotPasswordTokenExpiry: Date.now() + 5 * 60 * 1000
        });
    }
    sendOTP(email, otp);
    console.log("OTP sent" , otp);
    return NextResponse.json({ message: "OTP sent successfully" });
        } catch (error) {
            console.log(error)
        }
    }