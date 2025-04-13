import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import store from './store/store.js';
import { AuthLayout } from './components';
import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import RootLayout from './layout/rootLayout/RootLayout.jsx';

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
const VideoList = lazy(() => import('./pages/VideoList.jsx'));
const VideoUpload = lazy(() => import('./pages/VideoUpload.jsx'));
// Lazy load additional components
const ForgetPassword = lazy(() => import('./pages/ForgetPassword.jsx'));
const FrontendPage = lazy(() => import('./pages/FrontendPage.jsx'));
const ApiRequestForm = lazy(() => import('./pages/ApiRequestForm.jsx'));
const AddVideoDetailsInDataBase = lazy(() => import('./pages/AddVideoDetailsInDataBase.jsx'));


// Lazy load all admin components
import AdminLayout from './layout/adminLayout/AdminLayout';
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const UserManagement = lazy(() => import('./pages/admin/UserManagement'));

// Global fallback component
function GlobalFallback() {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
    </div>
  );
}

// Create routes
const router = createBrowserRouter([
  {
    
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/add-cors',
        element: (
          <Suspense fallback={<GlobalFallback />}>
            <FrontendPage />
          </Suspense>
        ),
      },
      {
        path: '/videos',
        element: (
          <Suspense fallback={<GlobalFallback />}>
            <VideoList />
          </Suspense>
        ),
      },
      {
        path: '/add-api',
        element: (
          <Suspense fallback={<GlobalFallback />}>
            <ApiRequestForm />
          </Suspense>
        ),
      },
      {
        path: '/admin',
        element: <App />,
        children: [
          {
            element: <AdminLayout />, // Directly render without Suspense
            children: [
              { 
                path: 'dashboard', // Note: removed leading slash to make it relative
                element: (
                  <Suspense fallback={<GlobalFallback />}>
                    <AdminDashboard />
                  </Suspense>
                ) 
              },
              { 
                path: 'users', // Note: removed leading slash to make it relative
                element: (
                  <Suspense fallback={<GlobalFallback />}>
                    <UserManagement />
                  </Suspense>
                ) 
              },
              {
                path: 'add',
                element: (
                  <Suspense fallback={<GlobalFallback />}>
                    <FrontendPage />
                  </Suspense>
                ),
              },
              { 
                path: 'upload-video', // Note: removed leading slash to make it relative
                element: (
                  <Suspense fallback={<GlobalFallback />}>
                    <VideoUpload />
                  </Suspense>
                ) 
              },
              { 
                path: 'input-url', // Note: removed leading slash to make it relative
                element: (
                  <Suspense fallback={<GlobalFallback />}>
                    <InputURL />
                  </Suspense>
                ) 
              },
              { 
                path: 'chat', // Note: removed leading slash to make it relative
                element: (
                  <Suspense fallback={<GlobalFallback />}>
                    <Dashboard />
                  </Suspense>
                ) 
              },
              { 
                path: 'history', // Note: removed leading slash to make it relative
                element: (
                  <Suspense fallback={<GlobalFallback />}>
                    <UserHistory />
                  </Suspense>
                ) 
              },
              { 
                path: 'settings', // Note: removed leading slash to make it relative
                element: (
                  <Suspense fallback={<GlobalFallback />}>
                    <Settings />
                  </Suspense>
                ) 
              },
              { 
                path: 'videos', // Note: removed leading slash to make it relative
                element: (
                  <Suspense fallback={<GlobalFallback />}>
                    <VideoList />
                  </Suspense>
                ) 
              },
              // ... other admin routes
            ],
          },
        ],
      },
      {
        path: '/add-VideoDetails',
        element: (
          <Suspense fallback={<GlobalFallback />}>
            <AddVideoDetailsInDataBase />
          </Suspense>
        ),
      },
      {
        path: '/login',
        element: (
          <AuthLayout authentication={false}>
            <Login />
          </AuthLayout>
        ),
      },
      {
        path: '/signup',
        element: (
          <AuthLayout authentication={false}>
            <Signup />
          </AuthLayout>
        ),
      },
      {
        path: '/dashboard',
        element: (
          <AuthLayout authentication>
            <Suspense fallback={<GlobalFallback />}>
              <DashboardLayout />
            </Suspense>
          </AuthLayout>
        ),
        children: [
          {
            path: '/dashboard/chat',
            element: (
              <Suspense fallback={<GlobalFallback />}>
                <Dashboard />
              </Suspense>
            ),
          },
          {
            path: '/dashboard/upload-video',
            element: (
              <Suspense fallback={<GlobalFallback />}>
                <VideoUpload />
              </Suspense>
            ),
          },
          {
            path: '/dashboard/uploadpdf',
            element: (
              <Suspense fallback={<GlobalFallback />}>
                <UploadPdf />
              </Suspense>
            ),
          },
          {
            path: '/dashboard/settings',
            element: (
              <Suspense fallback={<GlobalFallback />}>
                <Settings />
              </Suspense>
            ),
          },
          {
            path: '/dashboard/user-history',
            element: (
              <Suspense fallback={<GlobalFallback />}>
                <UserHistory />
              </Suspense>
            ),
          },
          {
            path: '/dashboard/info',
            element: (
              <Suspense fallback={<GlobalFallback />}>
                <Info />
              </Suspense>
            ),
          },
          {
            path: '/dashboard/input-url',
            element: (
              <Suspense fallback={<GlobalFallback />}>
                <InputURL />
              </Suspense>
            ),
            children: [
              {
                path: 'transcript',
                element: (
                  <Suspense fallback={<GlobalFallback />}>
                    <Transcript />
                  </Suspense>
                ),
              },
              {
                path: 'summary',
                element: (
                  <Suspense fallback={<GlobalFallback />}>
                    <Summary />
                  </Suspense>
                ),
              },
              {
                path: 'qna',
                element: (
                  <Suspense fallback={<GlobalFallback />}>
                    <Quiz />
                  </Suspense>
                ),
              },
              {
                path: 'key-concepts',
                element: (
                  <Suspense fallback={<GlobalFallback />}>
                    <KeyConcepts />
                  </Suspense>
                ),
              },
              {
                path: 'score',
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
        path: '/forgot-password',
        element: (
          <Suspense fallback={<GlobalFallback />}>
            <ForgetPassword />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: '/add-cors',
    element: (
      <Suspense fallback={<GlobalFallback />}>
        <FrontendPage />
      </Suspense>
    ),
  },
]);

// Render the app
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <Suspense fallback={<GlobalFallback />}>
        <RouterProvider router={router} />
      </Suspense>
    </Provider>
  </React.StrictMode>
);

