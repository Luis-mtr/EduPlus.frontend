import { React, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GetExpenses } from "../services/expenses";
import { Button, Row, Col } from "react-bootstrap";
import ExpenseForm from "./ExpenseForm";

// eslint-disable-next-line import/no-anonymous-default-export
export default () => {
  const dispatch = useDispatch();
  const expenses = useSelector((state) => state.expensesReducer.expenses);

  useEffect(() => {
    GetExpenses(dispatch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return expenses.map((e) => (
    <div key={e.id} style={{ marginBottom: "1rem" }}>
      <ListRow expense={e} />
    </div>
  ));
};

const ListRow = ({ expense }) => {
  const [isEditing, setIsEditing] = useState(false);
  return isEditing ? (
    <ExpenseForm expense={expense} setIsEditing={setIsEditing} />
  ) : (
    <div>
      <Row>
        <Col>{expense.description}</Col>
        <Col>${expense.amount}</Col>
        <Col>
          <Button variant="warning" onClick={() => setIsEditing(!isEditing)}>
            Edit
          </Button>
        </Col>
      </Row>
      <hr />
    </div>
  );
};
