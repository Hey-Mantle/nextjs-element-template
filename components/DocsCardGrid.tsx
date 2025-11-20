"use client";

import { Card, Link, Text, VerticalStack } from "@heymantle/litho";
import Image from "next/image";

interface DocCard {
  title: string;
  description: string;
  href: string;
  image?: string;
  external?: boolean;
}

interface DocSection {
  title: string;
  cards: DocCard[];
}

const docSections: DocSection[] = [
  {
    title: "Web Components",
    cards: [
      {
        title: "ui-modal",
        description: "Display modals and dialogs in the Mantle interface",
        href: "/docs/web-components/modal",
      },
      {
        title: "ui-title-bar",
        description: "Page title bars with actions and navigation",
        href: "/docs/web-components/title-bar",
      },
      {
        title: "ui-save-bar",
        description: "Unsaved changes indicator and save actions",
        href: "/docs/web-components/save-bar",
      },
      {
        title: "ui-nav-menu",
        description: "Navigation menus for app structure",
        href: "/docs/web-components/nav-menu",
      },
    ],
  },
  {
    title: "API",
    cards: [
      {
        title: "Authentication",
        description: "Client and server-side authentication patterns",
        href: "/docs/authentication",
      },
      {
        title: "Navigation",
        description: "Programmatic navigation and routing",
        href: "/docs/navigation",
      },
      {
        title: "Toast Notifications",
        description: "Display toast messages and notifications",
        href: "/docs/toasts",
      },
      {
        title: "API Reference",
        description: "Complete API documentation and endpoints",
        href: "/docs/api-reference",
      },
      {
        title: "Core API",
        description: "Mantle Core API reference documentation",
        href: "https://coreapi.heymantle.dev/reference/introduction",
        external: true,
      },
    ],
  },
  {
    title: "Element Configuration",
    cards: [
      {
        title: "UI Hooks",
        description: "Custom actions and links for Mantle pages",
        href: "/docs/ui-hooks",
      },
      {
        title: "Custom Data",
        description: "Store and retrieve custom data on Mantle resources",
        href: "/docs/custom-data",
      },
    ],
  },
];

export default function DocsCardGrid() {
  return (
    <VerticalStack gap="8">
      {docSections.map((section) => (
        <div key={section.title}>
          <Text variant="headingLg" fontWeight="semibold" className="mb-4">
            {section.title}
          </Text>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {section.cards.map((card) => {
              const CardContent = (
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <VerticalStack gap="4">
                    {/* Preview Image */}
                    <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-md flex items-center justify-center overflow-hidden">
                      {card.image ? (
                        <Image
                          src={card.image}
                          alt={card.title}
                          width={400}
                          height={200}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="text-gray-400 text-4xl font-bold">
                          {card.title.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>

                    {/* Title */}
                    <Text variant="headingMd" fontWeight="semibold">
                      {card.title}
                    </Text>

                    {/* Description */}
                    <Text variant="bodySm" color="subdued">
                      {card.description}
                    </Text>
                  </VerticalStack>
                </Card>
              );

              if (card.external) {
                return (
                  <a
                    key={card.href}
                    href={card.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block h-full"
                  >
                    {CardContent}
                  </a>
                );
              }

              return (
                <Link key={card.href} url={card.href} className="block h-full">
                  {CardContent}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </VerticalStack>
  );
}

