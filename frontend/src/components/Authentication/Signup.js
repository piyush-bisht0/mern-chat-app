import React, { useState } from "react";
import axios from "axios";
import {
  Button,
  Field,
  Fieldset,
  Input,
  FileUpload,
  Box,
  Image,
} from "@chakra-ui/react";
import { HiUpload } from "react-icons/hi";
import { toaster, Toaster } from "../../components/ui/toaster";
import { useHistory } from "react-router-dom";
// import { ChatState } from "../../Context/chatProvider"; // Uncomment if using context

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pic, setPic] = useState();
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  // const { setUser } = ChatState(); // Uncomment if using context

  const postDetails = (pics) => {
    setLoading(true);
    if (!pics) {
      toaster.create({
        description: "Please select an image!",
        type: "warning",
        closable: true,
        duration: 3000,
      });
      setLoading(false);
      return;
    }

    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "chat-app");
      data.append("cloud_name", "dnqboifdv");
      fetch("https://api.cloudinary.com/v1_1/dnqboifdv/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString());
          setLoading(false);
          toaster.create({
            description: "Picture uploaded successfully",
            type: "success",
            closable: true,
            duration: 3000,
          });
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    } else {
      toaster.create({
        description: "Please select a JPEG or PNG image!",
        type: "warning",
        closable: true,
        duration: 3000,
      });
      setLoading(false);
      return;
    }
  };

  const submitHandler = async () => {
    setLoading(true);
    if (!name || !email || !password || !confirmPassword) {
      toaster.create({
        description: "Please fill all the fields",
        type: "warning",
        closable: true,
        duration: 3000,
      });
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      toaster.create({
        description: "Passwords do not match",
        type: "error",
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
        "/api/user",
        {
          name,
          email,
          password,
          pic,
        },
        config
      );
      toaster.create({
        description: "Registered successfully",
        type: "success",
        closable: true,
        duration: 3000,
      });

      localStorage.setItem("userInfo", JSON.stringify(data));
      // setUser(data); // Uncomment if using context

      setLoading(false);
      history.push("/chats");
    } catch (error) {
      toaster.create({
        title: "Error occurred",
        description:
          error?.response?.data?.message || "Registration failed. Try again.",
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
              Name
              <Field.RequiredIndicator />
            </Field.Label>
            <Input
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Field.Root>

          <Field.Root required>
            <Field.Label>
              Email address
              <Field.RequiredIndicator />
            </Field.Label>
            <Input
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Field.Label>
              Confirm Password
              <Field.RequiredIndicator />
            </Field.Label>
            <Input
              name="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </Field.Root>

          <Field.Root>
            <Field.Label>Upload Profile Picture</Field.Label>
            <FileUpload.Root accept={["image/png", "image/jpeg"]}>
              <FileUpload.HiddenInput
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) postDetails(file);
                }}
              />
              <FileUpload.Trigger asChild>
                <Button variant="subtle" size="sm">
                  <HiUpload /> Upload file
                </Button>
              </FileUpload.Trigger>
              <FileUpload.List />
            </FileUpload.Root>
          </Field.Root>

          {pic && (
            <Box mt="2">
              <Image src={pic} alt="Preview" boxSize="80px" borderRadius="md" />
            </Box>
          )}
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

export default Signup;
