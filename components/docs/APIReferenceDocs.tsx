"use client";

import CodeBlock from "@/components/CodeBlock";
import { Card, Stack, Text } from "@heymantle/litho";

export default function APIReferenceDocs() {
  return (
    <Stack gap="6" className="w-full">
      {/* Session Management */}
      <Card title="Session Management" padded>
        <Stack gap="6">
          <div className="grid grid-cols-2 gap-6 w-full items-start">
            <Stack gap="2">
              <Text variant="bodyMd" fontWeight="semibold">
                requestSession()
              </Text>
              <Text variant="bodySm" color="subdued">
                Request session data from parent window with intelligent
                caching. Returns a Promise that resolves to the session token
                (JWT string).
              </Text>
            </Stack>
            <Stack gap="4">
              <CodeBlock language="typescript">
                {`const token = await mantle.requestSession();
// Returns: Promise<string> - Session token (JWT)`}
              </CodeBlock>
            </Stack>
          </div>

          <div className="grid grid-cols-2 gap-6 w-full items-start">
            <Stack gap="2">
              <Text variant="bodyMd" fontWeight="semibold">
                getSessionToken()
              </Text>
              <Text variant="bodySm" color="subdued">
                Get session token - simple async method that returns just the
                token string.
              </Text>
            </Stack>
            <Stack gap="4">
              <CodeBlock language="typescript">
                {`const token = await mantle.getSessionToken();
// Returns: Promise<string> - Session token`}
              </CodeBlock>
            </Stack>
          </div>
        </Stack>
      </Card>

      {/* User & Organization */}
      <Card title="User & Organization" padded>
        <Stack gap="6">
          <div className="grid grid-cols-2 gap-6 w-full items-start">
            <Stack gap="2">
              <Text variant="bodyMd" fontWeight="semibold">
                getUser()
              </Text>
              <Text variant="bodySm" color="subdued">
                Get user data with intelligent caching. Returns a Promise that
                resolves to the user object with id, name, email, and roles.
              </Text>
            </Stack>
            <Stack gap="4">
              <CodeBlock language="typescript">
                {`const user = await mantle.getUser();
// Returns: Promise<MantleUser>`}
              </CodeBlock>
            </Stack>
          </div>

          <div className="grid grid-cols-2 gap-6 w-full items-start">
            <Stack gap="2">
              <Text variant="bodyMd" fontWeight="semibold">
                getOrganization()
              </Text>
              <Text variant="bodySm" color="subdued">
                Get organization data with intelligent caching. Returns a
                Promise that resolves to the organization object with id, name,
                and other properties.
              </Text>
            </Stack>
            <Stack gap="4">
              <CodeBlock language="typescript">
                {`const org = await mantle.getOrganization();
// Returns: Promise<MantleOrganization>`}
              </CodeBlock>
            </Stack>
          </div>
        </Stack>
      </Card>

      {/* Authenticated Fetch */}
      <Card title="Authenticated Fetch" padded>
        <div className="grid grid-cols-2 gap-6 w-full items-start">
          <Stack gap="2">
            <Text variant="bodyMd" fontWeight="semibold">
              authenticatedFetch(url, options?)
            </Text>
            <Text variant="bodySm" color="subdued">
              Authenticated fetch helper that automatically includes Bearer
              token authorization. This method wraps the native fetch() API and
              automatically handles token management, expiry, and retries.
            </Text>
            <Stack gap="1" style={{ marginTop: "0.5rem" }}>
              <Text variant="bodySm" fontWeight="semibold">
                Parameters:
              </Text>
              <Text variant="bodySm" color="subdued">
                • <code>url</code> - The URL to fetch (string)
              </Text>
              <Text variant="bodySm" color="subdued">
                • <code>options</code> - Standard fetch options (RequestInit,
                optional)
              </Text>
              <Text
                variant="bodySm"
                fontWeight="semibold"
                style={{ marginTop: "0.5rem" }}
              >
                Returns:
              </Text>
              <Text variant="bodySm" color="subdued">
                Promise&lt;Response&gt; - Standard fetch Response object
              </Text>
            </Stack>
          </Stack>
          <Stack gap="4">
            <CodeBlock language="typescript">
              {`const response = await mantle.authenticatedFetch('/api/endpoint', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ data: 'value' }),
});
// Returns: Promise<Response>`}
            </CodeBlock>
          </Stack>
        </div>
      </Card>

      {/* Navigation */}
      <Card title="Navigation" padded>
        <Stack gap="6">
          <div className="grid grid-cols-2 gap-6 w-full items-start">
            <Stack gap="2">
              <Text variant="bodyMd" fontWeight="semibold">
                setPath(path)
              </Text>
              <Text variant="bodySm" color="subdued">
                Navigate to a path (updates both iframe and parent URLs). This
                keeps the Mantle parent window URL synchronized with your app's
                navigation.
              </Text>
            </Stack>
            <Stack gap="4">
              <CodeBlock language="typescript">
                {`await mantle.setPath('/my-page');`}
              </CodeBlock>
            </Stack>
          </div>

          <div className="grid grid-cols-2 gap-6 w-full items-start">
            <Stack gap="2">
              <Text variant="bodyMd" fontWeight="semibold">
                redirect(url)
              </Text>
              <Text variant="bodySm" color="subdued">
                Redirect to a URL. Can be used for external URLs or internal
                navigation.
              </Text>
            </Stack>
            <Stack gap="4">
              <CodeBlock language="typescript">
                {`await mantle.redirect('https://example.com');`}
              </CodeBlock>
            </Stack>
          </div>

          <div className="grid grid-cols-2 gap-6 w-full items-start">
            <Stack gap="2">
              <Text variant="bodyMd" fontWeight="semibold">
                openInNewTab(url)
              </Text>
              <Text variant="bodySm" color="subdued">
                Open URL in a new browser tab. Useful for external links or
                documentation.
              </Text>
            </Stack>
            <Stack gap="4">
              <CodeBlock language="typescript">
                {`await mantle.openInNewTab('https://example.com');`}
              </CodeBlock>
            </Stack>
          </div>
        </Stack>
      </Card>

      {/* Toast Notifications */}
      <Card title="Toast Notifications" padded>
        <Stack gap="6">
          <div className="grid grid-cols-2 gap-6 w-full items-start">
            <Stack gap="2">
              <Text variant="bodyMd" fontWeight="semibold">
                showSuccess(message)
              </Text>
              <Text variant="bodySm" color="subdued">
                Show a success toast notification. Displays at the top of the
                Mantle interface and automatically dismisses after a few
                seconds.
              </Text>
            </Stack>
            <Stack gap="4">
              <CodeBlock language="typescript">
                {`mantle.showSuccess('Operation completed!');`}
              </CodeBlock>
            </Stack>
          </div>

          <div className="grid grid-cols-2 gap-6 w-full items-start">
            <Stack gap="2">
              <Text variant="bodyMd" fontWeight="semibold">
                showError(message)
              </Text>
              <Text variant="bodySm" color="subdued">
                Show an error toast notification. Use this to display error
                messages to users.
              </Text>
            </Stack>
            <Stack gap="4">
              <CodeBlock language="typescript">
                {`mantle.showError('Something went wrong');`}
              </CodeBlock>
            </Stack>
          </div>

          <div className="grid grid-cols-2 gap-6 w-full items-start">
            <Stack gap="2">
              <Text variant="bodyMd" fontWeight="semibold">
                showToast(message, status?)
              </Text>
              <Text variant="bodySm" color="subdued">
                Show a toast with custom status. Use this for more control over
                toast appearance.
              </Text>
              <Stack gap="1" style={{ marginTop: "0.5rem" }}>
                <Text variant="bodySm" color="subdued">
                  • <code>status</code> - "success" | "error" (optional)
                </Text>
              </Stack>
            </Stack>
            <Stack gap="4">
              <CodeBlock language="typescript">
                {`mantle.showToast('Custom message', 'success');
mantle.showToast('Custom message', 'error');`}
              </CodeBlock>
            </Stack>
          </div>
        </Stack>
      </Card>

      {/* Page Management */}
      <Card title="Page Management" padded>
        <Stack gap="6">
          <div className="grid grid-cols-2 gap-6 w-full items-start">
            <Stack gap="2">
              <Text variant="bodyMd" fontWeight="semibold">
                setPage(options)
              </Text>
              <Text variant="bodySm" color="subdued">
                Set page title and subtitle in the Mantle interface. Updates the
                page header displayed in the parent window.
              </Text>
              <Stack gap="1" style={{ marginTop: "0.5rem" }}>
                <Text variant="bodySm" color="subdued">
                  • <code>title</code> - Page title (string)
                </Text>
                <Text variant="bodySm" color="subdued">
                  • <code>subtitle</code> - Page subtitle (string, optional)
                </Text>
              </Stack>
            </Stack>
            <Stack gap="4">
              <CodeBlock language="typescript">
                {`await mantle.setPage({
  title: 'My Page',
  subtitle: 'Page description',
});`}
              </CodeBlock>
            </Stack>
          </div>

          <div className="grid grid-cols-2 gap-6 w-full items-start">
            <Stack gap="2">
              <Text variant="bodyMd" fontWeight="semibold">
                setPagePrimaryAction(action)
              </Text>
              <Text variant="bodySm" color="subdued">
                Set the primary action button in the page header. This appears
                as a prominent button in the Mantle page header.
              </Text>
              <Stack gap="1" style={{ marginTop: "0.5rem" }}>
                <Text variant="bodySm" color="subdued">
                  • <code>label</code> - Button label (string)
                </Text>
                <Text variant="bodySm" color="subdued">
                  • <code>onClick</code> - Click handler function
                </Text>
              </Stack>
            </Stack>
            <Stack gap="4">
              <CodeBlock language="typescript">
                {`await mantle.setPagePrimaryAction({
  label: 'Save',
  onClick: () => handleSave(),
});`}
              </CodeBlock>
            </Stack>
          </div>
        </Stack>
      </Card>

      {/* Save Bar */}
      <Card title="Save Bar" padded>
        <Stack gap="6">
          <div className="grid grid-cols-2 gap-6 w-full items-start">
            <Stack gap="2">
              <Text variant="bodyMd" fontWeight="semibold">
                showSaveBar()
              </Text>
              <Text variant="bodySm" color="subdued">
                Show the save bar at the bottom of the page. Use this to
                indicate unsaved changes.
              </Text>
            </Stack>
            <Stack gap="4">
              <CodeBlock language="typescript">
                {`await mantle.showSaveBar();`}
              </CodeBlock>
            </Stack>
          </div>

          <div className="grid grid-cols-2 gap-6 w-full items-start">
            <Stack gap="2">
              <Text variant="bodyMd" fontWeight="semibold">
                hideSaveBar()
              </Text>
              <Text variant="bodySm" color="subdued">
                Hide the save bar. Call this after changes are saved or
                discarded.
              </Text>
            </Stack>
            <Stack gap="4">
              <CodeBlock language="typescript">
                {`await mantle.hideSaveBar();`}
              </CodeBlock>
            </Stack>
          </div>

          <div className="grid grid-cols-2 gap-6 w-full items-start">
            <Stack gap="2">
              <Text variant="bodyMd" fontWeight="semibold">
                setSaveBarOptions(options)
              </Text>
              <Text variant="bodySm" color="subdued">
                Configure the save bar with custom message and actions. Use this
                to customize the save bar appearance and behavior.
              </Text>
              <Stack gap="1" style={{ marginTop: "0.5rem" }}>
                <Text variant="bodySm" color="subdued">
                  • <code>message</code> - Message to display (string)
                </Text>
                <Text variant="bodySm" color="subdued">
                  • <code>discardAction</code> - Discard button config (object)
                </Text>
                <Text variant="bodySm" color="subdued">
                  • <code>saveAction</code> - Save button config (object)
                </Text>
              </Stack>
            </Stack>
            <Stack gap="4">
              <CodeBlock language="typescript">
                {`await mantle.setSaveBarOptions({
  message: 'You have unsaved changes',
  discardAction: { label: 'Discard' },
  saveAction: { label: 'Save' },
});`}
              </CodeBlock>
            </Stack>
          </div>
        </Stack>
      </Card>

      {/* Modal Management */}
      <Card title="Modal Management" padded>
        <Stack gap="6">
          <div className="grid grid-cols-2 gap-6 w-full items-start">
            <Stack gap="2">
              <Text variant="bodyMd" fontWeight="semibold">
                closeModal()
              </Text>
              <Text variant="bodySm" color="subdued">
                Close the current modal (if in modal context). This is a
                convenience method that sends the appropriate message to close
                the modal.
              </Text>
            </Stack>
            <Stack gap="4">
              <CodeBlock language="typescript">
                {`await mantle.closeModal();`}
              </CodeBlock>
            </Stack>
          </div>

          <div className="grid grid-cols-2 gap-6 w-full items-start">
            <Stack gap="2">
              <Text variant="bodyMd" fontWeight="semibold">
                showModalBackgroundOverlay()
              </Text>
              <Text variant="bodySm" color="subdued">
                Show a background overlay behind modals. Useful for creating
                layered modal experiences.
              </Text>
            </Stack>
            <Stack gap="4">
              <CodeBlock language="typescript">
                {`await mantle.showModalBackgroundOverlay();`}
              </CodeBlock>
            </Stack>
          </div>

          <div className="grid grid-cols-2 gap-6 w-full items-start">
            <Stack gap="2">
              <Text variant="bodyMd" fontWeight="semibold">
                hideModalBackgroundOverlay()
              </Text>
              <Text variant="bodySm" color="subdued">
                Hide the modal background overlay.
              </Text>
            </Stack>
            <Stack gap="4">
              <CodeBlock language="typescript">
                {`await mantle.hideModalBackgroundOverlay();`}
              </CodeBlock>
            </Stack>
          </div>
        </Stack>
      </Card>

      {/* Asset Library */}
      <Card title="Asset Library" padded>
        <Stack gap="6">
          <div className="grid grid-cols-2 gap-6 w-full items-start">
            <Stack gap="2">
              <Text variant="bodyMd" fontWeight="semibold">
                showAssetLibrary()
              </Text>
              <Text variant="bodySm" color="subdued">
                Show the Mantle asset library. Allows users to select assets
                from their Mantle account.
              </Text>
            </Stack>
            <Stack gap="4">
              <CodeBlock language="typescript">
                {`await mantle.showAssetLibrary();`}
              </CodeBlock>
            </Stack>
          </div>

          <div className="grid grid-cols-2 gap-6 w-full items-start">
            <Stack gap="2">
              <Text variant="bodyMd" fontWeight="semibold">
                hideAssetLibrary()
              </Text>
              <Text variant="bodySm" color="subdued">
                Hide the asset library.
              </Text>
            </Stack>
            <Stack gap="4">
              <CodeBlock language="typescript">
                {`await mantle.hideAssetLibrary();`}
              </CodeBlock>
            </Stack>
          </div>
        </Stack>
      </Card>

      {/* Properties */}
      <Card title="Read-Only Properties" padded>
        <Stack gap="6">
          <div className="grid grid-cols-2 gap-6 w-full items-start">
            <Stack gap="2">
              <Text variant="bodyMd" fontWeight="semibold">
                isReady
              </Text>
              <Text variant="bodySm" color="subdued">
                True when App Bridge is ready to receive messages. Check this
                before making API calls.
              </Text>
            </Stack>
            <Stack gap="4">
              <CodeBlock language="typescript">
                {`if (mantle.isReady) {
  // Safe to make API calls
}`}
              </CodeBlock>
            </Stack>
          </div>

          <div className="grid grid-cols-2 gap-6 w-full items-start">
            <Stack gap="2">
              <Text variant="bodyMd" fontWeight="semibold">
                initialized
              </Text>
              <Text variant="bodySm" color="subdued">
                True after receiving setup message from parent. This indicates
                full initialization is complete.
              </Text>
            </Stack>
            <Stack gap="4">
              <CodeBlock language="typescript">
                {`if (mantle.initialized) {
  // Fully initialized and ready
}`}
              </CodeBlock>
            </Stack>
          </div>

          <div className="grid grid-cols-2 gap-6 w-full items-start">
            <Stack gap="2">
              <Text variant="bodyMd" fontWeight="semibold">
                currentSession
              </Text>
              <Text variant="bodySm" color="subdued">
                Current session token (string | null). This is the JWT token
                used for authenticated requests.
              </Text>
            </Stack>
            <Stack gap="4">
              <CodeBlock language="typescript">
                {`const token = mantle.currentSession;
// Returns: string | null`}
              </CodeBlock>
            </Stack>
          </div>

          <div className="grid grid-cols-2 gap-6 w-full items-start">
            <Stack gap="2">
              <Text variant="bodyMd" fontWeight="semibold">
                currentUser
              </Text>
              <Text variant="bodySm" color="subdued">
                Current user object (MantleUser | null). Contains user id, name,
                email, and roles.
              </Text>
            </Stack>
            <Stack gap="4">
              <CodeBlock language="typescript">
                {`const user = mantle.currentUser;
// Returns: MantleUser | null`}
              </CodeBlock>
            </Stack>
          </div>

          <div className="grid grid-cols-2 gap-6 w-full items-start">
            <Stack gap="2">
              <Text variant="bodyMd" fontWeight="semibold">
                currentOrganization
              </Text>
              <Text variant="bodySm" color="subdued">
                Current organization object. Contains organization id, name, and
                other properties.
              </Text>
            </Stack>
            <Stack gap="4">
              <CodeBlock language="typescript">
                {`const org = mantle.currentOrganization;
// Returns: MantleOrganization | null`}
              </CodeBlock>
            </Stack>
          </div>

          <div className="grid grid-cols-2 gap-6 w-full items-start">
            <Stack gap="2">
              <Text variant="bodyMd" fontWeight="semibold">
                currentOrganizationId
              </Text>
              <Text variant="bodySm" color="subdued">
                Current organization ID (string | null). Quick access to the
                organization identifier.
              </Text>
            </Stack>
            <Stack gap="4">
              <CodeBlock language="typescript">
                {`const orgId = mantle.currentOrganizationId;
// Returns: string | null`}
              </CodeBlock>
            </Stack>
          </div>
        </Stack>
      </Card>
    </Stack>
  );
}
