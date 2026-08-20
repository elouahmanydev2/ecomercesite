'use client'
import { useAppDispatch } from "@/hooks/hooks";
import { banUser } from "@/lib/store/features/(users)/users/thunks/usersThunks";
import { setBanModal } from "@/lib/store/features/(users)/users/usersSlice";
import { BanType } from "@/types/usersType";
import { X } from "lucide-react";
import { useState } from "react";
import { useDispatch } from "react-redux";

interface BanProps{
    banModal:BanType
}
export default function BanModal({banModal}:BanProps) {
    const dispatch = useAppDispatch()
      const [banReason, setBanReason] = useState("");
    
    return(
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900">Ban {banModal.name}</h2>
              <button
                onClick={() => {
                  dispatch(setBanModal(null));
                  setBanReason("");
                }}
                className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>
            <p className="text-sm text-gray-500 mb-4">Provide a reason for banning this user.</p>
            <textarea
              value={banReason}
              onChange={(e) => setBanReason(e.target.value)}
              placeholder="Reason..."
              rows={3}
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  dispatch(setBanModal(null));
                  setBanReason("");
                }} className="flex-1 px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  dispatch(banUser({ id: banModal.id, reason: banReason }));
                  dispatch(setBanModal(null));
                  setBanReason("");
                }}
                className="flex-1 px-4 py-2 text-sm bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors"
              >
                Ban User
              </button>
            </div>
          </div>
        </div>
    )
}