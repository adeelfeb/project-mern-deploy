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
//     let isMounted = true; // Prevent memory leaks
  
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
//       isMounted = false; // Cleanup function
//     };
//   }, [dispatch]);
  
  
//   return (
//     <ImageProvider>
//       <LoadingProvider>
//         <SidebarProvider>
//           <div className="flex flex-col min-h-screen bg-gray-100 text-gray-800">
//             <main className="flex flex-grow flex-col">
//               {loading ? (
//                 // Fancy loading animation
//                 <div className="flex items-center justify-center h-screen">
//                   <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//                   <span className="ml-3 text-blue-600 text-lg">Loading...</span>
//                 </div>
//               ) : error ? (
//                 // Stylish error message
//                 <div className="flex items-center justify-center h-screen">
//                   <div className="bg-red-100 p-4 rounded-lg shadow-md flex items-center">
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       className="h-6 w-6 text-red-600 mr-2"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                       stroke="currentColor"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//                       />
//                     </svg>
//                     <p className="text-red-600">Error: {error}</p>
//                   </div>
//                 </div>
//               ) : (
//                 <Outlet /> // Render child routes here
//               )}
//             </main>
//           </div>
//         </SidebarProvider>
//       </LoadingProvider>
//     </ImageProvider>
//   );
// }

// export default App;







import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import authService from "./AserverAuth/auth";
import { setLoginStatus, setUserData, logout } from "./store/authSlice";
import { Outlet } from "react-router-dom";
import { ImageProvider } from "./contexts/ImageContext";
import { LoadingProvider } from "./contexts/LoadingContext";
import { SidebarProvider } from "./contexts/SidebarContext";

function App() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    let isMounted = true;

    async function fetchUserData() {
      try {
        const userData = await authService.getCurrentUser();
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
    }

    fetchUserData();

    return () => {
      isMounted = false;
    };
  }, [dispatch]);

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