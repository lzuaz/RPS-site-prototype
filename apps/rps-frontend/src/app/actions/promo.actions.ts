"use server";
import { createClient } from "@/lib/supabase/server";
export async function getPromoCodes() {
    try {
        const supabase = await createClient();
        const { data: codes, error } = await supabase.from('promo_codes').select('*');
        if (error) throw error;
        return { success: true, codes };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
export async function generatePromoCode(rewardType: string, rewardAmount: number) {
    try {
        const code = Math.random().toString(36).substring(2, 10).toUpperCase();
        const supabase = await createClient();
        const { data: newCode, error } = await supabase.from('promo_codes').insert([{
            code,
            reward_type: rewardType,
            reward_amount: rewardAmount
        }]).select().single();
        if (error) throw error;
        return { success: true, code: newCode };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
export async function deletePromoCode(id: string) {
    try {
        const supabase = await createClient();
        const { error } = await supabase.from('promo_codes').delete().eq('id', id);
        if (error) throw error;
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
export async function seedPromoCodes() {
    try {
        const supabase = await createClient();
        const { count } = await supabase.from('promo_codes').select('*', { count: 'exact', head: true });
        if (count === 0) {
            const { error } = await supabase.from('promo_codes').insert([
                { code: 'BETA-START', reward_type: 'coins', reward_amount: 1000 },
                { code: 'VIP-GIFT', reward_type: 'xp', reward_amount: 5000 },
            ]);
            if (error) throw error;
        }
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
