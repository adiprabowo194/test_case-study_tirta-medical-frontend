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
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import { useAuth } from "../contexts/AuthContext";
import { useTodo } from "../contexts/TodoContext";
import TodoModal from "../components/TodoModal";
import { X } from "lucide-react"; // Import X untuk icon close

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
  onDeleteRequest, // Ubah prop ini
  onToggle,
  onToggleSub,
  onDeleteSub,
}) => {
  const [cardMenuOpen, setCardMenuOpen] = useState(false);
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
                onClick={() => onDeleteRequest(todo)}
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
      {todo.subTodos?.length > 0 && (
        <div className="mt-2 d-flex flex-column gap-2">
          {todo.subTodos.map((sub) => (
            <div
              key={sub.id}
              className="d-flex align-items-center justify-content-between border rounded-pill px-3 py-2 bg-light shadow-sm ms-4"
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

// --- MAIN PAGE ---
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

  // State baru untuk Modal Konfirmasi Hapus
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const handleSave = (data) => {
    taskToEdit ? updateTodo(data) : addTodo(data);
    setIsModalOpen(false);
    setTaskToEdit(null);
  };

  // Fungsi untuk memicu modal konfirmasi
  const triggerDeleteConfirm = (todo) => {
    setItemToDelete(todo);
    setDeleteModalOpen(true);
  };

  // Fungsi eksekusi hapus setelah konfirmasi
  const executeDelete = () => {
    if (itemToDelete) {
      deleteTodo(itemToDelete.id);
      setDeleteModalOpen(false);
      setItemToDelete(null);
    }
  };

  return (
    <Container fluid className="p-0 vh-100 d-flex overflow-hidden bg-white">
      <style>
        {`
          .custom-green-checkbox.form-check-input:checked { background-color: #28a745 !important; border-color: #28a745 !important; }
          .sidebar-link { border-radius: 0 50px 50px 0; margin-right: 15px; transition: 0.3s; }
          .sidebar-link.active { background: linear-gradient(180deg, #154886 0%, #4F92E3 100%); color: white !important; box-shadow: 0 4px 10px rgba(21, 72, 134, 0.3); }
          .main-wrapper { background-color: #f8f9fa; border-radius: 30px 0 0 0; }
          .modal-content { border-radius: 15px; border: none; }
          .btn-confirm { background-color: #154886; border: none; padding: 10px 30px; border-radius: 8px; }
          .btn-cancel { background-color: #E2E8F0; color: #475569; border: none; padding: 10px 30px; border-radius: 8px; }
        `}
      </style>

      {/* LEFT SIDEBAR */}
      <div
        className="d-flex flex-column bg-white border-end"
        style={{ width: "260px", zIndex: 10 }}
      >
        <div className="p-4 mb-2">
          <img src="/logo.png" alt="Todo Apps" width="130" />
        </div>
        <Nav vertical className="flex-grow-1">
          <NavItem>
            <NavLink
              href="#"
              className="sidebar-link text-muted d-flex align-items-center gap-3 py-3 ps-4"
            >
              <LayoutDashboard size={20} /> Dashboard
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              href="#"
              className="sidebar-link active d-flex align-items-center gap-3 py-3 ps-4"
            >
              <CheckSquare size={20} /> Todo
            </NavLink>
          </NavItem>
        </Nav>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex-grow-1 d-flex flex-column main-wrapper shadow-sm">
        <header
          className="d-flex align-items-center justify-content-between px-4 bg-white"
          style={{ height: "80px" }}
        >
          <div className="position-relative" style={{ width: "75%" }}>
            <Search
              className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"
              size={18}
            />
            <Input
              placeholder="Search"
              className="ps-5 border-0 bg-light shadow-sm"
              style={{ borderRadius: "12px", height: "45px" }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="d-flex align-items-center gap-4">
            <Calendar className="text-muted cursor-pointer" size={22} />
            <div className="d-flex align-items-center gap-3">
              <div className="text-end d-none d-sm-block">
                <div className="fw-bold text-dark small">
                  {user?.email ? user.email.split("@")[0] : "Guest"}
                </div>
                <div className="text-muted" style={{ fontSize: "11px" }}>
                  Admin
                </div>
              </div>
              <Dropdown
                isOpen={dropdownOpen}
                toggle={() => setDropdownOpen(!dropdownOpen)}
              >
                <DropdownToggle
                  color="link"
                  className="p-0 border-0 position-relative"
                >
                  <img
                    src={`https://ui-avatars.com/api/?name=${user?.email}&background=0D8ABC&color=fff`}
                    alt="avatar"
                    className="rounded-circle"
                    width="35"
                  />
                  <span
                    className="position-absolute bottom-0 end-0 bg-success border border-white rounded-circle"
                    style={{ width: "12px", height: "12px" }}
                  ></span>
                </DropdownToggle>
                <DropdownMenu
                  end
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
              </Dropdown>
            </div>
          </div>
        </header>

        <main className="flex-grow-1 p-4 overflow-auto">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div className="d-flex align-items-center gap-2">
              <span style={{ fontSize: "24px" }}>📝</span>
              <h3 className="fw-bold m-0 text-dark">Todo</h3>
            </div>
            <Button
              color="white"
              className="shadow-sm border bg-white px-4 py-2 d-flex align-items-center gap-2"
              style={{ borderRadius: "10px", fontWeight: "600" }}
              onClick={() => {
                setTaskToEdit(null);
                setIsModalOpen(true);
              }}
            >
              Created Todo <Plus size={18} />
            </Button>
          </div>

          {todos.length === 0 ? (
            <div className="d-flex flex-column align-items-center justify-content-center h-75 opacity-75">
              <img
                src="/empty-state-illustration.png"
                alt="Empty"
                width="300"
              />
              <p className="text-muted mt-3">You Don't Have a Todo Yet</p>
            </div>
          ) : (
            <Row className="g-4">
              <Col lg={6}>
                <div className="bg-transparent px-2">
                  <h6 className="text-muted fw-bold mb-3">Not Checked</h6>
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
                        onDeleteRequest={triggerDeleteConfirm}
                        onToggle={toggleTodo}
                        onToggleSub={toggleSubTodo}
                        onDeleteSub={deleteSubTodo}
                      />
                    ))}
                </div>
              </Col>
              <Col lg={6}>
                <div className="bg-transparent px-2">
                  <h6 className="text-muted fw-bold mb-3">Checked</h6>
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
                        onDeleteRequest={triggerDeleteConfirm}
                        onToggle={toggleTodo}
                        onToggleSub={toggleSubTodo}
                        onDeleteSub={deleteSubTodo}
                      />
                    ))}
                </div>
              </Col>
            </Row>
          )}
        </main>
      </div>

      {/* --- MODAL KONFIRMASI HAPUS (Sesuai Gambar) --- */}
      <Modal
        isOpen={deleteModalOpen}
        toggle={() => setDeleteModalOpen(false)}
        centered
      >
        <div className="p-3 border-bottom d-flex justify-content-between align-items-center">
          <h5 className="m-0 fw-bold" style={{ color: "#475569" }}>
            Confirm Delete
          </h5>
          <X
            className="cursor-pointer text-muted"
            size={20}
            onClick={() => setDeleteModalOpen(false)}
          />
        </div>
        <ModalBody className="py-4">
          <p className="text-muted mb-0">
            Are you sure want to delete <strong>{itemToDelete?.title}</strong>?
          </p>
        </ModalBody>
        <ModalFooter className="border-0 pb-4 justify-content-center gap-3">
          <Button className="btn-confirm" onClick={executeDelete}>
            Confirm
          </Button>
          <Button
            className="btn-cancel"
            onClick={() => setDeleteModalOpen(false)}
          >
            Cancel
          </Button>
        </ModalFooter>
      </Modal>

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
