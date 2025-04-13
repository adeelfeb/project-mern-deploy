import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLoginStatus, setUserData, logout } from "./store/authSlice";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import authService from "./AserverAuth/auth";
import { ImageProvider } from "./contexts/ImageContext";
import { LoadingProvider } from "./contexts/LoadingContext";
import { SidebarProvider } from "./contexts/SidebarContext";


function App() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate(); // Add this
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const userData = useSelector((state) => state.auth.userData); // Get user data from Redux

  useEffect(() => {
    let isMounted = true;
    setError(null);

    const authPages = ["/login", "/signup", "/", "forget-password"];
    const shouldCheckAuth = !authPages.includes(location.pathname) || isLoggedIn;

    async function checkAuth() {
      try {
        const userData = await authService.getCurrentUser();
        if (!isMounted) return;

        if (userData) {
          dispatch(setLoginStatus(true));
          dispatch(setUserData(userData));
          
          // Enhanced redirect logic
          if (authPages.includes(location.pathname)) {
            navigate(userData.isAdmin ? '/admin/dashboard' : '/dashboard', { replace: true });
          } else if (location.pathname === '/') {
            navigate(userData.isAdmin ? '/admin/dashboard' : '/dashboard', { replace: true });
          }
          // Ensure admin stays on admin routes and vice versa
          else if (userData.isAdmin && !location.pathname.startsWith('/admin')) {
            navigate('/admin/dashboard', { replace: true });
          }
          else if (!userData.isAdmin && location.pathname.startsWith('/admin')) {
            navigate('/dashboard', { replace: true });
          }
        } else {
          dispatch(logout());
          if (!authPages.includes(location.pathname)) {
            navigate('/login', { replace: true });
          }
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        if (isMounted) setError(error.message || "Authentication error");
        dispatch(logout());
        if (!authPages.includes(location.pathname)) {
          navigate('/login', { replace: true });
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    if (shouldCheckAuth) {
      checkAuth();
    } else {
      setLoading(false);
    }

    return () => { isMounted = false };
  }, [dispatch, location.pathname, isLoggedIn, navigate]);


  

  return (
    <ImageProvider>
      <LoadingProvider>
        <SidebarProvider>
          <div className="flex flex-col min-h-screen bg-gray-100 text-gray-800">
            <main className="flex flex-grow flex-col">
              {loading ? (
                <div className="flex items-center justify-center h-screen">
                  <span className="text-blue-600 text-lg">Loading...</span>
                </div>
              ) : error ? (
                <div className="flex items-center justify-center h-screen">
                  <p className="text-red-600">Error: {error}</p>
                </div>
              ) : (
                <Outlet />
              )}
            </main>
          </div>
        </SidebarProvider>
      </LoadingProvider>
    </ImageProvider>
  );
}


export default App;




// import { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { setLoginStatus, setUserData, logout } from "./store/authSlice";
// import { Outlet, useLocation, useNavigate } from "react-router-dom";
// import authService from "./AserverAuth/auth";
// import { ImageProvider } from "./contexts/ImageContext";
// import { LoadingProvider } from "./contexts/LoadingContext";
// import { SidebarProvider } from "./contexts/SidebarContext";

// function App() {
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const dispatch = useDispatch();
//   const location = useLocation();
//   const navigate = useNavigate();
//   const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
//   // No need to select userData here, we get it fresh from getCurrentUser

//   useEffect(() => {
//     let isMounted = true;
//     setError(null); // Reset error on each check

//     // Define pages that don't require login
//     const publicPaths = ['/', '/login', '/signup', '/forgot-password', '/videos', '/add-cors' /* Add any other public paths here */];
//     // Define auth pages (login/signup)
//     const authPages = ["/login", "/signup"];

//     async function checkAuth() {
//       setLoading(true); // Start loading indicator for auth check
//       try {
//         const userData = await authService.getCurrentUser();
//         if (!isMounted) return; // Component unmounted during async call

//         if (userData) {
//           // User is logged in
//           dispatch(setLoginStatus(true));
//           dispatch(setUserData(userData));
//           console.log("User data after login is:", userData)

//           const isAdmin = userData.isAdmin;
//           const currentPath = location.pathname;
//           const isOnAuthPage = authPages.includes(currentPath);
//           const isOnAdminRoute = currentPath.startsWith('/admin');
//           const isOnUserDashboard = currentPath.startsWith('/dashboard');

//           // 1. If logged in but on login/signup page, redirect to appropriate dashboard
//           if (isOnAuthPage) {
//             console.log(`Redirecting logged in ${isAdmin ? 'admin' : 'user'} from auth page to dashboard.`);
//             navigate(isAdmin ? '/admin/dashboard' : '/dashboard', { replace: true });
//           }
//           // 2. If NOT admin but trying to access an admin route, redirect to user dashboard
//           else if (!isAdmin && isOnAdminRoute) {
//             console.log("Redirecting non-admin from admin route to /dashboard.");
//             navigate('/dashboard', { replace: true });
//           }
//           // 3. OPTIONAL: If IS admin but trying to access the regular user dashboard, redirect to admin dashboard
//           //    (Uncomment this if admins should *never* see the regular '/dashboard/*' routes)
//           /*
//           else if (isAdmin && isOnUserDashboard) {
//              console.log("Redirecting admin from user dashboard route to /admin/dashboard.");
//              navigate('/admin/dashboard', { replace: true });
//           }
//           */
//           // 4. *** REMOVED THE PROBLEMATIC REDIRECT ***
//           // Admins can now stay on non-admin routes like '/', '/videos', etc.

//         } else {
//           // User is not logged in
//           dispatch(logout()); // Ensure Redux state is cleared

//           const currentPath = location.pathname;
//           // Check if the current path requires authentication (is NOT public)
//           // This simple check assumes any route not explicitly public requires login.
//           // For more complex apps, you might have route metadata.
//           const requiresAuth = !publicPaths.some(path => {
//               // Handle exact matches and potential base paths like '/'
//               if (path === '/') return currentPath === '/';
//               return currentPath === path || currentPath.startsWith(path + '/');
//           });


//           if (requiresAuth) {
//             console.log(`Redirecting logged out user from protected route ${currentPath} to /login.`);
//             navigate('/login', { replace: true });
//           }
//         }
//       } catch (error) {
//         // Handle potential errors during getCurrentUser (e.g., network issue, invalid token)
//         console.error("Auth check failed:", error);
//         if (isMounted) setError(error.message || "Authentication error occurred.");
//         dispatch(logout()); // Log out on error
//         // Redirect to login if an error occurs while checking auth, unless already on a public page
//         const currentPath = location.pathname;
//         const isPublic = publicPaths.some(path => {
//             if (path === '/') return currentPath === '/';
//             return currentPath === path || currentPath.startsWith(path + '/');
//         });
//         if (!isPublic && isMounted) {
//              console.log(`Redirecting user to /login due to auth check error on ${currentPath}.`);
//              navigate('/login', { replace: true });
//         }
//       } finally {
//         if (isMounted) setLoading(false); // Stop loading indicator
//       }
//     }

//     checkAuth(); // Run the check

//     // Cleanup function
//     return () => {
//       isMounted = false;
//     };
//     // Rerun effect when location changes OR when login status potentially changes (e.g., after login/logout action)
//   }, [dispatch, location.pathname, navigate]); // Removed isLoggedIn dependency as checkAuth handles it internally


//   // The rest of your App component remains the same...
//   return (
//     <ImageProvider>
//       <LoadingProvider>
//         <SidebarProvider>
//           <div className="flex flex-col min-h-screen bg-gray-100 text-gray-800">
//             <main className="flex flex-grow flex-col">
//               {loading ? (
//                 <div className="flex items-center justify-center h-screen">
//                   {/* Use a spinner or a more visually appealing loader */}
//                   <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//                 </div>
//               ) : error ? (
//                 <div className="flex items-center justify-center h-screen">
//                   <p className="text-red-600 p-4 bg-red-100 border border-red-400 rounded">Error: {error}</p>
//                 </div>
//               ) : (
//                 <Outlet />
//               )}
//             </main>
//           </div>
//         </SidebarProvider>
//       </LoadingProvider>
//     </ImageProvider>
//   );
// }

// export default App;