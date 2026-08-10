<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class XpLevel extends Model
{
    protected $fillable = ['level', 'xp_threshold', 'capability'];
}
