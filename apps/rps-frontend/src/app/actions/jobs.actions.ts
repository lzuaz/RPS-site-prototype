"use server";
import { createClient } from "@/lib/supabase/server";
export interface JobData {
    id?: string;
    title: string;
    department: string;
    location: string;
    type: string;
    description: string;
    requirements: string[];
    is_active: boolean;
    is_urgent: boolean;
    created_at?: string;
    updated_at?: string;
}
export async function getJobs() {
    try {
        const supabase = await createClient();
        const { data: jobs, error } = await supabase.from('jobs').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        return { success: true, jobs };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
export async function createJob(jobData: JobData) {
    try {
        const supabase = await createClient();
        const { data: newJob, error } = await supabase.from('jobs').insert([{
            title: jobData.title,
            department: jobData.department,
            location: jobData.location,
            type: jobData.type,
            description: jobData.description,
            requirements: jobData.requirements,
            is_active: jobData.is_active,
            is_urgent: jobData.is_urgent
        }]).select();
        if (error) throw error;
        return { success: true, job: newJob && newJob.length > 0 ? newJob[0] : null };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
export async function updateJob(id: string, jobData: Partial<JobData>) {
    try {
        const supabase = await createClient();
        const { data: updatedJob, error } = await supabase.from('jobs').update({
            title: jobData.title,
            department: jobData.department,
            location: jobData.location,
            type: jobData.type,
            description: jobData.description,
            requirements: jobData.requirements,
            is_active: jobData.is_active,
            is_urgent: jobData.is_urgent,
            updated_at: new Date().toISOString()
        }).eq('id', id).select();
        if (error) throw error;
        return { success: true, job: updatedJob && updatedJob.length > 0 ? updatedJob[0] : null };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
export async function deleteJob(id: string) {
    try {
        const supabase = await createClient();
        const { error } = await supabase.from('jobs').delete().eq('id', id);
        if (error) throw error;
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
