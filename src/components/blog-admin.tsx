"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, CheckCircle, XCircle } from "lucide-react";
import type { BlogPost } from "@/lib/use-translated-data";

export default function BlogAdminPanel({ adminSecret }: { adminSecret: string }) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState({
    slug: "",
    titleAr: "", titleFr: "", titleEn: "",
    contentAr: "", contentFr: "", contentEn: "",
    image_url: "", author: "", seo_keywords: "", published: false
  });

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = () => {
    fetch("/api/blog?admin=true")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setPosts(data);
        setLoading(false);
      })
      .catch(console.error);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      slug: form.slug,
      title: { ar: form.titleAr, fr: form.titleFr, en: form.titleEn },
      content: { ar: form.contentAr, fr: form.contentFr, en: form.contentEn },
      image_url: form.image_url,
      author: form.author,
      seo_keywords: form.seo_keywords,
      published: form.published
    };

    const url = editingPost ? `/api/blog/${editingPost.slug}` : "/api/blog";
    const method = editingPost ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "x-admin-secret": adminSecret
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setIsAdding(false);
        setEditingPost(null);
        fetchPosts();
      } else {
        const err = await res.json();
        alert(err.error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (slug: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    try {
      const res = await fetch(`/api/blog/${slug}`, {
        method: "DELETE",
        headers: { "x-admin-secret": adminSecret }
      });
      if (res.ok) fetchPosts();
    } catch (err) {
      console.error(err);
    }
  };

  const openEdit = (post: BlogPost) => {
    setForm({
      slug: post.slug,
      titleAr: post.title.ar || "", titleFr: post.title.fr || "", titleEn: post.title.en || "",
      contentAr: post.content.ar || "", contentFr: post.content.fr || "", contentEn: post.content.en || "",
      image_url: post.image_url || "", author: post.author, seo_keywords: (post as any).seo_keywords || "",
      published: post.published
    });
    setEditingPost(post);
    setIsAdding(true);
  };

  if (loading) return <div>Loading blog posts...</div>;

  if (isAdding) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold mb-4">{editingPost ? "Edit Post" : "Add New Post"}</h3>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Slug (URL friendly)</label>
              <input required value={form.slug} onChange={e => setForm({...form, slug: e.target.value})} className="w-full border rounded-lg p-2" placeholder="e.g. cat-care-tips" disabled={!!editingPost} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Author</label>
              <input required value={form.author} onChange={e => setForm({...form, author: e.target.value})} className="w-full border rounded-lg p-2" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title (AR)</label>
              <input required value={form.titleAr} onChange={e => setForm({...form, titleAr: e.target.value})} className="w-full border rounded-lg p-2" dir="rtl" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Title (FR)</label>
              <input required value={form.titleFr} onChange={e => setForm({...form, titleFr: e.target.value})} className="w-full border rounded-lg p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Title (EN)</label>
              <input required value={form.titleEn} onChange={e => setForm({...form, titleEn: e.target.value})} className="w-full border rounded-lg p-2" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Content (AR)</label>
              <textarea required rows={5} value={form.contentAr} onChange={e => setForm({...form, contentAr: e.target.value})} className="w-full border rounded-lg p-2" dir="rtl" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Content (FR)</label>
              <textarea required rows={5} value={form.contentFr} onChange={e => setForm({...form, contentFr: e.target.value})} className="w-full border rounded-lg p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Content (EN)</label>
              <textarea required rows={5} value={form.contentEn} onChange={e => setForm({...form, contentEn: e.target.value})} className="w-full border rounded-lg p-2" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Image URL</label>
            <input value={form.image_url} onChange={e => setForm({...form, image_url: e.target.value})} className="w-full border rounded-lg p-2" />
          </div>

          <div className="flex items-center gap-2">
            <input type="checkbox" id="published" checked={form.published} onChange={e => setForm({...form, published: e.target.checked})} className="w-4 h-4" />
            <label htmlFor="published" className="text-sm font-medium">Published</label>
          </div>

          <div className="flex gap-3 justify-end mt-6">
            <button type="button" onClick={() => setIsAdding(false)} className="px-4 py-2 border rounded-xl hover:bg-gray-50">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700">Save Post</button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold text-[#0B1E36]">Blog Posts</h2>
        <button onClick={() => {
          setEditingPost(null);
          setForm({ slug: "", titleAr: "", titleFr: "", titleEn: "", contentAr: "", contentFr: "", contentEn: "", image_url: "", author: "Pet Shop Team", seo_keywords: "", published: true });
          setIsAdding(true);
        }} className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-emerald-700 transition-colors shadow-sm shadow-emerald-600/20">
          <Plus className="w-4 h-4" /> Add Post
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 font-medium">
            <tr>
              <th className="px-6 py-4">Title</th>
              <th className="px-6 py-4">Author</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {posts.map(post => (
              <tr key={post.id} className="hover:bg-gray-50/50">
                <td className="px-6 py-4 font-medium text-gray-900">{post.title.en || post.title.ar || post.title.fr}</td>
                <td className="px-6 py-4 text-gray-500">{post.author}</td>
                <td className="px-6 py-4 text-gray-500">{new Date(post.created_at).toLocaleDateString()}</td>
                <td className="px-6 py-4">
                  {post.published ? <span className="inline-flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full text-xs font-medium"><CheckCircle className="w-3 h-3" /> Published</span> : <span className="inline-flex items-center gap-1 text-orange-600 bg-orange-50 px-2 py-1 rounded-full text-xs font-medium"><XCircle className="w-3 h-3" /> Draft</span>}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => openEdit(post)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(post.slug)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
