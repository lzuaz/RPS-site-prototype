import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://awmttguteigtjbbqcpyn.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF3bXR0Z3V0ZWlndGpiYnFjcHluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEyNzY1NDYsImV4cCI6MjA5Njg1MjU0Nn0.vIe3T69CpBceq3I8PNmtbuXXTlSJx81W8uxnAsqfXqE');

async function main() {
    console.log("Fetching applications...");

    const { data: apps, error } = await supabase.from('job_applications').select('*, job:jobs(title)');

    if (error) {
        console.error("FAILED:", error);
    } else {
        console.log("SUCCESS:", JSON.stringify(apps, null, 2));
    }
}

main();
