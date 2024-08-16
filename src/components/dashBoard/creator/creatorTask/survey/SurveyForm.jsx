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
import { addSurveyTask } from "@/_lib/store/features/creator/surveyTask/surveyTaskSlice";

export default function SurveyForm({ setTaskCreated }) {
  const tester_gender = ["Male", "Female", "Both"];

  const dispatch = useAppDispatch();

  const [errorMesstester_age, setErrorMesstester_age] = useState(null);
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
      noOfQuestions: "",
      tester_age: "",
      tester_gender: "",
      country: "",
      post_date: "",
      end_date: "",
      instruction: "",
    },
  });

  const onSubmit = async (data, event) => {
    event.preventDefault();
    setErrorMesstester_age(null);
    setLoading(() => true);

    let post_date = new Date(data.post_date);
    let endDate = new Date(data.end_date);
    if (post_date > endDate) {
      setErrorMesstester_age("Starting Date cannot be after Ending Date");
      setLoading(() => false);
    } else {
      const formData = { creator, ...data };
      setTimeout(() => {
        setLoading(() => false);
        dispatch(addSurveyTask(formData));
        toast.success("Task created successfully....");
        setTaskCreated(() => true);
      }, 2000);
    }
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
                  <Label htmlFor="noOfQuestions" value="No of Questions" />
                </div>
                <TextInput
                  id="noOfQuestions"
                  type="number"
                  name="noOfQuestions"
                  placeholder="xx"
                  max={20}
                  min={3}
                  {...register("noOfQuestions", {
                    required: "No. of testers is required",
                  })}
                  required
                />
              </div>
              <div>
                <div className="block mb-2">
                  <Label htmlFor="tester_age" value="Min age of Testers" />
                </div>
                <Select
                  id="tester_age"
                  name="tester_age"
                  defaultValue="NA"
                  {...register("tester_age", {
                    minLength: {
                      value: 1,
                      messtester_age: "Select tester_age",
                    },
                  })}
                  required
                >
                  <option value="NA" disabled>
                    Select tester_age
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
                    <Label htmlFor="tester_gender" value="Gender" />
                  </div>
                  <Select
                    id="tester_gender"
                    name="tester_gender"
                    defaultValue="NA"
                    {...register("tester_gender", {
                      minLength: {
                        value: 1,
                        messtester_age: "Select tester_gender",
                      },
                    })}
                    required
                  >
                    <option value="NA" disabled>
                      Select tester_gender
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
                        messtester_age: "Select Country",
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
                  <Label htmlFor="post_date" value="Starting Date" />
                </div>

                <input
                  type="date"
                  name="post_date"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  {...register("post_date", {
                    required: "Starting Date is required",
                  })}
                  required
                />
              </div>
              <div>
                <div className="block mb-2">
                  <Label htmlFor="end_date" value="Ending Date" />
                </div>

                <input
                  type="date"
                  name="end_date"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  {...register("end_date", {
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
                    htmlFor="instruction"
                    className="min-w-full"
                    value="instruction"
                  />
                </div>
                <Textarea
                  id="instruction"
                  {...register("instruction", {
                    required: "Ending Date is required",
                  })}
                  placeholder="Enter instruction..."
                  required
                  rows={4}
                />
              </div>
            </div>
            {errorMesstester_age && (
              <p className="flex justify-center -mb-8 text-base font-normal text-red-500">
                {errorMesstester_age}
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
