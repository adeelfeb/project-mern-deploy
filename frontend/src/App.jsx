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

    const authPages = ["/login", "/signup"];
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


