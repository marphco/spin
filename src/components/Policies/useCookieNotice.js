import { useEffect, useState } from "react";

const KEY = "sf_cookie_notice_v1";

export function useCookieNotice() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const v = localStorage.getItem(KEY);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!v) setOpen(true);
  }, []);

  const accept = () => {
    localStorage.setItem(KEY, "1");
    setOpen(false);
  };

  return { open, accept };
}
