import { useNavigate } from "@remix-run/react";
import { ActionFunctionArgs, redirect } from "@remix-run/node";
import ExpenseForm from "~/components/expenses/ExpenseForm";
import Modal from "~/components/util/Modal";
import { deleteExpense, updateExpense } from "~/utils/expenses.server";
import { validateExpenseInput } from "~/utils/validation.server";

export default function UpdateExpensesPage() {
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

export async function action({ params, request }: ActionFunctionArgs) {
  const expenseId = params.id;

  if (request.method === "POST") {
    const formData = await request.formData();
    const expenseData = Object.fromEntries(formData);
    try {
      validateExpenseInput(expenseData);
    } catch (error) {
      return error;
    }
    await updateExpense(expenseId, expenseData);
    return redirect("/expenses");
  } else if (request.method === "DELETE") {
    await deleteExpense(expenseId);
    return redirect("/expenses");
  }
}
