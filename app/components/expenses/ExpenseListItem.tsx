import { Link, useFetcher } from "@remix-run/react";
type ExpenseListItemProps = {
  id: string;
  title: string;
  amount: number;
};
function ExpenseListItem({ id, title, amount }: ExpenseListItemProps) {
  const fetcher = useFetcher();

  function deleteExpenseItemHandler() {
    const proceed = confirm("Are you sure u want to delete");
    if (!proceed) {
      return;
    }
    fetcher.submit(null, { method: "DELETE", action: `/expenses/${id}` });
  }
  if (fetcher.state !== "idle") {
    return (
      <article className="expense-item locked">
        <p>Deleting...</p>
      </article>
    );
  }

  return (
    <article className="expense-item">
      <div>
        <h2 className="expense-title">{title}</h2>
        <p className="expense-amount">${amount.toFixed(2)}</p>
      </div>
      <menu className="expense-actions">
        <button onClick={deleteExpenseItemHandler}>Delete</button>
        <Link to={id}>Edit</Link>
      </menu>
    </article>
  );
}

export default ExpenseListItem;
