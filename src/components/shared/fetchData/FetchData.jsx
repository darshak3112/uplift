"use client";
import { useEffect } from "react";
import { login } from "@/_lib/store/features/userInfo/userInfoSlice";
import { getCookie } from "cookies-next";
import { useAppDispatch } from "@/_lib/store/hooks";

const FetchData = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(
      login({
        id: getCookie("authorizeId"),
        role: getCookie("authorizeRole"),
      })
    );
  }, []);
  return <></>;
};

export default FetchData;
