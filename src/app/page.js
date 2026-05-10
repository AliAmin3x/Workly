import Header from "@/components/Header";
import Dashboard from "./Dashboard";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <Header />
      <main className="p-6 pt-20">
        <Dashboard />
      </main>
    </div>
  );
}
