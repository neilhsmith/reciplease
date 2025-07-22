import { logger } from "@/monitoring/logger";
import { Welcome } from "@/welcome/welcome";

export function meta() {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export function loader() {
  logger.info("loader logger.info", { foo: "bar" });
}

export default function Home() {
  return <Welcome />;
}
