import { createAsyncThunk } from "@reduxjs/toolkit";
import { authClient } from "@/lib/authClient";
import { AuthResponseType } from "@/types/(auth)/authTypes";

interface ApiError {
  message: string;
}

/* -------------------------------------------------------------------------- */
/*                                 SIGN UP                                    */
/* -------------------------------------------------------------------------- */

export const signUpEmail = createAsyncThunk<
  AuthResponseType,
  FormData,
  { rejectValue: ApiError }
>(
  "auth/signUpEmail",
  async (formData, { rejectWithValue }) => {
    try {
      const email = formData.get("email");
      const password = formData.get("password");
      const name = formData.get("name");

      if (
        typeof email !== "string" ||
        typeof password !== "string" ||
        typeof name !== "string"
      ) {
        return rejectWithValue({
          message: "Invalid form data",
        });
      }

      const cleanEmail = email.trim().toLowerCase();
      const cleanName = name.trim();

      if (!cleanEmail) {
        return rejectWithValue({
          message: "Email is required",
        });
      }

      if (!cleanName) {
        return rejectWithValue({
          message: "Name is required",
        });
      }

      if (password.length < 8) {
        return rejectWithValue({
          message: "Password must be at least 8 characters",
        });
      }

      // const result = await auth.api.signUpEmail({
      //   body: {
      //     email: cleanEmail,
      //     password,
      //     name: cleanName,
      //   },
      // });
      const result = await authClient.signUp.email({
        email: cleanEmail,
        password,
        name: cleanName,
      });

      if (!result) {
        return rejectWithValue({
          message: "Failed to create account",
        });
      }

      return result.data?.user as AuthResponseType;
    } catch (error: unknown) {
      return rejectWithValue({
        message:
          error instanceof Error
            ? error.message
            : "Failed to create account",
      });
    }
  }
);

/* -------------------------------------------------------------------------- */
/*                                 SIGN IN                                    */
/* -------------------------------------------------------------------------- */

export const signInEmail = createAsyncThunk<
  AuthResponseType,
  FormData,
  { rejectValue: ApiError }
>(
  "auth/signInEmail",
  async (formData, { rejectWithValue }) => {
    try {
      const email = formData.get("email");
      const password = formData.get("password");

      if (
        typeof email !== "string" ||
        typeof password !== "string"
      ) {
        return rejectWithValue({
          message: "Invalid form data",
        });
      }

      const cleanEmail = email.trim().toLowerCase();

      if (!cleanEmail) {
        return rejectWithValue({
          message: "Email is required",
        });
      }

      if (!password) {
        return rejectWithValue({
          message: "Password is required",
        });
      }

      const result = await authClient.signIn.email({
        email: cleanEmail,
        password,
      });


      if (result.error?.message) {
        return rejectWithValue({
          message: result.error.message,
        });
      }

      if (!result.data?.user && result.error?.message) {
        return rejectWithValue({
          message: result.error?.message,
        });
      }

      return result.data?.user as AuthResponseType;
    } catch (error: unknown) {
      return rejectWithValue({
        message:
          error instanceof Error
            ? error.message
            : "Failed to sign in",
      });
    }
  }
);

/* -------------------------------------------------------------------------- */
/*                                SIGN OUT                                    */
/* -------------------------------------------------------------------------- */

export const signOutUser = createAsyncThunk<
  void,
  void,
  { rejectValue: ApiError }
>(
  "auth/signOut",
  async (_, { rejectWithValue }) => {
    try {
      await authClient.signOut();
    } catch (error: unknown) {
      return rejectWithValue({
        message:
          error instanceof Error
            ? error.message
            : "Failed to sign out",
      });
    }
  }
);