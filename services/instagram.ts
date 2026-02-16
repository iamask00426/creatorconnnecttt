
export const verify_ig = async (username: string, reelUrl: string): Promise<boolean> => {
    // API Key — loaded from environment variable
    const API_TOKEN = import.meta.env.VITE_APIFY_API_TOKEN || "";

    // Clean the username input: remove @, trim, lowercase for comparison
    const cleanUsername = username.replace('@', '').trim().toLowerCase();

    if (!cleanUsername) throw new Error("Please enter an Instagram handle first.");
    if (!reelUrl) throw new Error("Verification Reel URL is missing.");

    try {
        // 1. Start the Apify Actor (instagram-comment-scraper)
        const startResponse = await fetch(`https://api.apify.com/v2/acts/apify~instagram-comment-scraper/runs?token=${API_TOKEN}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                directUrls: [reelUrl],
                resultsLimit: 100, // Increased limit for better coverage
                viewOptions: "newest" // Prioritize newest comments
            })
        });

        if (!startResponse.ok) {
            const err = await startResponse.json();
            console.error("Apify Start Error", err);
            throw new Error("Failed to start verification. Please try again later.");
        }

        const startData = await startResponse.json();
        const runId = startData.data.id;
        const datasetId = startData.data.defaultDatasetId;

        // 2. Poll for completion (Wait loop)
        // Check status every 5 seconds, timeout after ~60 seconds
        let isComplete = false;
        let attempts = 0;
        const maxAttempts = 12;

        while (!isComplete && attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5s

            const statusResponse = await fetch(`https://api.apify.com/v2/acts/apify~instagram-comment-scraper/runs/${runId}?token=${API_TOKEN}`);
            const statusData = await statusResponse.json();
            const status = statusData.data.status;

            if (status === 'SUCCEEDED') {
                isComplete = true;
            } else if (status === 'FAILED' || status === 'ABORTED') {
                throw new Error("Verification process failed on the server.");
            }
            attempts++;
        }

        if (!isComplete) throw new Error("Verification timed out. Please try again.");

        // 3. Fetch the results (Comments)
        const resultsResponse = await fetch(`https://api.apify.com/v2/datasets/${datasetId}/items?token=${API_TOKEN}`);
        const comments = await resultsResponse.json();

        // 4. Check if the user's handle exists in the comments
        // Comparison is always lowercase to ensure matching
        const hasCommented = comments.some((comment: any) =>
            comment.ownerUsername && comment.ownerUsername.toLowerCase() === cleanUsername
        );

        return hasCommented;

    } catch (error) {
        console.error("Verification Error:", error);
        throw error;
    }
};
