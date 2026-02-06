"use client";
import { usePathname } from "next/navigation";

export default function ConditionalModalWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isModal = pathname?.startsWith("/modal-");

  return (
    <div className={isModal ? "p-4 pt-0 bg-surface-highest" : "p-4 pt-0"}>
      {children}
    </div>
  );
}
