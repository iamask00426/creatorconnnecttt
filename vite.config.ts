import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import type { Plugin } from 'vite';

function whatsappProxyPlugin(authKey: string): Plugin {
  console.log('[WhatsApp Proxy] Initialized with authKey length:', authKey?.length); // Debug log
  return {
    name: 'whatsapp-proxy',
    configureServer(server) {
      server.middlewares.use('/api/send-whatsapp', async (req, res) => {
        console.log('[WhatsApp Proxy] Received request:', req.method, req.url); // Debug log
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end('Method Not Allowed');
          return;
        }

        let body = '';
        req.on('data', (chunk: Buffer) => { body += chunk.toString(); });
        req.on('end', async () => {
          try {
            const { phone, name } = JSON.parse(body);
            if (!phone || !name) {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: 'phone and name are required' }));
              return;
            }

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
                  to_and_components: [
                    {
                      to: [phone],
                      components: {
                        body_1: { type: 'text', value: name },
                      },
                    },
                  ],
                },
              },
            };

            console.log('[WhatsApp Proxy] Sending payload to MSG91:', JSON.stringify(payload, null, 2));

            const msg91Res = await fetch(
              'https://api.msg91.com/api/v5/whatsapp/whatsapp-outbound-message/bulk/',
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  authkey: authKey, // Ensure this is valid in your .env
                },
                body: JSON.stringify(payload),
              }
            );

            const msg91Data = await msg91Res.text();
            console.log('[WhatsApp Proxy] MSG91 response:', msg91Res.status, msg91Data);

            res.statusCode = msg91Res.status;
            res.setHeader('Content-Type', 'application/json');
            res.end(msg91Data);
          } catch (err: any) {
            console.error('[WhatsApp Proxy] Error:', err);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: err.message }));
          }
        });
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    appType: 'spa',
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [
      react(),
      whatsappProxyPlugin(env.VITE_MSG91_AUTHKEY || ''),
    ],
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    }
  };
});
