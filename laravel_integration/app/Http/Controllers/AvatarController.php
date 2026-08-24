<?php

namespace App\Http\Controllers;

use App\Services\AvatarApiClient;
use Illuminate\Http\Request;

class AvatarController extends Controller
{
    public function show(AvatarApiClient $client)
    {
        return response()->json(
            $client->getAvatar(auth()->id())
        );
    }

    public function equip(Request $request, AvatarApiClient $client)
    {
        $data = $request->validate([
            'item_id' => ['required', 'integer'],
        ]);

        return response()->json(
            $client->equipItem(auth()->id(), $data['item_id'])
        );
    }
}
