import { createBrowserRouter } from "react-router-dom";
import { Suspense, lazy } from "react";
import LoadingOverlay from "../components/LoadingOverlay";
import ProtectedRoute from "../components/ProtectedRoute";
import PublicRoute from "../components/PublicRoute";

// ✅ Lazy Imports
const MainLayout = lazy(() => import("../layout/MainLayout"));
const Home = lazy(() => import("../pages/Home"));
const Events = lazy(() => import("../pages/Events"));
const Contact = lazy(() => import("../pages/Contact"));
const About = lazy(() => import("../pages/About"));
const Login = lazy(() => import("../pages/Login"));
const Register = lazy(() => import("../pages/Register"));
const paymentSuccess = lazy(() => import("../pages/payment/paymentSuccess"));
const paymentCancel = lazy(() => import("../pages/payment/paymentCancel"));
const ErrorPage = lazy(() => import("../pages/ErrorPage"));
const Profile = lazy(() => import("../pages/Profile"));
const MyBookings = lazy(() => import("../pages/attendee/MyBookings"));
const BookingDetails = lazy(() => import("../pages/attendee/BookingDetails"));
const ViewEventDetails = lazy(() =>
  import("../pages/organizer/ViewEventDetails")
);
const OrganizerDashboard = lazy(() =>
  import("../pages/organizer/OrganizerDashboard")
);
const OrganizerMyEvents = lazy(() =>
  import("../pages/organizer/OrganizerMyEvents")
);
const OrganizerAnalytics = lazy(() =>
  import("../pages/organizer/OrganizerAnalytics")
);
const TicketScanner = lazy(() => import("../pages/organizer/TicketScanner"));

// ✅ Wrapper component for Suspense fallback
const withSuspense = (Component) => (
  <Suspense fallback={<LoadingOverlay />}>
    <Component />
  </Suspense>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: withSuspense(MainLayout),
    errorElement: withSuspense(ErrorPage),
    children: [
      {
        index: true,
        element: (
          <PublicRoute blockedRoles={["organizer"]}>
            {withSuspense(Home)}
          </PublicRoute>
        ),
      },
      {
        path: "events",
        element: (
          <PublicRoute blockedRoles={["organizer"]}>
            {withSuspense(Events)}
          </PublicRoute>
        ),
      },
      {
        path: "contact",
        element: (
          <PublicRoute blockedRoles={["organizer"]}>
            {withSuspense(Contact)}
          </PublicRoute>
        ),
      },
      {
        path: "about",
        element: (
          <PublicRoute blockedRoles={["organizer"]}>
            {withSuspense(About)}
          </PublicRoute>
        ),
      },

      // ✅ Protected Organizer Routes
      {
        path: "organizerDashboard",
        element: (
          <ProtectedRoute allowedRoles={["organizer"]}>
            <Suspense fallback={<LoadingOverlay />}>
              <OrganizerDashboard />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: "organizerMyEvents",
        element: (
          <ProtectedRoute allowedRoles={["organizer"]}>
            <Suspense fallback={<LoadingOverlay />}>
              <OrganizerMyEvents />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: "organizerAnalytics",
        element: (
          <ProtectedRoute allowedRoles={["organizer"]}>
            <Suspense fallback={<LoadingOverlay />}>
              <OrganizerAnalytics />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: "ViewEventDetails/:eventId",
        element: (
          <ProtectedRoute allowedRoles={["organizer"]}>
            <Suspense fallback={<LoadingOverlay />}>
              <ViewEventDetails />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: "TicketScanner",
        element: (
          <ProtectedRoute allowedRoles={["organizer"]}>
            <Suspense fallback={<LoadingOverlay />}>
              <TicketScanner />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      // ✅ Protected attendee Routes

      {
        path: "profile",
        element: (
          <ProtectedRoute allowedRoles={["attendee", "organizer"]}>
            <Suspense fallback={<LoadingOverlay />}>
              <Profile />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: "myBookings",
        element: (
          <ProtectedRoute allowedRoles={["attendee"]}>
            <Suspense fallback={<LoadingOverlay />}>
              <MyBookings />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: "bookingDetails/:id",
        element: (
          <ProtectedRoute allowedRoles={["attendee"]}>
            <Suspense fallback={<LoadingOverlay />}>
              <BookingDetails />
            </Suspense>
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "/login",
    element: withSuspense(Login),
    errorElement: withSuspense(ErrorPage),
  },
  {
    path: "/register",
    element: withSuspense(Register),
    errorElement: withSuspense(ErrorPage),
  },
  {
    path: "/paymentSuccess",
    element: withSuspense(paymentSuccess),
    errorElement: withSuspense(ErrorPage),
  },
  {
    path: "/paymentCancel",
    element: withSuspense(paymentCancel),
    errorElement: withSuspense(ErrorPage),
  },
]);

export default router;
