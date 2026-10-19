import { useEffect } from "react";

const useDocumentTitle = (title) => {
  useEffect(() => {
    document.title = `${title} · TalkSpace`;
  }, [title]);
};

export default useDocumentTitle;
