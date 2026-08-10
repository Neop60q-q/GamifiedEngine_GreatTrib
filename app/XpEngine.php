<?php

namespace App;

use App\Models\XpAccount;
use App\Models\XpDefinition;
use App\Models\XpLevel;
use App\Models\XpTransaction;
use DomainException;
use Illuminate\Support\Facades\DB;

class XpEngine
{
    public function award(XpAccount $account, XpDefinition $definition, array $context): XpTransaction
    {
        if (! $definition->active) {
            throw new DomainException('This XP definition is not active.');
        }

        return DB::transaction(function () use ($account, $definition, $context) {
            $account = XpAccount::query()->lockForUpdate()->findOrFail($account->id);
            if ($existing = $this->idempotentResult($context)) {
                return $existing;
            }

            $this->guardRepeatability($account, $definition);
            $transaction = XpTransaction::create([
                'xp_account_id' => $account->id,
                'xp_definition_id' => $definition->id,
                'kind' => 'award',
                'amount' => $definition->xp_value,
                ...$context,
            ]);
            $this->refreshProgress($account);

            return $transaction->load('definition');
        });
    }

    public function adjust(XpAccount $account, int $amount, array $context): XpTransaction
    {
        if ($amount === 0) {
            throw new DomainException('An adjustment amount cannot be zero.');
        }

        return DB::transaction(function () use ($account, $amount, $context) {
            $account = XpAccount::query()->lockForUpdate()->findOrFail($account->id);
            if ($existing = $this->idempotentResult($context)) {
                return $existing;
            }
            if ($account->total_xp + $amount < 0) {
                throw new DomainException('This adjustment would make total XP negative.');
            }
            $transaction = XpTransaction::create([
                'xp_account_id' => $account->id,
                'kind' => 'adjustment',
                'amount' => $amount,
                ...$context,
            ]);
            $this->refreshProgress($account);

            return $transaction;
        });
    }

    public function reverse(XpTransaction $original, array $context): XpTransaction
    {
        return DB::transaction(function () use ($original, $context) {
            $original = XpTransaction::query()->lockForUpdate()->findOrFail($original->id);
            if ($prior = XpTransaction::query()->where('reverses_transaction_id', $original->id)->first()) {
                return $prior;
            }
            if ($original->kind === 'reversal') {
                throw new DomainException('A reversal cannot itself be reversed.');
            }
            $account = XpAccount::query()->lockForUpdate()->findOrFail($original->xp_account_id);
            if ($account->total_xp - $original->amount < 0) {
                throw new DomainException('This reversal would make total XP negative.');
            }
            $transaction = XpTransaction::create([
                'xp_account_id' => $account->id,
                'xp_definition_id' => $original->xp_definition_id,
                'kind' => 'reversal',
                'amount' => -$original->amount,
                'reverses_transaction_id' => $original->id,
                ...$context,
            ]);
            $this->refreshProgress($account);

            return $transaction;
        });
    }

    public function progress(XpAccount $account): array
    {
        $levels = XpLevel::query()->orderBy('level')->get();
        $current = $levels->where('xp_threshold', '<=', $account->total_xp)->last();
        $next = $levels->firstWhere('level', '>', $current?->level ?? 1);
        $floor = $current?->xp_threshold ?? 0;

        return [
            'account' => $account->only(['external_id', 'display_name']),
            'total_xp' => $account->total_xp,
            'level' => $current?->level ?? 1,
            'current_threshold' => $floor,
            'next_threshold' => $next?->xp_threshold,
            'xp_to_next_level' => $next ? $next->xp_threshold - $account->total_xp : 0,
            'progress_percent' => $next ? round((($account->total_xp - $floor) / ($next->xp_threshold - $floor)) * 100, 1) : 100,
            'unlocked_capabilities' => $levels->where('xp_threshold', '<=', $account->total_xp)->pluck('capability')->values(),
            'next_unlock' => $next?->capability,
        ];
    }

    private function refreshProgress(XpAccount $account): void
    {
        $total = max(0, (int) $account->transactions()->sum('amount'));
        $level = XpLevel::query()->where('xp_threshold', '<=', $total)->max('level') ?? 1;
        $account->update(['total_xp' => $total, 'current_level' => $level]);
    }

    private function idempotentResult(array $context): ?XpTransaction
    {
        return XpTransaction::query()->where('source_portal', $context['source_portal'])
            ->where('source_reference', $context['source_reference'])->first();
    }

    private function guardRepeatability(XpAccount $account, XpDefinition $definition): void
    {
        if ($definition->repeatability === 'unlimited') {
            return;
        }
        $query = $account->transactions()->where('kind', 'award')->where('xp_definition_id', $definition->id);
        $start = match ($definition->repeatability) {
            'daily' => now()->startOfDay(), 'weekly' => now()->startOfWeek(), 'monthly' => now()->startOfMonth(), default => null,
        };
        if ($start) {
            $query->where('created_at', '>=', $start);
        }
        if ($query->exists()) {
            throw new DomainException("This {$definition->repeatability} reward has already been awarded for the current period.");
        }
    }
}
