<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class XpDefinition extends Model
{
    protected $fillable = ['code', 'type', 'title', 'description', 'xp_value', 'verification', 'repeatability', 'active', 'metadata'];

    protected function casts(): array
    {
        return ['active' => 'boolean', 'metadata' => 'array'];
    }
}
