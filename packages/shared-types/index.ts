// Define the exact roles based on your Discord server hierarchy
export type RPSRole = 'DEVELOPER' | 'MODERATOR' | 'MEMBER' | 'INVESTOR';

// The baseline blueprint for every single user on the platform
export interface BaseUser {
    id: string;          // Their unique database ID
    discordId: string;   // Tied directly to your autonomous Discord bot
    username: string;
    email: string;
    role: RPSRole;
    avatarUrl?: string;  // Optional profile picture
    joinedAt: Date;
}

// The specific blueprint for Investors (extends the BaseUser)
export interface Investor extends BaseUser {
    role: 'INVESTOR';
    portfolioValue: number;
    activeInvestments: string[]; // Array of Project IDs they are funding
}

// The blueprint for Rascal Pixels Studio Assets (3D models, UI designs)
export interface StudioAsset {
    id: string;
    title: string;
    description: string;
    fileUrl: string;     // The URL where the high-end visual is stored
    uploadedBy: string;  // The ID of the Developer/Member who created it
    isPublic: boolean;
}