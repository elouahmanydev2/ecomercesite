import { Ban, Trash2, UserCheck } from "lucide-react";
import { useAppDispatch } from "@/hooks/hooks";
import { UserType } from "@/types/usersType";
import { unbanUser } from "@/lib/store/features/(users)/users/thunks/usersThunks";
import { setBanModal, setConfirmDelete } from "@/lib/store/features/(users)/users/usersSlice";

interface UserRowActionsProps {
  user: UserType;
  canEdit: boolean;
  canDelete: boolean;
}

export default function UserRowActions({
  user,
  canEdit,
  canDelete,
}: UserRowActionsProps) {
  const dispatch = useAppDispatch();

  if (!canEdit && !canDelete) return null;

  return (
    <td className="px-4 py-3">
      <div className="flex items-center justify-end gap-2">
        {canEdit &&
          (user.banned ? (
            <button
              onClick={() => dispatch(unbanUser(user.id))}
              className="p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition"
              title="Unban User"
            >
              <UserCheck size={16} />
            </button>
          ) : (
            <button
              onClick={() =>
                dispatch(
                  setBanModal({
                    id: user.id,
                    name: user.name,
                  })
                )
              }
              className="p-2 rounded-lg bg-yellow-50 text-yellow-600 hover:bg-yellow-100 transition"
              title="Ban User"
            >
              <Ban size={16} />
            </button>
          ))}

        {canDelete && (
          <button
            onClick={() => dispatch(setConfirmDelete(user.id))}
            className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition"
            title="Delete User"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>
    </td>
  );
}