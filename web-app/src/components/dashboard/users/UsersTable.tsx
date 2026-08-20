import UserItem from "./UserItem";
import { Roles } from "@/generated/prisma/enums";
import { useAppSelector } from "@/hooks/hooks";

// Assuming UserItemType is imported from your types file
interface UserTableProps {
  role: Roles;
  canEdit: boolean;
  canDelete: boolean;
}

export default function UsersTable({
  role,
  canEdit,
  canDelete,
}: UserTableProps) {
  const { users, loading } = useAppSelector(state => state.dashboard.users)


  return (
    <div className="bg-white border border-gray-200 rounded-xl">
      <div className="overflow-x-auto overflow-y-visible">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">User</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Role</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Status</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Joined</th>
              {(canEdit || canDelete) && <th className="px-4 py-3" />}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <tr key={i}>
                  {[1, 2, 3, 4, 5].map((j) => (
                    <td key={j} className="px-4 py-3">
                      <div className="h-4 bg-gray-100 rounded animate-pulse w-3/4" />
                    </td>
                  ))}
                </tr>
              ))
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-16 text-center text-gray-400">
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <UserItem key={user.id} user={user} role={role} />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}