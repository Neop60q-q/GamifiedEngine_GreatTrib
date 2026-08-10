<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AuthenticateXpEngine
{
    public function handle(Request $request, Closure $next): Response
    {
        $configuredKey = config('xp.api_key');
        $providedKey = $request->header('X-XP-Engine-Key');

        if (! is_string($configuredKey) || $configuredKey === '' || ! is_string($providedKey) || ! hash_equals($configuredKey, $providedKey)) {
            return response()->json(['message' => 'Invalid or missing XP engine credentials.'], 401);
        }

        return $next($request);
    }
}
