import { LoaderFunctionArgs } from "@remix-run/node";
import { requireUserSession } from "~/utils/auth.server";
import { getExpenses } from "~/utils/expenses.server";

 
export const loader = async ({ request }:LoaderFunctionArgs) => {
  const userId = await requireUserSession(request);
  return getExpenses(userId);
};