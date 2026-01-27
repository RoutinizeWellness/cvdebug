import { useTheme } from "next-themes"
import { Toaster as Sonner, ToasterProps } from "sonner"
// ...

<ErrorBoundary>
  <ClerkProvider ...>
    <ConvexProviderWithClerk ...>
      <ThemeProvider ...>
        <I18nProvider>
          <BrowserRouter>
            <App />
            <Toaster />
          </BrowserRouter>
        </I18nProvider>
      </ThemeProvider>
    </ConvexProviderWithClerk>
  </ClerkProvider>
</ErrorBoundary>