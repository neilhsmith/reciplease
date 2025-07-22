import type { Route } from "./+types/home";

import { useEffect } from "react";

import { logger } from "@/monitoring/logger";
import { Welcome } from "@/welcome/welcome";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export function loader() {
  logger.info("loader logger.info", { foo: "asdfasdf" });
}

export default function Home() {
  useEffect(() => {
    logger.info("Hello world", { foo: "bar" });
    console.log("testinggggg");
    console.error("browser error console.error");
  }, []);

  return <Welcome />;
}
