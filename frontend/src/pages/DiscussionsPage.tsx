import React, { useState, useEffect } from "react";
import {
  MessageSquare,
  Search,
  TrendingUp,
  FileText,
  DollarSign,
  BookOpen,
  Monitor,
  ThumbsUp,
  MessageCircle,
  Eye,
  Plus,
  AlertCircle as AlertIcon,
  Clock,
  User,
  X,
  Send,
  ArrowLeft,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

interface Comment {
  id: number;
  content: string;
  author: {
    name: string;
    avatar?: string;
  };
  createdAt: string;
  likes: number;
  isLiked?: boolean;
}

interface Post {
  id: number;
  title: string;
  content: string;
  category:
    | "interviews"
    | "resumereview"
    | "compensation"
    | "trends"
    | "showcase";
  author: {
    name: string;
    avatar?: string;
  };
  createdAt: string;
  likes: number;
  comments: Comment[];
  views: number;
  tags: string[];
  isLiked?: boolean;
}

interface NewPost {
  title: string;
  content: string;
  category: Post["category"];
  tags: string[];
}

const DiscussionsPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(
    null
  );
  const [activeCategory, setActiveCategory] =
    useState<Post["category"]>("interviews");
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [newComment, setNewComment] = useState("");
  const navigate = useNavigate();

  const [posts, setPosts] = useState<Post[]>([
    {
      id: 1,
      title: "My Experience with FAANG Interview Process",
      content: `Here's my detailed experience with the interview process at FAANG companies.

The process typically consisted of:
1. Initial recruiter screen
2. Technical phone screen
3. On-site interviews (virtual due to COVID)
4. Team matching

Key Tips:
- Focus on system design for senior roles
- Practice behavioral questions extensively
- Be prepared for cross-functional discussions
- Keep track of your previous answers

The entire process took about 6 weeks from start to finish. The most challenging part was the system design round, where I had to design a real-time notification system.`,
      category: "interviews",
      author: { name: "John Doe" },
      createdAt: "2 hours ago",
      likes: 45,
      comments: [
        {
          id: 1,
          content: "Thanks for sharing! How long did the entire process take?",
          author: { name: "Alice Cooper" },
          createdAt: "1 hour ago",
          likes: 5,
        },
        {
          id: 2,
          content: "Could you share more about the system design round?",
          author: { name: "Bob Wilson" },
          createdAt: "30 minutes ago",
          likes: 3,
        },
      ],
      views: 230,
      tags: ["interview", "tech", "FAANG"],
    },
    {
      id: 2,
      title: "Please Review My Software Engineer Resume",
      content: `I'm applying for senior positions and would appreciate feedback on my resume.

Current Role: Full Stack Developer at TechCorp
Experience: 5 years

Key Skills:
- React, Node.js, TypeScript
- AWS, Docker, Kubernetes
- System Design & Architecture
- Team Leadership

I'm particularly looking for feedback on:
1. How to better highlight leadership experience
2. Whether to include more technical details
3. Project impact quantification

Any suggestions would be greatly appreciated!`,
      category: "resumereview",
      author: { name: "Jane Smith" },
      createdAt: "1 day ago",
      likes: 15,
      comments: [
        {
          id: 3,
          content: "Add more metrics to show impact in your current role",
          author: { name: "Career Coach" },
          createdAt: "12 hours ago",
          likes: 8,
        },
      ],
      views: 120,
      tags: ["resume", "review", "senior"],
    },
  ]);

  const [newPost, setNewPost] = useState<NewPost>({
    title: "",
    content: "",
    category: "interviews",
    tags: [],
  });

  const categories = [
    {
      id: "interviews",
      name: "Interview Experiences",
      icon: BookOpen,
      description: "Share and learn from interview experiences",
    },
    {
      id: "resumereview",
      name: "Resume Review",
      icon: FileText,
      description: "Get feedback on your resume",
    },
    {
      id: "compensation",
      name: "Compensation",
      icon: DollarSign,
      description: "Discuss salary and benefits",
    },
    {
      id: "trends",
      name: "Industry Trends",
      icon: TrendingUp,
      description: "Stay updated with industry trends",
    },
    {
      id: "showcase",
      name: "Project Showcase",
      icon: Monitor,
      description: "Share your work and get feedback",
    },
  ];

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    if (token) {
      setIsLoggedIn(true);
      if (userData) {
        setUser(JSON.parse(userData));
      }
    }
  }, []);

  const handleCreatePost = () => {
    if (newPost.title && newPost.content) {
      setPosts([
        {
          id: posts.length + 1,
          ...newPost,
          author: { name: user?.name || "Anonymous" },
          createdAt: "Just now",
          likes: 0,
          comments: [],
          views: 0,
        },
        ...posts,
      ]);
      setNewPost({
        title: "",
        content: "",
        category: "interviews",
        tags: [],
      });
      setShowCreateModal(false);
    }
  };

  const handleLikePost = (postId: number) => {
    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          const wasLiked = post.isLiked;
          return {
            ...post,
            likes: wasLiked ? post.likes - 1 : post.likes + 1,
            isLiked: !wasLiked,
          };
        }
        return post;
      })
    );
  };

  const handleLikeComment = (postId: number, commentId: number) => {
    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            comments: post.comments.map((comment) => {
              if (comment.id === commentId) {
                const wasLiked = comment.isLiked;
                return {
                  ...comment,
                  likes: wasLiked ? comment.likes - 1 : comment.likes + 1,
                  isLiked: !wasLiked,
                };
              }
              return comment;
            }),
          };
        }
        return post;
      })
    );
  };

  const handleAddComment = (postId: number) => {
    if (!newComment.trim()) return;

    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            comments: [
              ...post.comments,
              {
                id: post.comments.length + 1,
                content: newComment,
                author: { name: user?.name || "Anonymous" },
                createdAt: "Just now",
                likes: 0,
              },
            ],
          };
        }
        return post;
      })
    );
    setNewComment("");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
  };

  const getCategoryIcon = (categoryId: string) => {
    const category = categories.find((cat) => cat.id === categoryId);
    if (!category) return MessageSquare;
    const Icon = category.icon;
    return Icon;
  };

  const PostDetailView = ({ post }: { post: Post }) => {
    const Icon = getCategoryIcon(post.category);

    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
        <div className="bg-gray-900 border border-purple-500/20 rounded-xl w-full max-w-3xl shadow-xl overflow-hidden animate-slideIn my-8">
          <div className="border-b border-purple-500/20 p-4 bg-gray-900/50 flex justify-between items-center sticky top-0 backdrop-blur-md">
            <div className="flex items-center">
              <Icon className="text-purple-400 mr-2" size={20} />{" "}
              <h2 className="text-xl font-semibold text-purple-100">
                {post.title}
              </h2>
            </div>
            <button
              onClick={() => setSelectedPost(null)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-6 bg-gray-900/30">
            {/* Author Info & Metadata */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center border border-purple-500/30">
                  <User size={20} className="text-purple-400" />
                </div>
                <div>
                  <div className="font-medium text-purple-100">
                    {post.author.name}
                  </div>
                  <div className="text-sm text-gray-400">{post.createdAt}</div>
                </div>
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-400">
                <div className="flex items-center">
                  <Eye size={16} className="mr-1" />
                  {post.views}
                </div>
                <div className="flex items-center">
                  <MessageCircle size={16} className="mr-1" />
                  {post.comments.length}
                </div>
              </div>
            </div>

            {/* Post Content */}
            <div className="prose prose-invert max-w-none mb-6">
              {post.content.split("\n").map((paragraph, idx) => (
                <p key={idx} className="text-gray-300 mb-4">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 rounded-full text-xs bg-purple-500/10 text-purple-300 border border-purple-500/20"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Like Button */}
            <div className="flex items-center space-x-6 py-4 border-t border-purple-500/20">
              <button
                onClick={() => handleLikePost(post.id)}
                className={`flex items-center space-x-2 transition-colors ${
                  post.isLiked
                    ? "text-purple-400"
                    : "text-gray-400 hover:text-purple-400"
                }`}
              >
                <ThumbsUp size={16} />
                <span>{post.likes}</span>
              </button>
            </div>

            {/* Comments Section */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-purple-100 mb-4">
                Comments ({post.comments.length})
              </h3>

              <div className="space-y-4 mb-6">
                {post.comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="bg-gray-800/50 rounded-lg p-4 border border-purple-500/10"
                  >
                    <div className="flex justify-between mb-2">
                      <div className="flex items-center space-x-2 text-sm">
                        <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center">
                          <User size={12} className="text-purple-400" />
                        </div>
                        <span className="font-medium text-purple-200">
                          {comment.author.name}
                        </span>
                        <span className="text-gray-400">
                          {comment.createdAt}
                        </span>
                      </div>
                      <button
                        onClick={() => handleLikeComment(post.id, comment.id)}
                        className={`flex items-center space-x-2 transition-colors ${
                          comment.isLiked
                            ? "text-purple-400"
                            : "text-gray-400 hover:text-purple-400"
                        }`}
                      >
                        <ThumbsUp size={12} />
                        <span className="text-sm">{comment.likes}</span>
                      </button>
                    </div>
                    <p className="text-gray-300 text-sm">{comment.content}</p>
                  </div>
                ))}
              </div>

              {isLoggedIn ? (
                <div className="relative">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a comment..."
                    className="w-full bg-gray-800 rounded-lg px-4 py-3 pr-12 border border-purple-500/20 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none transition-all duration-300 text-white placeholder-gray-500 min-h-[100px]"
                  />
                  <button
                    onClick={() => handleAddComment(post.id)}
                    disabled={!newComment.trim()}
                    className="absolute right-3 bottom-3 p-2 text-purple-400 hover:text-purple-300 disabled:text-gray-600 transition-colors"
                  >
                    <Send size={20} />
                  </button>
                </div>
              ) : (
                <div className="text-center py-4 bg-gray-800/50 rounded-lg border border-purple-500/20">
                  <p className="text-gray-400">
                    Please{" "}
                    <button
                      onClick={() => navigate("/login")}
                      className="text-purple-400 hover:text-purple-300"
                    >
                      log in
                    </button>{" "}
                    to comment on this post
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="text-gray-100 min-h-screen bg-gradient-to-br from-gray-950 via-purple-950 to-gray-950">
      <div className="container mx-auto px-4 py-8 max-w-6xl relative">
        <Navbar isLoggedIn={isLoggedIn} user={user} onLogout={handleLogout} />

        {/* Beta Banner */}
        <div className="py-3 px-6 text-center">
          <div className="flex items-center justify-center gap-x-4 text-white/90 font-medium">
            <div className="flex items-center gap-2 bg-purple-500/10 rounded-full px-4 py-1.5 border border-purple-400/20">
              <span className="animate-pulse text-lg">✨</span>
              <span className="text-sm font-semibold">Coming Soon</span>
            </div>

            <span className="text-sm">
              Discussions feature is in development
            </span>

            <div className="flex items-center gap-2 bg-purple-500/10 rounded-full px-4 py-1.5 border border-purple-400/20">
              <span className="h-2 w-2 rounded-full bg-purple-400 animate-pulse"></span>
              <span className="text-sm font-light text-purple-200">
                Beta Phase
              </span>
            </div>
          </div>
        </div>

        <style>{`
 @keyframes gradient {
   0% { background-position: 0% 50%; }
   50% { background-position: 100% 50%; }
   100% { background-position: 0% 50%; }
 }
 .animate-gradient {
   background-size: 200% 200%;
   animation: gradient 15s ease infinite;
 }
`}</style>

        {selectedPost ? (
          // Post Detail View
          <div className="animate-fadeIn">
            {/* Back Button */}
            <button
              onClick={() => setSelectedPost(null)}
              className="mb-6 flex items-center text-gray-400 hover:text-white transition-colors group"
            >
              <ArrowLeft
                className="mr-2 group-hover:-translate-x-1 transition-transform"
                size={20}
              />
              Back to Discussions
            </button>

            {/* Post Header */}
            <div className="mb-8">
              <div className="flex items-center space-x-2 mb-3">
                {React.createElement(getCategoryIcon(selectedPost.category), {
                  size: 24,
                  className: "text-purple-400",
                })}
                <span className="text-gray-400">
                  {categories.find((c) => c.id === selectedPost.category)?.name}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-purple-100 mb-4">
                {selectedPost.title}
              </h1>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center border border-purple-500/30">
                    <User size={20} className="text-purple-400" />
                  </div>
                  <div>
                    <div className="font-medium text-purple-100">
                      {selectedPost.author.name}
                    </div>
                    <div className="text-sm text-gray-400">
                      {selectedPost.createdAt}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-6 text-sm text-gray-400">
                  <div className="flex items-center">
                    <Eye size={16} className="mr-1" />
                    {selectedPost.views}
                  </div>
                  <div className="flex items-center">
                    <MessageCircle size={16} className="mr-1" />
                    {selectedPost.comments.length}
                  </div>
                  <button
                    onClick={() => handleLikePost(selectedPost.id)}
                    className={`flex items-center space-x-2 transition-colors ${
                      selectedPost.isLiked
                        ? "text-purple-400"
                        : "text-gray-400 hover:text-purple-400"
                    }`}
                  >
                    <ThumbsUp size={16} />
                    <span>{selectedPost.likes}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="bg-gray-900/40 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6 mb-8">
              <div className="prose prose-invert max-w-none mb-6">
                {selectedPost.content.split("\n").map((paragraph, idx) => (
                  <p key={idx} className="text-gray-300 mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>

              <div className="flex flex-wrap gap-2 pt-4 border-t border-purple-500/20">
                {selectedPost.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 rounded-full text-xs bg-purple-500/10 text-purple-300 border border-purple-500/20"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Comments */}
            <div className="bg-gray-900/40 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-purple-100 mb-6">
                Comments ({selectedPost.comments.length})
              </h2>

              {isLoggedIn && (
                <div className="mb-8">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a comment..."
                    className="w-full bg-gray-800 rounded-lg px-4 py-3 border border-purple-500/20 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none transition-all duration-300 text-white placeholder-gray-500 min-h-[100px] mb-4"
                  />
                  <button
                    onClick={() => handleAddComment(selectedPost.id)}
                    disabled={!newComment.trim()}
                    className="px-6 py-2 rounded-full bg-purple-600 hover:bg-purple-500 transition-all duration-300 transform hover:scale-105 text-white disabled:opacity-50 disabled:hover:bg-purple-600 disabled:hover:scale-100 flex items-center"
                  >
                    <Send size={16} className="mr-2" />
                    Post Comment
                  </button>
                </div>
              )}

              <div className="space-y-6">
                {selectedPost.comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="bg-gray-800/50 rounded-lg p-4 border border-purple-500/10"
                  >
                    <div className="flex justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                          <User size={16} className="text-purple-400" />
                        </div>
                        <div>
                          <div className="font-medium text-purple-200">
                            {comment.author.name}
                          </div>
                          <div className="text-sm text-gray-400">
                            {comment.createdAt}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() =>
                          handleLikeComment(selectedPost.id, comment.id)
                        }
                        className={`flex items-center space-x-2 transition-colors ${
                          comment.isLiked
                            ? "text-purple-400"
                            : "text-gray-400 hover:text-purple-400"
                        }`}
                      >
                        <ThumbsUp size={14} />
                        <span>{comment.likes}</span>
                      </button>
                    </div>
                    <p className="text-gray-300 mt-2">{comment.content}</p>
                  </div>
                ))}

                {!isLoggedIn && (
                  <div className="text-center py-4 bg-gray-800/50 rounded-lg border border-purple-500/20">
                    <p className="text-gray-400">
                      Please{" "}
                      <button
                        onClick={() => navigate("/login")}
                        className="text-purple-400 hover:text-purple-300"
                      >
                        log in
                      </button>{" "}
                      to comment on this post
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          // Posts List View
          <>
            {/* Header Section */}
            <div className="relative mb-12 animate-fadeIn">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-4xl font-bold flex items-center mb-2 text-purple-100 hover:text-purple-200 transition-colors">
                    <MessageSquare className="mr-4 text-purple-400" size={32} />
                    Discussions
                  </h1>
                  <p className="text-gray-400 ml-12">
                    Join the conversation with fellow professionals
                  </p>
                </div>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="bg-purple-700 hover:bg-purple-600 px-6 py-3 rounded-full font-semibold flex items-center transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-purple-600/20 active:scale-95"
                >
                  <Plus size={20} className="mr-2" />
                  Create Post
                </button>
              </div>
            </div>

            {/* Category Tabs */}
            <div className="mb-8">
              <div className="flex overflow-x-auto space-x-4 pb-4">
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <button
                      key={category.id}
                      onClick={() =>
                        setActiveCategory(category.id as Post["category"])
                      }
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all duration-300 ${
                        activeCategory === category.id
                          ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                          : "text-gray-400 hover:text-purple-300 hover:bg-purple-500/10"
                      }`}
                    >
                      <Icon size={18} />
                      <span>{category.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Search */}
            <div className="mb-8">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  className="w-full bg-gray-900/40 border border-purple-500/20 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-purple-500 transition-colors text-gray-100 placeholder-gray-500"
                  placeholder="Search discussions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Posts List */}
            <div className="space-y-4 mb-16">
              {posts
                .filter((post) => post.category === activeCategory)
                .map((post, index) => {
                  const Icon = getCategoryIcon(post.category);
                  return (
                    <div
                      key={post.id}
                      onClick={() => setSelectedPost(post)}
                      className="bg-gray-900/40 backdrop-blur-sm border border-purple-500/20 rounded-lg hover:border-purple-500/40 transition-all duration-300 group animate-fadeIn cursor-pointer"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="p-5">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <Icon className="text-purple-400" size={18} />
                              <span className="text-sm text-gray-400">
                                {
                                  categories.find((c) => c.id === post.category)
                                    ?.name
                                }
                              </span>
                            </div>
                            <h3 className="text-lg font-semibold text-purple-100 group-hover:text-purple-300 transition-colors mb-2">
                              {post.title}
                            </h3>
                            <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                              {post.content}
                            </p>
                            <div className="flex flex-wrap gap-2 mb-4">
                              {post.tags.map((tag, tagIndex) => (
                                <span
                                  key={tagIndex}
                                  className="px-2 py-1 rounded-full text-xs bg-purple-500/10 text-purple-300 border border-purple-500/20"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-400">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center">
                              <User size={14} className="mr-1" />
                              {post.author.name}
                            </div>
                            <div className="flex items-center">
                              <Clock size={14} className="mr-1" />
                              {post.createdAt}
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center">
                              <ThumbsUp size={14} className="mr-1" />
                              {post.likes}
                            </div>
                            <div className="flex items-center">
                              <MessageCircle size={14} className="mr-1" />
                              {post.comments.length}
                            </div>
                            <div className="flex items-center">
                              <Eye size={14} className="mr-1" />
                              {post.views}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>

            {/* Post Detail Modal */}
            {selectedPost && <PostDetailView post={selectedPost} />}

            {/* Create Post Modal */}
            {showCreateModal && (
              <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-gray-900 border border-purple-500/20 rounded-xl w-full max-w-2xl shadow-xl overflow-hidden animate-slideIn">
                  <div className="border-b border-purple-500/20 p-4 bg-gray-900/50">
                    <h2 className="text-xl font-semibold text-purple-100 flex items-center">
                      <AlertIcon className="mr-2 text-purple-400" size={20} />
                      Create New Post
                    </h2>
                  </div>
                  <div className="p-6 bg-gray-900/30">
                    <div className="space-y-4">
                      {/* Title */}
                      <div>
                        <label className="block text-sm font-medium mb-2 text-purple-100">
                          Title
                        </label>
                        <input
                          type="text"
                          className="w-full bg-gray-800 rounded-lg px-4 py-2 border border-purple-500/20 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none transition-all duration-300 text-white placeholder-gray-500"
                          value={newPost.title}
                          onChange={(e) =>
                            setNewPost({ ...newPost, title: e.target.value })
                          }
                          placeholder="Enter post title"
                        />
                      </div>

                      {/* Category Select */}
                      <div>
                        <label className="block text-sm font-medium mb-2 text-purple-100">
                          Category
                        </label>
                        <select
                          className="w-full bg-gray-800 rounded-lg px-4 py-2 border border-purple-500/20 focus:border-purple-500 focus:outline-none transition-all duration-300 text-white"
                          value={newPost.category}
                          onChange={(e) =>
                            setNewPost({
                              ...newPost,
                              category: e.target.value as Post["category"],
                            })
                          }
                        >
                          {categories.map((category) => (
                            <option
                              key={category.id}
                              value={category.id}
                              className="bg-gray-900"
                            >
                              {category.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Content */}
                      <div>
                        <label className="block text-sm font-medium mb-2 text-purple-100">
                          Content
                        </label>
                        <textarea
                          className="w-full bg-gray-800 rounded-lg px-4 py-2 border border-purple-500/20 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none transition-all duration-300 text-white placeholder-gray-500 min-h-[200px]"
                          value={newPost.content}
                          onChange={(e) =>
                            setNewPost({ ...newPost, content: e.target.value })
                          }
                          placeholder="Write your post content..."
                        />
                      </div>

                      {/* Tags */}
                      <div>
                        <label className="block text-sm font-medium mb-2 text-purple-100">
                          Tags (comma separated)
                        </label>
                        <input
                          type="text"
                          className="w-full bg-gray-800 rounded-lg px-4 py-2 border border-purple-500/20 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none transition-all duration-300 text-white placeholder-gray-500"
                          value={newPost.tags.join(", ")}
                          onChange={(e) =>
                            setNewPost({
                              ...newPost,
                              tags: e.target.value
                                .split(",")
                                .map((tag) => tag.trim()),
                            })
                          }
                          placeholder="Enter tags (e.g. interview, tech, career)"
                        />
                      </div>

                      {/* Action Buttons */}
                      <div className="flex justify-end space-x-4 pt-4 border-t border-purple-500/20">
                        <button
                          onClick={() => setShowCreateModal(false)}
                          className="px-6 py-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-all duration-300 text-gray-300"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleCreatePost}
                          className="px-6 py-2 rounded-full bg-purple-600 hover:bg-purple-500 transition-all duration-300 transform hover:scale-105 text-white disabled:opacity-50 disabled:hover:bg-purple-600 disabled:hover:scale-100"
                          disabled={!newPost.title || !newPost.content}
                        >
                          Create Post
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        <Footer />
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default DiscussionsPage;
