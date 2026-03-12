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

/**
 * WhatsApp Profile Approved Message Service (via MSG91)
 * Sends a "profile_apporved" template message when admin approves a user.
 */
export const sendWhatsAppApproval = async (phoneNumber: string, displayName: string): Promise<void> => {
    try {
        const cleanPhone = phoneNumber.replace(/[\s\-\+]/g, '');
        console.log('[WhatsApp] Sending approval message to:', cleanPhone, 'Name:', displayName);

        const response = await fetch('/api/send-whatsapp-approval', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone: cleanPhone, name: displayName }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('[WhatsApp] Approval API error:', response.status, errorText);
        } else {
            console.log('[WhatsApp] Approval message sent to', cleanPhone);
        }
    } catch (err) {
        console.error('[WhatsApp] Failed to send approval message:', err);
    }
};

/**
 * WhatsApp Connection Request Message Service (via MSG91)
 * Sends a "connection_massage" template when one user sends a collab request to another.
 */
export const sendWhatsAppConnection = async (
    receiverPhone: string,
    receiverName: string,
    senderName: string,
    senderUsername?: string
): Promise<void> => {
    try {
        const cleanPhone = receiverPhone.replace(/[\s\-\+]/g, '');
        const link = senderUsername
            ? `https://creatorconnect.io/${senderUsername}`
            : 'https://creatorconnect.io';

        console.log('[WhatsApp] Sending connection message to:', cleanPhone, 'Receiver:', receiverName, 'Sender:', senderName);

        const response = await fetch('/api/send-whatsapp-connection', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                phone: cleanPhone,
                receiverName,
                senderName,
                link,
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('[WhatsApp] Connection API error:', response.status, errorText);
        } else {
            console.log('[WhatsApp] Connection message sent to', cleanPhone);
        }
    } catch (err) {
        console.error('[WhatsApp] Failed to send connection message:', err);
    }
};

