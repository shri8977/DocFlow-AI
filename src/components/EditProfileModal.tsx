import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useAuth } from "@/contexts/AuthContext";
import { updateUserProfile, loadUserProfile } from "@/lib/localAuth";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const avatars = [
  "https://api.dicebear.com/7.x/adventurer/svg?seed=A",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=B",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=C",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=D",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=E",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=F",
];

const EditProfileModal = ({ isOpen, onClose }: Props) => {
  const { user } = useAuth();

  const [name, setName] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState("");

  // 🔒 Lock scroll
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  // 🔥 Fetch profile from Supabase
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      const profileData = await loadUserProfile(user.id);
      setName(profileData.full_name || "");
      setSelectedAvatar(profileData.avatar_url || avatars[0]);
    };

    if (isOpen) fetchProfile();
  }, [user, isOpen]);

  const handleSave = async () => {
    if (!user) return;
    try {
      await updateUserProfile(user.id, {
        full_name: name,
        avatar_url: selectedAvatar,
      });
      console.log("Saved successfully ✅");
      onClose();
    } catch (error: any) {
      console.log("Error:", error.message);
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-zinc-900 rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-xl"
      >
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b">
          <h2 className="text-lg font-semibold">Edit Profile</h2>
          <button onClick={onClose}>✕</button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">

          {/* Avatar Preview */}
          <div className="flex flex-col items-center gap-2">
            <img
              src={selectedAvatar}
              className="w-20 h-20 rounded-full border"
            />
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>

          {/* Name */}
          <div>
            <label className="text-sm font-medium">Full Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
            />
          </div>

          {/* Avatar Picker */}
          <div>
            <label className="text-sm font-medium">Choose Avatar</label>

            <div className="grid grid-cols-3 gap-3 mt-3">
              {avatars.map((avatar) => (
                <img
                  key={avatar}
                  src={avatar}
                  onClick={() => setSelectedAvatar(avatar)}
                  className={`w-16 h-16 rounded-full cursor-pointer border-2 transition ${
                    selectedAvatar === avatar
                      ? "border-primary scale-105"
                      : "border-transparent hover:scale-105"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-lg bg-primary text-white hover:opacity-90"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default EditProfileModal;
