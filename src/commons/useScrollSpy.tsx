import { useEffect, useState } from "react";

export function useScrollSpy(
  sectionRefs: React.RefObject<HTMLElement | null>[]
) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const obsever = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        root: null,
        rootMargin: "-50% 0px -50% 0px",
        threshold: 0,
      }
    );
    sectionRefs.forEach((ref) => {
      if (ref.current) obsever.observe(ref.current);
    });
    return () => obsever.disconnect();
  }, [sectionRefs]);
  return activeId;
}
