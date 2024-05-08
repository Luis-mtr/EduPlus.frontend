import { ActionCreators } from "../app/expensesReducer";

export const GetExpenses = async (dispatch) => {
  try {
    //API call
    const expenses = [
      { id: 1, description: "food", amount: 12.5 },
      { id: 2, description: "gas", amount: 15.5 },
      { id: 3, description: "heat", amount: 17.5 },
    ];
    dispatch(ActionCreators.setExpenses(expenses));
  } catch {
    console.log("Error!");
  }
};

export const newExpense = async (dispatch, expense) => {
  try {
    //api call
    dispatch(
      ActionCreators.newExpense({
        id: 10,
        description: expense.description,
        amount: expense.amount,
      })
    );
  } catch {
    console.log("Error!");
  }
};

export const EditExpense = async (dispatch, expense) => {
  try {
    //api call
    dispatch(ActionCreators.editExpense(expense));
  } catch {
    console.log("Error!");
  }
};

export const DeleteExpense = async (dispatch, expense) => {
  try {
    //api call
    dispatch(ActionCreators.deleteExpense(expense));
  } catch {
    console.log("Error!");
  }
};
