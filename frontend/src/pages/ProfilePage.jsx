import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAuthUser from "../hooks/useAuthUser";
import { updateUserProfile } from "../lib/api";
import { CameraIcon, SaveIcon, UserIcon } from "lucide-react";
import toast from "react-hot-toast";

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
  const [profileImage, setProfileImage] = useState(null); // Will hold base64 string

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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate size (e.g., max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be less than 2MB");
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setImagePreview(reader.result);
      setProfileImage(reader.result); // Base64 string for the backend
    };
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

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto max-w-4xl space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Your Profile
            </h1>
            <p className="text-base-content/60 mt-1 text-sm">
              Update your personal information and languages.
            </p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left Column: Avatar & Quick Info */}
            <div className="md:col-span-1 space-y-6">
              <section className="glass-panel p-6 rounded-2xl flex flex-col items-center text-center space-y-4">
                <div className="relative group cursor-pointer">
                  <div className="avatar">
                    <div className="w-32 rounded-full border-4 border-base-100 shadow-xl overflow-hidden bg-base-200">
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="Profile preview"
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-base-content/30">
                          <UserIcon className="size-12" />
                        </div>
                      )}
                    </div>
                  </div>
                  <label
                    htmlFor="avatar-upload"
                    className="absolute bottom-0 right-0 bg-primary text-primary-content p-2 rounded-full shadow-lg cursor-pointer hover:scale-110 transition-transform"
                  >
                    <CameraIcon className="size-5" />
                  </label>
                  <input
                    type="file"
                    id="avatar-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </div>

                <div>
                  <h2 className="font-semibold text-lg">
                    {authUser?.fullName}
                  </h2>
                  <p className="text-xs opacity-70 mt-1 truncate">
                    {authUser?.email}
                  </p>
                </div>
              </section>

              <button
                type="submit"
                className="btn btn-primary w-full gap-2 hover-lift"
                disabled={isPending}
              >
                {isPending ? (
                  <span className="loading loading-spinner loading-xs" />
                ) : (
                  <SaveIcon className="size-4" />
                )}
                Save Changes
              </button>
            </div>

            {/* Right Column: Form Fields */}
            <div className="md:col-span-2 space-y-6">
              <section className="glass-panel p-6 rounded-2xl space-y-6">
                <h3 className="text-lg font-semibold border-b border-base-content/10 pb-2">
                  Personal Details
                </h3>

                <div className="space-y-4">
                  <div className="form-control">
                    <label className="label text-xs font-semibold uppercase opacity-70">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Your name"
                      className="input input-bordered focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                    />
                  </div>

                  <div className="form-control">
                    <label className="label text-xs font-semibold uppercase opacity-70">
                      Bio
                    </label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      placeholder="Tell the world a bit about yourself"
                      className="textarea textarea-bordered h-24 focus:ring-2 focus:ring-primary/50 transition-all font-medium resize-none"
                    />
                  </div>

                  <div className="form-control">
                    <label className="label text-xs font-semibold uppercase opacity-70">
                      Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="City, Country"
                      className="input input-bordered focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                    />
                  </div>
                </div>
              </section>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
