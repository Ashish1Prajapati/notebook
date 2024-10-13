import Loading from "@/components/loading/loading";
import "@/styles/globals.css";
import { NextUIProvider } from "@nextui-org/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function App({ Component, pageProps }) {
  const [loading, setLoading] = useState(false);
  const { events, pathname } = useRouter();
  useEffect(() => {
    const start = () => {
      setLoading(true);
    };
    const end = () => {
      setLoading(false);
    };
    events.on("routeChangeStart", start);
    events.on("routeChangeComplete", end);
    events.on("routeChangeError", end);
    return () => {
      events.off("routeChangeStart", start);
      events.off("routeChangeComplete", end);
      events.off("routeChangeError", end);
    };
  }, [events, pathname]);
  return (loading ? 
    <Loading />:
    <NextUIProvider>
      <Component {...pageProps} />
    </NextUIProvider>
  )
}
