import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api-client";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  MessageSquare, Paperclip, Send, Trash2, CornerDownRight, 
  FileText, X, AlertCircle, Loader2, Download 
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface DiscussionItem {
  id: string;
  courseId: string;
  topicId: string;
  userId: {
    id: string;
    name: string;
    email: string;
    role: string;
    avatar?: string | null;
  };
  content: string;
  attachment?: {
    name: string;
    url: string;
  };
  parentId: string | null;
  createdAt: string;
}

interface DiscussionsProps {
  courseId: string;
  topicId: string;
}

export default function Discussions({ courseId, topicId }: DiscussionsProps) {
  const { token, user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // States
  const [content, setContent] = useState("");
  const [replyToId, setReplyToId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [selectedFile, setSelectedFile] = useState<{ name: string; file: string } | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const API_BASE = import.meta.env.VITE_API_URL as string;

  useEffect(() => {
    if (topicId) {
      localStorage.setItem(`lastViewedDiscussion_${topicId}`, new Date().toISOString());
      queryClient.invalidateQueries({ queryKey: ["replies-activity"] });
    }
  }, [topicId, queryClient]);

  // Fetch discussions
  const { data: discussions = [], isLoading, error } = useQuery<DiscussionItem[]>({
    queryKey: ["discussions", topicId],
    queryFn: () => apiFetch<DiscussionItem[]>(`${API_BASE}/discussions?topicId=${topicId}`),
    enabled: !!topicId,
  });

  // Create discussion mutation
  const createMutation = useMutation({
    mutationFn: (data: {
      courseId: string;
      topicId: string;
      content: string;
      parentId?: string | null;
      attachment?: { name: string; file: string } | null;
    }) =>
      apiFetch<DiscussionItem>(`${API_BASE}/discussions`, {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["discussions", topicId] });
      localStorage.setItem(`lastViewedDiscussion_${topicId}`, new Date().toISOString());
      queryClient.invalidateQueries({ queryKey: ["replies-activity"] });
      setContent("");
      setReplyContent("");
      setReplyToId(null);
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      toast({
        title: "Message posted",
        description: "Your comment was published successfully.",
      });
    },
    onError: (err: any) => {
      toast({
        variant: "destructive",
        title: "Error posting message",
        description: err.message || "Something went wrong.",
      });
    },
  });

  // Delete discussion mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      apiFetch(`${API_BASE}/discussions/${id}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["discussions", topicId] });
      toast({
        title: "Deleted successfully",
        description: "The discussion post and its replies were deleted.",
      });
    },
    onError: (err: any) => {
      toast({
        variant: "destructive",
        title: "Deletion failed",
        description: err.message || "Failed to delete the post.",
      });
    },
  });

  // File change handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Limit to 5MB
    if (file.size > 5 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "File too large",
        description: "Please select a file smaller than 5MB.",
      });
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = () => {
      setSelectedFile({
        name: file.name,
        file: reader.result as string,
      });
      setIsUploading(false);
    };
    reader.onerror = () => {
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: "Could not read the selected file.",
      });
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handlePost = (e: React.FormEvent, parentId: string | null = null) => {
    e.preventDefault();
    const text = parentId ? replyContent : content;
    if (!text.trim() && !selectedFile) return;

    createMutation.mutate({
      courseId,
      topicId,
      content: text,
      parentId,
      attachment: selectedFile,
    });
  };

  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleString([], {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Build thread tree
  const rootDiscussions = discussions.filter((d) => !d.parentId);
  const getReplies = (parentId: string) =>
    discussions.filter((d) => d.parentId === parentId);

  const getDisplayName = (d: DiscussionItem) => {
    if (d.userId.role === "admin") {
      return "Tutour";
    }
    return d.userId.name;
  };

  const isAdmin = user?.role === "admin";

  return (
    <div className="mt-8 border-t border-border pt-6 space-y-6" id="discussions-section">
      <div className="flex items-center gap-2">
        <MessageSquare className="h-5 w-5 text-indigo-500" />
        <h3 className="font-heading text-lg font-bold text-foreground">Discussions</h3>
        <Badge variant="secondary" className="rounded-full px-2">
          {discussions.length}
        </Badge>
      </div>

      {/* Main post input */}
      <form onSubmit={(e) => handlePost(e, null)} className="space-y-3 bg-secondary/15 p-4 rounded-xl border border-border/50">
        <Textarea
          placeholder="Ask a question or share reference material..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[80px] bg-background border-border resize-none"
        />

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 gap-1.5"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              {isUploading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Paperclip className="h-3.5 w-3.5" />
              )}
              Attach Document
            </Button>

            {selectedFile && (
              <div className="flex items-center gap-1.5 bg-secondary/60 px-2.5 py-1 rounded-md text-xs border border-border">
                <FileText className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                <span className="truncate max-w-[150px] font-medium text-foreground">{selectedFile.name}</span>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedFile(null);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  className="text-muted-foreground hover:text-foreground transition-colors ml-1"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}
          </div>

          <Button 
            type="submit" 
            size="sm" 
            className="h-8 gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white"
            disabled={createMutation.isPending || (!content.trim() && !selectedFile)}
          >
            {createMutation.isPending ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Send className="h-3.5 w-3.5" />
            )}
            Post
          </Button>
        </div>
      </form>

      {/* Discussion List */}
      {isLoading ? (
        <div className="py-8 text-center text-sm text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-indigo-500" />
          Loading conversations...
        </div>
      ) : error ? (
        <div className="py-6 text-center text-sm text-red-500 flex items-center justify-center gap-1.5 border border-red-500/20 rounded-xl bg-red-500/5">
          <AlertCircle className="h-4 w-4" />
          Failed to load discussions.
        </div>
      ) : rootDiscussions.length === 0 ? (
        <div className="py-10 text-center text-sm text-muted-foreground italic border border-dashed border-border rounded-xl">
          No discussions yet. Be the first to start the conversation!
        </div>
      ) : (
        <div className="space-y-6">
          {rootDiscussions.map((root) => {
            const replies = getReplies(root.id);
            const isRootAdmin = root.userId.role === "admin";
            const avatarUrl = root.userId.avatar;

            return (
              <div key={root.id} className="group border border-border/60 rounded-xl p-4 bg-background hover:border-border transition-colors space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9 border border-border/80">
                      {avatarUrl ? (
                        <AvatarImage src={avatarUrl.startsWith('http') ? avatarUrl : `${API_BASE.replace('/api', '')}${avatarUrl}`} alt={getDisplayName(root)} />
                      ) : null}
                      <AvatarFallback className={isRootAdmin ? "bg-indigo-600 text-white font-bold" : "bg-slate-200 dark:bg-slate-800 text-foreground"}>
                        {isRootAdmin ? "TU" : getUserInitials(root.userId.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-semibold text-foreground">
                          {getDisplayName(root)}
                        </span>
                        {isRootAdmin && (
                          <Badge className="bg-indigo-500 hover:bg-indigo-600 text-white text-[10px] py-0.5 px-1.5 font-bold uppercase tracking-wider">
                            Tutour
                          </Badge>
                        )}
                      </div>
                      <span className="text-[10px] text-muted-foreground">
                        {formatTime(root.createdAt)}
                      </span>
                    </div>
                  </div>

                  {/* Actions (Delete for admin) */}
                  {isAdmin && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => deleteMutation.mutate(root.id)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>

                {/* Content */}
                <p className="text-sm text-foreground/90 leading-relaxed pl-1 whitespace-pre-line">
                  {root.content}
                </p>

                {/* Attachment */}
                {root.attachment && root.attachment.url && (
                  <div className="pl-1">
                    <a
                      href={`${API_BASE.replace('/api', '')}${root.attachment.url}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 p-2 px-3 rounded-lg border border-border bg-secondary/30 hover:bg-secondary/60 transition-colors text-xs text-foreground font-medium"
                    >
                      <FileText className="h-4 w-4 text-indigo-500" />
                      <span className="truncate max-w-[200px]">{root.attachment.name}</span>
                      <Download className="h-3 w-3 text-muted-foreground" />
                    </a>
                  </div>
                )}

                {/* Footer Controls */}
                <div className="flex items-center gap-4 pl-1 text-xs">
                  <button
                    onClick={() => {
                      setReplyToId(replyToId === root.id ? null : root.id);
                      setReplyContent("");
                    }}
                    className="text-indigo-500 hover:text-indigo-600 font-semibold hover:underline flex items-center gap-1"
                  >
                    <MessageSquare className="h-3 w-3" />
                    Reply
                  </button>
                  {replies.length > 0 && (
                    <span className="text-muted-foreground">
                      {replies.length} {replies.length === 1 ? "reply" : "replies"}
                    </span>
                  )}
                </div>

                {/* Replies Thread */}
                {replies.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-border/50 space-y-3 pl-4 border-l border-border/80 ml-4">
                    {replies.map((reply) => {
                      const isReplyAdmin = reply.userId.role === "admin";
                      const replyAvatarUrl = reply.userId.avatar;

                      return (
                        <div key={reply.id} className="group/reply flex items-start gap-3 bg-secondary/5 hover:bg-secondary/10 p-2.5 rounded-lg border border-border/20 transition-colors">
                          <Avatar className="h-7 w-7 border border-border/80">
                            {replyAvatarUrl ? (
                              <AvatarImage src={replyAvatarUrl.startsWith('http') ? replyAvatarUrl : `${API_BASE.replace('/api', '')}${replyAvatarUrl}`} alt={getDisplayName(reply)} />
                            ) : null}
                            <AvatarFallback className={isReplyAdmin ? "bg-indigo-600 text-white text-xs font-bold" : "bg-slate-200 dark:bg-slate-800 text-foreground text-xs"}>
                              {isReplyAdmin ? "TU" : getUserInitials(reply.userId.name)}
                            </AvatarFallback>
                          </Avatar>

                          <div className="flex-1 min-w-0 space-y-1">
                            <div className="flex items-center justify-between gap-3">
                              <div>
                                <div className="flex items-center gap-1.5">
                                  <span className="text-xs font-semibold text-foreground">
                                    {getDisplayName(reply)}
                                  </span>
                                  {isReplyAdmin && (
                                    <Badge className="bg-indigo-500 hover:bg-indigo-600 text-white text-[9px] py-0 px-1 font-bold uppercase tracking-wider scale-90">
                                      Tutour
                                    </Badge>
                                  )}
                                </div>
                                <span className="text-[9px] text-muted-foreground">
                                  {formatTime(reply.createdAt)}
                                </span>
                              </div>

                              {isAdmin && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 opacity-0 group-hover/reply:opacity-100 transition-opacity"
                                  onClick={() => deleteMutation.mutate(reply.id)}
                                  disabled={deleteMutation.isPending}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              )}
                            </div>

                            <p className="text-xs text-foreground/90 leading-relaxed whitespace-pre-line">
                              {reply.content}
                            </p>

                            {/* Reply attachment */}
                            {reply.attachment && reply.attachment.url && (
                              <div className="pt-1">
                                <a
                                  href={`${API_BASE.replace('/api', '')}${reply.attachment.url}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1.5 p-1 px-2.5 rounded border border-border bg-secondary/30 hover:bg-secondary/60 transition-colors text-[10px] text-foreground font-medium"
                                >
                                  <FileText className="h-3.5 w-3.5 text-indigo-500" />
                                  <span className="truncate max-w-[150px]">{reply.attachment.name}</span>
                                  <Download className="h-2.5 w-2.5 text-muted-foreground" />
                                </a>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Inline Reply Input Box */}
                {replyToId === root.id && (
                  <form onSubmit={(e) => handlePost(e, root.id)} className="mt-3 pl-4 flex flex-col gap-2 border-l border-border/80 ml-4 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <CornerDownRight className="h-3.5 w-3.5" />
                      <span>Replying to {getDisplayName(root)}</span>
                    </div>

                    <Textarea
                      placeholder="Type your reply here..."
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      className="min-h-[60px] bg-background border-border text-xs resize-none"
                    />

                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <input
                          type="file"
                          id={`file-reply-${root.id}`}
                          onChange={handleFileChange}
                          className="hidden"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="xs"
                          className="h-7 text-[10px] gap-1 px-2"
                          onClick={() => document.getElementById(`file-reply-${root.id}`)?.click()}
                          disabled={isUploading}
                        >
                          {isUploading ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <Paperclip className="h-3 w-3" />
                          )}
                          Attach File
                        </Button>

                        {selectedFile && (
                          <div className="flex items-center gap-1.5 bg-secondary/60 px-2 py-0.5 rounded text-[10px] border border-border">
                            <FileText className="h-3 w-3 text-indigo-500 shrink-0" />
                            <span className="truncate max-w-[120px] font-medium text-foreground">{selectedFile.name}</span>
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedFile(null);
                              }}
                              className="text-muted-foreground hover:text-foreground transition-colors ml-1"
                            >
                              <X className="h-2.5 w-2.5" />
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="xs"
                          className="h-7 text-[10px] text-muted-foreground"
                          onClick={() => {
                            setReplyToId(null);
                            setSelectedFile(null);
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          size="xs"
                          className="h-7 text-[10px] gap-1 px-2.5 bg-indigo-600 hover:bg-indigo-700 text-white"
                          disabled={createMutation.isPending || (!replyContent.trim() && !selectedFile)}
                        >
                          {createMutation.isPending ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <Send className="h-3 w-3" />
                          )}
                          Reply
                        </Button>
                      </div>
                    </div>
                  </form>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
