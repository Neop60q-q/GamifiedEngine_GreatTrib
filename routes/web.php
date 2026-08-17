<?php

use App\Models\XpDefinition;
use App\Models\XpLevel;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', fn () => Inertia::render('basic-engine', [
    'definitions' => XpDefinition::query()->where('active', true)->orderBy('type')->get(),
    'levels' => XpLevel::query()->orderBy('level')->get(),
]))->name('home');

Route::redirect('/dashboard', '/')->name('dashboard');

require __DIR__.'/settings.php';
