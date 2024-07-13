"use client";

import { countries } from "@/_constants/shared/country";
import {
  Button,
  Card,
  Checkbox,
  Label,
  TextInput,
  HR,
  Select,
} from "flowbite-react";
import Image from "next/image";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";

export default function SignUp() {
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
            Create your Account
          </h5>
          <p className="text-sm font-normal text-gray-700">
            Start your website in seconds. Already have an account?{" "}
            <Link
              href={"/login"}
              className="font-semibold text-blue-700 hover:underline"
            >
              Login here
            </Link>
          </p>
        </div>
        <form className="flex flex-col gap-4">
          <div className="flex flex-col gap-4 md:flex-row">
            <div>
              <div className="block mb-2">
                <Label htmlFor="firstName" value="First Name" />
              </div>
              <TextInput
                id="firstName"
                type="text"
                placeholder="john"
                required
              />
            </div>
            <div>
              <div className="block mb-2">
                <Label htmlFor="lastName" value="Last Name" />
              </div>
              <TextInput
                id="lastName"
                type="text"
                placeholder="dean"
                required
              />
            </div>
          </div>
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
                <Label htmlFor="countries" value="Select your country" />
              </div>
              <Select id="countries" required>
                {countries.map((country) => (
                  <option key={country}>{country}</option>
                ))}
                {/* <option>Canada</option>
                <option>France</option>
                <option>Germany</option> */}
              </Select>
            </div>
          </div>
          <div className="flex flex-col gap-4 md:flex-row">
            <div>
              <div className="block mb-2">
                <Label htmlFor="password" value="Password" />
              </div>
              <TextInput
                id="password"
                type="password"
                placeholder="••••••••"
                required
              />
            </div>
            <div>
              <div className="block mb-2">
                <Label htmlFor="cPassword" value="Confirm password" />
              </div>
              <TextInput
                id="cPassword"
                type="password"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <HR />

          <Button color={"light"}>
            <FcGoogle className="w-5 h-5 mr-2" />
            Sign in with Google
          </Button>

          <div className="flex flex-col gap-3 my-2">
            <div className="flex gap-2">
              <Checkbox id="accept" />
              <Label htmlFor="accept" className="text-gray-500">
                By signing up, you are creating a uplift account and you agree
                to uplift{" "}
                <span className="text-blue-700 hover:underline hover:cursor-pointer">
                  Terms of Use
                </span>{" "}
                and{" "}
                <span className="text-blue-700 hover:underline hover:cursor-pointer">
                  Privacy Policy.
                </span>
              </Label>
            </div>
            <div className="flex gap-2">
              <Checkbox id="acceptEmail" />
              <Label htmlFor="acceptEmail" className="text-gray-500">
                Email me about product updates and resources.
              </Label>
            </div>
          </div>
          <Button type="submit" color={"blue"}>
            Create an account
          </Button>
        </form>
      </Card>
      <div className="flex items-center justify-center hidden md:block">
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
