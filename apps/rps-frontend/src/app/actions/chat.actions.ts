"use server";
import { createClient } from "@/lib/supabase/server";
export async function getChatHistory(channel: string = 'staff_comms') {
    try {
        const supabase = await createClient();
        const { data: messages, error } = await supabase
            .from('chat_logs')
            .select('id, channel, message, metadata, created_at, sender_id, sender:users(username, role)')
            .eq('channel', channel)
            .order('created_at', { ascending: false })
            .limit(100);
        if (error) throw error;
        return { 
            success: true, 
            messages: messages.reverse() 
        };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
export async function getChatMessage(id: string) {
    try {
        const supabase = await createClient();
        const { data: message, error } = await supabase
            .from('chat_logs')
            .select('id, channel, message, metadata, created_at, sender_id, sender:users(username, role)')
            .eq('id', id)
            .single();
        if (error) throw error;
        return { success: true, message };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
export async function sendChatMessage(channel: string = 'staff_comms', message: string, metadata: any = {}) {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) throw new Error("Not authenticated");
        const { data: newMessage, error } = await supabase
            .from('chat_logs')
            .insert([
                {
                    sender_id: user.id,
                    channel,
                    message,
                    metadata
                }
            ])
            .select('id, channel, message, metadata, created_at, sender_id, sender:users(username, role)')
            .single();
        if (error) throw error;
        return { success: true, message: newMessage };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
