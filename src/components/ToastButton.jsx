import React from "react";
import toast, { Toaster } from "react-hot-toast";

const ToastButton = ({
  text,
  toastMessage,
  className,
  type = "error",
  icon,
}) => {
  const notify = () => {
    const options = {
      icon: icon,
    };

    switch (type) {
      case "success":
        toast.success(toastMessage, options);
        break;
      case "error":
        toast.error(toastMessage, options);
        break;
      case "loading":
        toast.loading(toastMessage, options);
        break;
      default:
        toast(toastMessage, options);
    }
  };

  return (
    <div>
      <button onClick={notify} className={className}>
        {text}
      </button>
      <Toaster position="bottom-left" />
    </div>
  );
};

export default ToastButton;
