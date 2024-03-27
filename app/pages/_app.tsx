import "../styles/globals.css";
import "@coreui/coreui/dist/css/coreui.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import type { AppProps } from "next/app";
import { createTheme, NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import {
  DefaultLayout,
  AdminLayout,
  PortalLayout,
  LoginLayout,
} from "../components/layout";
import { useRouter } from "next/router";
import { useMemo, useEffect } from "react";
import {
  UserContextProvider,
  useUserContext,
  clearAuthorization,
} from "../utilities/authorization";

const lightTheme = createTheme({
  type: "light",
  theme: {
    colors: {},
  },
});

const darkTheme = createTheme({
  type: "dark",
  theme: {
    colors: {},
  },
});

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const currentRouter = useMemo(() => router?.route, [router?.route]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (
      !token &&
      currentRouter.startsWith("/admin") &&
      !currentRouter.includes("login")
    ) {
      router.push("/admin/login");
    }
    if (
      token &&
      currentRouter.startsWith("/admin") &&
      !currentRouter.includes("login")
    ) {
      const tokenData = JSON.parse(token);
      if (tokenData.role !== "superAdmin" && tokenData.role !== "admin") {
        router.push("/");
      }
    }
  }, [currentRouter, router]);

  return (
    <UserContextProvider>
      {!currentRouter ? (
        <DefaultLayout>
          <Component {...pageProps} />
        </DefaultLayout>
      ) : currentRouter.startsWith("/admin/login") ||
        currentRouter.startsWith("/login") ? (
        <LoginLayout>
          <Component {...pageProps} />
        </LoginLayout>
      ) : currentRouter.startsWith("/admin") ? (
        <NextThemesProvider
          defaultTheme="system"
          attribute="class"
          value={{
            light: lightTheme.className,
            dark: darkTheme.className,
          }}
        >
          <NextUIProvider>
            <AdminLayout>
              <Component {...pageProps} />
            </AdminLayout>
          </NextUIProvider>
        </NextThemesProvider>
      ) : (
        <PortalLayout>
          <Component {...pageProps} />
        </PortalLayout>
      )}
    </UserContextProvider>
  );
}

export default MyApp;
