import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Input,
  Nav,
  NavItem,
  NavLink,
  Card,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Button,
} from "reactstrap";
import { useAuth } from "../contexts/AuthContext";
import { useTodo } from "../contexts/TodoContext";
import TodoModal from "../components/TodoModal";
import {
  Search,
  Calendar,
  LogOut,
  LayoutDashboard,
  CheckSquare,
  Plus,
  MoreVertical,
  Trash2,
} from "lucide-react";

// --- KOMPONEN TODO ITEM ---
const TodoItem = ({
  todo,
  isCheckedCol,
  onEdit,
  onDelete,
  onToggle,
  onToggleSub,
  onDeleteSub,
}) => {
  const [cardMenuOpen, setCardMenuOpen] = useState(false);

  // Fungsi pembantu untuk format tanggal
  const formatTodoDate = (dateString) => {
    const todoDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const formattedDate = todoDate.toLocaleDateString("en-GB");

    if (new Date(todoDate).setHours(0, 0, 0, 0) < today.getTime()) {
      return { text: `Overdue - ${formattedDate}`, color: "text-danger" };
    } else if (new Date(todoDate).setHours(0, 0, 0, 0) === today.getTime()) {
      return { text: "Today", color: "text-success" };
    }
    return { text: formattedDate, color: "text-primary" };
  };

  const dateInfo = formatTodoDate(todo.dateTime);

  return (
    <Card
      className="border shadow-sm mb-3 bg-white"
      style={{ borderRadius: "15px", padding: "12px 16px" }}
    >
      {/* Container Utama Task */}
      <div className="d-flex align-items-center justify-content-between mb-1">
        <div className="d-flex align-items-center flex-grow-1">
          <Input
            type="checkbox"
            className="me-3 custom-green-checkbox"
            checked={todo.isDone}
            onChange={() => onToggle(todo.id)}
          />
          <span
            className={`fw-bold ${isCheckedCol ? "text-decoration-line-through text-muted" : "text-dark"}`}
          >
            {todo.title}
          </span>
        </div>

        <div className="d-flex align-items-center gap-2">
          <small
            className={`${isCheckedCol ? "text-primary" : dateInfo.color} fw-bold`}
          >
            {isCheckedCol
              ? new Date(todo.dateTime).toLocaleDateString("en-GB")
              : dateInfo.text}
          </small>
          <Dropdown
            isOpen={cardMenuOpen}
            toggle={() => setCardMenuOpen(!cardMenuOpen)}
          >
            <DropdownToggle color="link" className="p-0 text-muted border-0">
              <MoreVertical size={18} />
            </DropdownToggle>
            <DropdownMenu
              end
              className="shadow border-0 py-2"
              style={{ borderRadius: "12px" }}
            >
              <DropdownItem onClick={() => onEdit(todo)}>Edit</DropdownItem>
              <DropdownItem
                className="text-danger"
                onClick={() => onDelete(todo.id)}
              >
                Delete
              </DropdownItem>
              <DropdownItem onClick={() => onEdit(todo)}>
                Create Sub To-do
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>

      {/* Container Sub-Todos */}
      {todo.subTodos?.length > 0 && (
        <div className="mt-2 d-flex flex-column gap-2">
          {todo.subTodos.map((sub) => (
            <div
              key={sub.id}
              className="d-flex align-items-center justify-content-between border rounded-pill px-3 py-2 bg-light shadow-sm ms-4"
              style={{ border: "1px solid #f0f0f0" }}
            >
              <div className="d-flex align-items-center">
                <Input
                  type="checkbox"
                  className="me-2 custom-green-checkbox"
                  checked={sub.isDone}
                  onChange={() => onToggleSub(todo.id, sub.id)}
                />
                <span
                  className={`small text-muted ${sub.isDone ? "text-decoration-line-through" : ""}`}
                >
                  {sub.title}
                </span>
              </div>
              <Button
                color="link"
                className="p-0 text-muted"
                onClick={() => onDeleteSub(todo.id, sub.id)}
              >
                <Trash2 size={14} />
              </Button>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

// --- KOMPONEN HALAMAN UTAMA ---
const MainPage = () => {
  const { user, logout } = useAuth();
  const {
    todos,
    toggleTodo,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleSubTodo,
    deleteSubTodo,
  } = useTodo();
  const [search, setSearch] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);

  const handleSave = (data) => {
    taskToEdit ? updateTodo(data) : addTodo(data);
    setIsModalOpen(false);
    setTaskToEdit(null);
  };

  return (
    <Container
      fluid
      className="p-0 vh-100 d-flex flex-column bg-light overflow-hidden"
    >
      <style>
        {`
          .custom-green-checkbox.form-check-input:checked {
            background-color: #28a745 !important;
            border-color: #28a745 !important;
            box-shadow: none !important;
          }
          .custom-green-checkbox.form-check-input:focus {
            box-shadow: 0 0 0 0.25rem rgba(40, 167, 69, 0.25) !important;
            border-color: #28a745 !important;
          }
          .custom-green-checkbox.form-check-input {
            cursor: pointer;
            width: 1.2rem;
            height: 1.2rem;
          }
            .dropdown-menu {
      z-index: 1050 !important;
    }
        `}
      </style>

      {/* HEADER */}
      <header
        className="bg-white px-4 py-2 border-bottom d-flex justify-content-between align-items-center"
        style={{ height: "70px", flexShrink: 0 }}
      >
        <div className="d-flex align-items-center" style={{ width: "200px" }}>
          <img src="/logo.png" alt="Todo Apps" width="120" />
        </div>

        <div className="flex-grow-1 px-md-5">
          <div
            className="position-relative mx-auto"
            style={{ maxWidth: "600px" }}
          >
            <Search
              className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"
              size={18}
            />
            <Input
              placeholder="Search"
              className="ps-5 border-0 bg-light"
              style={{ borderRadius: "10px" }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="d-flex align-items-center gap-3">
          <Calendar className="text-muted d-none d-md-block" size={20} />
          <Dropdown
            isOpen={dropdownOpen}
            toggle={() => setDropdownOpen(!dropdownOpen)}
          >
            <DropdownToggle
              color="link"
              className="text-decoration-none p-0 border-0"
            >
              <img
                src={`https://ui-avatars.com/api/?name=${user?.email}&background=0D8ABC&color=fff`}
                alt="avatar"
                className="rounded-circle"
                width="35"
              />
            </DropdownToggle>

            <DropdownMenu
              className="shadow border-0 mt-2 p-2"
              style={{
                borderRadius: "10px",
                minWidth: "160px",
                transform: "translateX(-65%) translateY(50%)",
                left: "auto",
                right: "0",
              }}
            >
              <DropdownItem
                onClick={logout}
                className="text-danger d-flex align-items-center gap-2 rounded py-1"
              >
                <LogOut size={16} /> Logout
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>{" "}
        </div>
      </header>

      <div className="d-flex flex-grow-1 overflow-hidden">
        {/* SIDEBAR */}
        <div
          className="bg-white border-end d-none d-md-block"
          style={{ width: "240px" }}
        >
          <Nav vertical className="p-3 gap-2">
            <NavItem>
              <NavLink
                href="#"
                className="text-muted d-flex align-items-center gap-3 p-3"
              >
                <LayoutDashboard size={20} /> Dashboard
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                href="#"
                className="text-white d-flex align-items-center gap-3 p-2 rounded shadow-sm border-0"
                style={{
                  background:
                    "linear-gradient(180deg, #154886 0%, #4F92E3 100%)", // Gradasi sesuai gambar
                  fontWeight: "500",
                }}
              >
                <CheckSquare size={20} /> Todo
              </NavLink>
            </NavItem>
          </Nav>
        </div>

        {/* MAIN CONTENT */}
        <main className="flex-grow-1 p-4 overflow-auto bg-light">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3 className="fw-bold m-0 text-dark">📝 Todo</h3>
            <Button
              color="white"
              className="shadow-sm border bg-white px-3"
              onClick={() => {
                setTaskToEdit(null);
                setIsModalOpen(true);
              }}
            >
              Created Todo <Plus size={18} />
            </Button>
          </div>

          <Row className="g-2">
            <Col lg={6}>
              <div className="border px-3 rounded-4 py-4 h-100">
                <h6 className="text-muted fw-bold mb-3 px-2">Not Checked</h6>
                {todos
                  .filter(
                    (t) =>
                      !t.isDone &&
                      t.title.toLowerCase().includes(search.toLowerCase()),
                  )
                  .map((t) => (
                    <TodoItem
                      key={t.id}
                      todo={t}
                      isCheckedCol={false}
                      onEdit={setTaskToEdit}
                      onDelete={deleteTodo}
                      onToggle={toggleTodo}
                      onToggleSub={toggleSubTodo}
                      onDeleteSub={deleteSubTodo}
                    />
                  ))}
              </div>
            </Col>

            <Col lg={6}>
              <div className="border px-3 rounded-4 py-4 h-100">
                <h6 className="text-muted fw-bold mb-3 px-2">Checked</h6>
                {todos
                  .filter(
                    (t) =>
                      t.isDone &&
                      t.title.toLowerCase().includes(search.toLowerCase()),
                  )
                  .map((t) => (
                    <TodoItem
                      key={t.id}
                      todo={t}
                      isCheckedCol={true}
                      onEdit={setTaskToEdit}
                      onDelete={deleteTodo}
                      onToggle={toggleTodo}
                      onToggleSub={toggleSubTodo}
                      onDeleteSub={deleteSubTodo}
                    />
                  ))}
              </div>
            </Col>
          </Row>
        </main>
      </div>

      <TodoModal
        isOpen={isModalOpen || !!taskToEdit}
        toggle={() => {
          setIsModalOpen(false);
          setTaskToEdit(null);
        }}
        onSave={handleSave}
        editData={taskToEdit}
      />
    </Container>
  );
};

export default MainPage;
