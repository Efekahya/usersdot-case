import { Notifications } from "@mantine/notifications";
import { MantineProvider } from "@mantine/core";
import { Router } from "./Router";
import { theme } from "./theme";
import "./global.css";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";

export default function App() {
  return (
    <MantineProvider theme={theme}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          padding: "1rem"
        }}
      >
        <Notifications />
        <Router />
      </div>
    </MantineProvider>
  );
}
