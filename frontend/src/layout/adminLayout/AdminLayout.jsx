import React, { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar'; // Assuming this component exists
import { AdminFallback } from './AdminFallback'; // Assuming this component exists

 const AdminLayout = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-100"> {/* Added bg-gray-100 for context */}

      {/* Sidebar remains as a direct flex child */}
      <AdminSidebar />

      <div className="flex-1 overflow-y-auto p-4">
        <Suspense fallback={<AdminFallback />}>
          <Outlet />
        </Suspense>
      </div>

    </div>
  );
};

export default AdminLayout;