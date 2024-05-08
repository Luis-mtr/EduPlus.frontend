import { React, useState, useEffect } from "react";
import { Form, Row, Col, Button } from "react-bootstrap";
import { DeleteExpense, EditExpense, newExpense } from "../services/expenses";
import { useDispatch } from "react-redux";

// eslint-disable-next-line import/no-anonymous-default-export
export default ({ expense, setIsEditing }) => {
  const descriptions = ["card", "gas", "food"];
  const [amount, setAmount] = useState(0);
  const [description, setDescription] = useState();
  const [isNewExpense, setIsNewExpense] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    if (expense !== undefined) {
      setIsNewExpense(false);
      setAmount(expense.amount);
    } else {
      setIsNewExpense(true);
    }
  }, [expense]);

  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault();
        if (isNewExpense) {
          newExpense(dispatch, { description: description, amount: amount });
        } else {
          EditExpense(dispatch, {
            id: expense.id,
            description: description,
            amount: amount,
          });
          setIsEditing(false);
        }
      }}
    >
      <Row>
        <Col>
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="select"
            onChange={(e) => setDescription(e.target.value)}
          >
            {descriptions.map((d) => (
              <option>{d}</option>
            ))}
          </Form.Control>
        </Col>
        <Col>
          <Form.Label>Amount</Form.Label>
          <Form.Control
            type="number"
            step="0.01"
            placeholder={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </Col>

        <Col>
          <div style={{ marginTop: "auto" }}>
            {isNewExpense ? (
              <Button variant="primary" type="submit">
                Add
              </Button>
            ) : (
              <div>
                <Button
                  variant="danger"
                  style={{ marginRight: "2px" }}
                  onClick={() => DeleteExpense(dispatch, expense)}
                >
                  Delete
                </Button>
                <Button
                  variant="success"
                  type="submit"
                  style={{ marginRight: "2px" }}
                >
                  Save
                </Button>
                <Button
                  variant="default"
                  onClick={() => setIsEditing(false)}
                  style={{ marginRight: "2px" }}
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </Col>
      </Row>
    </Form>
  );
};
