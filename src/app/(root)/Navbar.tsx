"use client";
import { signOut } from "@/actions/auth.actions";
import { Button } from "@/components/ui/button";
import React from "react";

const Navbar = () => {
  const onHandleLogout = async () => {
    await signOut();
  };
  return <Button onClick={onHandleLogout}>Logout</Button>;
};

export default Navbar;
