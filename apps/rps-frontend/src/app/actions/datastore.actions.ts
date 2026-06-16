"use server";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";
const datastoreSchema = z.object({
    coins: z.number().min(0, "Coins cannot be negative"),
    inventory: z.array(z.any()),
    stats: z.object({
        level: z.number().min(1, "Level must be at least 1"),
        xp: z.number().min(0, "XP cannot be negative")
    })
}).passthrough();
async function checkStaffAccess() {
    const supabase = await createClient();
    const { data: authData } = await supabase.auth.getUser();
    if (!authData?.user) return false;
    const { data: user } = await supabase.from('users').select('role').eq('id', authData.user.id).single();
    if (!user || user.role === 'player') return false;
    return true;
}
export async function getPlayerData(searchTerm: string) {
    if (!(await checkStaffAccess())) return { success: false, error: "Unauthorized" };
    const supabase = await createClient();
    const isUuid = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(searchTerm);
    let query = supabase.from('users').select('id, username, email');
    if (isUuid) {
        query = query.eq('id', searchTerm);
    } else if (searchTerm.includes('@')) {
        query = query.eq('email', searchTerm);
    } else {
        query = query.eq('username', searchTerm);
    }
    const { data: user, error: userError } = await query.single();
    if (userError || !user) {
        return { success: false, error: "Player not found" };
    }
    const { data: datastore } = await supabase.from('player_datastore').select('data').eq('player_id', user.id).single();
    const defaultData = {
        coins: 0,
        inventory: [],
        stats: { level: 1, xp: 0 }
    };
    return { 
        success: true, 
        player: {
            id: user.id,
            username: user.username,
            email: user.email
        },
        data: datastore?.data || defaultData 
    };
}
export async function savePlayerData(playerId: string, dataJsonString: string) {
    if (!(await checkStaffAccess())) return { success: false, error: "Unauthorized" };
    const supabase = await createClient();
    try {
        let parsedData;
        try {
            parsedData = JSON.parse(dataJsonString);
        } catch (e) {
            return { success: false, error: "Invalid JSON syntax. Please check your formatting." };
        }
        const validation = datastoreSchema.safeParse(parsedData);
        if (!validation.success) {
            return { 
                success: false, 
                error: "Schema Validation Failed: " + validation.error.issues.map(i => i.message).join(", ") 
            };
        }
        const { error } = await supabase.from('player_datastore').upsert({
            player_id: playerId,
            data: validation.data,
            updated_at: new Date().toISOString()
        });
        if (error) throw error;
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message || "Database Error" };
    }
}
export async function wipePlayerData(playerId: string) {
    if (!(await checkStaffAccess())) return { success: false, error: "Unauthorized" };
    const supabase = await createClient();
    const { error } = await supabase.from('player_datastore').delete().eq('player_id', playerId);
    if (error) return { success: false, error: error.message };
    return { success: true };
}
