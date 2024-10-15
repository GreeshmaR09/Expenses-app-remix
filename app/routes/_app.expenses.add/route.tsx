import { useNavigate } from "@remix-run/react";
import { ActionFunctionArgs, redirect } from "@remix-run/node";
import ExpenseForm from "~/components/expenses/ExpenseForm";
import Modal from "~/components/util/Modal";
import { addExpense } from "~/utils/expenses.server";
import {validateExpenseInput} from '~/utils/validation.server'
import { requireUserSession } from "~/utils/auth.server";

export default function AddExpensesPage() {
  const navigate = useNavigate();
  function closeHandler() {
    navigate("..");
  }
  return (
    <>
      <Modal onClose={closeHandler}>
        <ExpenseForm />
      </Modal>
    </>
  );
}
export async function action({ request }:ActionFunctionArgs) {
  const userId =await requireUserSession(request)
  const formData = await request.formData();
  const expenseData = Object.fromEntries(formData);
  try {
    validateExpenseInput(expenseData);
  } catch (error) {
    console.log(error);
    return error;
  }
  await addExpense(expenseData,userId);
  return redirect("/expenses");
}
