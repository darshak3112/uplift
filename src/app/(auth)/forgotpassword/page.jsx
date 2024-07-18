"use client";

import { Button, Card, Checkbox, Label, TextInput, HR } from "flowbite-react";
import Image from "next/image";

export default function Login() {
  return (
    <section className="flex justify-center gap-24 px-5 py-8 md:px-14">
      <Card className="max-w-lg">
        <div className="flex items-center space-x-4">
          <Image
            className="w-12 h-12 rounded-full"
            src="/images/logo.png"
            alt="Bonnie Green avatar"
            height={50}
            width={60}
          />
          <h5 className="text-2xl font-medium tracking-tight text-gray-900 ">
            uplift
          </h5>
        </div>
        <div className="flex flex-col items-left">
          <h5 className="text-2xl font-bold tracking-tight text-gray-900 ">
            Reset your password
          </h5>
          <p className="text-sm font-normal text-gray-700">
            We&apos;ll email you instructions to reset your password. If you
            can&apos;t access your email, you can try{" "}
            <span className="font-semibold text-blue-700 hover:cursor-pointer hover:underline">
              account recovery.
            </span>
          </p>
        </div>
        <form className="flex flex-col gap-4">
          <div className="flex">
            <div className="w-full">
              <div className="block mb-2">
                <Label htmlFor="email1" value="Email" />
              </div>
              <TextInput
                className="w-full min-w-full"
                id="email1"
                type="email"
                placeholder="name@company.com"
                required
              />
            </div>
          </div>

          <div className="my-2">
            <div className="flex gap-1">
              <Checkbox id="remember" />
              <Label htmlFor="accept" className="text-gray-500">
                I agree to uplift&apos;s{" "}
                <span className="text-blue-700 hover:underline hover:cursor-pointer">
                  Terms of Use
                </span>{" "}
                and{" "}
                <span className="text-blue-700 hover:underline hover:cursor-pointer">
                  Privacy Policy.
                </span>
              </Label>
            </div>
          </div>
          <Button type="submit" color={"blue"}>
            Reset password
          </Button>
          <p className="text-sm font-normal text-gray-700">
            If you still need help, contact{" "}
            <span className="font-semibold text-blue-700 hover:cursor-pointer hover:underline">
              uplift support.
            </span>
          </p>
        </form>
      </Card>
      <div className="hidden md:block ">
        <Image
          className="w-[450px] h-[450px]"
          src={"/images/OfficeMan.png"}
          width={450}
          height={400}
          alt="human desk"
        />
      </div>
    </section>
  );
}
