/**
 * WhatsApp Welcome Message Service (via MSG91)
 * Sends a welcome template message when a user completes onboarding step 1.
 */

export const sendWhatsAppWelcome = async (phoneNumber: string, displayName: string): Promise<void> => {
    try {
        // Strip spaces, dashes, and leading '+' → pure digits with country code
        const cleanPhone = phoneNumber.replace(/[\s\-\+]/g, '');
        console.log('[WhatsApp Client] Sending to:', cleanPhone, 'Name:', displayName); // Debug log

        const response = await fetch('/api/send-whatsapp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone: cleanPhone, name: displayName }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('[WhatsApp] API error:', response.status, errorText);
        } else {
            console.log('[WhatsApp] Welcome message sent to', cleanPhone);
        }
    } catch (err) {
        // Fire-and-forget — never block onboarding
        console.error('[WhatsApp] Failed to send welcome message:', err);
    }
};
