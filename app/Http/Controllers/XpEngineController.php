<?php

namespace App\Http\Controllers;

use App\Models\XpAccount;
use App\Models\XpDefinition;
use App\Models\XpLevel;
use App\Models\XpTransaction;
use App\XpEngine;
use DomainException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class XpEngineController extends Controller
{
    public function __construct(private readonly XpEngine $engine) {}

    public function definitions(): JsonResponse
    {
        return response()->json(['data' => XpDefinition::query()->where('active', true)->orderBy('type')->get()]);
    }

    public function levels(): JsonResponse
    {
        return response()->json(['data' => XpLevel::query()->orderBy('level')->get()]);
    }

    public function progress(string $externalId): JsonResponse
    {
        $account = XpAccount::firstOrCreate(['external_id' => $externalId]);

        return response()->json([
            'data' => $this->engine->progress($account),
            'transactions' => $account->transactions()->with('definition')->latest()->limit(50)->get(),
        ]);
    }

    public function award(Request $request): JsonResponse
    {
        $data = $request->validate($this->rules(true));
        $account = XpAccount::firstOrCreate(['external_id' => $data['student_external_id']], ['display_name' => $data['student_display_name'] ?? null]);
        $definition = XpDefinition::where('code', $data['definition_code'])->firstOrFail();

        return $this->execute(fn () => $this->engine->award($account, $definition, $this->context($data)));
    }

    public function adjust(Request $request): JsonResponse
    {
        $data = $request->validate([...$this->rules(), 'amount' => ['required', 'integer', 'between:-100000,100000']]);
        $account = XpAccount::firstOrCreate(['external_id' => $data['student_external_id']]);

        return $this->execute(fn () => $this->engine->adjust($account, $data['amount'], $this->context($data)));
    }

    public function reverse(Request $request, XpTransaction $transaction): JsonResponse
    {
        $data = $request->validate([
            'source_portal' => ['required', 'in:educator,employer,system'],
            'source_reference' => ['required', 'string', 'max:255'],
            'actor_external_id' => ['required', 'string', 'max:255'],
            'reason' => ['required', 'string', 'max:255'],
            'metadata' => ['sometimes', 'array'],
        ]);

        return $this->execute(fn () => $this->engine->reverse($transaction, $this->context($data)));
    }

    private function rules(bool $withDefinition = false): array
    {
        return [
            'student_external_id' => ['required', 'string', 'max:255'],
            'student_display_name' => ['sometimes', 'nullable', 'string', 'max:255'],
            ...($withDefinition ? ['definition_code' => ['required', 'string', 'exists:xp_definitions,code']] : []),
            'source_portal' => ['required', 'in:student,educator,employer,system'],
            'source_reference' => ['required', 'string', 'max:255'],
            'actor_external_id' => ['sometimes', 'nullable', 'string', 'max:255'],
            'reason' => ['sometimes', 'nullable', 'string', 'max:255'],
            'metadata' => ['sometimes', 'array'],
        ];
    }

    private function context(array $data): array
    {
        return collect($data)->only(['source_portal', 'source_reference', 'actor_external_id', 'reason', 'metadata'])->all();
    }

    private function execute(callable $operation): JsonResponse
    {
        try {
            $transaction = $operation();
            $transaction->account->refresh();

            return response()->json(['data' => $transaction, 'progress' => $this->engine->progress($transaction->account)], 201);
        } catch (DomainException $exception) {
            return response()->json(['message' => $exception->getMessage()], 422);
        }
    }
}
