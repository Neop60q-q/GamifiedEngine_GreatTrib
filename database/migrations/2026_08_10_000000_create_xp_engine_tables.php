<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('xp_levels', function (Blueprint $table) {
            $table->id();
            $table->unsignedTinyInteger('level')->unique();
            $table->unsignedInteger('xp_threshold');
            $table->string('capability');
            $table->timestamps();
        });

        Schema::create('xp_definitions', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->enum('type', ['activity', 'challenge', 'achievement']);
            $table->string('title');
            $table->text('description')->nullable();
            $table->unsignedInteger('xp_value');
            $table->enum('verification', ['automatic', 'self', 'educator', 'employer', 'admin']);
            $table->enum('repeatability', ['once', 'daily', 'weekly', 'monthly', 'unlimited'])->default('once');
            $table->boolean('active')->default(true);
            $table->json('metadata')->nullable();
            $table->timestamps();
        });

        Schema::create('xp_accounts', function (Blueprint $table) {
            $table->id();
            $table->string('external_id')->unique();
            $table->string('display_name')->nullable();
            $table->unsignedInteger('total_xp')->default(0);
            $table->unsignedTinyInteger('current_level')->default(1);
            $table->timestamps();
        });

        Schema::create('xp_transactions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignId('xp_account_id')->constrained()->cascadeOnDelete();
            $table->foreignId('xp_definition_id')->nullable()->constrained()->nullOnDelete();
            $table->enum('kind', ['award', 'adjustment', 'reversal']);
            $table->integer('amount');
            $table->enum('source_portal', ['student', 'educator', 'employer', 'system']);
            $table->string('source_reference');
            $table->string('actor_external_id')->nullable();
            $table->uuid('reverses_transaction_id')->nullable();
            $table->string('reason')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamps();

            $table->unique(['source_portal', 'source_reference']);
            $table->foreign('reverses_transaction_id')->references('id')->on('xp_transactions')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('xp_transactions');
        Schema::dropIfExists('xp_accounts');
        Schema::dropIfExists('xp_definitions');
        Schema::dropIfExists('xp_levels');
    }
};
