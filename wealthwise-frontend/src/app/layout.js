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
      <body className="bg-slate-50 min-h-screen">
        <AuthProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                borderRadius: "10px",
                fontSize: "14px",
                fontWeight: "500",
              },
              success: { style: { background: "#0f172a", color: "#fff" } },
              error: { style: { background: "#ef4444", color: "#fff" } },
            }}
          />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}