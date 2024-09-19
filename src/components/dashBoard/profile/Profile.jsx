import React from "react";
import { Card, Label, TextInput, Button, Checkbox } from "flowbite-react";
import Image from "next/image";

export default function Profile() {
  const userProfile = {
    firstName: "John",
    lastName: "Doe",
    email: "hddbxh20@gmail.com",
    mobileNo: "1234566690",
    gender: "Male",
    role: "tester",
    dob: "1990-01-01",
    country: "India",
    pincode: "0123",
  };

  return (
    <section className="flex flex-col justify-center gap-24 px-5 py-8 md:flex-row md:px-14">
      <Card className="w-full max-w-lg">
        <div className="flex items-center mb-4 space-x-4">
          <Image
            className="w-12 h-12 rounded-full"
            src="/images/logo.png"
            alt="User avatar"
            height={50}
            width={60}
          />
          <h5 className="text-2xl font-medium tracking-tight text-gray-900">
            User Profile
          </h5>
        </div>
        <form method="POST" className="flex flex-col gap-4">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="w-full">
              <div className="block mb-2">
                <Label htmlFor="firstName" value="First Name" />
              </div>
              <TextInput
                id="firstName"
                type="text"
                placeholder="John"
                value={userProfile.firstName}
                readOnly
                className="text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50"
              />
            </div>
            <div className="w-full">
              <div className="block mb-2">
                <Label htmlFor="lastName" value="Last Name" />
              </div>
              <TextInput
                id="lastName"
                type="text"
                placeholder="Doe"
                value={userProfile.lastName}
                readOnly
                className="text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50"
              />
            </div>
          </div>
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="w-full">
              <div className="block mb-2">
                <Label htmlFor="email" value="Email" />
              </div>
              <TextInput
                id="email"
                type="email"
                placeholder="name@company.com"
                value={userProfile.email}
                readOnly
                className="text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50"
              />
            </div>
            <div className="w-full">
              <div className="block mb-2">
                <Label htmlFor="mobileNo" value="Mobile" />
              </div>
              <TextInput
                id="mobileNo"
                type="text"
                placeholder="1234567890"
                value={userProfile.mobileNo}
                readOnly
                className="text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50"
              />
            </div>
          </div>
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="w-full">
              <div className="block mb-2">
                <Label htmlFor="gender" value="Gender" />
              </div>
              <TextInput
                id="gender"
                type="text"
                value={userProfile.gender}
                readOnly
                className="text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50"
              />
            </div>
            <div className="w-full">
              <div className="block mb-2">
                <Label htmlFor="dob" value="Date of Birth" />
              </div>
              <TextInput
                id="dob"
                type="text"
                value={userProfile.dob}
                readOnly
                className="text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50"
              />
            </div>
          </div>
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="w-full">
              <div className="block mb-2">
                <Label htmlFor="country" value="Country" />
              </div>
              <TextInput
                id="country"
                type="text"
                value={userProfile.country}
                readOnly
                className="text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50"
              />
            </div>
            <div className="w-full">
              <div className="block mb-2">
                <Label htmlFor="pincode" value="Pincode" />
              </div>
              <TextInput
                id="pincode"
                type="text"
                placeholder="xxxxxx"
                value={userProfile.pincode}
                readOnly
                className="text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50"
              />
            </div>
          </div>
          <div className="flex flex-col gap-3 my-2">
            <div className="flex items-center gap-2">
              <Checkbox color="blue" checked disabled id="accept" />
              <Label htmlFor="accept" className="text-gray-500">
                By updating your profile, you agree to the{" "}
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
          <Button type="submit" color="blue">
            Save Changes
          </Button>
        </form>
      </Card>
      <div className="items-center justify-center hidden md:flex">
        <Image
          className="w-[450px] h-[450px]"
          src="/images/UpdateProfile.png"
          width={450}
          height={400}
          alt="Office worker"
        />
      </div>
    </section>
  );
}
