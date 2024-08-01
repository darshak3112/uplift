"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Button, Card, Label, TextInput, Radio } from "flowbite-react";
import toast from "react-hot-toast";

export default function ResetPassword({ params }) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    defaultValues: { password: "", role: null },
  });
  const searchParams = useSearchParams();
  const { token } = params;
  const role = searchParams.get("role");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    if (role) {
      setValue("role", role);
    }
  }, [role, setValue]);

  const onSubmit = async (data, event) => {
    event.preventDefault();
    setErrorMessage(null);
    setLoading(true);
    try {
      const response = await axios.post("/api/auth/reset-password", {
        ...data,
        token,
      });
      if (response?.status === 200) {
        setSuccessMessage(response?.data?.message);
        toast.success(response?.data?.message);
        router.push("/login");
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex justify-center gap-24 px-5 py-8 md:px-14">
      <Card className="max-w-lg">
        <h5 className="text-2xl font-bold tracking-tight text-gray-900">
          Reset your password
        </h5>
        <form
          method="POST"
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <div>
            <Label htmlFor="password">New Password</Label>
            <TextInput
              id="password"
              type="password"
              name="password"
              placeholder="••••••••"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
                maxLength: {
                  value: 15, // Adjust max length as needed
                  message: "Password cannot exceed 15 characters",
                },
                pattern: {
                  value:
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                  message:
                    "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character.",
                },
              })}
              required
            />
            {errors?.password && (
              <p className="mt-2 text-sm text-red-500 md:max-w-[10rem]">
                {errors?.password?.message}
              </p>
            )}
          </div>
          {errorMessage && <div className="text-red-600">{errorMessage}</div>}
          {successMessage && (
            <div className="text-green-600">{successMessage}</div>
          )}
          <Button type="submit" color={"blue"} isProcessing={loading}>
            Reset Password
          </Button>
        </form>
      </Card>
    </section>
  );
}
