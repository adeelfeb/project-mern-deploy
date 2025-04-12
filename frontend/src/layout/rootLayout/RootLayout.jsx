
// import React, { useEffect, useState } from 'react';
// import { Link, Outlet, useLocation } from 'react-router-dom';
// import { HiMenuAlt1, HiX } from 'react-icons/hi';
// import { AuthService } from '../../services/auth.service';
// import { useSidebar } from '../../contexts/SidebarContext';

// function RootLayout() {
//   const location = useLocation();
//   const [user, setUser] = useState(null); // Track the logged-in user state
//   const { isSidebarOpen, toggleSidebar } = useSidebar();

//   useEffect(() => {
//     async function fetchUser() {
//       try {
//         const authService = new AuthService();
//         const currentUser = await authService.getCurrentUser();
//         setUser(currentUser);
//       } catch (err) {
//         console.error('Error fetching user:', err);
//       }
//     }
//     fetchUser();
//   }, []);

//   const handleSignOut = () => {
//     localStorage.clear(); // Clear tokens on logout
//     setUser(null); // Reset user state
//   };

//   const shouldCenterOutlet = ['/home', '/sign-in', '/sign-up'].includes(location.pathname);

//   return (
//     <div className={`min-h-screen ${shouldCenterOutlet ? 'flex items-center justify-center' : ''}`}>
//       {/* Header */}
//       <header className="bg-gray-800 text-white px-4 py-3 flex justify-between items-center">
//         {/* Sidebar Toggle Button */}
//         <button onClick={toggleSidebar} className="p-2">
//           {isSidebarOpen ? <HiX size={24} /> : <HiMenuAlt1 size={24} />}
//         </button>
        
//         {/* Logo/Link */}
//         <Link to="/" className="font-bold text-xl">
//           Chatbot
//         </Link>

//         {/* User Section */}
//         {user ? (
//           <button onClick={handleSignOut} className="bg-red-500 px-4 py-2 rounded">
//             Sign Out
//           </button>
//         ) : (
//           <Link to="/sign-in" className="bg-blue-500 px-4 py-2 rounded">
//             Sign In
//           </Link>
//         )}
//       </header>

//       {/* Main Content */}
//       <main>
//         <Outlet />
//       </main>
//     </div>
//   );
// }

// export default RootLayout;










import React, { useEffect, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { HiMenuAlt1, HiX } from 'react-icons/hi';
import { AuthService } from '../../services/auth.service';
import { useSidebar } from '../../contexts/SidebarContext';

function RootLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [checkedAuth, setCheckedAuth] = useState(false); // Add this state
  const { isSidebarOpen, toggleSidebar } = useSidebar();

  useEffect(() => {
    async function fetchUser() {
      try {
        const authService = new AuthService();
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
        
        // Only redirect if we've completed auth check
        setCheckedAuth(true);
        
        if (currentUser) {
          // Redirect admin to admin dashboard if not already there
          if (currentUser.isAdmin && !location.pathname.startsWith('/admin')) {
            console.log("The current user is admin:", currentUser)
            navigate('/admin/dashboard', { replace: true });
          }
          // Redirect regular users away from admin pages
          else if (!currentUser.isAdmin && location.pathname.startsWith('/admin')) {
            console.log("The current user is not admin:", currentUser)
            navigate('/dashboard', { replace: true });
          }
          // If logged in but at root, redirect to appropriate dashboard
          else if (location.pathname === '/') {
            console.log("The current user is see for yourself:", currentUser)
            navigate(currentUser.isAdmin ? '/admin/dashboard' : '/dashboard', { replace: true });
          }
        }
      } catch (err) {
        console.error('Error fetching user:', err);
        setCheckedAuth(true);
      }
    }
    
    fetchUser();
  }, [location.pathname, navigate]);

  const handleSignOut = async () => {
    try {
      
      const authService = new AuthService();
      await authService.logout();
      localStorage.clear();
      setUser(null);
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const shouldCenterOutlet = ['/home', '/sign-in', '/sign-up'].includes(location.pathname);

  return (
    <div className={`min-h-screen ${shouldCenterOutlet ? 'flex items-center justify-center' : ''}`}>
      {/* Header */}
      <header className="bg-gray-800 text-white px-4 py-3 flex justify-between items-center">
        <button onClick={toggleSidebar} className="p-2">
          {isSidebarOpen ? <HiX size={24} /> : <HiMenuAlt1 size={24} />}
        </button>
        
        <Link to={user?.isAdmin ? '/admin/dashboard' : '/dashboard'} className="font-bold text-xl">
          {user?.isAdmin ? 'Admin Panel' : 'Chatbot'}
        </Link>

        {user ? (
          <div className="flex items-center gap-4">
            {user.isAdmin && (
              <span className="bg-purple-500 px-2 py-1 rounded text-sm">
                Admin
              </span>
            )}
            <button onClick={handleSignOut} className="bg-red-500 px-4 py-2 rounded">
              Sign Out
            </button>
          </div>
        ) : (
          <Link to="/sign-in" className="bg-blue-500 px-4 py-2 rounded">
            Sign In
          </Link>
        )}
      </header>

      {/* Main Content */}
      <main>
        <Outlet context={{ user }} />
      </main>
    </div>
  );
}

export default RootLayout;