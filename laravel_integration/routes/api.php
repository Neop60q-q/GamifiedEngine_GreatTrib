<?php

use App\Http\Controllers\GamificationController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/gamification/activities', [GamificationController::class, 'storeActivity']);
    Route::post('/gamification/activities/complete', [GamificationController::class, 'completeActivity']);
});
