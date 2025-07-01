import React, { useState } from "react";
import { Button, Field, Fieldset, Input } from "@chakra-ui/react";
import axios from "axios";
import { toaster, Toaster } from "../../components/ui/toaster";
import { useHistory } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const submitHandler = async () => {
    setLoading(true);
    if (!email || !password) {
      toaster.create({
        description: "Please fill all the fields",
        type: "warning",
        closable: true,
        duration: 3000,
      });
      setLoading(false);
      return;
    }
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        "/api/user/login",
        {
          email,
          password,
        },
        config
      );
      toaster.create({
        description: "Logged in successfully",
        type: "success",
        closable: true,
        duration: 3000,
      });

      localStorage.setItem("userInfo", JSON.stringify(data));

      setLoading(false);
      history.push("/chats");
    } catch (error) {
      toaster.create({
        title: "Error occured",
        description: error.response.data.message,
        type: "error",
        closable: true,
        duration: 3000,
      });
      setLoading(false);
    }
  };

  return (
    <>
      <Fieldset.Root size="lg" maxW="md">
        <Fieldset.Content>
          <Field.Root required>
            <Field.Label>
              Email address
              <Field.RequiredIndicator />
            </Field.Label>
            <Input
              name="email"
              type="email"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
          </Field.Root>

          <Field.Root required>
            <Field.Label>
              Password
              <Field.RequiredIndicator />
            </Field.Label>
            <Input
              name="password"
              type="password"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </Field.Root>
        </Fieldset.Content>

        <Button
          type="submit"
          variant="surface"
          borderRadius="2xl"
          alignSelf="flex-start"
          onClick={submitHandler}
          isLoading={loading}
        >
          Submit
        </Button>
      </Fieldset.Root>
      <Toaster />
    </>
  );
};

export default Login;
