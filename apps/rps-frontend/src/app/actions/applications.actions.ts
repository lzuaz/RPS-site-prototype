"use server";
import { createClient } from "@/lib/supabase/server";
import { sendApplicationEmail } from "./email.actions";
import { getJobs } from "./jobs.actions";
export interface ApplicationData {
    id?: string;
    job_id: string;
    applicant_name: string;
    applicant_email: string;
    birth_date?: string;
    region?: string;
    time_zone?: string;
    phone?: string;
    discord?: string;
    portfolio_url?: string;
    cover_letter?: string;
    status: string;
    created_at?: string;
    job?: { title: string };
}
export async function submitApplication(appData: ApplicationData) {
    try {
        const supabase = await createClient();
        console.log("SUBMITTING APPLICATION WITH PAYLOAD:", appData);
        const { data: newApp, error } = await supabase.from('job_applications').insert([{
            job_id: appData.job_id,
            applicant_name: appData.applicant_name,
            applicant_email: appData.applicant_email,
            birth_date: appData.birth_date,
            region: appData.region,
            time_zone: appData.time_zone,
            phone: appData.phone,
            discord: appData.discord,
            portfolio_url: appData.portfolio_url,
            cover_letter: appData.cover_letter,
            status: appData.status || 'Pending Review'
        }]).select();
        if (error) throw error;
        const { data: jobInfo } = await supabase.from('jobs').select('title').eq('id', appData.job_id).single();
        const jobTitle = jobInfo?.title || 'a position';
        await sendApplicationEmail(appData.applicant_email, appData.applicant_name, jobTitle, 'submission');
        return { success: true, application: newApp && newApp.length > 0 ? newApp[0] : null };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
export async function getApplications(jobId?: string) {
    try {
        const supabase = await createClient();
        let query = supabase.from('job_applications').select('*, job:jobs(title)').order('created_at', { ascending: false });
        if (jobId) {
            query = query.eq('job_id', jobId);
        }
        const { data: applications, error } = await query;
        if (error) throw error;
        return { success: true, applications };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
export async function updateApplicationStatus(id: string, status: string) {
    try {
        const supabase = await createClient();
        const { data: updatedApp, error } = await supabase.from('job_applications')
            .update({ status })
            .eq('id', id)
            .select();
        if (error) throw error;
        const app = updatedApp && updatedApp.length > 0 ? updatedApp[0] : null;
        if (app && (status === 'Approved' || status === 'Rejected')) {
            const { data: jobInfo } = await supabase.from('jobs').select('title').eq('id', app.job_id).single();
            const jobTitle = jobInfo?.title || 'a position';
            await sendApplicationEmail(
                app.applicant_email, 
                app.applicant_name, 
                jobTitle, 
                status === 'Approved' ? 'approval' : 'rejection'
            );
        }
        return { success: true, application: app };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
export async function deleteApplication(id: string) {
    try {
        const supabase = await createClient();
        const { error } = await supabase.from('job_applications').delete().eq('id', id);
        if (error) throw error;
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
