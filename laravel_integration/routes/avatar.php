<?php

use App\Http\Controllers\AvatarController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/avatar', [AvatarController::class, 'show']);
    Route::post('/avatar/equip', [AvatarController::class, 'equip']);
});
