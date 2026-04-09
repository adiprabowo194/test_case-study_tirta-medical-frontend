import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  FormFeedback,
  InputGroup,
  InputGroupText,
} from "reactstrap";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const LoginPage = () => {
  const { login } = useAuth();

  // State Input
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // State UI
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isEmailInvalid, setIsEmailInvalid] = useState(false);

  // 1. Fungsi Validasi Format Email
  const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleSignIn = (e) => {
    e.preventDefault();
    setErrorMsg("");
    setIsEmailInvalid(false);

    // Cek format email sesuai kriteria
    if (!validateEmail(email)) {
      setIsEmailInvalid(true);
      return;
    }

    // 2. Jalankan Logic Login/Register (Handled by AuthContext)
    const result = login(email, password);

    if (!result.success) {
      // Jika email terdaftar tapi password salah, munculkan error
      setErrorMsg(result.message);
    }
  };

  // 3. Logic Google Login (Password bypass)
  const handleGoogleLogin = () => {
    // Sesuai kriteria: Google login tidak butuh password
    login("google.user@mail.com", null);
  };

  return (
    <Container fluid className="p-0 vh-100 overflow-hidden">
      <Row className="g-0 h-100">
        {/* SISI KIRI: ILUSTRASI  */}
        <Col
          md={6}
          lg={7}
          className="d-none d-md-flex align-items-center justify-content-center"
          style={{ backgroundColor: "#F8FAFF" }}
        >
          <img
            src="/login-illustration.png"
            alt="Illustration"
            style={{ width: "80%", height: "auto", objectFit: "contain" }}
            onError={(e) => {
              e.target.src =
                "https://via.placeholder.com/600x400?text=Login+Illustration";
            }}
          />
        </Col>

        {/* SISI KANAN: FORM LOGIN */}
        <Col
          md={6}
          lg={5}
          className="d-flex align-items-center justify-content-center bg-white"
        >
          <div style={{ width: "100%", maxWidth: "400px" }} className="p-4">
            <div className="mb-5">
              <img
                src="/logo.png"
                alt="Logo"
                width="120"
                className="mb-4"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
              <h2 className="fw-bold text-dark" style={{ fontSize: "2rem" }}>
                Welcome Back
              </h2>
            </div>

            <Form onSubmit={handleSignIn}>
              {/* Email Input */}
              <FormGroup className="mb-3">
                <Label className="small fw-bold text-muted">
                  Email <span className="text-danger">*</span>
                </Label>
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  invalid={isEmailInvalid}
                  className="py-2"
                  style={{ borderRadius: "8px" }}
                />
                <FormFeedback>
                  Email needs to validate with correct format.
                </FormFeedback>
              </FormGroup>

              {/* Password Input */}
              <FormGroup className="mb-4">
                <Label className="small fw-bold text-muted">
                  Password <span className="text-danger">*</span>
                </Label>
                <InputGroup>
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    invalid={!!errorMsg}
                    className="py-2"
                    style={{ borderRadius: "8px 0 0 8px", borderRight: "none" }}
                  />
                  <InputGroupText
                    onClick={() => setShowPassword(!showPassword)}
                    className="bg-white border-start-0"
                    style={{ borderRadius: "0 8px 8px 0", cursor: "pointer" }}
                  >
                    {showPassword ? (
                      <EyeOff size={18} className="text-muted" />
                    ) : (
                      <Eye size={18} className="text-muted" />
                    )}
                  </InputGroupText>
                  <FormFeedback>{errorMsg}</FormFeedback>
                </InputGroup>
              </FormGroup>

              {/* Tombol Sign In */}
              <Button
                block
                className="py-2 fw-bold mb-3 shadow-sm"
                style={{
                  backgroundColor: "#21528c",
                  border: "none",
                  borderRadius: "8px",
                }}
              >
                Sign In
              </Button>

              {/* Divider */}
              <div className="d-flex align-items-center my-4">
                <div className="flex-grow-1 border-bottom border-light"></div>
                <div className="mx-3 small text-muted">Or</div>
                <div className="flex-grow-1 border-bottom border-light"></div>
              </div>

              {/* Tombol Google Login */}
              <Button
                outline
                block
                type="button"
                onClick={handleGoogleLogin}
                className="d-flex align-items-center justify-content-center py-2 text-muted border-light-subtle"
                style={{ borderRadius: "8px", backgroundColor: "#fff" }}
              >
                <img
                  src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                  alt="google icon"
                  width="18"
                  className="me-2"
                />
                Sign in with Google
              </Button>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;
