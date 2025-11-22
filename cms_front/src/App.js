import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import MainLayout from "./components/layout/MainLayout";
import Login from "./pages/auth/Login";
import Dashboard from "./pages/dashboard/Dashboard";
import Users from "./pages/users/Users";

// Catalogs
import Specialties from "./pages/catalogs/Specialties";
import BloodTypes from "./pages/catalogs/BloodTypes";
import Occupations from "./pages/catalogs/Occupations";
import MaritalStatus from "./pages/catalogs/MaritalStatus";
import AppointmentStatus from "./pages/catalogs/AppointmentStatus";
import AppointmentTypes from "./pages/catalogs/AppointmentTypes";
import ConsultationStatus from "./pages/catalogs/ConsultationStatus";
import CodeStatus from "./pages/catalogs/CodeStatus";

// People
import Doctors from "./pages/people/Doctors";
import Patients from "./pages/people/Patients";

// Appointments
import Appointments from "./pages/appointments/Appointments";
import Consultations from "./pages/appointments/Consultations";
import Episodes from "./pages/appointments/Episodes";

// Files
import Associations from "./pages/files/Associations";

// Insurance
import Companies from "./pages/insurance/Companies";
import Policies from "./pages/insurance/Policies";

// Notifications
import Notifications from "./pages/notifications/Notifications";
import AccessCodes from "./pages/notifications/AccessCodes";

// Audit
import Audit from "./pages/audit/Audit";

import "./styles/global.css";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          <Route
            path="/dashboard"
            element={
              <MainLayout>
                <Dashboard />
              </MainLayout>
            }
          />
          <Route
            path="/users"
            element={
              <MainLayout>
                <Users />
              </MainLayout>
            }
          />

          {/* Catalogs */}
          <Route
            path="/catalogs/specialties"
            element={
              <MainLayout>
                <Specialties />
              </MainLayout>
            }
          />
          <Route
            path="/catalogs/blood-types"
            element={
              <MainLayout>
                <BloodTypes />
              </MainLayout>
            }
          />
          <Route
            path="/catalogs/occupations"
            element={
              <MainLayout>
                <Occupations />
              </MainLayout>
            }
          />
          <Route
            path="/catalogs/marital-status"
            element={
              <MainLayout>
                <MaritalStatus />
              </MainLayout>
            }
          />
          <Route
            path="/catalogs/appointment-status"
            element={
              <MainLayout>
                <AppointmentStatus />
              </MainLayout>
            }
          />
          <Route
            path="/catalogs/appointment-types"
            element={
              <MainLayout>
                <AppointmentTypes />
              </MainLayout>
            }
          />
          <Route
            path="/catalogs/consultation-status"
            element={
              <MainLayout>
                <ConsultationStatus />
              </MainLayout>
            }
          />
          <Route
            path="/catalogs/code-status"
            element={
              <MainLayout>
                <CodeStatus />
              </MainLayout>
            }
          />

          {/* People */}
          <Route
            path="/people/doctors"
            element={
              <MainLayout>
                <Doctors />
              </MainLayout>
            }
          />
          <Route
            path="/people/patients"
            element={
              <MainLayout>
                <Patients />
              </MainLayout>
            }
          />

          {/* Appointments */}
          <Route
            path="/appointments/list"
            element={
              <MainLayout>
                <Appointments />
              </MainLayout>
            }
          />
          <Route
            path="/appointments/consultations"
            element={
              <MainLayout>
                <Consultations />
              </MainLayout>
            }
          />
          <Route
            path="/appointments/episodes"
            element={
              <MainLayout>
                <Episodes />
              </MainLayout>
            }
          />

          {/* Files */}
          <Route
            path="/files/associations"
            element={
              <MainLayout>
                <Associations />
              </MainLayout>
            }
          />

          {/* Insurance */}
          <Route
            path="/insurance/companies"
            element={
              <MainLayout>
                <Companies />
              </MainLayout>
            }
          />
          <Route
            path="/insurance/policies"
            element={
              <MainLayout>
                <Policies />
              </MainLayout>
            }
          />

          {/* Notifications */}
          <Route
            path="/notifications/list"
            element={
              <MainLayout>
                <Notifications />
              </MainLayout>
            }
          />
          <Route
            path="/notifications/access-codes"
            element={
              <MainLayout>
                <AccessCodes />
              </MainLayout>
            }
          />

          {/* Audit */}
          <Route
            path="/audit"
            element={
              <MainLayout>
                <Audit />
              </MainLayout>
            }
          />

          {/* Catch all - redirect to dashboard */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
