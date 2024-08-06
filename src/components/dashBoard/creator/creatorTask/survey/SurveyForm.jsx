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
import axios from "axios";
import { SpinnerComponent } from "@/components/shared/spinner/Spinner";
import toast from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "@/_lib/store/hooks";
import { addSurveyTask } from "@/_lib/store/features/creator/surveyTask/surveyTaskSlice";

export default function SurveyForm({ setTaskCreated }) {
  const gender = ["Male", "Female", "Both"];

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
      taskName: "",
      noOfTester: "",
      noOfQuestions: "",
      age: "",
      gender: "",
      country: "",
      startDate: "",
      endingDate: "",
      instructuions: "",
    },
  });

  const onSubmit = async (data, event) => {
    event.preventDefault();
    setErrorMessage(null);
    setLoading(() => true);
    const formData = { creator, ...data };
    setTimeout(() => {
      setLoading(() => false);
      dispatch(addSurveyTask(data));
      toast.success("Task created successfully....");
      setTaskCreated(() => true);
    }, 2000);
    // try {
    //   const { cPassword, ...formData } = data;
    //   const response = await axios.post("/api/auth/register", formData);
    //   toast.success("SignUp Successfully...");
    //   router.push("/login");
    // } catch (error) {
    //   ({
    //     response: { data },
    //   } = error);

    //   if (data?.message) {
    //     setTimeout(() => {
    //       setErrorMessage(() => data?.message);
    //     }, 1500);

    //     setTimeout(() => {
    //       setErrorMessage(() => null);
    //       setLoading(() => false);
    //     }, 4800);
    //   }
    // }
  };

  return (
    <section>
      <div className="flex justify-center gap-24 px-5 py-8 md:px-14">
        <Card className="max-w-lg">
          <div className="flex flex-col items-center">
            <h5 className="text-2xl font-bold tracking-tight text-gray-900 ">
              Survey Task
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
                  <Label htmlFor="taskName" value="Task Name" />
                </div>
                <TextInput
                  id="taskName"
                  type="text"
                  placeholder="Enter task name"
                  name="taskName"
                  {...register("taskName", {
                    required: "Task name is required",
                  })}
                  required
                />
              </div>
              <div>
                <div className="block mb-2">
                  <Label htmlFor="noOfTester" value="No of Testers" />
                </div>
                <TextInput
                  id="noOfTester"
                  type="number"
                  name="noOfTester"
                  placeholder="xx"
                  {...register("noOfTester", {
                    required: "No. of testers is required",
                  })}
                  required
                />
              </div>
            </div>
            <div className="flex flex-col gap-4 md:flex-row">
              <div>
                <div className="block mb-2">
                  <Label htmlFor="noOfQuestions" value="No of Questions" />
                </div>
                <TextInput
                  id="noOfQuestions"
                  type="number"
                  name="noOfQuestions"
                  placeholder="xx"
                  max={20}
                  {...register("noOfQuestions", {
                    required: "No. of testers is required",
                  })}
                  required
                />
              </div>
              <div>
                <div className="block mb-2">
                  <Label htmlFor="age" value="Min Age of Testers" />
                </div>
                <Select
                  id="age"
                  name="age"
                  defaultValue="NA"
                  {...register("age", {
                    minLength: {
                      value: 1,
                      message: "Select age",
                    },
                  })}
                  required
                >
                  <option value="NA" disabled>
                    Select Age
                  </option>
                  {Array.from({ length: 62 - 16 }, (_, index) => (
                    <option key={index + 16} value={index + 16}>
                      {index + 16}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
            <div className="flex flex-col gap-4 md:gap-16 md:flex-row">
              <div>
                <div>
                  <div className="block mb-2">
                    <Label htmlFor="gender" value="Gender" />
                  </div>
                  <Select
                    id="gender"
                    name="gender"
                    defaultValue="NA"
                    {...register("gender", {
                      minLength: {
                        value: 1,
                        message: "Select Gender",
                      },
                    })}
                    required
                  >
                    <option value="NA" disabled>
                      Select Gender
                    </option>
                    {gender.map((test) => (
                      <option key={test} value={test}>
                        {test}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>
              <div>
                <div>
                  <div className="block mb-2">
                    <Label htmlFor="countries" value="Select your country" />
                  </div>
                  <Select
                    id="countries"
                    name="country"
                    defaultValue="NA"
                    {...register("country", {
                      minLength: {
                        value: 1,
                        message: "Select Country",
                      },
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
              </div>
            </div>
            <div className="flex flex-col gap-4 md:gap-16 md:flex-row">
              <div>
                <div className="block mb-2">
                  <Label htmlFor="startDate" value="Staring Date" />
                </div>

                <input
                  type="date"
                  name="startDate"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  {...register("startDate", {
                    required: "Starting Date is required",
                  })}
                  required
                />
              </div>
              <div>
                <div className="block mb-2">
                  <Label htmlFor="endingDate" value="Ending Date" />
                </div>

                <input
                  type="date"
                  name="endingDate"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  {...register("endingDate", {
                    required: "Ending Date is required",
                  })}
                  required
                />
              </div>
            </div>
            <div>
              <div>
                <div className="block mb-2">
                  <Label
                    htmlFor="instructuions"
                    className="min-w-full"
                    value="Instructuions"
                  />
                </div>
                <Textarea
                  id="instructuions"
                  {...register("instructuions", {
                    required: "Ending Date is required",
                  })}
                  placeholder="Enter Instructuions..."
                  required
                  rows={4}
                />
              </div>
            </div>
            {errorMessage && (
              <p className="flex justify-center -mb-8 text-base font-normal text-red-500">
                {errorMessage}
              </p>
            )}
            <HR />

            <Button type="submit" color={"blue"}>
              {loading ? <SpinnerComponent /> : "Next"}
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
