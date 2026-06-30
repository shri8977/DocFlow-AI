import { useState } from "react";
import { Menu, FileText, User } from "lucide-react";

import Sidebar, { ToolId } from "@/components/Sidebar";
import StatusTicker from "@/components/StatusTicker";
import HomeView from "@/components/HomeView";
import ThemeToggle from "@/components/ThemeToggle";

// 🔥 Modal
import EditProfileModal from "@/components/EditProfileModal";

// Tools
import MergePDF from "@/tools/MergePDF";
import SplitPDF from "@/tools/SplitPDF";
import CompressImage from "@/tools/CompressImage";
import ConvertTool from "@/tools/ConvertTool";
import OCRTool from "@/tools/OCRTool";
import AISummarize from "@/tools/AISummarize";
import AITranslate from "@/tools/AITranslate";
import AIQuestions from "@/tools/AIQuestions";
import AddWatermark from "@/tools/AddWatermark";
import CompressPDF from "@/tools/CompressPDF";

const TOOL_COMPONENTS: Record<string, React.ComponentType<any> | null> = {
  merge: MergePDF,
  split: SplitPDF,
  "compress-img": CompressImage,
  "compress-pdf": CompressPDF,
  convert: ConvertTool,
  ocr: OCRTool,
  "ai-summarize": AISummarize,
  "ai-translate": AITranslate,
  "ai-questions": AIQuestions,
  "add-watermark": AddWatermark,
};

const Index = () => {
  const [activeTool, setActiveTool] = useState<ToolId>("home");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // 🔥 Profile modal state
  const [openProfile, setOpenProfile] = useState(false);

  const ActiveComponent =
    activeTool !== "home" ? TOOL_COMPONENTS[activeTool] : null;

  return (
    <div className="min-h-screen bg-background">
      
      {/* Sidebar */}
      <Sidebar
        activeTool={activeTool}
        onSelectTool={setActiveTool}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* 🔥 Mobile Header */}
      <header className="md:hidden fixed top-0 left-0 right-0 h-14 bg-surface border-b border-border/50 flex items-center justify-between px-4 z-30">
        
        {/* Menu */}
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="p-2 rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
            <FileText className="w-3.5 h-3.5 text-primary-foreground" />
          </div>
          <span className="font-semibold text-foreground text-sm tracking-tight">
            DocFlow AI
          </span>
        </div>

        {/* 🔥 RIGHT SIDE (FIXED) */}
        <div className="flex items-center gap-2">
          
          {/* Profile Button */}
          <button
            type="button"
            onClick={() => setOpenProfile(true)}
            className="p-2 rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
            aria-label="Open profile settings"
          >
            <User className="w-5 h-5" />
          </button>

          {/* Theme Toggle */}
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="md:ml-64 pb-12 pt-14 md:pt-0">
        <div className="max-w-4xl mx-auto px-4 md:px-8 py-8 md:py-12">
          {activeTool === "home" ? (
            <HomeView onSelectTool={setActiveTool} />
          ) : ActiveComponent ? (
            <ActiveComponent />
          ) : null}
        </div>
      </main>

      {/* Bottom ticker */}
      <StatusTicker />

      {/* 🔥 Profile Modal */}
      <EditProfileModal
        isOpen={openProfile}
        onClose={() => setOpenProfile(false)}
      />
    </div>
  );
};

export default Index;
