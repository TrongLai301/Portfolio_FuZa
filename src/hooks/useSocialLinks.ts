import { useState, useCallback, useEffect } from "react";
import { socialLinkService, type SocialLink } from "../services/socialLinkService";
import { toast } from "sonner";

export const useSocialLinks = () => {
  const [links, setLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [nextOrder, setNextOrder] = useState(1);

  const fetchLinks = useCallback(async () => {
    setLoading(true);
    try {
      const data = await socialLinkService.getAll();
      setLinks(data);
      
      // Tính toán thứ tự hiển thị tiếp theo
      if (data.length > 0) {
        const max = Math.max(...data.map(l => l.display_order || 0));
        setNextOrder(max + 1);
      } else {
        setNextOrder(1);
      }
    } catch (error: any) {
      toast.error("Error fetching social links: " + error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const addLink = async (input: SocialLink) => {
    setSubmitting(true);
    try {
      await socialLinkService.create(input);
      toast.success("Social link saved successfully!");
      await fetchLinks();
      return true;
    } catch (error: any) {
      toast.error("Save failed: " + error.message);
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const editLink = async (id: string, input: Partial<SocialLink>) => {
    setSubmitting(true);
    try {
      await socialLinkService.update(id, input);
      toast.success("Social link updated!");
      await fetchLinks();
      return true;
    } catch (error: any) {
      toast.error("Update failed: " + error.message);
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const removeLink = async (id: string) => {
    try {
      await socialLinkService.delete(id);
      toast.success("Social link removed!");
      await fetchLinks();
    } catch (error: any) {
      toast.error("Delete failed: " + error.message);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, [fetchLinks]);

  return {
    links,
    loading,
    submitting,
    nextOrder,
    fetchLinks,
    addLink,
    editLink,
    removeLink
  };
};
