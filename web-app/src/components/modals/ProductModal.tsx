import { ProductStatus } from "@/generated/prisma/enums";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { resetProductStatus } from "@/lib/features/product/productSlice";
import { createProduct } from "@/lib/features/product/thunks/productThunk";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

interface AddModalProps {
  onClose: () => void;
}

type PreviewFile = {
  file: File;
  preview: string;
};

export default function ProductModal({ onClose }: AddModalProps) {
  const dispatch = useAppDispatch();
  
  // 1. Redux State Selectors
  const { loading, success, error } = useAppSelector((state) => state.product);

  // 2. Local Form States
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("0");
  const [status, setStatus] = useState<ProductStatus>(ProductStatus.Draft);
  const [files, setFiles] = useState<PreviewFile[]>([]);

  // 3. Handle Redux Actions Lifecycle (Success / Cleanup)
  useEffect(() => {
    if (success) {
      dispatch(resetProductStatus());
      onClose(); // Auto-close modal when product finishes creating successfully
    }
  }, [success, dispatch, onClose]);

  // Clean up object URLs on unmount to prevent browser memory leaks
  useEffect(() => {
    return () => {
      files.forEach((f) => URL.revokeObjectURL(f.preview));
    };
  }, []);

  // 4. File Selection Logic
  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);

    if (selectedFiles.length + files.length > 5) {
      alert("You can upload a maximum of 5 images.");
      return;
    }

    const newPreviewFiles: PreviewFile[] = selectedFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setFiles((prev) => [...prev, ...newPreviewFiles]);
    e.target.value = "";
  };

  const removeImage = (index: number) => {
    setFiles((prev) => {
      const target = prev[index];
      if (target) {
        URL.revokeObjectURL(target.preview);
      }
      return prev.filter((_, i) => i !== index);
    });
  };

  // 5. Submit Handler (Constructs multipart/form-data payload)
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) return alert("Product name is required");
    if (!price || parseFloat(price) < 0) return alert("Please enter a valid price");
    if (files.length === 0) return alert("Please upload at least one image");

    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("stock", stock);
    formData.append("status", status);

    // Append raw files directly matching the array key expected by your api route (`files`)
    files.forEach((item) => {
      formData.append("files", item.file);
    });

    dispatch(createProduct(formData));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <form 
        onSubmit={handleSave}
        className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 bg-[#111] p-6 shadow-2xl"
      >
        <h3 className="mb-5 text-base font-semibold text-white">
          Add Product
        </h3>

        {/* Display Submission Errors */}
        {error && (
          <div className="mb-4 text-xs bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {/* Product Name */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-white/50">
              Product Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nike Air Max"
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-white/20 focus:border-violet-500/50 focus:outline-none"
            />
          </div>

          {/* Price */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-white/50">
              Price ($)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              required
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="99.99"
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-white/20 focus:border-violet-500/50 focus:outline-none"
            />
          </div>

          {/* Images Upload Area */}
          <div>
            <label className="flex flex-col items-center justify-center border border-dashed border-white/20 rounded-lg p-5 cursor-pointer hover:bg-white/5 transition-colors">
              <span className="text-sm font-medium text-white/70">
                Click to select images
              </span>
              <span className="mt-1 text-xs text-white/40">
                Maximum 5 images
              </span>
              <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={handleSelect}
              />
            </label>

            {/* Preview Grid */}
            {files.length > 0 && (
              <div className="mt-4">
                <h4 className="mb-2 text-xs font-medium text-white/50">
                  Preview ({files.length}/5)
                </h4>

                <div className="grid grid-cols-3 gap-2">
                  {files.map((item, index) => (
                    <div
                      key={index}
                      className="relative aspect-square overflow-hidden rounded-lg border border-white/10 bg-white/5"
                    >
                      <img
                        src={item.preview}
                        alt={`Preview ${index}`}
                        className="h-full w-full object-cover"
                      />

                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] text-white hover:bg-red-700 transition-colors"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sales */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-white/50">
              Stock
            </label>
            <input
              type="number"
              min={0}
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              placeholder="0"
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-white/20 focus:border-violet-500/50 focus:outline-none"
            />
          </div>

          {/* Status */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-white/50">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as ProductStatus)}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white focus:border-violet-500/50 focus:outline-none"
            >
              {Object.values(ProductStatus).map((statusVal) => (
                <option
                  key={statusVal}
                  value={statusVal}
                  className="bg-[#111] text-white"
                >
                  {statusVal}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Modal Controls */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            disabled={loading}
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm text-white/50 transition-colors hover:text-white disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-violet-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-violet-700 disabled:bg-violet-600/50 disabled:cursor-not-allowed"
          >
            {loading ? "Saving..." : "Save Product"}
          </button>
        </div>
      </form>
    </div>
  );
}