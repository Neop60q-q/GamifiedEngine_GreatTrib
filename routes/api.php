<?php

use App\Http\Controllers\XpEngineController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->middleware('xp.engine')->group(function () {
    Route::get('definitions', [XpEngineController::class, 'definitions']);
    Route::get('levels', [XpEngineController::class, 'levels']);
    Route::get('students/{externalId}/progress', [XpEngineController::class, 'progress']);
    Route::post('awards', [XpEngineController::class, 'award']);
    Route::post('adjustments', [XpEngineController::class, 'adjust']);
    Route::post('transactions/{transaction}/reversal', [XpEngineController::class, 'reverse']);
});
