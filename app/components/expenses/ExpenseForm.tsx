import {
  Link,
  useActionData,
  useMatches,
  useNavigation,
  useParams,
} from "@remix-run/react";
type ValidationErrors = Record<string, string>;

type Expense = {
  id: string;
  title: string;
  amount: number;
  date: string;
};

function ExpenseForm() {
  const matches = useMatches();
  const params = useParams<{ id: string }>();

  const navigation = useNavigation();
  const today = new Date().toISOString().slice(0, 10);
  const validationErrors = useActionData<ValidationErrors | null>();
  const expensesMatch = matches.find(
    (match) => match.id === "routes/_app.expenses"
  ) as { data: Expense[] } | undefined;
  const expenseData = expensesMatch?.data.find(
    (expense) => expense.id === params.id
  );

  if (params.id && !expenseData) {
    return <p>invalid expense id</p>;
  }
  const isSubmitting = navigation.state !== "idle";

  const defaultValues = expenseData
    ? {
        title: expenseData.title,
        amount: expenseData.amount,
        date: expenseData.date,
      }
    : { title: "", amount: "", date: "" };
  return (
    <form method="post" className="form" id="expense-form">
      <p>
        <label htmlFor="title">Expense Title</label>
        <input
          type="text"
          id="title"
          name="title"
          required
          maxLength={30}
          defaultValue={defaultValues.title}
        />
      </p>

      <div className="form-row">
        <p>
          <label htmlFor="amount">Amount</label>
          <input
            type="number"
            id="amount"
            name="amount"
            min="0"
            step="0.01"
            required
            defaultValue={defaultValues.amount}
          />
        </p>
        <p>
          <label htmlFor="date">Date</label>
          <input
            type="date"
            id="date"
            name="date"
            max={today}
            required
            defaultValue={
              defaultValues.date ? defaultValues.date.slice(0, 10) : ""
            }
          />
        </p>
      </div>
      {validationErrors && (
        <ul>
          {Object.values(validationErrors).map((error) => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      )}

      <div className="form-actions">
        <button disabled={isSubmitting}>
          {isSubmitting ? "Saving Expense" : " Save Expense"}
        </button>
        <Link to={".."}>Cancel</Link>
      </div>
    </form>
  );
}

export default ExpenseForm;
