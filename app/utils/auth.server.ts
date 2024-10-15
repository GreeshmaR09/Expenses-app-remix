import { redirect } from "@remix-run/node";
import { prisma } from "./database.server";
import bcrypt from "bcryptjs";
import { createCookieSessionStorage } from "@remix-run/node";

const SESSION_SECRET = process.env.SESSION_SECRET;
const sessionStorage = createCookieSessionStorage({
  cookie: {
    secure: process.env.NODE_ENV === "production",
    secrets: [SESSION_SECRET],
    sameSite: "lax", //protect against malicious activity
    maxAge: 30 * 24 * 60 * 60, //30 days
    httpOnly: true,
  },
});

type RequestType = {
  headers: {
    get: (name: string) => string | null;
  };
};
export async function getUserFromSession(
  request: RequestType
): Promise<string | null> {
  const session = await sessionStorage.getSession(
    request.headers.get("Cookie")
  );
  const userId = session.get("userId");
  if (!userId) {
    return null;
  }

  return userId;
}

async function createUserSession(userId: string, redirectPath: string) {
  const session = await sessionStorage.getSession();
  session.set("userId", userId);
  return redirect(redirectPath, {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session),
    },
  });
}

export async function destroyUserSession(request:RequestType) {
  const session = await sessionStorage.getSession(
    request.headers.get("Cookie")
  );

  return redirect("/", {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session),
    },
  });
}

export async function requireUserSession(request: RequestType): Promise<string> {
  const userId = await getUserFromSession(request);
  if (!userId) {
    throw redirect("/auth?mode=login");
  }
  return userId;
}

interface SignupParams {
  email: string;
  password: string;
}


export async function signup({ email, password }: SignupParams)  {
  const existingUser = await prisma.user.findFirst({ where: { email } });

  if (existingUser) {
    const error = new Error("A user exist in this email");
    error.status = 422;
    throw error;
  }
  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: { email: email, password: hashedPassword },
  });
  return createUserSession(user.id, "/expenses");
}

interface LoginParams {
  email: string;
  password: string;
}

// Function to log in a user
export async function login({ email, password }: LoginParams)  {
  const existingUser = await prisma.user.findFirst({ where: { email } });

  if (!existingUser) {
    const error = new Error("Please Register to Continue");
    error.status = 401;
    throw error;
  }

  const passwordCorrect = await bcrypt.compare(password, existingUser.password);

  if (!passwordCorrect) {
    const error = new Error("Please Check the credentials");
    error.status = 401;
    throw error;
  }

  return await createUserSession(existingUser.id, "/expenses");
}
