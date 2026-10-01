<?php

// Merge this section into Laravel's config/services.php.

return [
    'gamification' => [
        'creation_url' => env(
            'GAMIFICATION_CREATION_URL',
            'http://creation-engine:8001'
        ),

        'xp_url' => env(
            'GAMIFICATION_XP_URL',
            'http://xp-engine:8002'
        ),

        'avatar_url' => env(
            'GAMIFICATION_AVATAR_URL',
            'http://avatar-engine:8003'
        ),
    ],
];
