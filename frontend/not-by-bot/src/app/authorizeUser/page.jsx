import React from "react";
import styles from "./authorizePage.module.css";
import Image from "next/image";
import SignUp from "../components/auth/signUp";
import login from "../components/auth/login";

const page = () => {
  return (
    <>
      <div className={styles.container}>
        <div className={styles.parentGrid}>
          <div className={styles.box1}>
            <h1 style={{ fontSize: 35, fontWeight: "bold" }}>
              Embark on a journey of authenticity with us
            </h1>
            <div className={styles.image}>
              <Image src="/assets/bg3.png" width={250} height={250} />
            </div>
          </div>
          <div className={styles.box2}>
            
            <SignUp/>
          </div>
          <div className="glow absolute -z-10 aspect-square w-full max-w-xl rounded-full bg-blue-400/20 blur-3xl filter" />
        </div>
      </div>
    </>
  );
};

export default page;
