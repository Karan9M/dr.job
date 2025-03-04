import { ThemeProvider } from "@/components/general/ThemeProvider";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";


export const poppins = Poppins({
  subsets: ["latin"],
  weight: "500"
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
        </ThemeProvider>
      </body>
    </html>
  );
}
