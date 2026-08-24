<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class GamificationApiClient
{
    public function createActivity(array $payload): array
    {
        return Http::timeout(5)
            ->retry(2, 200)
            ->post(
                config('services.gamification.creation_url').'/v1/activities',
                $payload
            )
            ->throw()
            ->json();
    }

    public function completeActivity(array $payload): array
    {
        return Http::timeout(5)
            ->retry(2, 200)
            ->post(
                config('services.gamification.xp_url').'/v1/completions/activity',
                $payload
            )
            ->throw()
            ->json();
    }

    public function progress(string $externalUserId): array
    {
        return Http::timeout(5)
            ->get(
                config('services.gamification.xp_url')
                ."/v1/students/{$externalUserId}/progress"
            )
            ->throw()
            ->json();
    }
}
