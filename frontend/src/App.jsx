import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLoginStatus, setUserData, logout } from "./store/authSlice";
import { Outlet, useLocation } from "react-router-dom";
import authService from "./AserverAuth/auth";
import { ImageProvider } from "./contexts/ImageContext";
import { LoadingProvider } from "./contexts/LoadingContext";
import { SidebarProvider } from "./contexts/SidebarContext";


function App() {
  const [loading, setLoading] = useState(true); // Start with true for initial auth check
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const location = useLocation();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  useEffect(() => {
    let isMounted = true;
    setError(null); // Clear previous errors

    const authPages = ["/login", "/signup"];
    const shouldCheckAuth = !authPages.includes(location.pathname) || isLoggedIn;

    async function checkAuth() {
      try {
        const userData = await authService.getCurrentUser();
        if (!isMounted) return;

        if (userData) {
          dispatch(setLoginStatus(true));
          dispatch(setUserData(userData));
          // Redirect if on auth page while logged in
          if (authPages.includes(location.pathname)) {
            window.location.replace('/dashboard'); // or your preferred route
          }
        } else {
          dispatch(logout());
          // Redirect if not on auth page and not logged in
          if (!authPages.includes(location.pathname)) {
            window.location.replace('/login');
          }
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        if (isMounted) setError(error.message || "Authentication error");
        dispatch(logout());
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
  }, [dispatch, isLoggedIn]);

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


