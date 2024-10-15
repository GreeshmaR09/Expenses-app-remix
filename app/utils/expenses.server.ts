import { prisma } from "./database.server";

interface ExpenseData {
  title: string;
  amount: number; 
  date: Date; 
}

export async function addExpense(
  expenseData: ExpenseData,
  userId: string
): Promise<ReturnType<typeof prisma.expense.create>> {
  try {
    return await prisma.expense.create({
      data: {
        title: expenseData.title,
        amount: +expenseData.amount,
        date: new Date(expenseData.date),
        user: { connect: { id: userId } },
      },
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getExpenses(
  userId: string
): Promise<ReturnType<typeof prisma.expense.findMany>> {
  if (!userId) {
    throw new Error("Failed to get Expenses");
  }
  try {
    const expenses = await prisma.expense.findMany({
      where: { userId },
      orderBy: { date: "desc" },
    });
    return expenses;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getExpense(
  id: string
): Promise<ReturnType<typeof prisma.expense.findFirst> | null> {
  try {
    const expense = await prisma.expense.findFirst({ where: { id } });
    return expense;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function updateExpense(
  id: string,
  expenseData: ExpenseData
): Promise<ReturnType<typeof prisma.expense.update>> {
  try {
    const expense = await prisma.expense.update({
      where: { id },
      data: {
        title: expenseData.title,
        amount: +expenseData.amount,
        date: new Date(expenseData.date),
      },
    });
    return expense;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function deleteExpense(id: string): Promise<void> {
  try {
    await prisma.expense.delete({ where: { id } });
  } catch (error) {
    console.log(error);
    throw new Error("Failed to delete expense");
  }
}
