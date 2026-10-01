import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\XpEngineController::definitions
 * @see app/Http/Controllers/XpEngineController.php:18
 * @route '/api/v1/definitions'
 */
export const definitions = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: definitions.url(options),
    method: 'get',
})

definitions.definition = {
    methods: ["get","head"],
    url: '/api/v1/definitions',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\XpEngineController::definitions
 * @see app/Http/Controllers/XpEngineController.php:18
 * @route '/api/v1/definitions'
 */
definitions.url = (options?: RouteQueryOptions) => {
    return definitions.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\XpEngineController::definitions
 * @see app/Http/Controllers/XpEngineController.php:18
 * @route '/api/v1/definitions'
 */
definitions.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: definitions.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\XpEngineController::definitions
 * @see app/Http/Controllers/XpEngineController.php:18
 * @route '/api/v1/definitions'
 */
definitions.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: definitions.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\XpEngineController::definitions
 * @see app/Http/Controllers/XpEngineController.php:18
 * @route '/api/v1/definitions'
 */
    const definitionsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: definitions.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\XpEngineController::definitions
 * @see app/Http/Controllers/XpEngineController.php:18
 * @route '/api/v1/definitions'
 */
        definitionsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: definitions.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\XpEngineController::definitions
 * @see app/Http/Controllers/XpEngineController.php:18
 * @route '/api/v1/definitions'
 */
        definitionsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: definitions.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    definitions.form = definitionsForm
/**
* @see \App\Http\Controllers\XpEngineController::levels
 * @see app/Http/Controllers/XpEngineController.php:23
 * @route '/api/v1/levels'
 */
export const levels = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: levels.url(options),
    method: 'get',
})

levels.definition = {
    methods: ["get","head"],
    url: '/api/v1/levels',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\XpEngineController::levels
 * @see app/Http/Controllers/XpEngineController.php:23
 * @route '/api/v1/levels'
 */
levels.url = (options?: RouteQueryOptions) => {
    return levels.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\XpEngineController::levels
 * @see app/Http/Controllers/XpEngineController.php:23
 * @route '/api/v1/levels'
 */
levels.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: levels.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\XpEngineController::levels
 * @see app/Http/Controllers/XpEngineController.php:23
 * @route '/api/v1/levels'
 */
levels.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: levels.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\XpEngineController::levels
 * @see app/Http/Controllers/XpEngineController.php:23
 * @route '/api/v1/levels'
 */
    const levelsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: levels.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\XpEngineController::levels
 * @see app/Http/Controllers/XpEngineController.php:23
 * @route '/api/v1/levels'
 */
        levelsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: levels.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\XpEngineController::levels
 * @see app/Http/Controllers/XpEngineController.php:23
 * @route '/api/v1/levels'
 */
        levelsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: levels.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    levels.form = levelsForm
/**
* @see \App\Http\Controllers\XpEngineController::progress
 * @see app/Http/Controllers/XpEngineController.php:28
 * @route '/api/v1/students/{externalId}/progress'
 */
export const progress = (args: { externalId: string | number } | [externalId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: progress.url(args, options),
    method: 'get',
})

progress.definition = {
    methods: ["get","head"],
    url: '/api/v1/students/{externalId}/progress',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\XpEngineController::progress
 * @see app/Http/Controllers/XpEngineController.php:28
 * @route '/api/v1/students/{externalId}/progress'
 */
progress.url = (args: { externalId: string | number } | [externalId: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { externalId: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    externalId: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        externalId: args.externalId,
                }

    return progress.definition.url
            .replace('{externalId}', parsedArgs.externalId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\XpEngineController::progress
 * @see app/Http/Controllers/XpEngineController.php:28
 * @route '/api/v1/students/{externalId}/progress'
 */
progress.get = (args: { externalId: string | number } | [externalId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: progress.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\XpEngineController::progress
 * @see app/Http/Controllers/XpEngineController.php:28
 * @route '/api/v1/students/{externalId}/progress'
 */
progress.head = (args: { externalId: string | number } | [externalId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: progress.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\XpEngineController::progress
 * @see app/Http/Controllers/XpEngineController.php:28
 * @route '/api/v1/students/{externalId}/progress'
 */
    const progressForm = (args: { externalId: string | number } | [externalId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: progress.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\XpEngineController::progress
 * @see app/Http/Controllers/XpEngineController.php:28
 * @route '/api/v1/students/{externalId}/progress'
 */
        progressForm.get = (args: { externalId: string | number } | [externalId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: progress.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\XpEngineController::progress
 * @see app/Http/Controllers/XpEngineController.php:28
 * @route '/api/v1/students/{externalId}/progress'
 */
        progressForm.head = (args: { externalId: string | number } | [externalId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: progress.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    progress.form = progressForm
/**
* @see \App\Http\Controllers\XpEngineController::award
 * @see app/Http/Controllers/XpEngineController.php:38
 * @route '/api/v1/awards'
 */
export const award = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: award.url(options),
    method: 'post',
})

award.definition = {
    methods: ["post"],
    url: '/api/v1/awards',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\XpEngineController::award
 * @see app/Http/Controllers/XpEngineController.php:38
 * @route '/api/v1/awards'
 */
award.url = (options?: RouteQueryOptions) => {
    return award.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\XpEngineController::award
 * @see app/Http/Controllers/XpEngineController.php:38
 * @route '/api/v1/awards'
 */
award.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: award.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\XpEngineController::award
 * @see app/Http/Controllers/XpEngineController.php:38
 * @route '/api/v1/awards'
 */
    const awardForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: award.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\XpEngineController::award
 * @see app/Http/Controllers/XpEngineController.php:38
 * @route '/api/v1/awards'
 */
        awardForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: award.url(options),
            method: 'post',
        })
    
    award.form = awardForm
/**
* @see \App\Http\Controllers\XpEngineController::adjust
 * @see app/Http/Controllers/XpEngineController.php:47
 * @route '/api/v1/adjustments'
 */
export const adjust = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: adjust.url(options),
    method: 'post',
})

adjust.definition = {
    methods: ["post"],
    url: '/api/v1/adjustments',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\XpEngineController::adjust
 * @see app/Http/Controllers/XpEngineController.php:47
 * @route '/api/v1/adjustments'
 */
adjust.url = (options?: RouteQueryOptions) => {
    return adjust.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\XpEngineController::adjust
 * @see app/Http/Controllers/XpEngineController.php:47
 * @route '/api/v1/adjustments'
 */
adjust.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: adjust.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\XpEngineController::adjust
 * @see app/Http/Controllers/XpEngineController.php:47
 * @route '/api/v1/adjustments'
 */
    const adjustForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: adjust.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\XpEngineController::adjust
 * @see app/Http/Controllers/XpEngineController.php:47
 * @route '/api/v1/adjustments'
 */
        adjustForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: adjust.url(options),
            method: 'post',
        })
    
    adjust.form = adjustForm
/**
* @see \App\Http\Controllers\XpEngineController::reverse
 * @see app/Http/Controllers/XpEngineController.php:55
 * @route '/api/v1/transactions/{transaction}/reversal'
 */
export const reverse = (args: { transaction: string | { id: string } } | [transaction: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reverse.url(args, options),
    method: 'post',
})

reverse.definition = {
    methods: ["post"],
    url: '/api/v1/transactions/{transaction}/reversal',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\XpEngineController::reverse
 * @see app/Http/Controllers/XpEngineController.php:55
 * @route '/api/v1/transactions/{transaction}/reversal'
 */
reverse.url = (args: { transaction: string | { id: string } } | [transaction: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { transaction: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { transaction: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    transaction: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        transaction: typeof args.transaction === 'object'
                ? args.transaction.id
                : args.transaction,
                }

    return reverse.definition.url
            .replace('{transaction}', parsedArgs.transaction.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\XpEngineController::reverse
 * @see app/Http/Controllers/XpEngineController.php:55
 * @route '/api/v1/transactions/{transaction}/reversal'
 */
reverse.post = (args: { transaction: string | { id: string } } | [transaction: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reverse.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\XpEngineController::reverse
 * @see app/Http/Controllers/XpEngineController.php:55
 * @route '/api/v1/transactions/{transaction}/reversal'
 */
    const reverseForm = (args: { transaction: string | { id: string } } | [transaction: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: reverse.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\XpEngineController::reverse
 * @see app/Http/Controllers/XpEngineController.php:55
 * @route '/api/v1/transactions/{transaction}/reversal'
 */
        reverseForm.post = (args: { transaction: string | { id: string } } | [transaction: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: reverse.url(args, options),
            method: 'post',
        })
    
    reverse.form = reverseForm
const XpEngineController = { definitions, levels, progress, award, adjust, reverse }

export default XpEngineController