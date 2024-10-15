// shared layout for all pages inside expenses

import { LoaderFunctionArgs } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { FaDownload, FaPlus } from "react-icons/fa";
import ExpensesList from "~/components/expenses/ExpensesList";
import expensesStyle from "~/styles/expenses.css?url";
import { requireUserSession } from "~/utils/auth.server";
import { getExpenses } from "~/utils/expenses.server";

interface Expense {
  id: string;
  title: string;
  amount: number;
  date: string;
}
export default function ExpensesPageLayout() {
  const expenses = useLoaderData<Expense[]>();
  const hasExpenses = expenses && expenses.length > 0;
  return (
    <>
      <Outlet />
      <main>
        <section id="expenses-actions">
          <Link to="add">
            <FaPlus />
            <span>Add Expense</span>
          </Link>
          <a href="/expenses/raw" target="_blank">
            <FaDownload />
            Download Raw Data
          </a>
        </section>
        {hasExpenses && <ExpensesList expenses={expenses} />}
        {!hasExpenses && (
          <section id="no-expenses">
            <h1>No Expenses Found</h1>
            <p>
              <Link to="add">Start Adding</Link>
            </p>
          </section>
        )}
      </main>
    </>
  );
}
export function links() {
  return [{ rel: "stylesheet", href: expensesStyle }];
}

export async function loader({ request }: LoaderFunctionArgs) {
  const userId = await requireUserSession(request);

  await requireUserSession(request);
  const expenses = await getExpenses(userId);
  return expenses;
}
