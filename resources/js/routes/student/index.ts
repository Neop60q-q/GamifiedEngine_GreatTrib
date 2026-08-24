import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
 * @see routes/web.php:14
 * @route '/student'
 */
export const portal = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: portal.url(options),
    method: 'get',
})

portal.definition = {
    methods: ["get","head"],
    url: '/student',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:14
 * @route '/student'
 */
portal.url = (options?: RouteQueryOptions) => {
    return portal.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:14
 * @route '/student'
 */
portal.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: portal.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:14
 * @route '/student'
 */
portal.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: portal.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:14
 * @route '/student'
 */
    const portalForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: portal.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:14
 * @route '/student'
 */
        portalForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: portal.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:14
 * @route '/student'
 */
        portalForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: portal.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    portal.form = portalForm
const student = {
    portal: Object.assign(portal, portal),
}

export default student