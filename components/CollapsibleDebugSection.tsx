"use client";

import {
  Button,
  Card,
  Stack,
  Text,
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
      <Stack gap="3">
        <Stack horizontal gap="3" align="center">
          <Text variant="headingSm">{title}</Text>
          <Button onClick={() => setIsExpanded(!isExpanded)} size="small">
            {isExpanded ? "Hide" : "Show"} Details
          </Button>
        </Stack>

        {isExpanded && <Stack gap="3">{children}</Stack>}
      </Stack>
    </Card>
  );
}
