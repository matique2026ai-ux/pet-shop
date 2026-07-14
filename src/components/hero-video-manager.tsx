"use client";

import { useState, useEffect, useRef } from "react";
import { Upload, Trash2, Film } from "lucide-react";

export default function HeroVideoManager() {
  const [videos, setVideos] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const getSecret = () => sessionStorage.getItem("admin_secret") || "";

  const load = async () => {
    setLoading(true);
    try {
      const r = await fetch("/api/hero-videos");
      const d = await r.json();
      setVideos(d.videos || []);
    } catch {
      setError("Failed to load hero videos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/hero-videos", {
        method: "POST",
        headers: { "x-admin-secret": getSecret() },
        body: fd,
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || "Upload failed");
      setVideos((v) => [...v, d.url]);
    } catch (err: any) {
      setError(err.message || "Upload failed");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const handleDelete = async (url: string) => {
    const name = url.split("/").pop();
    if (!name) return;
    setError("");
    try {
      const res = await fetch("/api/hero-videos", {
        method: "DELETE",
        headers: { "Content-Type": "application/json", "x-admin-secret": getSecret() },
        body: JSON.stringify({ name }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || "Delete failed");
      setVideos((v) => v.filter((u) => u !== url));
    } catch (err: any) {
      setError(err.message || "Delete failed");
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center gap-2 mb-1">
        <Film className="w-5 h-5 text-emerald-600" />
        <h2 className="text-lg font-bold text-gray-900">Hero Videos</h2>
      </div>
      <p className="text-sm text-gray-500 mb-4">
        Upload videos from your device. The homepage hero plays them in a loop. Add at least one to replace the default clips.
      </p>

      {error && <p className="text-sm text-red-600 mb-3">{error}</p>}

      <label className="inline-flex items-center gap-2 bg-emerald-600 text-white px-4 py-2.5 rounded-xl font-medium hover:bg-emerald-700 cursor-pointer transition-colors">
        <Upload className="w-4 h-4" />
        {uploading ? "Uploading..." : "Upload video"}
        <input ref={fileRef} type="file" accept="video/*" className="hidden" onChange={handleUpload} disabled={uploading} />
      </label>

      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {loading && <p className="text-sm text-gray-400">Loading...</p>}
        {!loading && videos.length === 0 && (
          <p className="text-sm text-gray-400">No custom videos yet — the hero shows default clips.</p>
        )}
        {videos.map((url) => (
          <div key={url} className="relative rounded-xl overflow-hidden border border-gray-200 bg-black">
            <video src={url} className="w-full h-40 object-cover" muted controls />
            <button
              onClick={() => handleDelete(url)}
              className="absolute top-2 right-2 bg-red-600 text-white p-1.5 rounded-lg hover:bg-red-700 transition-colors"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
