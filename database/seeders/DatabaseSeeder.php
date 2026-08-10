<?php

namespace Database\Seeders;

use App\Models\XpDefinition;
use App\Models\XpLevel;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $levels = [[1, 0, 'Student Profile'], [2, 100, 'Basic Job Applications'], [3, 350, 'Premium Challenges'], [4, 750, 'Employer Recommendations'], [5, 1350, 'Advanced Opportunities'], [6, 2250, 'Verified Contributor'], [7, 3550, 'Mentor Eligibility'], [8, 5350, 'Elite Opportunities'], [9, 7850, 'Industry Recognition'], [10, 11350, 'Platform Ambassador']];
        foreach ($levels as [$level, $threshold, $capability]) {
            XpLevel::updateOrCreate(['level' => $level], ['xp_threshold' => $threshold, 'capability' => $capability]);
        }

        $definitions = [
            ['profile.complete', 'activity', 'Complete student profile', 50, 'automatic', 'once'],
            ['resume.upload', 'activity', 'Upload a resume', 100, 'educator', 'once'],
            ['workshop.attend', 'activity', 'Attend a career workshop', 150, 'educator', 'unlimited'],
            ['gig.complete', 'challenge', 'Complete an employer gig', 250, 'employer', 'unlimited'],
            ['first.steps', 'achievement', 'Complete a first activity', 50, 'automatic', 'once'],
        ];
        foreach ($definitions as [$code, $type, $title, $xp, $verification, $repeatability]) {
            XpDefinition::updateOrCreate(['code' => $code], compact('type', 'title', 'verification', 'repeatability') + ['xp_value' => $xp, 'active' => true]);
        }
    }
}
