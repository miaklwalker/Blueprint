// src/mocks/next-navigation.ts
// Mock for Next.js navigation to prevent build errors with nextstepjs

export const useRouter = () => {
  return {
    push: () => {},
    replace: () => {},
    prefetch: () => {},
    back: () => {},
    forward: () => {},
    refresh: () => {},
  };
};

export const usePathname = () => {
  return '';
};

export const useSearchParams = () => {
  return new URLSearchParams();
};

export const useParams = () => {
  return {};
};