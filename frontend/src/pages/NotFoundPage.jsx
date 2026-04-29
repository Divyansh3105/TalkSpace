import { Link } from "react-router";
import { HomeIcon } from "lucide-react";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-base-100">
      {/* Large 404 */}
      <p className="text-[8rem] sm:text-[12rem] font-extrabold leading-none text-primary/20 select-none">
        404
      </p>

      <div className="-mt-4 space-y-3">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
          Page not found
        </h1>
        <p className="text-base-content/60 max-w-sm">
          The page you're looking for doesn't exist or has been moved.
        </p>
      </div>

      <Link to="/" className="btn btn-primary mt-8 gap-2">
        <HomeIcon className="size-4" />
        Back to Home
      </Link>
    </div>
  );
};

export default NotFoundPage;
