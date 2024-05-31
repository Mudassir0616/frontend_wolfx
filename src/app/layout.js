import { Inter, Roboto } from "next/font/google";
import "./globals.css";
import Head from "next/head";
import Navbar from "@/components/common_components/Navbars/Navbar";
import SideNav from "@/components/common_components/Navbars/SIdeNavbar";

const inter = Inter({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
})

export const metadata = {
  title: "WolfX",
  description: "WolfX frontend setup",
  keywords: "WolfX, frontend, setup, digital agency, IT services, artificial flowers, home decor, furniture",
  url: "https://www.wolfx.com",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.className}>
      <Head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <meta name="keywords" content={metadata.keywords} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content={metadata.title} />
        <meta property="og:description" content={metadata.description} />
        <meta property="og:url" content={metadata.url} />
        <meta property="og:image" content={'/next.svg'} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metadata.title} />
        <meta name="twitter:description" content={metadata.description} />
        <meta name="twitter:image" content={metadata.image} />
      </Head>
      <body className="sidenav-body">
      {/* <body> */}

        {/* <Navbar /> */}

        {/* // for side nav */}
        <SideNav />
        <main className="content-wrapper sidenav-main-layout">
        {/* <main className="content-wrapper"> */}
          {children}
        </main>
      </body>
    </html>
  );
}
