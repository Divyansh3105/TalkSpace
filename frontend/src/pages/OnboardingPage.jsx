import { useState } from "react";
import useAuthUser from "../hooks/useAuthUser.js";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { completeOnboarding } from "../lib/api.js";
import { MapPinIcon, ShuffleIcon } from "lucide-react";
import AuthStage from "../components/AuthStage";
import Avatar from "../components/Avatar";

// The field being edited glows on the preview so you can see where it lands.
const lit = (active) =>
  `rounded-lg px-2 -mx-2 transition-colors duration-200 ${active ? "bg-primary/15 ring-1 ring-primary/40" : ""}`;

const ProfilePreview = ({ form, focused }) => (
  // Desktop: avatar beside name/location, bio full width underneath.
  // `lg:contents` lifts the text lines into the card's grid.
  <div className="w-full flex items-center gap-4 lg:grid lg:grid-cols-[auto_minmax(0,1fr)] lg:gap-x-7 lg:gap-y-1 lg:max-w-xl lg:bg-base-100 lg:border lg:border-base-content/10 lg:rounded-3xl lg:p-10 lg:shadow-[0_24px_60px_-24px_rgb(0_0_0/0.4)]">
    <div className={`${lit(focused === "profilePic")} lg:row-span-2 lg:py-2`}>
      <Avatar
        src={form.profilePic}
        name={form.fullName}
        className="size-16 sm:size-20 lg:size-32"
      />
    </div>
    <div className="min-w-0 space-y-1 lg:contents">
      <p className={`${lit(focused === "fullName")} text-lg lg:text-3xl font-bold tracking-tight truncate lg:self-end`}>
        {form.fullName || <span className="text-base-content/30">Your name</span>}
      </p>
      <p className={`${lit(focused === "location")} flex items-center gap-1.5 text-sm text-base-content/60 lg:self-start`}>
        <MapPinIcon className="size-4 shrink-0" />
        <span className={`truncate ${form.location ? "" : "text-base-content/30"}`}>
          {form.location || "City, Country"}
        </span>
      </p>
      <p className={`${lit(focused === "bio")} lg:text-base text-sm text-base-content/80 line-clamp-1 sm:line-clamp-2 lg:line-clamp-4 lg:col-span-2 lg:mt-6 break-words`}>
        {form.bio || <span className="text-base-content/30">A line or two about you.</span>}
      </p>
    </div>
  </div>
);

const OnBoardingPage = () => {
  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();
  const [focused, setFocused] = useState(null);

  const [formState, setFormState] = useState({
    fullName: authUser?.fullName || "",
    bio: authUser?.bio || "",
    location: authUser?.location || "",
    profilePic: authUser?.profilePic || "",
  });

  const { mutate: onboardingMutation, isPending } = useMutation({
    mutationFn: completeOnboarding,
    onSuccess: () => {
      toast.success("Profile onboarded successfully");
      queryClient.invalidateQueries({ queryKey: ["authData"] });
    },

    onError: (error) => {
      toast.error(error.response?.data?.message || "Can't reach the server. Please try again.");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onboardingMutation(formState);
  };

  const handleRandomAvatar = () => {
    const seed = Math.random().toString(36).substring(2, 10);
    const randomAvatar = `https://api.dicebear.com/9.x/personas/svg?seed=${seed}`;

    setFormState({ ...formState, profilePic: randomAvatar });
    setFocused("profilePic");
  };

  // Shared props: controlled value + focus tracking for the live preview
  const field = (name) => ({
    id: name,
    name,
    value: formState[name],
    onChange: (e) => setFormState({ ...formState, [name]: e.target.value }),
    onFocus: () => setFocused(name),
    onBlur: () => setFocused(null),
    required: true,
  });

  return (
    <AuthStage stage={<ProfilePreview form={formState} focused={focused} />}>
      <h1 className="text-2xl font-bold tracking-tight">Complete your profile</h1>
      <p className="text-sm text-base-content/60 mt-1">
        This is how people will find you on TalkSpace.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div className="flex items-center justify-between gap-3 rounded-xl bg-base-content/[0.04] px-4 py-3">
          <span className="text-sm font-medium">Photo</span>
          <button
            type="button"
            onClick={handleRandomAvatar}
            onBlur={() => setFocused(null)}
            className="btn btn-sm bg-primary/10 text-primary border-transparent hover:bg-primary hover:text-primary-content hover:border-transparent gap-1.5"
          >
            <ShuffleIcon className="size-4" />
            Generate random avatar
          </button>
        </div>

        <div>
          <label htmlFor="fullName" className="block text-sm font-medium mb-1.5">
            Full name
          </label>
          <input
            {...field("fullName")}
            type="text"
            maxLength={100}
            autoComplete="name"
            className="input input-bordered w-full"
            placeholder="Your full name"
          />
        </div>

        <div>
          <div className="flex items-baseline justify-between mb-1.5">
            <label htmlFor="bio" className="text-sm font-medium">Bio</label>
            <span className="text-xs text-base-content/50 tabular-nums">
              {formState.bio.length}/300
            </span>
          </div>
          <textarea
            {...field("bio")}
            maxLength={300}
            rows={3}
            className="textarea textarea-bordered w-full text-base resize-none"
            placeholder="Tell others about yourself"
          />
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium mb-1.5">
            Location
          </label>
          <input
            {...field("location")}
            type="text"
            maxLength={100}
            className="input input-bordered w-full"
            placeholder="City, Country"
          />
        </div>

        <button className="btn btn-primary w-full mt-2" disabled={isPending} type="submit">
          {isPending ? (
            <>
              <span className="loading loading-spinner loading-xs" />
              Saving…
            </>
          ) : (
            "Complete onboarding"
          )}
        </button>
      </form>
    </AuthStage>
  );
};

export default OnBoardingPage;
