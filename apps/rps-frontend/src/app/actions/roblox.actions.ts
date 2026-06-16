"use server";
const ROBLOX_UNIVERSE_RESOLVER = "https://apis.roblox.com/universes/v1/places/{placeId}/universe";
const ROBLOX_GAMES_API = "https://games.roblox.com/v1/games?universeIds={universeId}";
const ROBLOX_VOTES_API = "https://games.roblox.com/v1/games/votes?universeIds={universeId}";
export async function resolvePlaceToUniverse(placeId: string) {
    try {
        const res = await fetch(ROBLOX_UNIVERSE_RESOLVER.replace("{placeId}", placeId), {
            next: { revalidate: 3600 } 
        });
        if (!res.ok) {
            throw new Error(`Failed to resolve Place ID: ${res.statusText}`);
        }
        const data = await res.json();
        if (!data.universeId) {
            throw new Error("Invalid Place ID or game is private/unavailable.");
        }
        return { success: true, universeId: data.universeId.toString() };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
export async function getGameMetrics(universeId: string) {
    try {
        const gameRes = await fetch(ROBLOX_GAMES_API.replace("{universeId}", universeId), {
            cache: 'no-store' 
        });
        if (!gameRes.ok) {
            throw new Error(`Failed to fetch game data: ${gameRes.statusText}`);
        }
        const gameData = await gameRes.json();
        if (!gameData.data || gameData.data.length === 0) {
            throw new Error("No game data found for this Universe ID.");
        }
        const game = gameData.data[0];
        const votesRes = await fetch(ROBLOX_VOTES_API.replace("{universeId}", universeId), {
            cache: 'no-store'
        });
        let votes = { upVotes: 0, downVotes: 0 };
        if (votesRes.ok) {
            const votesData = await votesRes.json();
            if (votesData.data && votesData.data.length > 0) {
                votes = votesData.data[0];
            }
        }
        const totalVotes = votes.upVotes + votes.downVotes;
        const ratio = totalVotes > 0 ? Math.round((votes.upVotes / totalVotes) * 100) : 0;
        return {
            success: true,
            metrics: {
                id: game.id,
                name: game.name,
                visits: game.visits || 0,
                playing: game.playing || 0,
                favorites: game.favoritedCount || 0,
                upVotes: votes.upVotes,
                downVotes: votes.downVotes,
                ratio: ratio
            }
        };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
