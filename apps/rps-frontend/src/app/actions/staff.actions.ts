"use server";
import { createClient } from "@/lib/supabase/server";
import { getUniversalSecurityKey } from "./settings.actions";
import { createAdminClient } from "@/lib/supabase/admin";
import bcrypt from "bcryptjs";
export async function getAllUsers() {
    try {
        const supabase = await createClient();
        const { data: staff, error } = await supabase.from('users')
            .select('id, username, role, first_name, last_name, email');
        if (error) throw error;
        const formattedStaff = staff.map(u => ({
            id: u.id,
            username: u.username,
            role: u.role,
            firstName: u.first_name,
            lastName: u.last_name,
            email: u.email
        }));
        return { success: true, staff: formattedStaff };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
export async function searchPlayers(query: string) {
    try {
        if (!query.trim()) return { success: true, players: [] };
        const supabase = await createClient();
        const { data: players, error } = await supabase.from('users')
            .select('id, username, email')
            .neq('role', 'admin') 
            .ilike('username', `%${query}%`)
            .limit(5);
        if (error) throw error;
        return { success: true, players: players || [] };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
export async function addStaff(username: string, role: string) {
    try {
        const supabase = await createClient();
        const { data: existingUser, error: findError } = await supabase.from('users').select('id, username, role, first_name, last_name, email').eq('username', username).single();
        if (findError || !existingUser) {
            return { success: false, error: "Player not found. They must register an account first." };
        }
        const { error: updateError } = await supabase.from('users').update({ role }).eq('id', existingUser.id);
        if (updateError) throw updateError;
        const formattedStaff = {
            id: existingUser.id,
            username: existingUser.username,
            role: role,
            firstName: existingUser.first_name,
            lastName: existingUser.last_name,
            email: existingUser.email
        };
        return { success: true, staff: formattedStaff };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
export async function enrollStaff(data: { username: string, email: string, phone_number: string, timezone: string, role: string }) {
    try {
        const supabase = await createClient();
        const { data: existingUser } = await supabase.from('users').select('id').eq('username', data.username).single();
        if (existingUser) return { success: false, error: 'Username already exists' };
        const supabaseAdmin = createAdminClient();
        const keyRes = await getUniversalSecurityKey();
        const defaultPassword = keyRes.success ? keyRes.key : "Vanguard2026!";
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email: data.email,
            password: defaultPassword,
            email_confirm: true,
            user_metadata: {
                username: data.username,
                role: data.role
            }
        });
        if (authError) throw authError;
        if (authData?.user) {
            await supabaseAdmin.from('users').update({
                phone_number: data.phone_number,
                timezone: data.timezone,
                role: data.role 
            }).eq('id', authData.user.id);
        }
        const formattedStaff = {
            id: authData?.user?.id || '',
            username: data.username,
            role: data.role,
            firstName: '',
            lastName: '',
            email: data.email
        };
        return { success: true, staff: formattedStaff };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
export async function removeStaff(id: string) {
    try {
        const supabase = await createClient();
        const { error } = await supabase.from('users').delete().eq('id', id);
        if (error) throw error;
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
export async function initDefaultStaff() {
    try {
        const supabase = await createClient();
        const { count } = await supabase.from('users').select('*', { count: 'exact', head: true }).in('role', ['admin', 'moderator', 'developer']);
        if (count === 0) {
            const password = await bcrypt.hash("password123", 10);
            const { error } = await supabase.from('users').insert([
                { username: "RascalPixels", role: "admin", password, email: "admin@rps.com" },
                { username: "System_Friday", role: "developer", password, email: "friday@rps.com" },
                { username: "RPS_Mod_1", role: "moderator", password, email: "mod1@rps.com" }
            ]);
            if (error) throw error;
        }
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
