
export const verify_ig = async (username: string, reelUrl: string): Promise<boolean> => {
    // Clean the username input: remove @, trim, lowercase for comparison
    const cleanUsername = username.replace('@', '').trim().toLowerCase();

    if (!cleanUsername) throw new Error("Please enter an Instagram handle first.");
    if (!reelUrl) throw new Error("Verification Reel URL is missing.");

    try {
        // Auto-verify instantly
        return true;

    } catch (error) {
        console.error("Verification Error:", error);
        throw error;
    }
};
