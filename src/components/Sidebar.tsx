import { useState, useEffect } from "react";
import { 
  FileText, Image, ScanText, Scissors, Combine, Minimize2, FileOutput, Home, 
  Sparkles, Languages, HelpCircle, Droplets, LogOut, X, Settings
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ThemeToggle from "./ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";

// ✅ NEW MODAL
import EditProfileModal from "./EditProfileModal";

export type ToolId = 
  | "home" 
  | "merge" | "split" | "compress-pdf" | "compress-img" | "convert"
  | "ocr" | "ai-summarize" | "ai-translate" | "ai-questions"
  | "add-watermark";

interface Tool {
  id: ToolId;
  label: string;
  icon: React.ElementType;
  category: string;
  description: string;
  beta?: boolean;
}

export const TOOLS: Tool[] = [
  { id: "home", label: "Home", icon: Home, category: "", description: "" },
  { id: "ai-summarize", label: "AI Summarize", icon: Sparkles, category: "AI Tools", description: "Summarize documents with AI" },
  { id: "ai-translate", label: "AI Translate", icon: Languages, category: "AI Tools", description: "Translate text to any language" },
  { id: "ai-questions", label: "Question Generator", icon: HelpCircle, category: "AI Tools", description: "Generate study questions" },
  { id: "ocr", label: "OCR Extract Text", icon: ScanText, category: "AI Tools", description: "Extract text from images" },
  { id: "merge", label: "Merge PDF", icon: Combine, category: "Organize", description: "Combine multiple PDFs" },
  { id: "split", label: "Split PDF", icon: Scissors, category: "Organize", description: "Split PDF into parts" },
  { id: "compress-pdf", label: "Compress PDF", icon: Minimize2, category: "Organize", description: "Reduce PDF file size" },
  { id: "add-watermark", label: "Add Watermark", icon: Droplets, category: "Editing", description: "Stamp watermark on PDF" },
  { id: "convert", label: "Convert", icon: FileOutput, category: "Convert", description: "Convert between formats", beta: true },
  { id: "compress-img", label: "Compress Image", icon: Image, category: "Convert", description: "Reduce image file size" },
];

const spring = { type: "spring" as const, stiffness: 400, damping: 30 };

interface SidebarProps {
  activeTool: ToolId;
  onSelectTool: (id: ToolId) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

const SidebarContent = ({ activeTool, onSelectTool }: { activeTool: ToolId; onSelectTool: (id: ToolId) => void }) => {
  const { user, signOut } = useAuth();

  const [profileOpen, setProfileOpen] = useState(false);
  const [profile, setProfile] = useState<{ full_name: string | null; avatar_url: string | null } | null>(null);

  let lastCategory = "";

  const displayName = profile?.full_name || user?.full_name || user?.email || "User";
  const avatarUrl = profile?.avatar_url || user?.avatar_url || undefined;
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <>
      {/* Navigation */}
      <nav className="flex-1 py-3 px-3 space-y-0.5 overflow-y-auto">
        {TOOLS.map((tool) => {
          const showCategory = tool.category && tool.category !== lastCategory;
          if (tool.category) lastCategory = tool.category;

          return (
            <div key={tool.id}>
              {showCategory && (
                <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide px-3 pt-4 pb-1.5">
                  {tool.category}
                </p>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={spring}
                onClick={() => onSelectTool(tool.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                  activeTool === tool.id
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                <tool.icon className="w-4 h-4" />
                {tool.label}
              </motion.button>
            </div>
          );
        })}
      </nav>

      {/* Profile Section */}
      <div className="p-4 border-t border-border/50 space-y-3">
        {user && (
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setProfileOpen(true)}
              className="flex items-center gap-2"
              aria-label="Open profile settings"
            >
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                {avatarUrl ? (
                  <img src={avatarUrl} alt={`${displayName} avatar`} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xs font-semibold text-primary">{initial}</span>
                )}
              </div>

              <div className="flex flex-col text-left">
                <span className="text-xs font-medium">{displayName}</span>
                <span className="text-[10px] text-muted-foreground">{user.email}</span>
              </div>
            </button>

            <div className="flex gap-1">
              <button type="button" onClick={() => setProfileOpen(true)} aria-label="Open profile settings">
                <Settings className="w-4 h-4" />
              </button>
              <button type="button" onClick={signOut} aria-label="Sign out">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        <p className="text-xs text-muted-foreground">AI Powered Tools</p>
      </div>

      {/* ✅ NEW MODAL */}
      <EditProfileModal
        isOpen={profileOpen}
        onClose={() => setProfileOpen(false)}
      />
    </>
  );
};

const Sidebar = ({ activeTool, onSelectTool }: SidebarProps) => {
  return (
    <aside className="hidden md:flex w-64 h-screen fixed left-0 top-0 bg-surface border-r flex-col">
      <div className="h-16 flex items-center justify-between px-5 border-b">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4" />
          <span>DocFlow AI</span>
        </div>
        <ThemeToggle />
      </div>

      <SidebarContent activeTool={activeTool} onSelectTool={onSelectTool} />
    </aside>
  );
};

export default Sidebar;
