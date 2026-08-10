<?php

namespace Tests\Feature;

use App\Models\XpDefinition;
use App\Models\XpLevel;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class XpEngineTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        config(['xp.api_key' => 'test-key']);
        XpLevel::create(['level' => 1, 'xp_threshold' => 0, 'capability' => 'Student Profile']);
        XpLevel::create(['level' => 2, 'xp_threshold' => 100, 'capability' => 'Basic Job Applications']);
        XpDefinition::create([
            'code' => 'gig.complete', 'type' => 'challenge', 'title' => 'Complete gig',
            'xp_value' => 250, 'verification' => 'employer', 'repeatability' => 'unlimited', 'active' => true,
        ]);
    }

    public function test_portal_award_is_idempotent_and_updates_progress(): void
    {
        $payload = [
            'student_external_id' => 'student-123', 'definition_code' => 'gig.complete',
            'source_portal' => 'employer', 'source_reference' => 'completion-987', 'actor_external_id' => 'employer-42',
        ];

        $this->withHeader('X-XP-Engine-Key', 'test-key')->postJson('/api/v1/awards', $payload)
            ->assertCreated()->assertJsonPath('progress.total_xp', 250)->assertJsonPath('progress.level', 2);
        $this->withHeader('X-XP-Engine-Key', 'test-key')->postJson('/api/v1/awards', $payload)
            ->assertCreated()->assertJsonPath('progress.total_xp', 250);

        $this->assertDatabaseCount('xp_transactions', 1);
    }

    public function test_engine_rejects_unauthenticated_portal_calls(): void
    {
        $this->getJson('/api/v1/levels')->assertUnauthorized();
    }
}
