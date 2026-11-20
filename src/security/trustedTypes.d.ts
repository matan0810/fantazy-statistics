// Trusted Types, as far as the site uses them (not yet in TypeScript's DOM library).

interface TrustedScriptURL {
  readonly brand: 'TrustedScriptURL';
}

interface TrustedTypePolicy {
  createScriptURL(input: string): TrustedScriptURL;
}

interface TrustedTypePolicyFactory {
  createPolicy(
    name: string,
    rules: { createScriptURL: (input: string) => string },
  ): TrustedTypePolicy;
}

interface Window {
  readonly trustedTypes?: TrustedTypePolicyFactory;
}

interface ServiceWorkerContainer {
  register(
    scriptURL: TrustedScriptURL,
    options?: RegistrationOptions,
  ): Promise<ServiceWorkerRegistration>;
}
