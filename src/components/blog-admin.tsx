"use client";

import { useState, useEffect } from "react";
import {
  Plus, Edit2, Trash2, CheckCircle, XCircle, Eye, EyeOff,
  BookOpen, Calendar, User, Globe, X, AlertTriangle, Upload, ImageIcon, RefreshCw
} from "lucide-react";
import type { BlogPost } from "@/lib/use-translated-data";

// ── Inline mini confirm modal ──────────────────────────────────────────────
function MiniConfirm({
  open, title, message, onConfirm, onCancel,
}: {
  open: boolean; title: string; message: string;
  onConfirm: () => void; onCancel: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-6 h-6 text-red-600" />
        </div>
        <h3 className="text-base font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-500 mb-6">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Inline mini alert modal ────────────────────────────────────────────────
function MiniAlert({
  open, title, message, onClose,
}: {
  open: boolean; title: string; message: string; onClose: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
        <h3 className="text-base font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-500 mb-6 break-words">{message}</p>
        <button
          onClick={onClose}
          className="w-full px-4 py-2.5 rounded-xl bg-[#0B1E36] text-white text-sm font-medium hover:bg-[#112540] transition-colors"
        >
          OK
        </button>
      </div>
    </div>
  );
}

// ── Tabs component ──────────────────────────────────────────────────────────
function LangTab({
  active, label, onClick,
}: {
  active: boolean; label: string; onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
        active
          ? "bg-emerald-600 text-white shadow-sm"
          : "text-gray-500 hover:text-gray-800 hover:bg-gray-100"
      }`}
    >
      {label}
    </button>
  );
}

// ── Main component ──────────────────────────────────────────────────────────
export default function BlogAdminPanel({ adminSecret }: { adminSecret: string }) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [activeLang, setActiveLang] = useState<"ar" | "fr" | "en">("ar");
  const [uploadingImg, setUploadingImg] = useState(false);
  const [saving, setSaving] = useState(false);

  const [confirmState, setConfirmState] = useState<{
    open: boolean; slug: string;
  }>({ open: false, slug: "" });

  const [alertState, setAlertState] = useState<{
    open: boolean; title: string; message: string;
  }>({ open: false, title: "Error", message: "" });

  const showAlert = (message: string, title = "Error") =>
    setAlertState({ open: true, title, message });

  const [form, setForm] = useState({
    slug: "",
    titleAr: "", titleFr: "", titleEn: "",
    contentAr: "", contentFr: "", contentEn: "",
    image_url: "", author: "", seo_keywords: "", published: true,
  });

  useEffect(() => { fetchPosts(); }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/blog?admin=true");
      const data = await res.json();
      if (Array.isArray(data)) setPosts(data);
      else showAlert(data.error || "Failed to load posts");
    } catch {
      showAlert("Network error while loading posts");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      showAlert("File is too large. Max size is 5 MB.", "Upload Error");
      return;
    }
    setUploadingImg(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: adminSecret ? { "x-admin-secret": adminSecret } : {},
        body: fd,
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setForm((f) => ({ ...f, image_url: data.url }));
    } catch (e) {
      showAlert("Upload failed: " + (e as Error).message, "Upload Error");
    } finally {
      setUploadingImg(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.slug.trim()) { showAlert("Slug (URL) is required.", "Validation"); return; }
    if (!form.titleAr.trim() && !form.titleEn.trim() && !form.titleFr.trim()) {
      showAlert("At least one title (AR, FR, or EN) is required.", "Validation");
      return;
    }

    setSaving(true);
    const payload = {
      slug: form.slug.trim().toLowerCase().replace(/\s+/g, "-"),
      title: { ar: form.titleAr, fr: form.titleFr, en: form.titleEn },
      content: { ar: form.contentAr, fr: form.contentFr, en: form.contentEn },
      image_url: form.image_url,
      author: form.author,
      seo_keywords: form.seo_keywords,
      published: form.published,
    };

    const url = editingPost ? `/api/blog/${editingPost.slug}` : "/api/blog";
    const method = editingPost ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "x-admin-secret": adminSecret,
        },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setIsAdding(false);
        setEditingPost(null);
        await fetchPosts();
      } else {
        const err = await res.json();
        showAlert(err.error || "Failed to save post");
      }
    } catch (e) {
      showAlert("Network error: " + (e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (slug: string) => {
    try {
      const res = await fetch(`/api/blog/${slug}`, {
        method: "DELETE",
        headers: { "x-admin-secret": adminSecret },
      });
      if (res.ok) {
        setConfirmState({ open: false, slug: "" });
        await fetchPosts();
      } else {
        const err = await res.json();
        showAlert(err.error || "Failed to delete post");
      }
    } catch (e) {
      showAlert("Network error: " + (e as Error).message);
    }
  };

  const openEdit = (post: BlogPost) => {
    setForm({
      slug: post.slug,
      titleAr: post.title.ar || "",
      titleFr: post.title.fr || "",
      titleEn: post.title.en || "",
      contentAr: post.content.ar || "",
      contentFr: post.content.fr || "",
      contentEn: post.content.en || "",
      image_url: post.image_url || "",
      author: post.author,
      seo_keywords: (post as any).seo_keywords || "",
      published: post.published,
    });
    setEditingPost(post);
    setIsAdding(true);
    setActiveLang("ar");
  };

  const openNew = () => {
    setForm({
      slug: "", titleAr: "", titleFr: "", titleEn: "",
      contentAr: "", contentFr: "", contentEn: "",
      image_url: "", author: "Paws & Wings Team", seo_keywords: "", published: true,
    });
    setEditingPost(null);
    setIsAdding(true);
    setActiveLang("ar");
  };

  // ── FORM VIEW ─────────────────────────────────────────────────────────────
  if (isAdding) {
    const langLabels = { ar: "العربية", fr: "Français", en: "English" };
    return (
      <>
        <MiniAlert {...alertState} onClose={() => setAlertState(s => ({ ...s, open: false }))} />

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-emerald-600" />
              </div>
              <h2 className="text-base font-bold text-[#0B1E36]">
                {editingPost ? "Edit Post" : "New Blog Post"}
              </h2>
            </div>
            <button
              onClick={() => setIsAdding(false)}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSave} className="p-6 space-y-6">
            {/* Row 1 — Slug + Author */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  Slug (URL) *
                </label>
                <input
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  placeholder="e.g. cat-care-tips"
                  disabled={!!editingPost}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-50 disabled:text-gray-400 font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  Author
                </label>
                <input
                  value={form.author}
                  onChange={(e) => setForm({ ...form, author: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Language tabs + multilingual fields */}
            <div className="border border-gray-100 rounded-xl overflow-hidden">
              <div className="flex items-center gap-1 p-2 bg-gray-50 border-b border-gray-100">
                <Globe className="w-4 h-4 text-gray-400 mx-1" />
                {(["ar", "fr", "en"] as const).map((l) => (
                  <LangTab
                    key={l}
                    active={activeLang === l}
                    label={langLabels[l]}
                    onClick={() => setActiveLang(l)}
                  />
                ))}
              </div>
              <div className="p-4 space-y-4" dir={activeLang === "ar" ? "rtl" : "ltr"}>
                {activeLang === "ar" && (
                  <>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Title (AR)</label>
                      <input
                        value={form.titleAr}
                        onChange={(e) => setForm({ ...form, titleAr: e.target.value })}
                        placeholder="عنوان المقال"
                        className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Content (AR)</label>
                      <textarea
                        rows={8}
                        value={form.contentAr}
                        onChange={(e) => setForm({ ...form, contentAr: e.target.value })}
                        placeholder="محتوى المقال..."
                        className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                      />
                    </div>
                  </>
                )}
                {activeLang === "fr" && (
                  <>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Title (FR)</label>
                      <input
                        value={form.titleFr}
                        onChange={(e) => setForm({ ...form, titleFr: e.target.value })}
                        placeholder="Titre de l'article"
                        className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Content (FR)</label>
                      <textarea
                        rows={8}
                        value={form.contentFr}
                        onChange={(e) => setForm({ ...form, contentFr: e.target.value })}
                        placeholder="Contenu de l'article..."
                        className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                      />
                    </div>
                  </>
                )}
                {activeLang === "en" && (
                  <>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Title (EN)</label>
                      <input
                        value={form.titleEn}
                        onChange={(e) => setForm({ ...form, titleEn: e.target.value })}
                        placeholder="Article title"
                        className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Content (EN)</label>
                      <textarea
                        rows={8}
                        value={form.contentEn}
                        onChange={(e) => setForm({ ...form, contentEn: e.target.value })}
                        placeholder="Article content..."
                        className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Image */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                Cover Image
              </label>
              <div className="flex gap-2 items-start">
                <input
                  value={form.image_url}
                  onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                  placeholder="https://... or upload below"
                  className="flex-1 px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <label className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-gray-300 text-sm text-gray-500 cursor-pointer hover:border-emerald-400 hover:text-emerald-600 transition-colors ${uploadingImg ? "opacity-50 pointer-events-none" : ""}`}>
                  {uploadingImg ? (
                    <div className="animate-spin w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full" />
                  ) : (
                    <Upload className="w-4 h-4" />
                  )}
                  Upload
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handleImageUpload(f);
                    }}
                  />
                </label>
              </div>
              {form.image_url && (
                <div className="mt-2 relative w-32 h-20 rounded-lg overflow-hidden border border-gray-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={form.image_url} alt="preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, image_url: "" })}
                    className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>

            {/* SEO keywords */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                SEO Keywords
              </label>
              <input
                value={form.seo_keywords}
                onChange={(e) => setForm({ ...form, seo_keywords: e.target.value })}
                placeholder="cat food, pet care, Algeria..."
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Published toggle */}
            <label className="flex items-center gap-3 cursor-pointer select-none w-fit">
              <div
                onClick={() => setForm({ ...form, published: !form.published })}
                className={`w-11 h-6 rounded-full transition-colors relative ${form.published ? "bg-emerald-500" : "bg-gray-300"}`}
              >
                <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.published ? "translate-x-5" : "translate-x-0.5"}`} />
              </div>
              <span className="text-sm font-medium text-gray-700">
                {form.published ? "Published" : "Draft"}
              </span>
            </label>

            {/* Actions */}
            <div className="flex gap-3 justify-end pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-medium hover:bg-emerald-700 transition-colors disabled:opacity-60 inline-flex items-center gap-2"
              >
                {saving && <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />}
                {editingPost ? "Update Post" : "Publish Post"}
              </button>
            </div>
          </form>
        </div>
      </>
    );
  }

  // ── LIST VIEW ─────────────────────────────────────────────────────────────
  return (
    <>
      <MiniConfirm
        open={confirmState.open}
        title="Delete Post"
        message="Are you sure you want to permanently delete this blog post? This cannot be undone."
        onConfirm={() => handleDelete(confirmState.slug)}
        onCancel={() => setConfirmState({ open: false, slug: "" })}
      />
      <MiniAlert {...alertState} onClose={() => setAlertState(s => ({ ...s, open: false }))} />

      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#0B1E36]">Blog Posts</h2>
              <p className="text-xs text-gray-400">{posts.length} post{posts.length !== 1 ? "s" : ""}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchPosts}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={openNew}
              className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-emerald-700 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              New Post
            </button>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="animate-spin w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full mx-auto mb-3" />
            <p className="text-sm text-gray-400">Loading posts…</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-base font-semibold text-gray-700 mb-1">No posts yet</h3>
            <p className="text-sm text-gray-400 mb-5">Create your first blog post to engage your audience.</p>
            <button
              onClick={openNew}
              className="inline-flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-emerald-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Write First Post
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Table header */}
            <div className="grid grid-cols-12 gap-2 px-6 py-3 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              <div className="col-span-1" />
              <div className="col-span-4">Title</div>
              <div className="col-span-2">Author</div>
              <div className="col-span-2">Date</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-1 text-right">Actions</div>
            </div>

            <div className="divide-y divide-gray-50">
              {posts.map((post) => {
                const title = post.title.ar || post.title.fr || post.title.en || "Untitled";
                const date = new Date(post.created_at);
                const dateStr = isNaN(date.getTime()) ? "—" : date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
                return (
                  <div
                    key={post.id}
                    className="grid grid-cols-12 gap-2 items-center px-6 py-4 hover:bg-gray-50/50 transition-colors"
                  >
                    {/* Cover thumbnail */}
                    <div className="col-span-1">
                      {post.image_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={post.image_url}
                          alt=""
                          className="w-9 h-9 rounded-lg object-cover border border-gray-100"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center">
                          <ImageIcon className="w-4 h-4 text-gray-300" />
                        </div>
                      )}
                    </div>

                    {/* Title */}
                    <div className="col-span-4">
                      <p className="text-sm font-semibold text-gray-900 truncate" dir="auto">{title}</p>
                      <p className="text-xs text-gray-400 font-mono truncate">/{post.slug}</p>
                    </div>

                    {/* Author */}
                    <div className="col-span-2 flex items-center gap-1.5 text-sm text-gray-500 min-w-0">
                      <User className="w-3.5 h-3.5 shrink-0 text-gray-300" />
                      <span className="truncate">{post.author}</span>
                    </div>

                    {/* Date */}
                    <div className="col-span-2 flex items-center gap-1.5 text-sm text-gray-500">
                      <Calendar className="w-3.5 h-3.5 shrink-0 text-gray-300" />
                      <span>{dateStr}</span>
                    </div>

                    {/* Status badge */}
                    <div className="col-span-2">
                      {post.published ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full text-xs font-semibold">
                          <CheckCircle className="w-3 h-3" /> Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-orange-600 bg-orange-50 border border-orange-100 px-2.5 py-1 rounded-full text-xs font-semibold">
                          <XCircle className="w-3 h-3" /> Draft
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="col-span-1 flex justify-end gap-1">
                      <button
                        onClick={() => openEdit(post)}
                        className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setConfirmState({ open: true, slug: post.slug })}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
