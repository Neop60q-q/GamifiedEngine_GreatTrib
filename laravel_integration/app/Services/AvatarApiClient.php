<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class AvatarApiClient
{
    public function getAvatar(int $studentId): array
    {
        return Http::timeout(5)
            ->get(config('services.avatar.url')."/v1/avatar/{$studentId}")
            ->throw()
            ->json();
    }

    public function equipItem(int $studentId, int $itemId): array
    {
        return Http::timeout(5)
            ->post(config('services.avatar.url').'/v1/avatar/equip', [
                'student_id' => $studentId,
                'item_id' => $itemId,
            ])
            ->throw()
            ->json();
    }
}
