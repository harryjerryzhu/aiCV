// Vercel Serverless Function: NVIDIA API Proxy
// This proxies requests to NVIDIA API to avoid CORS issues in production

export const config = {
    runtime: 'edge',
};

export default async function handler(req: Request) {
    if (req.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
            status: 405,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    const apiKey = process.env.NVIDIA_API_KEY;

    if (!apiKey) {
        return new Response(JSON.stringify({ error: 'NVIDIA API key not configured' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    try {
        const body = await req.json();

        const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify(body),
        });

        const data = await response.json();

        return new Response(JSON.stringify(data), {
            status: response.status,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error: any) {
        console.error('NVIDIA API Proxy Error:', error);
        return new Response(JSON.stringify({ error: error.message || 'Internal server error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
