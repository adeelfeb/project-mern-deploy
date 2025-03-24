import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLoginStatus, setUserData, logout } from "./store/authSlice";
import { Outlet, useLocation } from "react-router-dom";
import authService from "./AserverAuth/auth";
import { ImageProvider } from "./contexts/ImageContext";
import { LoadingProvider } from "./contexts/LoadingContext";
import { SidebarProvider } from "./contexts/SidebarContext";

function App() {
  const [loading, setLoading] = useState(false); // Initially false for faster page load
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const location = useLocation();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  // Only check authentication on login/signup pages
  useEffect(() => {
    const authPages = ["/login", "/signup"];
    if (!authPages.includes(location.pathname)) return;
  
    let isMounted = true;
    setLoading(true);
  
    const fetchUserData = async () => {
      try {
        const userData = await authService.getCurrentUser();
        // console.log("user is:", userData)
        if (isMounted) {
          if (userData) {
            dispatch(setLoginStatus(true));
            dispatch(setUserData(userData));
          } else {
            dispatch(logout());
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        if (isMounted) setError(error.message || "Failed to load user data.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };
  
    fetchUserData();
  
    return () => {
      isMounted = false;
    };
  }, [dispatch, location.pathname]);
  // useEffect(() => {
  //   const authPages = ["/login", "/signup"]; // Add authentication-related routes here
  //   if (!authPages.includes(location.pathname)) return;

  //   let isMounted = true;
  //   setLoading(true);

  //   async function fetchUserData() {
  //     try {
  //       const userData = await authService.getCurrentUser();
  //       console.log("the user is :", userData)
  //       if (isMounted) {
  //         if (userData) {
  //           dispatch(setLoginStatus(true));
  //           dispatch(setUserData(userData));
  //         } else {
  //           dispatch(logout());
  //         }
  //       }
  //     } catch (error) {
  //       console.error("Error fetching user data:", error);
  //       if (isMounted) setError(error.message || "Failed to load user data.");
  //     } finally {
  //       if (isMounted) setLoading(false);
  //     }
  //   }

  //   fetchUserData();

  //   return () => {
  //     isMounted = false;
  //   };
  // }, [dispatch, location.pathname]);

  return (
    <ImageProvider>
      <LoadingProvider>
        <SidebarProvider>
          <div className="flex flex-col min-h-screen bg-gray-100 text-gray-800">
            <main className="flex flex-grow flex-col">
              {/* Only show loading when checking auth on login/signup pages */}
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
// import { useDispatch } from "react-redux";
// import authService from "./AserverAuth/auth";
// import { setLoginStatus, setUserData, logout } from "./store/authSlice";
// import { Outlet } from "react-router-dom";
// import { ImageProvider } from "./contexts/ImageContext";
// import { LoadingProvider } from "./contexts/LoadingContext";
// import { SidebarProvider } from "./contexts/SidebarContext";

// function App() {
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const dispatch = useDispatch();

//   useEffect(() => {
//     let isMounted = true;

//     async function fetchUserData() {
//       try {
//         const userData = await authService.getCurrentUser();
//         if (isMounted) {
//           if (userData) {
//             dispatch(setLoginStatus(true));
//             dispatch(setUserData(userData));
//           } else {
//             dispatch(logout());
//           }
//         }
//       } catch (error) {
//         console.error("Error fetching user data:", error);
//         if (isMounted) setError(error.message || "Failed to load user data.");
//       } finally {
//         if (isMounted) setLoading(false);
//       }
//     }

//     fetchUserData();

//     return () => {
//       isMounted = false;
//     };
//   }, [dispatch]);

//   return (
//     <ImageProvider>
//       <LoadingProvider>
//         <SidebarProvider>
//           <div className="flex flex-col min-h-screen bg-gray-100 text-gray-800">
//             <main className="flex flex-grow flex-col">
//               {loading ? (
//                 <div className="flex items-center justify-center h-screen">
//                   <span className="text-blue-600 text-lg">Loading...</span>
//                 </div>
//               ) : error ? (
//                 <div className="flex items-center justify-center h-screen">
//                   <p className="text-red-600">Error: {error}</p>
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