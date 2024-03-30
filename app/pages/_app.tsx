import "../styles/globals.css";
import "@coreui/coreui/dist/css/coreui.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import type { AppProps } from "next/app";
import {
  DefaultLayout,
  AdminLayout,
  PortalLayout,
  LoginLayout,
} from "../components/layout";
import { Spin } from "antd";
import { NextRouter, useRouter } from "next/router";
import { useMemo, useEffect, Suspense } from "react";
import {
  UserContextProvider,
  useUserContext,
  clearAuthorization,
} from "../utilities/authorization";

const requireAuthRouter = ["/aduan", "/permintaan-dokumen"];

const checkAuth = (
  router: NextRouter,
  currentRouter: string,
  token: string | null
) => {
  if (currentRouter.startsWith("/admin")) {
    if (!token && currentRouter.includes("login")) {
      router.replace("/admin/login");
    } else if (token && !currentRouter.includes("login")) {
      const tokenData = JSON.parse(token);
      if (tokenData.role !== "superAdmin" && tokenData.role !== "admin") {
        router.replace("/");
      }
    }
  } else if (
    !token && requireAuthRouter.find((router) => currentRouter.startsWith(router))
  ) {
    router.replace("/login");
  }
};

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const currentRouter = useMemo(() => router?.route, [router?.route]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    checkAuth(router, currentRouter, token);
  }, [currentRouter, router]);

  return (
    <Suspense fallback={<Spin />}>
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
          <AdminLayout>
            <Component {...pageProps} />
          </AdminLayout>
        ) : (
          <PortalLayout>
            <Component {...pageProps} />
          </PortalLayout>
        )}
      </UserContextProvider>
    </Suspense>
  );
}

export default MyApp;
