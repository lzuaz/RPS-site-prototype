"use server";
import { createClient } from "@/lib/supabase/server";
export async function getFeatureFlags() {
    try {
        const supabase = await createClient();
        const { data: flags, error } = await supabase.from('feature_flags').select('*');
        if (error) throw error;
        return { success: true, flags };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
export async function toggleFeatureFlag(id: string, active: boolean) {
    try {
        const supabase = await createClient();
        const { data: updated, error } = await supabase.from('feature_flags')
            .update({ active })
            .eq('id', id)
            .select()
            .single();
        if (error) throw error;
        return { success: true, flag: updated };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
export async function seedFeatureFlags() {
    try {
        const supabase = await createClient();
        const { count } = await supabase.from('feature_flags').select('*', { count: 'exact', head: true });
        if (count === 0) {
            const { error } = await supabase.from('feature_flags').insert([
                { name: 'Vanguard Matrix', active: true },
                { name: 'Global Chat', active: true },
                { name: 'Tournaments', active: false },
                { name: 'BETA Branch Access', active: false },
            ]);
            if (error) throw error;
        }
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
