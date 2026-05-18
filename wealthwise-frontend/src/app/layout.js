import { Toaster } from "react-hot-toast";
import { AuthProvider } from "../context/AuthContext";
import "./globals.css";

export const metadata = {
  title: "WealthWise",
  description: "Personal Finance Manager",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        <AuthProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              success: {
                style: {
                  background: "#22c55e",
                  color: "#fff",
                },
              },
              error: {
                style: {
                  background: "#ef4444",
                  color: "#fff",
                },
              },
            }}
          />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
