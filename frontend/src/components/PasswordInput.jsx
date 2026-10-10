import { useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";

const PasswordInput = ({ id, value, onChange, autoComplete, minLength }) => {
  const [visible, setVisible] = useState(false);
  const Icon = visible ? EyeOffIcon : EyeIcon;

  return (
    <div className="relative">
      <input
        id={id}
        type={visible ? "text" : "password"}
        className="input input-bordered w-full pr-11"
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        minLength={minLength}
        required
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        className="absolute inset-y-0 right-0 px-3 flex items-center text-base-content/50 hover:text-base-content rounded-r-btn"
        aria-label={visible ? "Hide password" : "Show password"}
        aria-pressed={visible}
      >
        <Icon className="size-4" />
      </button>
    </div>
  );
};

export default PasswordInput;
