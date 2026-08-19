import { useEffect, useState } from "react";
import { Roles } from "@/generated/prisma/enums";
import {
  Users,
} from "lucide-react";
import { can } from "@/hooks/can";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { PERMISSIONS } from "@/lib/auth/permissions";
import UserFilters from "./UserFilters";
import UsersTable from "./UsersTable";
import ConfirmDeleteModal from "@/components/modals/ConfirmDeleteModal";
import BanModal from "@/components/modals/BanModal";
import { fetchUsers } from "@/lib/store/features/(users)/users/thunks/usersThunks";
import { setPage } from "@/lib/store/ui/uiSlice";
import { setOpenUserMenu } from "@/lib/store/features/(users)/users/usersSlice";




export default function UsersContent({ role }: { role: Roles }) {
  const dispatch = useAppDispatch();
  const page = useAppSelector(s => s.ui.page)

  const { confirmDelete, banModal } = useAppSelector((s) => s.dashboard.users);
  const {total, OpenUserMenu } = useAppSelector((s) => s.dashboard.users);
  const canView = can(role, PERMISSIONS.users.view);
  const canCreate = can(role, PERMISSIONS.users.create);
  const canEdit = can(role, PERMISSIONS.users.edit);
  const canDelete = can(role, PERMISSIONS.users.delete);


  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<Roles | "all">("all");

  const LIMIT = 10;

  useEffect(() => {
    if (!canView) return;
    dispatch(fetchUsers({ search, role: roleFilter, page, limit: LIMIT }));
  }, [search, roleFilter, page, dispatch, canView]);


  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-blue-50 p-2 rounded-lg">
            <Users size={20} className="text-blue-600" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Users</h1>
            <p className="text-sm text-gray-500">{total} total users</p>
          </div>
        </div>

        {canCreate && (
          <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
            + Invite User
          </button>
        )}
      </div>

      {/* Filters */}
      <UserFilters
        search={search}
        setSearch={setSearch}
        roleFilter={roleFilter}
        setRoleFilter={setRoleFilter}
        onFilterChange={() => dispatch(setPage(1))}
      />

      {/* Table */}     
      

      <UsersTable role={role} canEdit={canEdit} canDelete={canDelete} />

      {/* Delete Confirm Modal */}
      {confirmDelete && (
        <ConfirmDeleteModal confirmDelete={confirmDelete} />
      )}

      {/* Ban Modal */}
      {banModal && (
        <BanModal banModal={banModal} />
      )}

      {/* Backdrop click to close menu */}
      {OpenUserMenu && (
        <div className="fixed inset-0 z-40" onClick={() => dispatch(setOpenUserMenu(null))} />
        
      )}
    </div>
  );
}