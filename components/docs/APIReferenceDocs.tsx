"use client";

import {
  Card,
  HorizontalStack,
  Text,
  VerticalStack,
} from "@heymantle/litho";
import CodeBlock from "@/components/CodeBlock";

export default function APIReferenceDocs() {
  return (
    <VerticalStack gap="6">
      {/* Session Management */}
      <Card>
        <VerticalStack gap="4">
          <Text variant="headingMd">Session Management</Text>
          <VerticalStack gap="4">
            <HorizontalStack gap="4" align="start">
              <VerticalStack gap="2" style={{ flex: 1 }}>
                <Text variant="bodyMd" fontWeight="semibold">
                  requestSession()
                </Text>
                <Text variant="bodySm" color="subdued">
                  Request session data from parent window with intelligent caching. Returns a Promise that resolves to the session token (JWT string).
                </Text>
              </VerticalStack>
              <div style={{ flex: 1 }}>
                <CodeBlock language="typescript">
{`const token = await mantle.requestSession();
// Returns: Promise<string> - Session token (JWT)`}
                </CodeBlock>
              </div>
            </HorizontalStack>

            <HorizontalStack gap="4" align="start">
              <VerticalStack gap="2" style={{ flex: 1 }}>
                <Text variant="bodyMd" fontWeight="semibold">
                  getSessionToken()
                </Text>
                <Text variant="bodySm" color="subdued">
                  Get session token - simple async method that returns just the token string.
                </Text>
              </VerticalStack>
              <div style={{ flex: 1 }}>
                <CodeBlock language="typescript">
{`const token = await mantle.getSessionToken();
// Returns: Promise<string> - Session token`}
                </CodeBlock>
              </div>
            </HorizontalStack>
          </VerticalStack>
        </VerticalStack>
      </Card>

      {/* User & Organization */}
      <Card>
        <VerticalStack gap="4">
          <Text variant="headingMd">User & Organization</Text>
          <VerticalStack gap="4">
            <HorizontalStack gap="4" align="start">
              <VerticalStack gap="2" style={{ flex: 1 }}>
                <Text variant="bodyMd" fontWeight="semibold">
                  getUser()
                </Text>
                <Text variant="bodySm" color="subdued">
                  Get user data with intelligent caching. Returns a Promise that resolves to the user object with id, name, email, and roles.
                </Text>
              </VerticalStack>
              <div style={{ flex: 1 }}>
                <CodeBlock language="typescript">
{`const user = await mantle.getUser();
// Returns: Promise<MantleUser>`}
                </CodeBlock>
              </div>
            </HorizontalStack>

            <HorizontalStack gap="4" align="start">
              <VerticalStack gap="2" style={{ flex: 1 }}>
                <Text variant="bodyMd" fontWeight="semibold">
                  getOrganization()
                </Text>
                <Text variant="bodySm" color="subdued">
                  Get organization data with intelligent caching. Returns a Promise that resolves to the organization object with id, name, and other properties.
                </Text>
              </VerticalStack>
              <div style={{ flex: 1 }}>
                <CodeBlock language="typescript">
{`const org = await mantle.getOrganization();
// Returns: Promise<MantleOrganization>`}
                </CodeBlock>
              </div>
            </HorizontalStack>
          </VerticalStack>
        </VerticalStack>
      </Card>

      {/* Authenticated Fetch */}
      <Card>
        <VerticalStack gap="4">
          <Text variant="headingMd">Authenticated Fetch</Text>
          <HorizontalStack gap="4" align="start">
            <VerticalStack gap="2" style={{ flex: 1 }}>
              <Text variant="bodyMd" fontWeight="semibold">
                authenticatedFetch(url, options?)
              </Text>
              <Text variant="bodySm" color="subdued">
                Authenticated fetch helper that automatically includes Bearer token authorization. This method wraps the native fetch() API and automatically handles token management, expiry, and retries.
              </Text>
              <VerticalStack gap="1" style={{ marginTop: "0.5rem" }}>
                <Text variant="bodySm" fontWeight="semibold">Parameters:</Text>
                <Text variant="bodySm" color="subdued">
                  • <code>url</code> - The URL to fetch (string)
                </Text>
                <Text variant="bodySm" color="subdued">
                  • <code>options</code> - Standard fetch options (RequestInit, optional)
                </Text>
                <Text variant="bodySm" fontWeight="semibold" style={{ marginTop: "0.5rem" }}>
                  Returns:
                </Text>
                <Text variant="bodySm" color="subdued">
                  Promise&lt;Response&gt; - Standard fetch Response object
                </Text>
              </VerticalStack>
            </VerticalStack>
            <div style={{ flex: 1 }}>
              <CodeBlock language="typescript">
{`const response = await mantle.authenticatedFetch('/api/endpoint', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ data: 'value' }),
});
// Returns: Promise<Response>`}
              </CodeBlock>
            </div>
          </HorizontalStack>
        </VerticalStack>
      </Card>

      {/* Navigation */}
      <Card>
        <VerticalStack gap="4">
          <Text variant="headingMd">Navigation</Text>
          <VerticalStack gap="4">
            <HorizontalStack gap="4" align="start">
              <VerticalStack gap="2" style={{ flex: 1 }}>
                <Text variant="bodyMd" fontWeight="semibold">
                  setPath(path)
                </Text>
                <Text variant="bodySm" color="subdued">
                  Navigate to a path (updates both iframe and parent URLs). This keeps the Mantle parent window URL synchronized with your app's navigation.
                </Text>
              </VerticalStack>
              <div style={{ flex: 1 }}>
                <CodeBlock language="typescript">
{`await mantle.setPath('/my-page');`}
                </CodeBlock>
              </div>
            </HorizontalStack>

            <HorizontalStack gap="4" align="start">
              <VerticalStack gap="2" style={{ flex: 1 }}>
                <Text variant="bodyMd" fontWeight="semibold">
                  redirect(url)
                </Text>
                <Text variant="bodySm" color="subdued">
                  Redirect to a URL. Can be used for external URLs or internal navigation.
                </Text>
              </VerticalStack>
              <div style={{ flex: 1 }}>
                <CodeBlock language="typescript">
{`await mantle.redirect('https://example.com');`}
                </CodeBlock>
              </div>
            </HorizontalStack>

            <HorizontalStack gap="4" align="start">
              <VerticalStack gap="2" style={{ flex: 1 }}>
                <Text variant="bodyMd" fontWeight="semibold">
                  openInNewTab(url)
                </Text>
                <Text variant="bodySm" color="subdued">
                  Open URL in a new browser tab. Useful for external links or documentation.
                </Text>
              </VerticalStack>
              <div style={{ flex: 1 }}>
                <CodeBlock language="typescript">
{`await mantle.openInNewTab('https://example.com');`}
                </CodeBlock>
              </div>
            </HorizontalStack>
          </VerticalStack>
        </VerticalStack>
      </Card>

      {/* Toast Notifications */}
      <Card>
        <VerticalStack gap="4">
          <Text variant="headingMd">Toast Notifications</Text>
          <VerticalStack gap="4">
            <HorizontalStack gap="4" align="start">
              <VerticalStack gap="2" style={{ flex: 1 }}>
                <Text variant="bodyMd" fontWeight="semibold">
                  showSuccess(message)
                </Text>
                <Text variant="bodySm" color="subdued">
                  Show a success toast notification. Displays at the top of the Mantle interface and automatically dismisses after a few seconds.
                </Text>
              </VerticalStack>
              <div style={{ flex: 1 }}>
                <CodeBlock language="typescript">
{`mantle.showSuccess('Operation completed!');`}
                </CodeBlock>
              </div>
            </HorizontalStack>

            <HorizontalStack gap="4" align="start">
              <VerticalStack gap="2" style={{ flex: 1 }}>
                <Text variant="bodyMd" fontWeight="semibold">
                  showError(message)
                </Text>
                <Text variant="bodySm" color="subdued">
                  Show an error toast notification. Use this to display error messages to users.
                </Text>
              </VerticalStack>
              <div style={{ flex: 1 }}>
                <CodeBlock language="typescript">
{`mantle.showError('Something went wrong');`}
                </CodeBlock>
              </div>
            </HorizontalStack>

            <HorizontalStack gap="4" align="start">
              <VerticalStack gap="2" style={{ flex: 1 }}>
                <Text variant="bodyMd" fontWeight="semibold">
                  showToast(message, status?)
                </Text>
                <Text variant="bodySm" color="subdued">
                  Show a toast with custom status. Use this for more control over toast appearance.
                </Text>
                <VerticalStack gap="1" style={{ marginTop: "0.5rem" }}>
                  <Text variant="bodySm" color="subdued">
                    • <code>status</code> - "success" | "error" (optional)
                  </Text>
                </VerticalStack>
              </VerticalStack>
              <div style={{ flex: 1 }}>
                <CodeBlock language="typescript">
{`mantle.showToast('Custom message', 'success');
mantle.showToast('Custom message', 'error');`}
                </CodeBlock>
              </div>
            </HorizontalStack>
          </VerticalStack>
        </VerticalStack>
      </Card>

      {/* Page Management */}
      <Card>
        <VerticalStack gap="4">
          <Text variant="headingMd">Page Management</Text>
          <VerticalStack gap="4">
            <HorizontalStack gap="4" align="start">
              <VerticalStack gap="2" style={{ flex: 1 }}>
                <Text variant="bodyMd" fontWeight="semibold">
                  setPage(options)
                </Text>
                <Text variant="bodySm" color="subdued">
                  Set page title and subtitle in the Mantle interface. Updates the page header displayed in the parent window.
                </Text>
                <VerticalStack gap="1" style={{ marginTop: "0.5rem" }}>
                  <Text variant="bodySm" color="subdued">
                    • <code>title</code> - Page title (string)
                  </Text>
                  <Text variant="bodySm" color="subdued">
                    • <code>subtitle</code> - Page subtitle (string, optional)
                  </Text>
                </VerticalStack>
              </VerticalStack>
              <div style={{ flex: 1 }}>
                <CodeBlock language="typescript">
{`await mantle.setPage({
  title: 'My Page',
  subtitle: 'Page description',
});`}
                </CodeBlock>
              </div>
            </HorizontalStack>

            <HorizontalStack gap="4" align="start">
              <VerticalStack gap="2" style={{ flex: 1 }}>
                <Text variant="bodyMd" fontWeight="semibold">
                  setPagePrimaryAction(action)
                </Text>
                <Text variant="bodySm" color="subdued">
                  Set the primary action button in the page header. This appears as a prominent button in the Mantle page header.
                </Text>
                <VerticalStack gap="1" style={{ marginTop: "0.5rem" }}>
                  <Text variant="bodySm" color="subdued">
                    • <code>label</code> - Button label (string)
                  </Text>
                  <Text variant="bodySm" color="subdued">
                    • <code>onClick</code> - Click handler function
                  </Text>
                </VerticalStack>
              </VerticalStack>
              <div style={{ flex: 1 }}>
                <CodeBlock language="typescript">
{`await mantle.setPagePrimaryAction({
  label: 'Save',
  onClick: () => handleSave(),
});`}
                </CodeBlock>
              </div>
            </HorizontalStack>
          </VerticalStack>
        </VerticalStack>
      </Card>

      {/* Save Bar */}
      <Card>
        <VerticalStack gap="4">
          <Text variant="headingMd">Save Bar</Text>
          <VerticalStack gap="4">
            <HorizontalStack gap="4" align="start">
              <VerticalStack gap="2" style={{ flex: 1 }}>
                <Text variant="bodyMd" fontWeight="semibold">
                  showSaveBar()
                </Text>
                <Text variant="bodySm" color="subdued">
                  Show the save bar at the bottom of the page. Use this to indicate unsaved changes.
                </Text>
              </VerticalStack>
              <div style={{ flex: 1 }}>
                <CodeBlock language="typescript">
{`await mantle.showSaveBar();`}
                </CodeBlock>
              </div>
            </HorizontalStack>

            <HorizontalStack gap="4" align="start">
              <VerticalStack gap="2" style={{ flex: 1 }}>
                <Text variant="bodyMd" fontWeight="semibold">
                  hideSaveBar()
                </Text>
                <Text variant="bodySm" color="subdued">
                  Hide the save bar. Call this after changes are saved or discarded.
                </Text>
              </VerticalStack>
              <div style={{ flex: 1 }}>
                <CodeBlock language="typescript">
{`await mantle.hideSaveBar();`}
                </CodeBlock>
              </div>
            </HorizontalStack>

            <HorizontalStack gap="4" align="start">
              <VerticalStack gap="2" style={{ flex: 1 }}>
                <Text variant="bodyMd" fontWeight="semibold">
                  setSaveBarOptions(options)
                </Text>
                <Text variant="bodySm" color="subdued">
                  Configure the save bar with custom message and actions. Use this to customize the save bar appearance and behavior.
                </Text>
                <VerticalStack gap="1" style={{ marginTop: "0.5rem" }}>
                  <Text variant="bodySm" color="subdued">
                    • <code>message</code> - Message to display (string)
                  </Text>
                  <Text variant="bodySm" color="subdued">
                    • <code>discardAction</code> - Discard button config (object)
                  </Text>
                  <Text variant="bodySm" color="subdued">
                    • <code>saveAction</code> - Save button config (object)
                  </Text>
                </VerticalStack>
              </VerticalStack>
              <div style={{ flex: 1 }}>
                <CodeBlock language="typescript">
{`await mantle.setSaveBarOptions({
  message: 'You have unsaved changes',
  discardAction: { label: 'Discard' },
  saveAction: { label: 'Save' },
});`}
                </CodeBlock>
              </div>
            </HorizontalStack>
          </VerticalStack>
        </VerticalStack>
      </Card>

      {/* Modal Management */}
      <Card>
        <VerticalStack gap="4">
          <Text variant="headingMd">Modal Management</Text>
          <VerticalStack gap="4">
            <HorizontalStack gap="4" align="start">
              <VerticalStack gap="2" style={{ flex: 1 }}>
                <Text variant="bodyMd" fontWeight="semibold">
                  closeModal()
                </Text>
                <Text variant="bodySm" color="subdued">
                  Close the current modal (if in modal context). This is a convenience method that sends the appropriate message to close the modal.
                </Text>
              </VerticalStack>
              <div style={{ flex: 1 }}>
                <CodeBlock language="typescript">
{`await mantle.closeModal();`}
                </CodeBlock>
              </div>
            </HorizontalStack>

            <HorizontalStack gap="4" align="start">
              <VerticalStack gap="2" style={{ flex: 1 }}>
                <Text variant="bodyMd" fontWeight="semibold">
                  showModalBackgroundOverlay()
                </Text>
                <Text variant="bodySm" color="subdued">
                  Show a background overlay behind modals. Useful for creating layered modal experiences.
                </Text>
              </VerticalStack>
              <div style={{ flex: 1 }}>
                <CodeBlock language="typescript">
{`await mantle.showModalBackgroundOverlay();`}
                </CodeBlock>
              </div>
            </HorizontalStack>

            <HorizontalStack gap="4" align="start">
              <VerticalStack gap="2" style={{ flex: 1 }}>
                <Text variant="bodyMd" fontWeight="semibold">
                  hideModalBackgroundOverlay()
                </Text>
                <Text variant="bodySm" color="subdued">
                  Hide the modal background overlay.
                </Text>
              </VerticalStack>
              <div style={{ flex: 1 }}>
                <CodeBlock language="typescript">
{`await mantle.hideModalBackgroundOverlay();`}
                </CodeBlock>
              </div>
            </HorizontalStack>
          </VerticalStack>
        </VerticalStack>
      </Card>

      {/* Asset Library */}
      <Card>
        <VerticalStack gap="4">
          <Text variant="headingMd">Asset Library</Text>
          <VerticalStack gap="4">
            <HorizontalStack gap="4" align="start">
              <VerticalStack gap="2" style={{ flex: 1 }}>
                <Text variant="bodyMd" fontWeight="semibold">
                  showAssetLibrary()
                </Text>
                <Text variant="bodySm" color="subdued">
                  Show the Mantle asset library. Allows users to select assets from their Mantle account.
                </Text>
              </VerticalStack>
              <div style={{ flex: 1 }}>
                <CodeBlock language="typescript">
{`await mantle.showAssetLibrary();`}
                </CodeBlock>
              </div>
            </HorizontalStack>

            <HorizontalStack gap="4" align="start">
              <VerticalStack gap="2" style={{ flex: 1 }}>
                <Text variant="bodyMd" fontWeight="semibold">
                  hideAssetLibrary()
                </Text>
                <Text variant="bodySm" color="subdued">
                  Hide the asset library.
                </Text>
              </VerticalStack>
              <div style={{ flex: 1 }}>
                <CodeBlock language="typescript">
{`await mantle.hideAssetLibrary();`}
                </CodeBlock>
              </div>
            </HorizontalStack>
          </VerticalStack>
        </VerticalStack>
      </Card>

      {/* Properties */}
      <Card>
        <VerticalStack gap="4">
          <Text variant="headingMd">Read-Only Properties</Text>
          <VerticalStack gap="3">
            <HorizontalStack gap="4" align="start">
              <VerticalStack gap="2" style={{ flex: 1 }}>
                <Text variant="bodyMd" fontWeight="semibold">
                  isReady
                </Text>
                <Text variant="bodySm" color="subdued">
                  True when App Bridge is ready to receive messages. Check this before making API calls.
                </Text>
              </VerticalStack>
              <div style={{ flex: 1 }}>
                <CodeBlock language="typescript">
{`if (mantle.isReady) {
  // Safe to make API calls
}`}
                </CodeBlock>
              </div>
            </HorizontalStack>

            <HorizontalStack gap="4" align="start">
              <VerticalStack gap="2" style={{ flex: 1 }}>
                <Text variant="bodyMd" fontWeight="semibold">
                  initialized
                </Text>
                <Text variant="bodySm" color="subdued">
                  True after receiving setup message from parent. This indicates full initialization is complete.
                </Text>
              </VerticalStack>
              <div style={{ flex: 1 }}>
                <CodeBlock language="typescript">
{`if (mantle.initialized) {
  // Fully initialized and ready
}`}
                </CodeBlock>
              </div>
            </HorizontalStack>

            <HorizontalStack gap="4" align="start">
              <VerticalStack gap="2" style={{ flex: 1 }}>
                <Text variant="bodyMd" fontWeight="semibold">
                  currentSession
                </Text>
                <Text variant="bodySm" color="subdued">
                  Current session token (string | null). This is the JWT token used for authenticated requests.
                </Text>
              </VerticalStack>
              <div style={{ flex: 1 }}>
                <CodeBlock language="typescript">
{`const token = mantle.currentSession;
// Returns: string | null`}
                </CodeBlock>
              </div>
            </HorizontalStack>

            <HorizontalStack gap="4" align="start">
              <VerticalStack gap="2" style={{ flex: 1 }}>
                <Text variant="bodyMd" fontWeight="semibold">
                  currentUser
                </Text>
                <Text variant="bodySm" color="subdued">
                  Current user object (MantleUser | null). Contains user id, name, email, and roles.
                </Text>
              </VerticalStack>
              <div style={{ flex: 1 }}>
                <CodeBlock language="typescript">
{`const user = mantle.currentUser;
// Returns: MantleUser | null`}
                </CodeBlock>
              </div>
            </HorizontalStack>

            <HorizontalStack gap="4" align="start">
              <VerticalStack gap="2" style={{ flex: 1 }}>
                <Text variant="bodyMd" fontWeight="semibold">
                  currentOrganization
                </Text>
                <Text variant="bodySm" color="subdued">
                  Current organization object. Contains organization id, name, and other properties.
                </Text>
              </VerticalStack>
              <div style={{ flex: 1 }}>
                <CodeBlock language="typescript">
{`const org = mantle.currentOrganization;
// Returns: MantleOrganization | null`}
                </CodeBlock>
              </div>
            </HorizontalStack>

            <HorizontalStack gap="4" align="start">
              <VerticalStack gap="2" style={{ flex: 1 }}>
                <Text variant="bodyMd" fontWeight="semibold">
                  currentOrganizationId
                </Text>
                <Text variant="bodySm" color="subdued">
                  Current organization ID (string | null). Quick access to the organization identifier.
                </Text>
              </VerticalStack>
              <div style={{ flex: 1 }}>
                <CodeBlock language="typescript">
{`const orgId = mantle.currentOrganizationId;
// Returns: string | null`}
                </CodeBlock>
              </div>
            </HorizontalStack>
          </VerticalStack>
        </VerticalStack>
      </Card>
    </VerticalStack>
  );
}
