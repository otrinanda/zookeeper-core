// src/components/shared/user-debug-info.tsx

"use client";

import { useAuthStore } from "@/store/use-auth-store";
import { getUserRoles } from "@/lib/permissions";
import { useState } from "react";

/**
 * Component untuk debug user info
 * Hanya tampil di development mode
 */
export const UserDebugInfo = () => {
  const { user } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);

  // Only show in development
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  if (!user) {
    return null;
  }

  const roles = getUserRoles(user);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-500 text-white px-3 py-2 rounded-full shadow-lg hover:bg-blue-600 text-xs font-mono"
      >
        👤 Debug
      </button>

      {isOpen && (
        <div className="absolute bottom-12 right-0 bg-white border border-gray-200 rounded-lg shadow-xl p-4 w-80 max-h-96 overflow-auto">
          <div className="space-y-2 text-xs font-mono">
            <div className="font-bold text-sm mb-2 flex justify-between items-center">
              <span>User Debug Info</span>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div>
              <span className="font-semibold">Name:</span>
              <div className="bg-gray-50 p-1 rounded">{user.name}</div>
            </div>

            <div>
              <span className="font-semibold">Email:</span>
              <div className="bg-gray-50 p-1 rounded">{user.email}</div>
            </div>

            {user.no_identity && (
              <div>
                <span className="font-semibold">ID:</span>
                <div className="bg-gray-50 p-1 rounded">{user.no_identity}</div>
              </div>
            )}

            <div>
              <span className="font-semibold">Main Roles:</span>
              <div className="bg-green-50 p-1 rounded space-y-1">
                {user.role_user.map((role, idx) => (
                  <div key={idx} className="text-green-700">
                    • {role.role_code} ({role.role_name})
                  </div>
                ))}
              </div>
            </div>

            {user.sub_role_user && user.sub_role_user.length > 0 && (
              <div>
                <span className="font-semibold">Sub Roles:</span>
                <div className="bg-blue-50 p-1 rounded space-y-1">
                  {user.sub_role_user.map((role, idx) => (
                    <div key={idx} className="text-blue-700">
                      • {role.role_code} ({role.role_name})
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <span className="font-semibold">All Role Codes:</span>
              <div className="bg-purple-50 p-1 rounded">
                {roles.join(", ")}
              </div>
            </div>

            {user.unit_ids && user.unit_ids.length > 0 && (
              <div>
                <span className="font-semibold">Unit IDs:</span>
                <div className="bg-gray-50 p-1 rounded">
                  {user.unit_ids.join(", ")}
                </div>
              </div>
            )}

            {user.bio && (
              <div>
                <span className="font-semibold">Bio:</span>
                <div className="bg-gray-50 p-1 rounded">{user.bio}</div>
              </div>
            )}

            {user.photo_profile && (
              <div>
                <span className="font-semibold">Photo:</span>
                <img
                  src={user.photo_profile}
                  alt="Profile"
                  className="w-16 h-16 rounded-full mt-1"
                />
              </div>
            )}

            <div className="pt-2 border-t">
              <button
                onClick={() => console.log("Full User Object:", user)}
                className="text-blue-500 hover:text-blue-700 text-xs"
              >
                📋 Log Full Object to Console
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
