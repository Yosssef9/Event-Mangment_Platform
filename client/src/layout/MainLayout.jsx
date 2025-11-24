import { Outlet, Link } from "react-router-dom";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
export default function MainLayout() {
  return (
    <div>
      <NavBar />
      <div className="min-h-screen bg-gradient-to-b from-fuchsia-50 to-purple-100 flex flex-col items-center justify-start px-6 md:px-20 lg:px-32 py-20 text-center">
        <Outlet /> {/* Nested routes render here */}
      </div>
      <Footer />
    </div>
  );
}
