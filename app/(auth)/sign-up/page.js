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

const SignUp = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const hasMounted = useMounted();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = {
      email: e.target.email.value,
      password: e.target.password.value,
      unit: e.target.unit.value,
      role: "admin",
    };
    toast.loading("Loading...");

    try {
      request
        .post("/auth/register", data)
        .then(function (response) {
          console.log("Success:", response.data);
          if (response.status === 200 || response.status === 201) {
            toast.dismiss();
            toast.success("Success register");
            router.push("/sign-in");
          } else {
            toast.dismiss();
            toast.error("Failed to register. Please try again.");
            setLoading(false);
          }
        })
        .catch(function (error) {
          const message = error?.response?.data?.errors?.message;

          toast.dismiss();
          toast.error(message);
          setLoading(false);
        });
    } catch (err) {
      const message = error?.response?.data?.errors?.message;

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
                <Link href="/">
                  <Image
                    src="/images/brand/logo/logo-primary.svg"
                    className="mb-2"
                    alt=""
                  />
                </Link>
                <p className="mb-6">Please enter your user information.</p>
              </div>
              {/* Form */}
              {hasMounted && (
                <Form onSubmit={handleSubmit}>
                  {/* Email */}
                  <Form.Group className="mb-3" controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
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

                  {/* Unit */}
                  <Form.Group className="mb-3" controlId="unit">
                    <Form.Label>Unit</Form.Label>
                    <Form.Control
                      type="text"
                      name="unit"
                      placeholder="Enter Your Unit"
                      required=""
                    />
                  </Form.Group>

                  <div>
                    {/* Button */}
                    <div className="d-grid">
                      <Button variant="primary" type="submit">
                        Create Free Account
                      </Button>
                    </div>
                    <div className="d-md-flex justify-content-between mt-4">
                      <div className="mb-2 mb-md-0">
                        <Link href="/sign-in" className="fs-5">
                          Already member? Login{" "}
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

export default SignUp;
