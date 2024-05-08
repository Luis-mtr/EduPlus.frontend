/* eslint-disable no-unused-vars */
import { act } from "react";
import { newExpense } from "../services/expenses";
import { type } from "@testing-library/user-event/dist/cjs/utility/type.js";

const initialState = {
  expenses: [],
};

export const ActionTypes = {
  SET_EXPENSES: "SET_EXPENSES",
  NEW_EXPENSE: "NEW_EXPENSE",
  EDIT_EXPENSE: "EDIT_EXPENSE",
  DELETE_EXPENSE: "DELETE_EXPENSE",
};

export const ActionCreators = {
  setExpenses: (payload) => ({ type: ActionTypes.SET_EXPENSES, payload }),
  newExpense: (payload) => ({ type: ActionTypes.NEW_EXPENSE, payload }),
  editExpense: (payload) => ({ type: ActionTypes.EDIT_EXPENSE, payload }),
  deleteExpense: (payload) => ({ type: ActionTypes.DELETE_EXPENSE, payload }),
};

// eslint-disable-next-line import/no-anonymous-default-export
export default (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.SET_EXPENSES:
      return { ...state, expenses: [...action.payload] };
    case ActionTypes.NEW_EXPENSE:
      return { ...state, expenses: [action.payload, ...state.expenses] };
    case ActionTypes.EDIT_EXPENSE:
      var expenses = state.expenses.map((expense) => {
        if (expense.id === action.payload.id) {
          expense = action.payload;
        }
        return expense;
      });
      return { ...state, expenses: [...expenses] };
    case ActionTypes.DELETE_EXPENSE:
      // eslint-disable-next-line no-redeclare
      var expenses = state.expenses.filter(
        (expense) => expense.id !== action.payload.id
      );
      return { ...state, expenses: [...expenses] };
    default:
      return state;
  }
};
