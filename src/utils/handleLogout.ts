/* eslint-disable @typescript-eslint/no-explicit-any */
import Swal from "sweetalert2";
import { Dispatch } from "redux";
import { logout } from "@/src/redux/features/auth/authSlice";
import { colors } from "../lib/colors";

export const logoutHandler = async (dispatch: Dispatch, router: any) => {
  try {
    const result = await Swal.fire({
      title: "Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: colors.primary,
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Log out!",
    });

    if (result.isConfirmed) {
      await dispatch(logout());
      await Swal.fire({
        title: "Logged Out Successfully!",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
      await router.push("/");
    }
  } catch (error) {
    Swal.fire({
      position: "top-end",
      icon: "error",
      title: "Failed",
      text:
        (error as any)?.data?.success === false &&
        (error as any)?.data?.errorSources[0]?.message,
      showConfirmButton: true,
      confirmButtonColor: colors.primary,
    });
  }
};
