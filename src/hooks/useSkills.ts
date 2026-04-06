import { useState, useCallback, useEffect } from "react";
import {
  skillService,
  type Skill,
  type CreateSkillInput,
} from "../services/skillService";
import { toast } from "sonner";

export const useSkills = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [nextOrder, setNextOrder] = useState(1);

  const fetchSkills = useCallback(async () => {
    setLoading(true);
    try {
      const data = await skillService.getSkills();
      setSkills(data);

      // Compute next order
      if (data.length > 0) {
        const max = Math.max(...data.map((s) => s.display_order || 0));
        setNextOrder(max + 1);
      } else {
        setNextOrder(1);
      }
    } catch (error: any) {
      toast.error("Error fetching skills: " + error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const addSkill = async (input: CreateSkillInput) => {
    setSubmitting(true);
    try {
      await skillService.createSkill(input);
      toast.success("Skill saved successfully!");
      await fetchSkills();
      return true;
    } catch (error: any) {
      toast.error("Save failed: " + error.message);
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const editSkill = async (id: string, input: Partial<CreateSkillInput>) => {
    setSubmitting(true);
    try {
      await skillService.updateSkill(id, input);
      toast.success("Skill updated!");
      await fetchSkills();
      return true;
    } catch (error: any) {
      toast.error("Update failed: " + error.message);
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const removeSkill = async (id: string) => {
    try {
      await skillService.deleteSkill(id);
      toast.success("Skill removed!");
      await fetchSkills();
    } catch (error: any) {
      toast.error("Delete failed: " + error.message);
    }
  };

  const reorderSkills = async (newSkills: Skill[]) => {
    // 1. Optimistic update
    const previousSkills = [...skills];
    const orderedSkills = newSkills.map((s, idx) => ({ ...s, display_order: idx + 1 }));
    setSkills(orderedSkills);

    try {
      // 2. Prepare payload - Send full objects to avoid NOT NULL constraints
      await skillService.updateOrder(orderedSkills);
      toast.success("Skills updated.");
    } catch (error: any) {
      // 3. Rollback if failed
      setSkills(previousSkills);
      toast.error("Sync failed: " + error.message);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, [fetchSkills]);

  return {
    skills,
    loading,
    submitting,
    nextOrder,
    fetchSkills,
    addSkill,
    editSkill,
    removeSkill,
    reorderSkills,
  };
};
