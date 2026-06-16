"use server";
import { Resend } from 'resend';
import ApplicantEmail from '@/emails/ApplicantTemplate';
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
export async function sendApplicationEmail(
    toEmail: string, 
    applicantName: string, 
    jobTitle: string, 
    type: 'submission' | 'approval' | 'rejection'
) {
    if (!resend) {
        console.warn('RESEND_API_KEY is not configured. Email dispatch skipped.');
        return { success: true, simulated: true };
    }
    try {
        let subject = '';
        if (type === 'submission') subject = `Application Received: ${jobTitle}`;
        if (type === 'approval') subject = `Application Approved: Next Steps for ${jobTitle}`;
        if (type === 'rejection') subject = `Update on your application for ${jobTitle}`;
        const { data, error } = await resend.emails.send({
            from: 'Rascal Pixel Studio <careers@rascalpixelstudio.com>', 
            to: toEmail,
            subject: subject,
            react: ApplicantEmail({ applicantName, jobTitle, type }),
        });
        if (error) {
            console.error('Resend API Error:', error);
            return { success: false, error: error.message };
        }
        return { success: true, data };
    } catch (error: any) {
        console.error('Email dispatch failed:', error);
        return { success: false, error: error.message };
    }
}
