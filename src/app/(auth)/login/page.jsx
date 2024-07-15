"use client";

import {
  Button,
  Card,
  Checkbox,
  Label,
  TextInput,
  HR,
  Radio,
} from "flowbite-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";

export default function Login() {
  const [user, setUser] = useState(null);

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
            Welcome Back
          </h5>
          <p className="text-sm font-normal text-gray-700">
            Start your website in seconds. Don’t have an account?{" "}
            <Link
              href={"/signup"}
              className="font-semibold text-blue-700 hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <div className="mr-5">
              <Label htmlFor="lableUser" className="text-lg">
                Signup as:
              </Label>
            </div>
            <Radio
              id="creatorRadio"
              onClick={() => setUser("Creator")}
              name="user"
              value="creator"
            />
            <Label htmlFor="creator">Creator</Label>
          </div>
          <div className="flex items-center gap-2">
            <Radio
              id="testerRadio"
              onClick={() => setUser("Tester")}
              name="user"
              value="tester"
            />
            <Label htmlFor="tester">Tester</Label>
          </div>
        </div>
        <form className="flex flex-col gap-4">
          <div className="flex flex-col gap-4 md:flex-row">
            <div>
              <div className="block mb-2">
                <Label htmlFor="email1" value="Email" />
              </div>
              <TextInput
                id="email1"
                type="email"
                placeholder="name@company.com"
                required
              />
            </div>
            <div>
              <div className="block mb-2">
                <Label htmlFor="password1" value="Password" />
              </div>
              <TextInput
                id="password1"
                type="password"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <HR />

          <Button disabled={user === null} color={"light"}>
            <FcGoogle className="w-5 h-5 mr-2" />
            {user === null
              ? "To sign up with google please select role"
              : "Sign up with google"}
          </Button>

          <div className="flex items-center justify-between gap-2 my-2">
            <div className="flex gap-1">
              <Checkbox id="remember" />
              <Label htmlFor="remember">Remember me</Label>
            </div>
            <Link
              href={"/forgotpassword"}
              className="text-sm font-semibold text-blue-700"
            >
              Forgot Password?
            </Link>
          </div>
          <Button type="submit" color={"blue"}>
            Sign in to your account
          </Button>
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
