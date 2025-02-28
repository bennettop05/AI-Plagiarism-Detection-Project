"use client";

import React, { useState } from "react";
import {
  Input,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  RadioGroup,
  Radio,
  Spinner,
} from "@nextui-org/react";
import supabase from "../../../../supabase";
import { useRouter } from "next/navigation";

const signUp = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [gender, setGender] = useState("Select Gender");
  const [password, setPassword] = useState("");
  const [occupation, setOccupation] = useState("");
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmitButton = () => {
    startRegistration();
  };

  const startRegistration = () => {
    setLoading(true);

    if (
      name === "" ||
      gender === "Select Gender" ||
      value === "" ||
      password === "" ||
      occupation === ""
    ) {
      alert("Please fill in all the values");
    } else if (password.length < 6) {
      alert("Password Length should be at least 6");
    } else {
      signUpNewUser();
    }
  };

  const signUpNewUser = async () => {
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: value,
        password: password,
      });

      if (error) {
        console.error(error);
        alert("There was an eror please try again");
      } else if (data) {
        const userData = data.user;

        if (userData) {
          // setUserID(userData.id);
          addUserDetails(userData.id);
        } else {
          console.error("User data is null or undefined");
        }
      }
    } catch (err) {
      console.log(err);
      alert("Error: " + err);
    } finally {
      setLoading(false);
    }
  };

  const addUserDetails = async (id: string) => {
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from("users")
        .insert([
          {
            id: id,
            name: name,
            gender: gender,
            occupation: occupation,
          },
        ])
        .select();

      console.log("DB Created");
      console.log(data);

      if (error) {
        console.log(error);
        alert("There was an eror please try again");
      }else{
        // router.push("/marketplace");
        window.location.href = "http://localhost:3000/marketplace"
      }

    } catch (err) {
      console.log(err);
      alert("Error: " + err);
    } finally {
      setLoading(false);
    }
  };

  const validateEmail = (value: string) =>
    value.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i);

  const isInvalid = React.useMemo(() => {
    if (value === "") return false;

    return validateEmail(value) ? false : true;
  }, [value]);

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
      <h1 className="text-3xl font-bold text-black">Create Account</h1>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 40,
          alignItems: "center",
        }}
      >
        <Input
          size="sm"
          type="text"
          label="Full Name"
          style={{ width: "100%" }}
          value={name}
          onValueChange={setName}
        />

        <div className="ml-5">
          <Dropdown>
            <DropdownTrigger>
              <Button variant="bordered">{gender}</Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Action event example"
              onAction={(key) => setGender(key + "")}
            >
              <DropdownItem key="Male" className="text-black">
                Male
              </DropdownItem>
              <DropdownItem key="Female" className="text-black">
                Female
              </DropdownItem>
              <DropdownItem key="Neutral" className="text-black">
                Prefer Not to Say
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
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
          value={value}
          type="email"
          label="Email"
          variant="bordered"
          isInvalid={isInvalid}
          color={isInvalid ? "danger" : "success"}
          errorMessage={isInvalid && "Please enter a valid email"}
          onValueChange={setValue}
          className="max-w-xs text-black"
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
          label="Create a Password"
          //   style={{ width: "100%" }}
          value={password}
          onValueChange={setPassword}
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
        <RadioGroup
          label="Select your Occupation"
          value={occupation}
          onValueChange={setOccupation}
        >
          <Radio value="employer" style={{ marginTop: 5 }}>
            Employer
          </Radio>
          <Radio value="author" style={{ marginTop: 5 }}>
            Content Writer
          </Radio>
          <Radio value="user" style={{ marginTop: 5 }}>
            Other
          </Radio>
        </RadioGroup>
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
            Register your Account
          </Button>
        )}
      </div>
    </div>
  );
};

export default signUp;
