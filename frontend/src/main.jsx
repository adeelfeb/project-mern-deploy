import React from 'react';
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
import Dashboard from './dashboard/Dashboard.jsx';
import DashboardLayout from './dashboard/DashboardLayout.jsx';
import Settings from './pages/Settings.jsx';
import Info from './info/Info.jsx';
import UploadPdf from './chroma/UploadPdf.jsx'
import InputURL from './pages/InputUrl.jsx';
import FrontendPage from './pages/FrontendPage.jsx';
import conf from './conf/conf.js';
import Transcript from './pages/Transcript.jsx';
import Summary from './pages/Summary.jsx';
import Quiz from './pages/Quiz.jsx';
import KeyConcepts from './pages/KeyConcepts.jsx';
import CurrentScore from './pages/CurrentScore.jsx';
import UserHistory from './pages/UserHistory.jsx';
import NotFound from './pages/NotFound.jsx';



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
            <DashboardLayout />
          </AuthLayout>
        ),
        children: [
          {
            path: "/dashboard/chat",
            element: <Dashboard />, 
          },
          {
            path: "/dashboard/uploadpdf",
            element: <UploadPdf />, 
          },
          {
            path: "/dashboard/settings",
            element: <Settings />, 
          },
          {
            path: "/dashboard/user-history",
            element: <UserHistory />, 
          },
          {
            path: "/dashboard/info",
            element: <Info />, 
          },
          {
            path: "/dashboard/input-url",
            element: <InputURL />, 
            children: [
              { path: "transcript", element: <Transcript/> },
              { path: "summary", element: <Summary/> },
              { path: "qna", element: <Quiz/> },
              { path: "key-concepts", element: <KeyConcepts/> },
              { path: "score", element: <CurrentScore/> },
            ],
          },
        ],
      },
      {
        path: "/forgot-password",
        element: <ForgetPassword />,
      },
      {
        path: "*", // Wildcard route for 404
        element: <NotFound />,
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
  


  
// const router = createBrowserRouter([
//     {
//       path: "/",
//       element: <App />,
//       children: [
//         {
//           path: "/",
//           element: <Home />,
//         },
//         {
//           path: "/add-cors",
//           element: <FrontendPage />,
//         },
//         {
//           path: "/login",
//           element: (
//             <AuthLayout authentication={false}>
//               <Login />
//             </AuthLayout>
//           ),
//         },
//         {
//           path: "/signup",
//           element: (
//             <AuthLayout authentication={false}>
//               <Signup />
//             </AuthLayout>
//           ),
//         },
//         {
//           path: "/dashboard",
//           element: (
//             <AuthLayout authentication>
//               <DashboardLayout />
//             </AuthLayout>
//           ),
//           children: [
//             {
//               path: "/dashboard/chat",
//               element: <Dashboard />, // Main dashboard/chat component
//             },
//             {
//               path: "/dashboard/uploadpdf",
//               element: <UploadPdf />, // Upload PDF component
//             },
//             {
//               path: "/dashboard/settings",
//               element: <Settings />, // Settings component
//             },
//             {
//               path: "/dashboard/info",
//               element: <Info />, // Info component
//             },
//             {
//               path: "/dashboard/input-url",
//               element: <InputURL />, // Info component
//             },
//           ],
//         },
      
//         {
//           path: "/forgot-password",
//           element: <ForgetPassword />,
//         },
//       ],
//     },
//   ]);
  
