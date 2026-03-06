import React, { useState, useEffect } from "react";
import { MessageSquare, Pencil, Trash2, X, FileText, UploadCloud } from "lucide-react";
import { toast } from "react-toastify";
import { apiClient } from "../../services/apiClient";
import { confirmAction } from "../../utils/confirmToast.jsx";

export default function MyCareerWallPosts({ user }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edit Modal State
  const [editingPost, setEditingPost] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user?.id) {
      fetchPosts();
    }
  }, [user]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get(`/community/thoughts/?user=${user.id}`);
      setPosts(res.data.results || res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    confirmAction("Delete this post permanently?", async () => {
      try {
        await apiClient.delete(`/community/thoughts/${id}/`);
        toast.success("Post removed.");
        fetchPosts();
      } catch (err) {
        toast.error("Failed to delete post.");
        console.error(err);
      }
    });
  };

  const handleEditClick = (post) => {
    setEditingPost(post);
    setTitle(post.title);
    setDescription(post.description);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      // Not handling resume edit for simplicity, they can view/delete and re-post or stick to text
      
      await apiClient.patch(`/community/thoughts/${editingPost.id}/`, formData);
      toast.success("Post updated!");
      setEditingPost(null);
      fetchPosts();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update post.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return null; // Or a spinner, but dashboard has its own.

  if (posts.length === 0) return null; // Don't show the section if they have no posts.

  return (
    <div className="space-y-4 pt-10 border-t border-slate-100 mt-10">
      <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-4">
        Your Career Wall Posts
      </h2>
      
      <div className="grid gap-4">
        {posts.map((post) => (
          <div key={post.id} className="group flex flex-col md:flex-row items-start md:items-center justify-between p-7 bg-white border border-slate-100 rounded-[2.5rem] hover:border-primary-200 transition-all hover:shadow-sm">
            <div className="flex items-center gap-6 w-full md:w-auto overflow-hidden">
                <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100">
                    <MessageSquare size={24} className="text-slate-400" />
                </div>
                <div className="min-w-0 pr-4">
                    <h3 className="text-lg font-bold text-slate-900 truncate uppercase tracking-tight">{post.title}</h3>
                    <p className="text-[11px] text-slate-400 font-bold mt-1.5 truncate max-w-sm">{post.description}</p>
                </div>
            </div>
            
            <div className="flex items-center gap-4 mt-6 md:mt-0 w-full md:w-auto justify-end border-t border-slate-50 md:border-t-0 pt-4 md:pt-0">
               {post.resume_file && (
                 <a href={post.resume_file} target="_blank" rel="noopener noreferrer" title="View Attachment" className="p-4 rounded-2xl bg-white border border-slate-100 text-slate-400 hover:text-primary-600 transition-all">
                    <FileText size={18} />
                 </a>
               )}
               <div className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-100 text-rose-500 font-black text-[12px]">
                 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-thumbs-up"><path d="M7 10v12"/><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z"/></svg>
                 <span>{post.likes_count || 0}</span>
               </div>
               <button onClick={() => handleEditClick(post)} title="Edit Post" className="p-4 rounded-2xl bg-white border border-slate-100 text-slate-400 hover:text-primary-600 hover:bg-primary-50 transition-all">
                 <Pencil size={18} />
               </button>
               <button onClick={() => handleDelete(post.id)} title="Delete Post" className="p-4 rounded-2xl bg-white border border-slate-100 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all">
                 <Trash2 size={18} />
               </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editingPost && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white border border-slate-100 rounded-[2rem] w-full max-w-xl shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/20">
              <h2 className="text-xl font-serif font-black text-slate-900">Edit Post</h2>
              <button onClick={() => setEditingPost(null)} className="p-2 rounded-full hover:bg-slate-100 transition-colors">
                <X size={20} className="text-slate-300" />
              </button>
            </div>
            <form onSubmit={handleUpdate} className="p-8 space-y-6">
              <div>
                 <label className="block text-[10px] font-black uppercase tracking-widest text-[#27187E] ml-2 mb-2">
                    Title / Role
                 </label>
                 <input 
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm text-slate-900 focus:ring-primary-500 font-bold"
                 />
              </div>
              <div>
                 <label className="block text-[10px] font-black uppercase tracking-widest text-[#27187E] ml-2 mb-2">
                    Description
                 </label>
                 <textarea 
                    required
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 rounded-3xl px-6 py-5 text-sm text-slate-900 focus:ring-primary-500 font-medium resize-none"
                 ></textarea>
              </div>
              <div className="flex justify-end pt-2 gap-4">
                 <button type="button" onClick={() => setEditingPost(null)} className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-600 transition-colors">Cancel</button>
                 <button disabled={isSubmitting} type="submit" className="px-8 py-4 bg-[#27187E] text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-primary-600 transition-all">
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                 </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
