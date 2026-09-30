import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import ManagementLayout from "./management/ManagementLayout";

import Dashboard from "./management/pages/Dashboard";
import Library from "./management/pages/Library";
import ConfigureActivity from "./management/pages/ConfigureActivity";
import ConfigureChallenge from "./management/pages/ConfigureChallenge";
import AssignStudents from "./management/pages/AssignStudents";
import ManageAssignments from "./management/pages/ManageAssignments";
import ReviewQueue from "./management/pages/ReviewQueue";
import ReviewCompletion from "./management/pages/ReviewCompletion";

import { ManagementProvider } from "./management/context/ManagementContext";

export default function App() {
  return (
    <BrowserRouter>
      <ManagementProvider>
        <Routes>
          <Route
            path="/"
            element={
              <Navigate
                to="/management/dashboard"
                replace
              />
            }
          />

          {/* PAGES WITH SIDEBAR */}
          <Route
            path="/management"
            element={<ManagementLayout />}
          >
            <Route
              index
              element={
                <Navigate
                  to="dashboard"
                  replace
                />
              }
            />

            <Route
              path="dashboard"
              element={<Dashboard />}
            />

            <Route
              path="library"
              element={<Library />}
            />

            <Route
              path="assignments"
              element={<ManageAssignments />}
            />

            <Route
              path="reviews"
              element={<ReviewQueue />}
            />

            {/* Review Completion HAS sidebar */}
            <Route
              path="reviews/:id"
              element={<ReviewCompletion />}
            />
          </Route>

          {/* PAGES WITHOUT SIDEBAR */}

          <Route
            path="/management/activities/create"
            element={<ConfigureActivity />}
          />

          <Route
            path="/management/challenges/create"
            element={<ConfigureChallenge />}
          />

          <Route
            path="/management/assign"
            element={<AssignStudents />}
          />
        </Routes>
      </ManagementProvider>
    </BrowserRouter>
  );
}