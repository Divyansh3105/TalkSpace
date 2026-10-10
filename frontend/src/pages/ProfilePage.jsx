import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAuthUser from "../hooks/useAuthUser";
import { updateUserProfile } from "../lib/api";
import { CameraIcon, SaveIcon, UserIcon } from "lucide-react";
import toast from "react-hot-toast";

const AVATAR_SIZE = 256;

// Center-crop to a square and re-encode as a small JPEG (~20-40KB),
// so any photo fits the backend's upload limit.
async function toAvatarDataUrl(file) {
  const img = await createImageBitmap(file);
  const side = Math.min(img.width, img.height);
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = AVATAR_SIZE;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#fff"; // JPEG has no alpha; avoid black behind transparent PNGs
  ctx.fillRect(0, 0, AVATAR_SIZE, AVATAR_SIZE);
  ctx.drawImage(
    img,
    (img.width - side) / 2,
    (img.height - side) / 2,
    side,
    side,
    0,
    0,
    AVATAR_SIZE,
    AVATAR_SIZE,
  );
  return canvas.toDataURL("image/jpeg", 0.85);
}

const ProfilePage = () => {
  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    fullName: authUser?.fullName || "",
    bio: authUser?.bio || "",
    location: authUser?.location || "",
  });

  const [imagePreview, setImagePreview] = useState(
    authUser?.profilePic || null,
  );
  const [profileImage, setProfileImage] = useState(null); // JPEG data URL

  const { mutate: updateProfile, isPending } = useMutation({
    mutationFn: updateUserProfile,
    onSuccess: () => {
      toast.success("Profile updated successfully");
      queryClient.invalidateQueries({ queryKey: ["authData"] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update profile");
    },
  });

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const dataUrl = await toAvatarDataUrl(file);
      setImagePreview(dataUrl);
      setProfileImage(dataUrl);
    } catch {
      toast.error("Couldn't read that image. Try a JPEG or PNG.");
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    const dataToSubmit = { ...formData };
    if (profileImage) {
      dataToSubmit.profileImage = profileImage;
    }
    updateProfile(dataToSubmit);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const field = "input input-bordered w-full bg-base-100";

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-3xl space-y-8">
        <header>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Your Profile</h1>
          <p className="text-base-content/60 mt-1 text-sm">
            Update your photo, name, bio and location.
          </p>
        </header>

        <form onSubmit={handleSave} className="panel overflow-hidden">
          {/* Identity */}
          <div className="flex flex-col sm:flex-row items-center gap-5 p-6 border-b border-base-content/[0.06]">
            <label
              htmlFor="avatar-upload"
              className="relative group cursor-pointer rounded-full focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 focus-within:ring-offset-base-200"
              title="Change photo"
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Profile preview"
                  className="size-24 rounded-full object-cover bg-base-300"
                />
              ) : (
                <div className="size-24 rounded-full bg-base-300 flex items-center justify-center text-base-content/30">
                  <UserIcon className="size-10" />
                </div>
              )}
              <span className="absolute inset-0 rounded-full bg-black/45 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <CameraIcon className="size-6" />
              </span>
              <span className="absolute -bottom-0.5 -right-0.5 bg-primary text-primary-content p-1.5 rounded-full ring-4 ring-base-200">
                <CameraIcon className="size-3.5" />
              </span>
              <input
                type="file"
                id="avatar-upload"
                className="sr-only"
                accept="image/*"
                onChange={handleImageChange}
              />
            </label>

            <div className="text-center sm:text-left min-w-0">
              <h2 className="font-semibold text-lg truncate">{authUser?.fullName}</h2>
              <p className="text-sm text-base-content/60 truncate">{authUser?.email}</p>
              <label htmlFor="avatar-upload" className="text-sm font-medium text-primary cursor-pointer hover:underline underline-offset-4 mt-1 inline-block">
                Change photo
              </label>
            </div>
          </div>

          {/* Details */}
          <div className="p-6 space-y-5">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium mb-1.5">
                Full name
              </label>
              <input
                id="fullName"
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Your name"
                maxLength={100}
                className={field}
              />
            </div>

            <div>
              <div className="flex items-baseline justify-between mb-1.5">
                <label htmlFor="bio" className="text-sm font-medium">Bio</label>
                <span className="text-xs text-base-content/50 tabular-nums">
                  {formData.bio.length}/300
                </span>
              </div>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Tell the world a bit about yourself"
                maxLength={300}
                rows={3}
                className="textarea textarea-bordered w-full bg-base-100 text-base resize-none"
              />
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium mb-1.5">
                Location
              </label>
              <input
                id="location"
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="City, Country"
                maxLength={100}
                className={field}
              />
            </div>
          </div>

          <div className="flex justify-end px-6 py-4 bg-base-content/[0.03] border-t border-base-content/[0.06]">
            <button type="submit" className="btn btn-primary gap-2 min-w-36" disabled={isPending}>
              {isPending ? (
                <span className="loading loading-spinner loading-xs" />
              ) : (
                <SaveIcon className="size-4" />
              )}
              {isPending ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
