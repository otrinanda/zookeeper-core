"use client";

import { useAuthStore } from "@/store/use-auth-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getUserRoles } from "@/lib/permissions";

export default function DashboardPage() {
  const { user } = useAuthStore();

  // Get all user roles (main + sub roles)
  const userRoles = getUserRoles(user);

  // Get initials for avatar
  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Get primary role name
  const primaryRoleName =
    user?.role_user && user.role_user.length > 0
      ? user.role_user[0].role_name
      : "No Role";

  return (
    <div className="container mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Welcome</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="text-lg">
                {getInitials(user?.name)}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <p className="text-2xl font-semibold">
                Hello, {user?.name || "User"}
              </p>
              <p className="text-muted-foreground">
                {user?.email || "No email"}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              Role anda saat ini adalah:
            </p>
            <div className="flex items-center gap-2">
              <Badge variant="default" className="text-base px-4 py-2">
                {primaryRoleName}
              </Badge>
            </div>
          </div>

          {user?.sub_role_user && user.sub_role_user.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Additional Roles:
              </p>
              <div className="flex flex-wrap gap-2">
                {user.sub_role_user.map((role, index) => (
                  <Badge
                    key={`${role.role_code}-${index}`}
                    variant="outline"
                    className="text-sm"
                  >
                    {role.role_name}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {userRoles.length > 0 && (
            <div className="space-y-2 pt-4 border-t">
              <p className="text-sm font-medium text-muted-foreground">
                Role Codes:
              </p>
              <div className="flex flex-wrap gap-2">
                {userRoles.map((roleCode, index) => (
                  <Badge
                    key={`${roleCode}-${index}`}
                    variant="secondary"
                    className="text-xs font-mono"
                  >
                    {roleCode}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Email
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold">
              {user?.email || "-"}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Identity Number
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold">
              {user?.no_identity || "-"}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Roles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold">
              {userRoles.length}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}