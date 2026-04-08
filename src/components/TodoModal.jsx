import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import { Plus, Trash2 } from "lucide-react";

const TodoModal = ({ isOpen, toggle, onSave, editData }) => {
  const [title, setTitle] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [subTodos, setSubTodos] = useState([]);

  useEffect(() => {
    if (isOpen) {
      setTitle(editData?.title || "");
      setDateTime(editData?.dateTime || "");
      setSubTodos(editData?.subTodos ? [...editData.subTodos] : []);
    }
  }, [isOpen, editData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      id: editData?.id || Date.now(),
      title,
      dateTime,
      subTodos,
      isDone: editData?.isDone || false,
    });
  };

  const addSub = () =>
    setSubTodos([...subTodos, { id: Date.now(), title: "", isDone: false }]);
  const removeSub = (id) => setSubTodos(subTodos.filter((s) => s.id !== id));
  const updateSub = (id, val) =>
    setSubTodos(subTodos.map((s) => (s.id === id ? { ...s, title: val } : s)));

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered>
      <ModalHeader toggle={toggle} className="border-0 pb-0 fw-bold">
        {editData ? "Edit Todo" : "Add Todo"}
      </ModalHeader>
      <Form onSubmit={handleSubmit}>
        <ModalBody className="p-4 pt-2">
          <FormGroup>
            <Label className="small fw-bold text-muted">
              Todo <span className="text-danger">*</span>
            </Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Task title"
            />
          </FormGroup>
          <FormGroup className="mt-3">
            <Label className="small fw-bold text-muted">
              Date Time <span className="text-danger">*</span>
            </Label>
            <Input
              type="datetime-local"
              value={dateTime}
              onChange={(e) => setDateTime(e.target.value)}
              required
            />
          </FormGroup>
          <div className="mt-4">
            <Label className="small fw-bold text-muted">Sub Todos</Label>
            {subTodos.map((st) => (
              <div key={st.id} className="d-flex gap-2 mt-2 align-items-center">
                <Input
                  value={st.title}
                  onChange={(e) => updateSub(st.id, e.target.value)}
                  placeholder="Sub todo"
                  required
                />
                <Button
                  color="link"
                  className="text-danger p-0"
                  onClick={() => removeSub(st.id)}
                  type="button"
                >
                  <Trash2 size={18} />
                </Button>
              </div>
            ))}
            <div>
              <Button
                color="link"
                className="p-0 mt-2 text-decoration-none text-muted small"
                onClick={addSub}
                type="button"
              >
                <Plus size={16} /> Add Sub Todo
              </Button>
            </div>
          </div>
        </ModalBody>
        <ModalFooter className="border-0 d-flex justify-content-end gap-3">
          <Button
            color="primary"
            type="submit"
            className="px-5 fw-bold"
            style={{ backgroundColor: "#154886" }}
          >
            Save
          </Button>
          <Button
            color="light"
            onClick={toggle}
            className="px-5 text-primary fw-bold"
          >
            Cancel
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};

export default TodoModal;
