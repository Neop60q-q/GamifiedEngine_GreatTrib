<?php

use App\Models\XpDefinition;
use App\Models\XpLevel;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', fn () => Inertia::render('basic-engine', [
    'definitions' => XpDefinition::query()->where('active', true)->orderBy('type')->get(),
    'levels' => XpLevel::query()->orderBy('level')->get(),
]))->name('home');

Route::get('/student', fn () => Inertia::render('student-portal', [
    'levels' => XpLevel::query()->orderBy('level')->get(),
]))->name('student.portal');

Route::get('/educator', fn () => Inertia::render('educator-portal', [
    'definitions' => XpDefinition::query()
        ->where('active', true)
        ->whereIn('type', ['activity', 'achievement'])
        ->orderBy('type')
        ->get(),
]))->name('educator.portal');

Route::get('/employer', fn () => Inertia::render('employer-portal', [
    'definitions' => XpDefinition::query()
        ->where('active', true)
        ->whereIn('type', ['challenge', 'achievement'])
        ->orderBy('type')
        ->get(),
]))->name('employer.portal');

Route::redirect('/dashboard', '/')->name('dashboard');

require __DIR__.'/settings.php';
