"use client";

import { Button, Card, Text, VerticalStack } from "@heymantle/litho";
import { useState } from "react";

export default function ExampleComponent() {
  const [count, setCount] = useState(0);

  return (
    <Card padded>
      <VerticalStack gap="4">
        <Text variant="headingMd">Interactive Example</Text>
        <Text>
          This component demonstrates state management with Litho components.
        </Text>
        <div className="text-center">
          <Text variant="bodyXl" fontWeight="bold">
            Count: {count}
          </Text>
        </div>
        <div className="flex gap-2 justify-center">
          <Button onClick={() => setCount(count - 1)}>Decrease</Button>
          <Button primary onClick={() => setCount(count + 1)}>
            Increase
          </Button>
        </div>
      </VerticalStack>
    </Card>
  );
}
