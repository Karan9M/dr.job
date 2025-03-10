import { ThemeProvider } from "@/components/general/ThemeProvider";
import type { Metadata } from "next";
import { Poppins } from "next/font/google"
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";


const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "700"]
})

export const metadata: Metadata = {
  title: "Dr.Job | Find jobs easily",
  description: "Dr.Job is a job search platform that helps you find your dream job easily.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/logo.png" type="image/png" />
      </head>
      <body
        className={poppins.className}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster closeButton richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
