"use client";

import { Content } from "@prismicio/client";
import WordMark from "./WordMark";
import { PrismicNextLink } from "@prismicio/next";
import Link from "next/link";
import ButtonLink from "./ButtonLink";
import { Button } from "@nextui-org/react";
import supabase from "../../../supabase";
import { useEffect, useState } from "react";
import Logout from "./auth/logout";
import AccountLogo from "./AccountLogo";

type NavBarProps = {
  settings: Content.SettingsDocument;
};

export default function NavBar({ settings }: NavBarProps) {
  const [user, setUser] = useState(false);

  useEffect(() => {
    const authState = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          setUser(true);
          console.log(user);

          // getUserData(user.id);
        }
      } catch (err) {
        console.log(err);
      }
    };

    const getUserData = async (user_id: string) => {
      try {
        let { data: users, error } = await supabase
          .from("users")
          .select()
          .eq("id", user_id);
      } catch (err) {
        console.log(err);
      }
    };

    authState();
  }, []);

  return (
    <nav className="px-4 py-4 md:px-6 md:py-6" aria-label="Main">
      <div className="mx-auto flex max-w-6xl flex-col justify-between py-2 font-medium text-white md:flex-row md:items-center">
        <Link href="/">
          <WordMark />
        </Link>
        <ul className="flex gap-6">
          {settings.data.navigation.map((item) => {
            if (item.cta_button) {
              return (
                <li key={item.label}>
                  <ButtonLink field={item.link}>{item.label}</ButtonLink>
                </li>
              );
            }

            return (
              <li key={item.label} className="text-white">
                <PrismicNextLink
                  field={item.link}
                  className="inline-flex min-h-11 items-center"
                >
                  {item.label}
                </PrismicNextLink>
              </li>
            );
          })}
          <div>
            {user ? (
              // <Logout />
              <AccountLogo />
            ) : (
              <>
                <Link href="/loginUser">
                  <Button variant="light" color="warning">
                    Login
                  </Button>
                </Link>
                <Link href="/authorizeUser">
                  <Button
                    variant="ghost"
                    color="warning"
                    radius="full"
                    style={{ marginLeft: 10 }}
                  >
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </ul>
      </div>
    </nav>
  );
}
