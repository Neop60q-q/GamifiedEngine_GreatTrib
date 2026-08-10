<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class XpTransaction extends Model
{
    use HasUuids;

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = ['xp_account_id', 'xp_definition_id', 'kind', 'amount', 'source_portal', 'source_reference', 'actor_external_id', 'reverses_transaction_id', 'reason', 'metadata'];

    protected function casts(): array
    {
        return ['metadata' => 'array'];
    }

    public function account(): BelongsTo
    {
        return $this->belongsTo(XpAccount::class, 'xp_account_id');
    }

    public function definition(): BelongsTo
    {
        return $this->belongsTo(XpDefinition::class, 'xp_definition_id');
    }
}
