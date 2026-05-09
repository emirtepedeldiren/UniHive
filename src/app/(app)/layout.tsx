import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Sidebar />
      <div className="ml-60 min-h-screen flex flex-col">
        <TopBar />
        <main className="mt-14 flex-1">{children}</main>
      </div>
    </>
  );
}
