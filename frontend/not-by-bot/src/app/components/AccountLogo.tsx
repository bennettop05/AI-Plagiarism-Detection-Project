import React from "react";
import {
  Avatar,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownSection,
  DropdownItem,
  Button,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import supabase from "../../../supabase";

const accountLogo = () => {
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

  const handleClick=(key: string)=>{
    if(key==="account"){
        router.push('/account')
    }else if(key==="logout"){
      signUserOut()
    }
  }

  return (
    <div>
      <Dropdown backdrop="blur">
        <DropdownTrigger>
          <Avatar
            isBordered
            // color="warning"
            // style={{background: 'black'}}
            src="https://i.pravatar.cc/150?u=a04258114e29026702d"
          />
          {/* <Button variant="bordered">Open Menu</Button> */}
        </DropdownTrigger>
        <DropdownMenu aria-label="Static Actions" onAction={(key) => handleClick(key+"")}>
          <DropdownItem key="account" className="text-black">
            My Account
          </DropdownItem>
          <DropdownItem key="logout" className="text-danger" color="danger">
            Logout
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
};

export default accountLogo;
