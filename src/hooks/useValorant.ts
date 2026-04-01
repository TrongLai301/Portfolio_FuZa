import { useState, useEffect } from "react";
import { 
  valorantService
} from "../services/valorantService";
import type { ValorantData } from "../services/valorantService";
import { toast } from "sonner";

export function useValorant() {
  const [data, setData] = useState<ValorantData | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await valorantService.getProfile();
      setData(result);
    } catch (e: any) {
      toast.error("Failed to fetch Valorant intel: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const saveValorant = async (newData: ValorantData) => {
    setSubmitting(true);
    try {
      await valorantService.saveAll(newData);
      toast.success("Valorant profile updated successfully.");
      await fetchData();
      return true;
    } catch (e: any) {
      toast.error("Failed to update Valorant profile: " + e.message);
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  return { 
    data, 
    loading, 
    submitting, 
    saveValorant, 
    refetch: fetchData 
  };
}
