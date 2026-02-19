/**
 * Discord Logger Utility
 * Sends detailed error logs to a Discord channel via Webhook
 */

export async function sendLogToDiscord(error: any, payload: any = {}) {
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    if (!webhookUrl) {
        console.warn("DISCORD_WEBHOOK_URL is not set. Skipping Discord log.");
        return;
    }

    try {
        const now = new Date();
        const timestamp = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getFullYear()).slice(-2)} ${String(now.getSeconds()).padStart(2, '0')}/${String(now.getMinutes()).padStart(2, '0')}/${String(now.getHours() % 12 || 12).padStart(2, '0')} ${now.getHours() >= 12 ? 'PM' : 'AM'}`;
        const errorMessage = error instanceof Error ? error.message : String(error);
        const stackTrace = error instanceof Error ? error.stack : "No stack trace available";

        // Create the log content
        const logData = {
            timestamp,
            error: errorMessage,
            stack: stackTrace,
            payload: payload,
            env: process.env.APP_ENV || "development",
        };

        const content = `**Prod Error Detected**\n**Time:** ${timestamp}\n**Error:** ${errorMessage}\n\n*Full details attached in log.txt*`;

        // Create a FormData to send the full log as a file (to avoid Discord's 2000 char limit)
        const formData = new FormData();
        formData.append("content", content);

        const logBlob = new Blob([JSON.stringify(logData, null, 2)], { type: "text/plain" });
        formData.append("file", logBlob, `error-log-${Date.now()}.txt`);

        await fetch(webhookUrl, {
            method: "POST",
            body: formData,
        });

    } catch (discordError) {
        console.error("CRITICAL: Failed to send log to Discord:", discordError);
    }
}

/**
 * Higher-order function to wrap API handlers for global error catching
 */
export function withErrorLogging(handler: Function) {
    return async (req: Request, ...args: any[]) => {
        try {
            return await handler(req, ...args);
        } catch (error) {
            // Log payload similar to your Python implementation
            const url = new URL(req.url);
            const payload = {
                url: req.url,
                method: req.method,
                query: Object.fromEntries(url.searchParams),
                headers: Object.fromEntries(req.headers.entries()),
            };

            await sendLogToDiscord(error, payload);

            return new Response(
                JSON.stringify({ message: "Internal server error", error: String(error) }),
                { status: 500, headers: { 'Content-Type': 'application/json' } }
            );
        }
    };
}
