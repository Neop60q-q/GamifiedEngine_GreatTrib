<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class XpAccount extends Model
{
    protected $fillable = ['external_id', 'display_name', 'total_xp', 'current_level'];

    public function transactions(): HasMany
    {
        return $this->hasMany(XpTransaction::class);
    }
}
