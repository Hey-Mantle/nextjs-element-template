"use client";

import { useAppBridge } from "@heymantle/app-bridge-react";
import { Layout, Text } from "@heymantle/litho";
import { usePathname, useRouter } from "next/navigation";
import { useCallback } from "react";

interface Tab {
  handle: string;
  title: string;
  active: boolean;
  content: string;
}

const tabStyles = (active: boolean) =>
  `relative cursor-pointer rounded-md lg:px-2 lg:py-2 lg:rounded-none lg:first:rounded-t-md lg:last:rounded-b-md ${
    active
      ? "lg:bg-surface-highest lg:outline lg:outline-tint-1 lg:shadow-card lg:hover:bg-surface-highest lg:active:bg-surface-highest"
      : "hover:bg-tint-1 active:bg-tint-2 dark:hover:bg-tint-alt-1 dark:active:bg-tint-alt-2"
  }`;

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { mantle } = useAppBridge();

  const currentPath = pathname || "";
  const pathSegments = currentPath.split("/").filter(Boolean);
  const slug = pathSegments.length > 1 ? pathSegments[1] : "general";

  const handleTabClick = useCallback(
    (handle: string) => {
      const path = `/settings/${handle}`;
      router.push(path);
      if (mantle) {
        (mantle as any).setPath(path);
      }
    },
    [router, mantle]
  );

  const TABS: Tab[] = [
    {
      handle: "general",
      title: "General",
      active: slug === "general",
      content: "User and organization details",
    },
    {
      handle: "tokens",
      title: "Tokens",
      active: slug === "tokens",
      content: "Manage access and refresh tokens",
    },
  ];

  return (
    <div className="pt-4">
      <Layout>
        <Layout.Section sidebar="slim">
          <div className="relative -left-4 w-full-plus-8 flex py-2 px-2 bg-surface-highest md:left-0 md:w-full md:rounded-md shadow-card outline outline-tint-2 md:outline-tint-1 overflow-y-visible overflow-x-auto no-scrollbar lg:px-0 lg:overflow-visible lg:bg-surface-lower lg:py-0 lg:flex-col">
            {TABS.map((tab, index) => {
              const isLast = index === TABS.length - 1;
              return (
                <div
                  key={tab.handle}
                  onClick={() => handleTabClick(tab.handle)}
                  className={tabStyles(tab.active)}
                >
                  {!isLast && (
                    <div className="hidden lg:block absolute bottom-0 left-0 right-0 h-px w-full bg-tint-2 pointer-events-none" />
                  )}
                  <div
                    className={`relative flex items-center justify-between gap-2 py-1.5 px-2${
                      tab.content ? " lg:pb-2" : ""
                    }`}
                  >
                    <Text
                      fontWeight="semibold"
                      color={tab.active ? "link" : "subdued"}
                      className="truncate"
                    >
                      {tab.title}
                    </Text>
                  </div>
                  {tab.content && (
                    <div className="hidden lg:block p-2 pt-0">
                      <Text color="subdued" variant="bodySm">
                        {tab.content}
                      </Text>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Layout.Section>
        <Layout.Section>{children}</Layout.Section>
      </Layout>
    </div>
  );
}
