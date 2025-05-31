"use client";

// import node module libraries
import { Row, Col, Card, Form, Button, Image } from "react-bootstrap";
import Link from "next/link";

// import hooks
import useMounted from "hooks/useMounted";
import toast, { Toaster } from "node_modules/react-hot-toast/dist";
import Cookies from "js-cookie";
import request from "utils/request";
import { useState } from "react";
import { useRouter } from "node_modules/next/navigation";

const SignIn = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const hasMounted = useMounted();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = {
      email: e.target.username.value,
      password: e.target.password.value,
    };
    toast.loading("Loading...");

    try {
      request
        .post("/auth/login", data)
        .then(function (response) {
          console.log("Success:", response.data);
          if (response.status === 200 || response.status === 201) {
            Cookies.set("token", response.data.token);
            toast.dismiss();
            toast.success("Success Login");
            router.push("/");
          } else {
            toast.dismiss();
            toast.error("Failed to login. Please try again.");
            setLoading(false);
          }
        })
        .catch(function (error) {
          const message = error?.response?.data?.message;
          console.log(error);
          toast.dismiss();
          toast.error(message);
          setLoading(false);
        });
    } catch (error) {
      const message = error?.response?.data?.message;
      console.log(error);
      toast.dismiss();
      toast.error(message);
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster position="top-center" />
      <Row className="align-items-center justify-content-center g-0 min-vh-100">
        <Col xxl={4} lg={6} md={8} xs={12} className="py-8 py-xl-0">
          {/* Card */}
          <Card className="smooth-shadow-md">
            {/* Card body */}
            <Card.Body className="p-6">
              <div className="mb-4">
                <Link href="/">as</Link>
                <p className="mb-6">Please enter your user information.</p>
              </div>
              {/* Form */}
              {hasMounted && (
                <Form onSubmit={handleSubmit}>
                  {/* Username */}
                  <Form.Group className="mb-3" controlId="username">
                    <Form.Label>Username or email</Form.Label>
                    <Form.Control
                      type="email"
                      name="username"
                      placeholder="Enter address here"
                      required=""
                    />
                  </Form.Group>

                  {/* Password */}
                  <Form.Group className="mb-3" controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      placeholder="**************"
                      required=""
                    />
                  </Form.Group>

                  {/* Checkbox */}
                  <div className="d-lg-flex justify-content-between align-items-center mb-4">
                    <Form.Check type="checkbox" id="rememberme">
                      <Form.Check.Input type="checkbox" />
                      <Form.Check.Label>Remember me</Form.Check.Label>
                    </Form.Check>
                  </div>
                  <div>
                    {/* Button */}
                    <div className="d-grid">
                      <Button variant="primary" type="submit">
                        Sign In
                      </Button>
                    </div>
                    <div className="d-md-flex justify-content-between mt-4">
                      <div className="mb-2 mb-md-0">
                        <Link href="/sign-up" className="fs-5">
                          Create An Account{" "}
                        </Link>
                      </div>
                      <div>
                        <Link
                          href="/authentication/forget-password"
                          className="text-inherit fs-5"
                        >
                          Forgot your password?
                        </Link>
                      </div>
                    </div>
                  </div>
                </Form>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default SignIn;
