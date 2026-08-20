import { useAppDispatch } from '@/hooks/hooks';
import { deleteUser } from '@/lib/store/features/(users)/users/thunks/usersThunks';
import { setConfirmDelete } from '@/lib/store/features/(users)/users/usersSlice';
import { X } from 'lucide-react';

export default function ConfirmDeleteModal ({ confirmDelete }: { confirmDelete: string }) {
    const dispatch = useAppDispatch()

    return (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
            <div className="bg-green-400 rounded-xl shadow-xl max-w-sm w-full p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="font-semibold text-gray-900">Delete User</h2>
                    <button
                        onClick={() => dispatch(setConfirmDelete(null))}
                        className="text-gray-400 hover:text-gray-600">
                        <X size={18} />
                    </button>
                </div>
                <p className="text-sm text-gray-500 mb-6">
                    This will permanently delete the user and all associated data. This action cannot be undone.
                </p>
                <div className="flex gap-3">
                    <button
                        onClick={() => dispatch(setConfirmDelete(null))}
                        className="flex-1 px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => {
                            dispatch(deleteUser(confirmDelete));
                            dispatch(setConfirmDelete(null));
                        }}
                        className="flex-1 px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>)
}