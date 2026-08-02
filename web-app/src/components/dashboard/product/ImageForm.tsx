import { ChangeEvent } from "react";

type PreviewFile = {
  file: File;
  preview: string;
};

interface Props {
  files: PreviewFile[];
  handleSelectImages: (e: ChangeEvent<HTMLInputElement>) => void;
  removeImage: (n: number) => void;
}

export default function ImageForm({
  files,
  handleSelectImages,
  removeImage,
}: Props) {
  return (
    <section className="space-y-4">
      <h2 className="border-b border-zinc-800 pb-2 text-base font-semibold text-zinc-300">
        Product Images
      </h2>

      <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-zinc-800 bg-zinc-900/40 p-6 text-center transition-all hover:border-indigo-500/50 hover:bg-zinc-900/70">
        <svg
          className="mb-2 h-8 w-8 text-zinc-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>

        <span className="text-sm font-medium text-zinc-200">
          Click to select images
        </span>

        <span className="mt-1 text-xs text-zinc-500">
          PNG, JPG, or WEBP · Maximum 5 images
        </span>

        <input
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={handleSelectImages}
          disabled={files.length >= 5}
        />
      </label>

      {/* Preview */}
      {files.length > 0 && (
        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Image Previews
            </h4>

            <span className="text-xs font-medium text-zinc-500">
              {files.length} / 5 selected
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
            {files.map((item, index) => (
              <div
                key={item.preview}
                className="group relative aspect-square overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900/60 shadow-sm"
              >
                <img
                  src={item.preview}
                  alt={`Product image ${index + 1}`}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />

                {/* Thumbnail Badge */}
                {index === 0 && (
                  <span className="absolute bottom-1 left-1 rounded bg-indigo-600/90 px-1.5 py-0.5 text-[10px] font-semibold text-white backdrop-blur-sm">
                    Thumbnail
                  </span>
                )}

                {/* Remove */}
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-zinc-950/80 text-zinc-300 shadow transition-colors hover:bg-red-600 hover:text-white"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}