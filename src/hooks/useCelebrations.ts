import { useState, useEffect } from "react";
import { celebrationService } from "../services/celebrationService";
import type { Celebration, CreateCelebrationInput } from "../services/celebrationService";
import { toast } from "sonner";

export function useCelebrations() {
  const [celebrations, setCelebrations] = useState<Celebration[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchCelebrations = async () => {
    setLoading(true);
    try {
      const data = await celebrationService.getAll();
      setCelebrations(data);
    } catch (e: any) {
      toast.error("Failed to fetch memories: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCelebrations();
  }, []);

  const saveCelebration = async (input: CreateCelebrationInput) => {
    setSubmitting(true);
    try {
      await celebrationService.create(input);
      toast.success("Memory create successfully.");
      await fetchCelebrations();
      return true;
    } catch (e: any) {
      toast.error("Create failed: " + e.message);
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const editCelebration = async (id: string, input: CreateCelebrationInput) => {
    setSubmitting(true);
    try {
      await celebrationService.update(id, input);
      toast.success("Memory updated.");
      await fetchCelebrations();
      return true;
    } catch (e: any) {
      toast.error("Update failed: " + e.message);
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const removeCelebration = async (id: string, imageUrl?: string) => {
    try {
      await celebrationService.delete(id, imageUrl);
      toast.success("Memory deleted.");
      await fetchCelebrations();
      return true;
    } catch (e: any) {
      toast.error("Delete failed: " + e.message);
      return false;
    }
  };

  return { 
    celebrations, 
    loading, 
    submitting, 
    saveCelebration, 
    editCelebration, 
    removeCelebration,
    refetch: fetchCelebrations 
  };
}
