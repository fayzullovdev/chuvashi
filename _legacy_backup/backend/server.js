// Steam OpenID Backend Server (Node.js + Express)
// Bu faylni ishga tushirish uchun: npm install express openid

const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// CORS sozlamalari
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// Static files (frontend)
app.use(express.static(path.join(__dirname, '..')));

// Steam OpenID authentication endpoint
app.get('/auth/steam', (req, res) => {
    const openid = require('openid');
    const realm = req.protocol + '://' + req.get('host');
    const returnUrl = realm + '/auth/steam/callback';

    const relyingParty = new openid.RelyingParty(
        returnUrl,
        realm,
        true,
        false,
        []
    );

    relyingParty.authenticate('https://steamcommunity.com/openid', false, (error, authUrl) => {
        if (error) {
            return res.redirect('/?error=' + encodeURIComponent(error.message));
        }
        if (!authUrl) {
            return res.redirect('/?error=Authentication failed');
        }
        res.redirect(authUrl);
    });
});

// Steam OpenID callback handler
app.get('/auth/steam/callback', (req, res) => {
    const openid = require('openid');
    const realm = req.protocol + '://' + req.get('host');
    const returnUrl = realm + '/auth/steam/callback';

    const relyingParty = new openid.RelyingParty(
        returnUrl,
        realm,
        true,
        false,
        []
    );

    relyingParty.verifyAssertion(req, (error, result) => {
        if (error) {
            return res.redirect('/?error=' + encodeURIComponent(error.message));
        }

        if (!result || !result.authenticated) {
            return res.redirect('/?error=Authentication failed');
        }

        // Extract Steam ID from OpenID identifier
        // Format: https://steamcommunity.com/openid/id/76561198000000000
        const steamId = result.claimedIdentifier.match(/\/(\d+)$/)[1];

        if (!steamId) {
            return res.redirect('/?error=Steam ID not found');
        }

        // Redirect to frontend with Steam ID
        res.redirect(`/?steamid=${steamId}`);
    });
});

// Get user profile data (optional, if you want to fetch profile info)
app.get('/api/user/:steamId', async (req, res) => {
    const steamId = req.params.steamId;

    try {
        // You can fetch profile data here if you have Steam API key
        // For now, return basic info
        res.json({
            steamId: steamId,
            username: `Steam User ${steamId.slice(-4)}`,
            avatar: `https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/fe/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg`,
            profileUrl: `https://steamcommunity.com/profiles/${steamId}`,
            stats: {
                kills: 0,
                deaths: 0,
                assists: 0,
                headshots: 0,
                matches: 0,
                wins: 0,
                kd: '0.00',
                headshotPercentage: '0.0',
                winRate: '0.0'
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Steam OpenID endpoint: http://localhost:${PORT}/auth/steam`);
});

