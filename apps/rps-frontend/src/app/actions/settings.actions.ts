"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
export async function getLandingBlockOrder() {
    try {
        const supabase = await createClient();
        const { data, error } = await supabase.from('site_settings').select('value').eq('key', 'landing_blocks_order').single();
        if (error || !data || !data.value) {
            return { success: true, order: ["hero", "games", "vanguard", "contact"] };
        }
        return { success: true, order: data.value as string[] };
    } catch (error: any) {
        return { success: false, order: ["hero", "games", "vanguard", "contact"], error: error.message };
    }
}
export async function updateLandingBlockOrder(order: string[]) {
    try {
        const supabase = await createClient();
        const { error } = await supabase.from('site_settings').upsert({ 
            key: 'landing_blocks_order', 
            value: order, 
            updated_at: new Date().toISOString() 
        });
        if (error) throw new Error(error.message);
        revalidatePath('/dev');
        revalidatePath('/');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
export async function getUniversalSecurityKey() {
    try {
        const supabase = await createClient();
        const { data, error } = await supabase.from('site_settings').select('value').eq('key', 'universal_security_key').single();
        if (error || !data || !data.value) return { success: true, key: "VanguardOverride2026!" };
        return { success: true, key: data.value as string };
    } catch (error: any) {
        return { success: false, key: "VanguardOverride2026!", error: error.message };
    }
}
export async function updateUniversalSecurityKey(newKey: string) {
    try {
        const supabase = await createClient();
        const { error } = await supabase.from('site_settings').upsert({ 
            key: 'universal_security_key', 
            value: newKey, 
            updated_at: new Date().toISOString() 
        });
        if (error) throw new Error(error.message);
        revalidatePath('/dev');
        revalidatePath('/');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
