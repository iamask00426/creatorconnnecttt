import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const MSG91_AUTHKEY = process.env.VITE_MSG91_AUTHKEY || '';

app.use(express.json());

// Serve static files from Vite build
app.use(express.static(path.join(__dirname, 'dist')));

// ========== WhatsApp API Proxy Endpoints ==========

// Welcome message (existing)
app.post('/api/send-whatsapp', async (req, res) => {
    try {
        const { phone: rawPhone, name } = req.body;
        const phone = rawPhone?.replace(/[\s\-\+]/g, '');
        if (!phone || !name) return res.status(400).json({ error: 'phone and name are required' });

        const payload = {
            integrated_number: '919354265293',
            content_type: 'template',
            payload: {
                messaging_product: 'whatsapp',
                type: 'template',
                template: {
                    name: 'welcome_massage_',
                    language: { code: 'en', policy: 'deterministic' },
                    namespace: '3ae38a9f_cbce_4436_a228_5bdab18fbb9d',
                    to_and_components: [{
                        to: [phone],
                        components: {
                            body_1: { type: 'text', value: name },
                        },
                    }],
                },
            },
        };

        console.log('[WhatsApp] Sending welcome to:', phone);
        const msg91Res = await fetch('https://api.msg91.com/api/v5/whatsapp/whatsapp-outbound-message/bulk/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', authkey: MSG91_AUTHKEY },
            body: JSON.stringify(payload),
        });

        const data = await msg91Res.text();
        console.log('[WhatsApp] Welcome response:', msg91Res.status, data);
        res.status(msg91Res.status).json(JSON.parse(data));
    } catch (err) {
        console.error('[WhatsApp] Welcome error:', err);
        res.status(500).json({ error: err.message });
    }
});

// Profile approved message
app.post('/api/send-whatsapp-approval', async (req, res) => {
    try {
        const { phone: rawPhone, name } = req.body;
        const phone = rawPhone?.replace(/[\s\-\+]/g, '');
        if (!phone || !name) return res.status(400).json({ error: 'phone and name are required' });

        const payload = {
            integrated_number: '919354265293',
            content_type: 'template',
            payload: {
                messaging_product: 'whatsapp',
                type: 'template',
                template: {
                    name: 'profile_apporved',
                    language: { code: 'en', policy: 'deterministic' },
                    namespace: '3ae38a9f_cbce_4436_a228_5bdab18fbb9d',
                    to_and_components: [{
                        to: [phone],
                        components: {
                            body_name: { type: 'text', value: name, parameter_name: 'name' },
                        },
                    }],
                },
            },
        };

        console.log('[WhatsApp] Sending approval to:', phone, 'Name:', name);
        const msg91Res = await fetch('https://api.msg91.com/api/v5/whatsapp/whatsapp-outbound-message/bulk/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', authkey: MSG91_AUTHKEY },
            body: JSON.stringify(payload),
        });

        const data = await msg91Res.text();
        console.log('[WhatsApp] Approval response:', msg91Res.status, data);
        res.status(msg91Res.status).json(JSON.parse(data));
    } catch (err) {
        console.error('[WhatsApp] Approval error:', err);
        res.status(500).json({ error: err.message });
    }
});

// Connection request message
app.post('/api/send-whatsapp-connection', async (req, res) => {
    try {
        const { phone: rawPhone, receiverName, senderName, link } = req.body;
        const phone = rawPhone?.replace(/[\s\-\+]/g, '');
        if (!phone || !receiverName || !senderName || !link) {
            return res.status(400).json({ error: 'phone, receiverName, senderName, and link are required' });
        }

        const payload = {
            integrated_number: '919354265293',
            content_type: 'template',
            payload: {
                messaging_product: 'whatsapp',
                type: 'template',
                template: {
                    name: 'connection_massage',
                    language: { code: 'en', policy: 'deterministic' },
                    namespace: '3ae38a9f_cbce_4436_a228_5bdab18fbb9d',
                    to_and_components: [{
                        to: [phone],
                        components: {
                            body_1: { type: 'text', value: receiverName, parameter_name: '1' },
                            body_2: { type: 'text', value: senderName, parameter_name: '2' },
                            body_3: { type: 'text', value: link, parameter_name: '3' },
                        },
                    }],
                },
            },
        };

        console.log('[WhatsApp] Sending connection to:', phone);
        const msg91Res = await fetch('https://api.msg91.com/api/v5/whatsapp/whatsapp-outbound-message/bulk/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', authkey: MSG91_AUTHKEY },
            body: JSON.stringify(payload),
        });

        const data = await msg91Res.text();
        console.log('[WhatsApp] Connection response:', msg91Res.status, data);
        res.status(msg91Res.status).json(JSON.parse(data));
    } catch (err) {
        console.error('[WhatsApp] Connection error:', err);
        res.status(500).json({ error: err.message });
    }
});

// SPA fallback — all other routes serve index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`[Server] Running on port ${PORT}`);
    console.log(`[Server] MSG91 AuthKey length: ${MSG91_AUTHKEY.length}`);
});
