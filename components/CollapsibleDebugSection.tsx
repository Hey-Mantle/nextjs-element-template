"use client";

import {
  Button,
  Card,
  HorizontalStack,
  Text,
  VerticalStack,
} from "@heymantle/litho";
import { useState } from "react";

interface CollapsibleDebugSectionProps {
  title: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
}

export default function CollapsibleDebugSection({
  title,
  children,
  defaultExpanded = false,
}: CollapsibleDebugSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <Card>
      <VerticalStack gap="3">
        <HorizontalStack gap="3" align="center">
          <Text variant="headingSm">{title}</Text>
          <Button onClick={() => setIsExpanded(!isExpanded)} size="small">
            {isExpanded ? "Hide" : "Show"} Details
          </Button>
        </HorizontalStack>

        {isExpanded && <VerticalStack gap="3">{children}</VerticalStack>}
      </VerticalStack>
    </Card>
  );
}
