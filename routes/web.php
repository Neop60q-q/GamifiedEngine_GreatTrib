<?php

use App\Models\XpDefinition;
use App\Models\XpLevel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', fn () => Inertia::render('basic-engine', [
    'definitions' => XpDefinition::query()->where('active', true)->orderBy('type')->get(),
    'levels' => XpLevel::query()->orderBy('level')->get(),
]))->name('home');

Route::get('/student', fn () => Inertia::render('student-portal', [
    'levels' => XpLevel::query()->orderBy('level')->get(),
]))->name('student.portal');

Route::get('/management', fn (Request $request) => Inertia::render('management-portal', [
    'definitions' => XpDefinition::query()
        ->where('active', true)
        ->orderBy('type')
        ->get(),
    'initialRole' => in_array($request->query('role'), ['educator', 'employer'], true)
        ? $request->query('role')
        : 'educator',
]))->name('management.portal');

Route::redirect('/educator', '/management?role=educator')->name('educator.portal');
Route::redirect('/employer', '/management?role=employer')->name('employer.portal');

Route::redirect('/dashboard', '/')->name('dashboard');

require __DIR__.'/settings.php';
