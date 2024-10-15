import { LoaderFunctionArgs } from "@remix-run/node";
import {
  Link,
  isRouteErrorResponse,
  json,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import Chart from "~/components/expenses/Chart";
import ExpenseStatistics from "~/components/expenses/ExpenseStatistics";
import Error from "~/components/util/Error";
import { requireUserSession } from "~/utils/auth.server";
import { getExpenses } from "~/utils/expenses.server";
type Expense = {
  id: string;
  title: string;
  amount: number;
  date:Date;
};

export default function ExpensesAnalysisPage() {
  const expenses = useLoaderData<Expense[]>();
  return (
    <main>
      <Chart expenses={expenses} />
      <ExpenseStatistics expenses={expenses} />
    </main>
  );
}

export async function loader({ request }: LoaderFunctionArgs) {
  const userId = await requireUserSession(request);
  const expenses = await getExpenses(userId);

  // Check if expenses array is empty
  if (!expenses || expenses.length === 0) {
    throw json(
      { message: "No expenses found" },
      { status: 404, statusText: "There is no expenses add some" }
    );
  }

  return expenses;
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    const message = error.data ? error.data.message : "Something went wrong!";
    const title =
      error.status === 404 ? error.statusText : "No Expensesssssss Found";

    return (
      <main>
        <Error title={title}>
          <p>{message}</p>
          <p>
            Back to <Link to={"/"}>Safety</Link>
          </p>
        </Error>
      </main>
    );
  }
}
