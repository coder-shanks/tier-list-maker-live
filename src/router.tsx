import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  redirect,
} from "@tanstack/react-router";
import { TooltipProvider } from "./components/ui/tooltip";
import LandingPage from "./components/landing/LandingPage";
import TierStudio from "./components/studio/TierStudio";

// Root Route
export const rootRoute = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <TooltipProvider delay={0}>
      <Outlet />
    </TooltipProvider>
  );
}

// Home / Landing Page Route
export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: LandingPage,
});

// Template Studio Route - the single unified workspace route
export const templateRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/templates/$templateId",
  component: TemplateRouteComponent,
});

function TemplateRouteComponent() {
  const { templateId } = templateRoute.useParams();
  return <TierStudio initialTemplateId={templateId} />;
}

// Studio redirect route -> redirects to default template (/templates/games)
export const studioRedirectRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/studio",
  beforeLoad: () => {
    throw redirect({
      to: "/templates/$templateId",
      params: { templateId: "games" },
    });
  },
});

// Clean Route Tree
export const routeTree = rootRoute.addChildren([
  indexRoute,
  templateRoute,
  studioRedirectRoute,
]);

// Create router
export const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  scrollRestoration: true,
});

// Register router for full TypeScript type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
