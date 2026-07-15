import {
  HashRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Alumni from "./pages/Alumni";
import Mentorship from "./pages/Mentorship";
import Posts from "./pages/Posts";
import Connections from "./pages/Connections";
import Events from "./pages/Events";
import CreateEvent from "./pages/CreateEvent";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import AlumniProfile from "./pages/AlumniProfile";
import EditEvent from "./pages/EditEvent";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <HashRouter>
      <Routes>
        {/* Default route */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Public routes */}
        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Alumni */}
        <Route
          path="/alumni"
          element={
            <ProtectedRoute>
              <Alumni />
            </ProtectedRoute>
          }
        />
        <Route
          path="/alumni/:id"
          element={
            <ProtectedRoute>
              <AlumniProfile />
            </ProtectedRoute>
          }
        />

        {/* Mentorship */}
        <Route
          path="/mentorship"
          element={
            <ProtectedRoute>
              <Mentorship />
            </ProtectedRoute>
          }
        />

        {/* Community Posts */}
        <Route
          path="/posts"
          element={
            <ProtectedRoute>
              <Posts />
            </ProtectedRoute>
          }
        />

        {/* Connections */}
        <Route
          path="/connections"
          element={
            <ProtectedRoute>
              <Connections />
            </ProtectedRoute>
          }
        />

        {/* Events */}
        <Route
          path="/events"
          element={
            <ProtectedRoute>
              <Events />
            </ProtectedRoute>
          }
        />

        {/* Create Event */}
        <Route
          path="/events/create"
          element={
            <ProtectedRoute>
              <CreateEvent />
            </ProtectedRoute>
          }
        />
        <Route
          path="/events/:id/edit"
          element={
            <ProtectedRoute>
              <EditEvent />
            </ProtectedRoute>
          }
        />

        {/* Profile */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Edit Profile */}
        <Route
          path="/profile/edit"
          element={
            <ProtectedRoute>
              <EditProfile />
            </ProtectedRoute>
          }
        />

        {/* Unknown route */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
