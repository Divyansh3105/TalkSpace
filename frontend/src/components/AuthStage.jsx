import { Link } from "react-router";

const Logo = () => (
  <Link to="/" className="inline-flex items-center gap-2.5">
    <img src="/logo.png" alt="" width={32} height={32} className="size-8 object-contain" />
    <span className="text-xl font-bold tracking-tight">TalkSpace</span>
  </Link>
);

const DefaultStage = () => (
  <div className="flex items-center gap-4 sm:gap-5 lg:block lg:w-full lg:max-w-[min(560px,40vw)]">
    <img
      src="/i.png"
      alt="Two people chatting on a video call"
      className="w-32 sm:w-44 lg:w-full shrink-0 aspect-square object-contain"
    />
    <div className="lg:mt-2">
      <h2 className="text-xl sm:text-2xl lg:text-4xl font-bold tracking-tight text-balance leading-tight">
        Chat and video, in one place.
      </h2>
      <p className="mt-1.5 lg:mt-3 text-xs sm:text-sm lg:text-base text-base-content/70 max-w-md">
        Find people near you, make friends, and start a video call from any chat.
      </p>
    </div>
  </div>
);

/**
 * AuthStage — the shared frame for login, sign-up and onboarding.
 * A primary-tinted stage owns the screen; the form card (children) floats
 * over its right edge on desktop and over its bottom edge on mobile.
 * Pass `stage` to replace the illustration (onboarding shows the live profile).
 */
const AuthStage = ({ stage, children }) => (
  <div className="min-h-dvh bg-base-100 lg:grid lg:grid-cols-12">
    <section className="relative bg-primary/10 lg:col-start-1 lg:col-end-9 lg:row-start-1 overflow-hidden">
      <div className="h-full flex flex-col px-5 pt-5 pb-16 sm:px-8 sm:pt-8 lg:p-12 lg:pr-[calc(12.5%+3rem)]">
        <Logo />
        <div className="flex-1 flex items-center gap-5 mt-4 lg:mt-0 lg:flex-col lg:items-center lg:justify-center">
          {stage ?? <DefaultStage />}
        </div>
      </div>
    </section>

    <div className="relative z-10 -mt-10 px-4 pb-10 lg:mt-0 lg:p-0 lg:col-start-8 lg:col-end-12 lg:row-start-1 lg:self-center lg:py-12">
      <div className="animate-settle mx-auto w-full max-w-md lg:max-w-none bg-base-100 border border-base-content/10 rounded-2xl shadow-[0_12px_40px_-12px_rgb(0_0_0/0.35)] p-6 sm:p-8">
        {children}
      </div>
    </div>
  </div>
);

export default AuthStage;
