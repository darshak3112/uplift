"use client";

import { countries } from "@/_constants/shared/country";
import {
  Button,
  Card,
  Label,
  TextInput,
  HR,
  Select,
  Textarea,
} from "flowbite-react";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { SpinnerComponent } from "@/components/shared/spinner/Spinner";
import toast from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "@/_lib/store/hooks";
import { addAppTask } from "@/_lib/store/features/creator/appTask/appTaskSlice";

export default function TaskReviewForm({ setTaskCreated }) {
  const tester_gender = ["Male", "Female", "Both"];

  const dispatch = useAppDispatch();

  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const creator = useAppSelector((state) => state.userInfo.id);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      heading: "",
      tester_no: "",
      tester_age: "",
      tester_gender: "",
      country: "",
      instruction: "",
    },
  });

  const onSubmit = async (data, event) => {
    event.preventDefault();
    setErrorMessage(null);
    setLoading(() => true);

    let today = new Date();
    today.setHours(0, 0, 0, 0); // Set today's date to midnight for accurate comparison

    const post_date = today.toISOString(); // Convert to ISO string
    const end_date = new Date(today);
    end_date.setDate(today.getDate() + 15); // Assuming the end date is 15 days after the start
    const endDateISO = end_date.toISOString(); // Convert to ISO string

    const formData = { creator, post_date, end_date: endDateISO, ...data };

    setTimeout(() => {
      setLoading(() => false);
      dispatch(addAppTask(formData));
      toast.success("Task created successfully....");
      setTaskCreated(() => true);
    }, 2000);
  };

  return (
    <section>
      <div className="flex justify-center gap-24 px-5 py-8 md:px-14">
        <Card className="max-w-lg">
          <div className="flex flex-col items-center">
            <h5 className="text-2xl font-bold tracking-tight text-gray-900 ">
              Task Review Form
            </h5>
          </div>

          <form
            method="POST"
            className="flex flex-col gap-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="flex flex-col gap-4 md:flex-row">
              <div>
                <div className="block mb-2">
                  <Label htmlFor="heading" value="Task Name" />
                </div>
                <TextInput
                  id="heading"
                  type="text"
                  placeholder="Enter task name"
                  name="heading"
                  {...register("heading", {
                    required: "Task name is required",
                  })}
                  required
                />
              </div>
              <div>
                <div className="block mb-2">
                  <Label htmlFor="tester_no" value="No of Testers" />
                </div>
                <TextInput
                  id="tester_no"
                  type="number"
                  name="tester_no"
                  placeholder="xx"
                  {...register("tester_no", {
                    required: "No. of testers is required",
                  })}
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-4 md:flex-row">
              <div>
                <div className="block mb-2">
                  <Label htmlFor="tester_age" value="Min Age of Testers" />
                </div>
                <Select
                  id="tester_age"
                  name="tester_age"
                  defaultValue="NA"
                  {...register("tester_age", {
                    required: "Select tester age",
                  })}
                  required
                >
                  <option value="NA" disabled>
                    Select tester age
                  </option>
                  {Array.from({ length: 62 - 16 }, (_, index) => (
                    <option key={index + 16} value={index + 16}>
                      {index + 16}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <div className="block mb-2">
                  <Label htmlFor="tester_gender" value="Gender" />
                </div>
                <Select
                  id="tester_gender"
                  name="tester_gender"
                  defaultValue="NA"
                  {...register("tester_gender", {
                    required: "Select tester gender",
                  })}
                  required
                >
                  <option value="NA" disabled>
                    Select tester gender
                  </option>
                  {tester_gender.map((test) => (
                    <option key={test} value={test}>
                      {test}
                    </option>
                  ))}
                </Select>
              </div>
            </div>

            <div>
              <div className="block mb-2">
                <Label htmlFor="country" value="Select Country" />
              </div>
              <Select
                id="country"
                name="country"
                defaultValue="NA"
                {...register("country", {
                  required: "Select Country",
                })}
                required
              >
                <option value="NA" disabled>
                  Select Country
                </option>
                {countries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <div className="block mb-2">
                <Label htmlFor="instruction" value="Instruction" />
              </div>
              <Textarea
                id="instruction"
                {...register("instruction", {
                  required: "Instruction is required",
                })}
                placeholder="Enter instructions..."
                required
                rows={4}
              />
            </div>

            {errorMessage && (
              <p className="flex justify-center -mb-8 text-base font-normal text-red-500">
                {errorMessage}
              </p>
            )}
            <HR />

            <Button type="submit" color={"blue"}>
              {loading ? <SpinnerComponent /> : "Submit"}
            </Button>
          </form>
        </Card>

        <div className="items-center justify-center hidden md:flex ">
          <Image
            className="w-[450px] h-[450px]"
            src={"/images/taskMan.png"}
            width={450}
            height={400}
            alt="human desk"
          />
        </div>
      </div>
    </section>
  );
}
