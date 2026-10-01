<?php

namespace App\Http\Controllers;

use App\Services\GamificationApiClient;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class GamificationController extends Controller
{
    public function storeActivity(
        Request $request,
        GamificationApiClient $client
    ) {
        $data = $request->validate([
            'external_id' => ['required', 'string'],
            'title' => ['required', 'string'],
            'description' => ['required', 'string'],
            'category' => ['required', 'string'],
            'factors' => ['required', 'array'],
            'status' => ['nullable', 'string'],
        ]);

        // This is the integration boundary.
        // Replace these mappings with Alumable's real user/organisation IDs.
        $data['creator_external_id'] = (string) auth()->id();
        $data['creator_role'] = strtoupper(
            auth()->user()->role
        );

        return response()->json(
            $client->createActivity($data)
        );
    }

    public function completeActivity(
        Request $request,
        GamificationApiClient $client
    ) {
        $data = $request->validate([
            'external_activity_id' => ['required', 'string'],
            'event_id' => ['nullable', 'string'],
            'approval_status' => ['nullable', 'string'],
        ]);

        $payload = [
            'external_user_id' => (string) auth()->id(),
            'external_activity_id' => $data['external_activity_id'],
            'event_id' => $data['event_id'] ?? (string) Str::uuid(),
            'approval_status' => $data['approval_status'] ?? 'APPROVED',
        ];

        return response()->json(
            $client->completeActivity($payload)
        );
    }

    public function progress(
        GamificationApiClient $client
    ) {
        return response()->json(
            $client->progress(
                (string) auth()->id()
            )
        );
    }
}
