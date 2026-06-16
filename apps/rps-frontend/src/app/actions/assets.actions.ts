"use server";
import { createClient } from "@/lib/supabase/server";
export async function getAssets() {
    try {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from('assets')
            .select('*')
            .order('created_at', { ascending: false });
        if (error) {
            console.error("Fetch assets error:", error);
            return { success: false, error: error.message };
        }
        return { success: true, assets: data };
    } catch (err: any) {
        return { success: false, error: err.message || "Unknown error" };
    }
}
export async function createAssetRecord(assetData: {
    name: string;
    type: string;
    size: number;
    url: string;
    uploaded_by: string;
    status: string;
}) {
    try {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from('assets')
            .insert([assetData])
            .select()
            .single();
        if (error) {
            console.error("Create asset error:", error);
            return { success: false, error: error.message };
        }
        return { success: true, asset: data };
    } catch (err: any) {
        return { success: false, error: err.message || "Unknown error" };
    }
}
export async function updateAssetStatus(assetId: string, newStatus: "approved" | "rejected") {
    try {
        const supabase = await createClient();
        const { data: authData } = await supabase.auth.getUser();
        if (!authData.user) throw new Error("Not authenticated");
        const { data: userData } = await supabase
            .from('users')
            .select('role')
            .eq('id', authData.user.id)
            .single();
        if (!userData || (userData.role !== 'admin' && userData.role !== 'developer')) {
            throw new Error("Unauthorized: Only admins and developers can approve assets");
        }
        const { error } = await supabase
            .from('assets')
            .update({ status: newStatus })
            .eq('id', assetId);
        if (error) {
            console.error("Update asset status error:", error);
            return { success: false, error: error.message };
        }
        return { success: true };
    } catch (err: any) {
        return { success: false, error: err.message || "Unknown error" };
    }
}
export async function deleteAssetRecord(assetId: string) {
    try {
        const supabase = await createClient();
        const { data: authData } = await supabase.auth.getUser();
        if (!authData.user) throw new Error("Not authenticated");
        const { data: userData } = await supabase
            .from('users')
            .select('role')
            .eq('id', authData.user.id)
            .single();
        if (!userData || (userData.role !== 'admin' && userData.role !== 'developer')) {
            throw new Error("Unauthorized: Only admins and developers can delete assets");
        }
        const { error } = await supabase
            .from('assets')
            .delete()
            .eq('id', assetId);
        if (error) {
            console.error("Delete asset error:", error);
            return { success: false, error: error.message };
        }
        return { success: true };
    } catch (err: any) {
        return { success: false, error: err.message || "Unknown error" };
    }
}
