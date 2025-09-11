import { Page, Text, VerticalStack } from "@heymantle/litho";

export default function Home() {
  return (
    <Page title="Typography Test" subtitle="Testing Litho typography variants">
      <VerticalStack gap="6">
        <div className="text-center">
          <Text variant="headingXl" className="mb-4">
            Typography Test
          </Text>
          <Text variant="bodyLg" color="subdued">
            Testing different Litho typography variants
          </Text>
        </div>

        <VerticalStack gap="4">
          <Text variant="headingXl">Heading XL - This should be large</Text>
          <Text variant="headingLg">
            Heading LG - This should be medium-large
          </Text>
          <Text variant="headingMd">Heading MD - This should be medium</Text>
          <Text variant="bodyLg">Body LG - This should be medium</Text>
          <Text variant="bodyMd">Body MD - This should be base size</Text>
          <Text variant="bodySm">Body SM - This should be small</Text>
        </VerticalStack>

        <VerticalStack gap="2">
          <Text variant="headingMd">Font Weight Test</Text>
          <Text variant="bodyMd" fontWeight="normal">
            Normal weight text
          </Text>
          <Text variant="bodyMd" fontWeight="medium">
            Medium weight text
          </Text>
          <Text variant="bodyMd" fontWeight="semibold">
            Semibold weight text
          </Text>
          <Text variant="bodyMd" fontWeight="bold">
            Bold weight text
          </Text>
        </VerticalStack>
      </VerticalStack>
    </Page>
  );
}
