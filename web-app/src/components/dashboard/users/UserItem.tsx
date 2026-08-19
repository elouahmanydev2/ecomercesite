import { Roles } from "@/generated/prisma/enums";
import { can } from "@/hooks/can";
import { useAppDispatch} from "@/hooks/hooks";
import { Ban,UserCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { UserType } from "@/types/usersType";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { updateUserRole } from "@/lib/store/features/(users)/users/thunks/usersThunks";
import { ROLE_COLORS } from "@/lib/utils/constants";
import UserRowActions from "./UserRowActions";

const ALL_ROLES = Object.values(Roles);
interface UserProps {
    user: UserType,
    role: Roles
}

export default function UserItem({ user, role }: UserProps) {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const canEdit = can(role, PERMISSIONS.users.edit);
    const canDelete = can(role, PERMISSIONS.users.delete);
    return (
        <tr key={user.id} className="hover:bg-gray-50 transition-colors">
            {/* User */}
            <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                    {user.image ? (
                        <img src={user.image} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
                    ) : (
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold text-xs">
                            {user.name?.charAt(0).toUpperCase()}
                        </div>
                    )}
                    <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-400">{user.email}</p>
                    </div>
                </div>
            </td>

            {/* Role */}
            <td className="px-4 py-3">
                {canEdit ? (
                    <select
                        value={user.role}
                        onChange={(e) =>
                            dispatch(updateUserRole({ id: user.id, role: e.target.value as Roles })).then(()=>{
                                router.refresh()
                            })
                        }
                        className={`text-xs font-medium px-2 py-1 rounded-full border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 ${ROLE_COLORS[user.role]}`}
                    >
                        {ALL_ROLES.map((r) => (
                            <option key={r} value={r}>{r.replace("_", " ")}</option>
                        ))}
                    </select>
                ) : (
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${ROLE_COLORS[user.role]}`}>
                        {user.role.replace("_", " ")}
                    </span>
                )}
            </td>

            {/* Status */}
            <td className="px-4 py-3">
                {user.banned ? (
                    <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-red-100 text-red-600">
                        <Ban size={11} /> Banned
                    </span>
                ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-600">
                        <UserCheck size={11} /> Active
                    </span>
                )}
            </td>

            {/* Joined */}
            <td className="px-4 py-3 text-gray-500 text-xs">
                {new Date(user.createdAt).toLocaleDateString("en-US", {
                    year: "numeric", month: "short", day: "numeric",
                })}
            </td>
            {/* Actions */}
            <UserRowActions
                user={user}
                canEdit={canEdit}
                canDelete={canDelete}
            />
        </tr>
    )
}