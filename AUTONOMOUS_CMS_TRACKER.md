# 100+ Autonomous CMS & Automation Features Tracker

This tracker contains the blueprint for making the RPS Platform a 100% autonomous Content Management System (CMS). The goal is zero hardcoding—meaning you can launch games, post jobs, and run live events entirely from the Admin Dashboard without ever touching code or redeploying the site.

## 🎮 Game Portfolio Manager (Zero-Code Game Launches)
- [ ] 1. **Dynamic Games Database**: Add new games via a form (Title, Description, Genre).
- [ ] 2. **Thumbnail & Cover Art Uploader**: Directly upload game assets that auto-optimize.
- [ ] 3. **Roblox Place ID Linker**: Enter a Place ID and the site auto-fetches Roblox metadata.
- [ ] 4. **Live Player Count Sync**: Auto-updates "Currently Playing" on the site via Roblox OpenCloud API.
- [ ] 5. **Game Status Toggles**: Instantly switch a game from "In Development" to "Alpha" to "Live".
- [ ] 6. **Patch Notes Publisher**: Rich-text editor to publish game updates directly to the game's page.
- [ ] 7. **Video Trailer Embeds**: Add YouTube/Vimeo links that instantly render as hero videos on game pages.
- [ ] 8. **Featured Game Selector**: Pin a specific game to the top of the landing page carousel.
- [ ] 9. **Game-Specific Social Links**: Unique Discord/Twitter links per game.
- [ ] 10. **Game Server Lockdown**: A panic button to remotely kick all players from a specific game via webhook.
- [ ] 11. **UGC / Asset Showcase**: Gallery to upload and show off 3D models and animations for upcoming games.
- [ ] 12. **Roadmap Builder**: Drag-and-drop interface to show players what's coming in Q1/Q2/Q3.
- [ ] 13. **Auto-generated SEO**: Automatically creates meta tags and descriptions when a new game is published.
- [ ] 14. **Custom Game Routing**: Automatically generates URLs like `rps.com/games/my-new-game`.
- [x] 15. **Game Metrics Dashboard**: View total visits, favorites, and thumbs-up ratio pulled from Roblox.

## 📢 Global Announcements & Live Events
- [ ] 16. **Landing Page Banner Manager**: Turn a global urgent banner on/off (e.g., "Roblox Datastores are down").
- [ ] 17. **Rich-Text Blog Editor**: Write full news articles with images and formatting directly in the dashboard.
- [ ] 18. **Scheduled Publishing**: Write a post and set it to auto-publish on Friday at 5 PM.
- [ ] 19. **Live Event Countdown Timers**: Configure a countdown on the homepage for a game launch.
- [ ] 20. **Automated Discord Webhooks**: Pushing an announcement on the site automatically posts it to your Discord server.
- [ ] 21. **Automated Twitter/X Sync**: Auto-tweet when a new patch note or game is published.
- [ ] 22. **Push Notifications**: Send browser notifications to players when an event starts.
- [ ] 23. **Dynamic Event Theming**: A single toggle in the admin panel to turn the whole website into a "Halloween" or "Winter" theme.
- [ ] 24. **In-Game Announcement Sync**: Writing an announcement on the site sends it to a GUI inside your Roblox games.
- [ ] 25. **Content Tagging**: Tag posts as "Update", "Community", or "Leak" for easy filtering.

## 💼 Careers & Studio Expansion
- [x] 26. **Dynamic Job Board**: Create, edit, and delete job openings (e.g., "Senior Animator").
- [x] 27. **Job Status Toggles**: Hide positions when filled or mark them as "Urgently Hiring".
- [x] 28. **Application Intake System**: A database table to store submitted resumes and portfolios.
- [x] 29. **Application Status Pipeline**: Move applicants from "Reviewing" to "Interview" to "Hired".
- [ ] 30. **Automated Rejection/Acceptance Emails**: Trigger template emails based on applicant status.
- [ ] 31. **Dynamic Staff Roster**: The "Meet the Team" page automatically generates based on who has the 'admin' or 'developer' role.
- [ ] 32. **Roblox Avatar Auto-Fetcher**: Enter a staff member's Roblox Username, and the site auto-pulls their 3D avatar render.
- [ ] 33. **Staff Social Portfolios**: Staff can update their own Twitter/ArtStation links via their profile settings.
- [ ] 34. **Department Categorization**: Group staff by "Programming", "Animation", "Modeling".
- [ ] 35. **Alumni/Past Contributors List**: Move former staff to a Hall of Fame without deleting them.

## 🎁 Economy, Promo Codes & Datastore
- [ ] 36. **Cross-Game Promo Generator**: Create codes in the dashboard that work across multiple specific games.
- [ ] 37. **Time-Expiring Codes**: Set a promo code to automatically die at midnight.
- [ ] 38. **Usage-Capped Codes**: Create a code that only the first 500 people can redeem.
- [ ] 39. **In-Game Redemption Webhooks**: When a player claims a code on the site, it updates their Roblox Datastore instantly.
- [ ] 40. **Global Player Search**: Look up any player by username to see their total coins/stats across all your games.
- [ ] 41. **Manual Stat Editing**: Give a player 1000 coins directly from the web dashboard as an apology/refund.
- [ ] 42. **Inventory Wipe Tool**: Safely reset a specific exploiter's data without affecting others.
- [ ] 43. **Daily Reward Manager**: Configure what the daily login reward gives (Coins, XP, Items) dynamically.
- [ ] 44. **Double XP Multiplier Toggle**: Turn on a global 2x multiplier for the weekend across all games.
- [ ] 45. **Global Leaderboard Sync**: The site pulls the top 100 players' data every hour to display automatically.

## 🛠️ Dynamic Site Settings & Branding
- [x] 46. **Landing Page Block Reordering**: Drag and drop the order of sections (e.g., move "Careers" above "Games").
- [ ] 47. **Site Maintenance Mode Toggle**: 1-click button to replace the site with a "We'll be right back" screen.
- [ ] 48. **Dynamic FAQ Builder**: Add, edit, and rearrange Frequently Asked Questions.
- [ ] 49. **TOS & Privacy Policy Editor**: Update legal documents directly via a rich-text editor.
- [ ] 50. **Partner/Sponsor Logo Manager**: Upload logos of companies or YouTubers you partner with.
- [ ] 51. **Custom Hero Images**: Change the background image of the main landing page.
- [ ] 52. **Global Color Scheme Editor**: Change the primary "Sky Blue" to "Neon Green" across the entire app instantly.
- [ ] 53. **Dynamic Footer Links**: Add or remove links in the site footer dynamically.
- [ ] 54. **SEO Metadata Manager**: Update global keywords and OpenGraph images for link sharing.
- [ ] 55. **Site View Analytics**: Built-in graphs showing daily unique website visitors.

## 🛡️ Moderation, Security & RBAC
- [ ] 56. **Global Ban System**: Banning a user on the website instantly kicks them from all your Roblox games.
- [ ] 57. **Hardware/IP Ban Logs**: Track and manage severe bans.
- [ ] 58. **Automated Profanity Filters**: Configurable word blacklists for user profiles and comments.
- [ ] 59. **Audit Trail Logs**: Track exactly which Admin changed a game description or created a promo code.
- [ ] 60. **Role-Based Access Control (RBAC) Manager**: Create custom roles (e.g., "Junior Mod") with specific permissions.
- [ ] 61. **Feature Flag Toggles**: Turn specific website features on/off (e.g., disable the job board temporarily).
- [ ] 62. **API Key Generator**: Create secure tokens for your Roblox games to communicate with the website.
- [ ] 63. **Honeypot Bot Protection**: Invisible dynamic fields that catch and ban scrapers.
- [ ] 64. **Automatic Database Backups**: Trigger or schedule full PostgreSQL backups.
- [ ] 65. **Rate Limit Configurator**: Adjust how many requests users can make to stop spam.

## 🗣️ Community & Social Hub
- [ ] 66. **Dynamic Forums/Discussions**: Create categories where players can post feedback.
- [ ] 67. **User Comments on Patch Notes**: Allow logged-in players to comment on updates.
- [ ] 68. **Upvote/Downvote System**: Let the community vote on proposed game features.
- [ ] 69. **Player Bug Report Inbox**: Manage submitted bugs, mark them as "Resolved" or "In Progress".
- [ ] 70. **Automated Status Updates**: When a bug is fixed, the reporter gets an automated email.
- [ ] 71. **Player Profiles**: Users can customize their bio and show off their ranks.
- [ ] 72. **Badge Syncing**: Auto-display Roblox badges a player has earned on their web profile.
- [ ] 73. **Creator Support Codes**: Manage specific influencer codes that give them a revenue cut.
- [x] 74. **In-browser Live Chat (Staff)**: A real-time WebSocket chat strictly for developers.
- [ ] 75. **Guild/Clan Support**: Allow players to create groups dynamically.

## 🤖 Roblox API Integrations
- [ ] 76. **MessagingService Bridge**: Send messages from the website directly into live Roblox servers.
- [ ] 77. **MemoryStore Access**: View and clear active matchmaking queues from the web.
- [ ] 78. **Roblox Group Sync**: Verify if a website user is in your Roblox Group to give them special roles.
- [ ] 79. **Asset Verification**: Ensure uploaded models don't trigger Roblox moderation before publishing.
- [ ] 80. **Roblox Premium Tracking**: See how many Premium players are active across your portfolio.
- [ ] 81. **Revenue Dashboard**: Pull Robux revenue data via OpenCloud to visualize earnings on the site.
- [ ] 82. **Cross-Server Teleport Commands**: Force teleport a player from the website to a VIP server.
- [ ] 83. **Server Instance Viewer**: See a list of every active Roblox server (Job IDs) and its player count.
- [ ] 84. **Shutdown Specific Server**: Terminate a specific buggy Roblox server instance.
- [ ] 85. **Auto-Matchmaking Algorithms**: Tune the MMR (Matchmaking Rating) logic remotely.

## ⚙️ Advanced CMS Architecture
- [ ] 86. **Headless CMS Engine**: Separate the frontend entirely so data is just JSON APIs.
- [ ] 87. **Draft & Publish States**: Work on a massive game update page in "Draft" mode, and publish when ready.
- [ ] 88. **Content Versioning**: If you mess up a patch note, click "Restore Previous Version".
- [ ] 89. **Image CDN Integration**: Connect to AWS S3 or Cloudflare R2 for infinite asset storage.
- [ ] 90. **Webhook Dispatcher**: Create custom webhooks to notify third-party services of events.
- [ ] 91. **Dynamic Form Builder**: Build new data-entry forms (e.g., a "Beta Tester Signup" form) visually.
- [ ] 92. **Localization Dashboard**: Translate the site into Spanish/French directly from the DB.
- [ ] 93. **A/B Testing Framework**: Serve two different Landing Pages and see which converts more players.
- [ ] 94. **Automated Error Logging**: If a player's datastore fails, log it centrally in the admin panel.
- [ ] 95. **User Tier System**: Dynamically assign perks (VIP, MVP) based on play time.
- [ ] 96. **Subscription Management**: If you ever launch a Patreon/Subscription, sync it to in-game perks automatically.
- [ ] 97. **Data Export Tools**: Download all email subscribers or player data as a CSV.
- [ ] 98. **Custom Analytics Events**: Track things like "How many users clicked the Discord link today".
- [ ] 99. **Database GUI Viewer**: A raw table editor for emergency data fixes.
- [ ] 100. **Scheduled Wipes**: Configure an automated global leaderboard wipe at the end of every "Season".
- [ ] 101. **AI Content Assistant**: An integrated LLM to help write patch notes and job descriptions faster.
