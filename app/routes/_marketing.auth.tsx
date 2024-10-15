import authStyles from "~/styles/auth.css?url";
import AuthForm from "~/components/auth/AuthForm";
import { validateCredentials } from "~/utils/validation.server";
import { ActionFunctionArgs } from "@remix-run/node";
import { login, signup } from "~/utils/auth.server";

interface Credentials {
  email: string;
  password: string;
}
class CustomError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = "CustomError";
  }
}
export default function AuthPage() {
  return (
    <>
      <AuthForm />
    </>
  );
}
export async function action({ request }: ActionFunctionArgs) {
  const searchParams = new URL(request.url).searchParams;
  const authMode = searchParams.get("mode") || "login";
  const formData = await request.formData();
  const credentials: Credentials = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };
  try {
    validateCredentials(credentials);
  } catch (error: unknown) {
    return { validationErrors: error.email };
  }
  try {
    if (authMode === "login") {
      return await login(credentials);
    } else {
      return await signup(credentials);
    }
  } catch (error: unknown) {
    if (error instanceof CustomError) {
      if (error.status === 422) {
        return { credentialsError: error.message };
      }
      return { error: "Something went wrong, please try again later." };
    }
    return { error: "An unknown error occurred." };
  }
}
export function links() {
  return [{ rel: "stylesheet", href: authStyles }];
}
