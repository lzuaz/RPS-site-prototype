import * as React from 'react';
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
  Button
} from '@react-email/components';
interface ApplicantEmailProps {
  applicantName: string;
  jobTitle: string;
  type: 'submission' | 'approval' | 'rejection';
}
const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ? process.env.NEXT_PUBLIC_SITE_URL : '';
export const ApplicantEmail = ({
  applicantName,
  jobTitle,
  type,
}: ApplicantEmailProps) => {
  let previewText = '';
  let headingText = '';
  let bodyText = '';
  let buttonEl = null;
  if (type === 'submission') {
    previewText = `Application Received: ${jobTitle} at Rascal Pixel Studio`;
    headingText = `Application Received`;
    bodyText = `Thank you for submitting your dossier to join the Vanguard. We have received your application for the ${jobTitle} position. Our recruitment team is currently reviewing your materials. We will be in touch soon.`;
  } else if (type === 'approval') {
    previewText = `Next Steps: ${jobTitle} at Rascal Pixel Studio`;
    headingText = `Application Approved`;
    bodyText = `Congratulations. Your initial application for ${jobTitle} has been approved by the Vanguard. You are invited to the next phase of the recruitment process. Please click the link below to schedule an interview with our lead engineers.`;
    buttonEl = (
      <Button style={button} href="https://discord.gg/your-discord-link">
        Schedule Interview
      </Button>
    );
  } else if (type === 'rejection') {
    previewText = `Update on your application: ${jobTitle}`;
    headingText = `Application Status`;
    bodyText = `Thank you for your interest in joining Rascal Pixel Studio. While your background is impressive, we will not be moving forward with your application for the ${jobTitle} position at this time. The Vanguard's current needs require a different alignment of skills. We wish you the best in your future endeavors.`;
  }
  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={logoSection}>
            <Text style={logoText}>RASCAL PIXEL STUDIO</Text>
          </Section>
          <Section style={contentSection}>
            <Heading style={h1}>{headingText}</Heading>
            <Text style={text}>Dear {applicantName},</Text>
            <Text style={text}>{bodyText}</Text>
            {buttonEl && (
              <Section style={buttonContainer}>
                {buttonEl}
              </Section>
            )}
            <Hr style={hr} />
            <Text style={footer}>
              Rascal Pixel Studio • The Vanguard
              <br />
              This is an automated transmission. Do not reply directly to this address.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};
export default ApplicantEmail;
const main = {
  backgroundColor: '#000000',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};
const container = {
  backgroundColor: '#0a0a0a',
  margin: '40px auto',
  padding: '20px 0 48px',
  borderRadius: '8px',
  border: '1px solid #222222',
  maxWidth: '600px',
};
const logoSection = {
  padding: '20px 40px',
  textAlign: 'center' as const,
};
const logoText = {
  color: '#ffffff',
  fontSize: '24px',
  fontWeight: 'bold',
  letterSpacing: '4px',
};
const contentSection = {
  padding: '0 40px',
};
const h1 = {
  color: '#ffffff',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '30px 0',
  padding: '0',
};
const text = {
  color: '#a0a0a0',
  fontSize: '14px',
  lineHeight: '24px',
};
const buttonContainer = {
  marginTop: '32px',
  marginBottom: '32px',
  textAlign: 'center' as const,
};
const button = {
  backgroundColor: '#0ea5e9',
  borderRadius: '4px',
  color: '#fff',
  fontSize: '14px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 24px',
};
const hr = {
  borderColor: '#222222',
  margin: '40px 0',
};
const footer = {
  color: '#666666',
  fontSize: '12px',
  lineHeight: '16px',
  textAlign: 'center' as const,
};
