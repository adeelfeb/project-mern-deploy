import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { Provider } from 'react-redux';
import store from './store/store.js';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Home from './pages/Home';
import { AuthLayout } from './components';
import Signup from './pages/Signup';
import Login from './pages/Login';
import ForgetPassword from './pages/ForgetPassword.jsx';
import FrontendPage from './pages/FrontendPage.jsx';
import ApiRequestForm from './pages/ApiRequestForm.jsx';
import AddVideoDetailsInDataBase from './pages/AddVideoDetailsInDataBase.jsx';

// Lazy load all components
const Dashboard = lazy(() => import('./dashboard/Dashboard.jsx'));
const DashboardLayout = lazy(() => import('./dashboard/DashboardLayout.jsx'));
const Settings = lazy(() => import('./pages/Settings.jsx'));
const UserHistory = lazy(() => import('./pages/UserHistory.jsx'));
const Info = lazy(() => import('./info/Info.jsx'));
const UploadPdf = lazy(() => import('./chroma/UploadPdf.jsx'));
const InputURL = lazy(() => import('./pages/InputURL.jsx'));
const Transcript = lazy(() => import('./pages/Transcript'));
const Summary = lazy(() => import('./pages/Summary'));
const Quiz = lazy(() => import('./pages/Quiz'));
const KeyConcepts = lazy(() => import('./pages/KeyConcepts'));
const CurrentScore = lazy(() => import('./pages/CurrentScore'));
const VideoList = lazy(()=> import("./pages/VideoList.jsx"))

// Global fallback component
function GlobalFallback() {
  return <div>Loading...</div>;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/add-cors",
        element: <FrontendPage />,
      },
      {
        path: "/videos",
        element: <VideoList />,
      },
      {
        path: "/add-api",
        element: <ApiRequestForm />,
      },
      {
        path: "/add-VideoDetails",
        element: <AddVideoDetailsInDataBase />,
      },
      {
        path: "/login",
        element: (
          <AuthLayout authentication={false}>
            <Login />
          </AuthLayout>
        ),
      },
      {
        path: "/signup",
        element: (
          <AuthLayout authentication={false}>
            <Signup />
          </AuthLayout>
        ),
      },
      {
        path: "/dashboard",
        element: (
          <AuthLayout authentication>
            <Suspense fallback={<GlobalFallback />}>
              <DashboardLayout />
            </Suspense>
          </AuthLayout>
        ),
        children: [
          {
            path: "/dashboard/chat",
            element: (
              <Suspense fallback={<GlobalFallback />}>
                <Dashboard />
              </Suspense>
            ),
          },
          {
            path: "/dashboard/uploadpdf",
            element: (
              <Suspense fallback={<GlobalFallback />}>
                <UploadPdf />
              </Suspense>
            ),
          },
          {
            path: "/dashboard/settings",
            element: (
              <Suspense fallback={<GlobalFallback />}>
                <Settings />
              </Suspense>
            ),
          },
          {
            path: "/dashboard/user-history",
            element: (
              <Suspense fallback={<GlobalFallback />}>
                <UserHistory />
              </Suspense>
            ),
          },
          {
            path: "/dashboard/info",
            element: (
              <Suspense fallback={<GlobalFallback />}>
                <Info />
              </Suspense>
            ),
          },
          {
            path: "/dashboard/input-url",
            element: (
              <Suspense fallback={<GlobalFallback />}>
                <InputURL />
              </Suspense>
            ),
            children: [
              {
                path: "transcript",
                element: (
                  <Suspense fallback={<GlobalFallback />}>
                    <Transcript />
                  </Suspense>
                ),
              },
              {
                path: "summary",
                element: (
                  <Suspense fallback={<GlobalFallback />}>
                    <Summary />
                  </Suspense>
                ),
              },
              {
                path: "qna",
                element: (
                  <Suspense fallback={<GlobalFallback />}>
                    <Quiz />
                  </Suspense>
                ),
              },
              {
                path: "key-concepts",
                element: (
                  <Suspense fallback={<GlobalFallback />}>
                    <KeyConcepts />
                  </Suspense>
                ),
              },
              {
                path: "score",
                element: (
                  <Suspense fallback={<GlobalFallback />}>
                    <CurrentScore />
                  </Suspense>
                ),
              },
            ],
          },
        ],
      },
      {
        path: "/forgot-password",
        element: <ForgetPassword />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);