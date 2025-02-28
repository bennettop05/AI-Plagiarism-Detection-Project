"use client";

import React, { useState } from "react";

import { Input, Button, Spinner } from "@nextui-org/react";
import supabase from "../../../../supabase";
import { useRouter } from "next/navigation";

const login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const validateEmail = (value: string) =>
    value.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i);

  const isInvalid = React.useMemo(() => {
    if (email === "") return false;

    return validateEmail(email) ? false : true;
  }, [email]);

  const handleSubmitButton = () => {
    setLoading(true);
    if (email === "" || password === "") {
      alert("Please fill all the fields");
      setLoading(false);
    } else if (isInvalid) {
      alert("Enter a Valid Email");
      setLoading(false);
    } else {
      console.log("logging in");
      loginInUser();
      setLoading(false);
    }
  };

  const loginInUser = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (data) {
        console.log(data);
        // router.push("/marketplace");
        window.location.href = "http://localhost:3000/marketplace"
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        justifyContent: "center",
      }}
    >
      <h1 className="text-3xl font-bold text-black">Login User</h1>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 20,
          alignItems: "center",
        }}
      >
        <Input
          value={email}
          type="email"
          label="Email"
          variant="bordered"
          isInvalid={isInvalid}
          color={isInvalid ? "danger" : "success"}
          errorMessage={isInvalid && "Please enter a valid email"}
          onValueChange={setEmail}
          className=" text-black"
        />
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 20,
          alignItems: "center",
        }}
      >
        <Input
          size="sm"
          type="password"
          label="Password"
          value={password}
          onValueChange={setPassword}
        />
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: 20,
        }}
      >
        {loading ? (
          <Spinner />
        ) : (
          <Button
            variant="ghost"
            color="default"
            size="sm"
            onPress={() => handleSubmitButton()}
          >
            Login
          </Button>
        )}
      </div>
    </div>
  );
};

export default login;
