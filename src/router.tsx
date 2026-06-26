import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // cache for 5 min — avoids refetch on every page visit
        gcTime: 10 * 60 * 1000,   // keep unused data for 10 min
        refetchOnWindowFocus: false, // don't refetch when tab regains focus
        retry: 1,
      },
    },
  });

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreload: "intent", // prefetch route data when user hovers a link
    defaultPreloadStaleTime: 30_000, // treat prefetched data as fresh for 30 s
  });

  return router;
};
