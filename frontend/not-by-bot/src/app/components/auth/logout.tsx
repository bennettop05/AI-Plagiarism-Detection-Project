import React from "react";
import { Button } from "@nextui-org/react";
import supabase from "../../../../supabase";
import { useRouter } from "next/navigation";

const logout = () => {
  const router = useRouter();

  const signUserOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();

      console.log(error);
      window.location.href = "http://localhost:3000/"
      
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <Button
        variant="ghost"
        color="warning"
        onPress={() => {
          signUserOut();
        }}
      >
        Logout
      </Button>
    </div>
  );
};

export default logout;
