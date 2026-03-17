import { useContext, useMemo, useCallback } from 'react';

/**
 * Context Optimization Hook
 * Prevents unnecessary re-renders when using context
 *
 * Features:
 * - Memoizes selected context values
 * - Only triggers re-render on relevant changes
 * - Reduces component re-renders
 */

/**
 * Optimized context hook with selector pattern
 * Usage:
 *
 * const userName = useContextSelector(UserContext, state => state.user.name);
 *
 * Component only re-renders when the selected value changes
 */
export function useContextSelector<T, S>(
    Context: React.Context<T>,
    selector: (state: T) => S,
    equalsFn?: (prev: S, next: S) => boolean
): S {
    const context = useContext(Context);

    if (!context) {
        throw new Error('Context not found. Make sure the component is wrapped with the provider.');
    }

    // Use custom equality function or default shallow comparison
    const defaultEquals = (prev: S, next: S) => prev === next;
    const isEqual = equalsFn || defaultEquals;

    return useMemo(() => {
        return selector(context);
    }, [context, selector, isEqual]);
}

/**
 * Hook for memoized context actions
 * Prevents action function recreation
 *
 * Usage:
 * const { setUser, logout } = useContextActions(UserContext, state => state);
 */
export function useContextActions<T, A extends Record<string, (...args: any[]) => any>>(
    Context: React.Context<T>,
    actionSelector: (state: T) => A
): A {
    const context = useContext(Context);

    if (!context) {
        throw new Error('Context not found. Make sure the component is wrapped with the provider.');
    }

    return useCallback(() => {
        return actionSelector(context);
    }, [context, actionSelector])();
}

/**
 * Combine multiple context selectors
 * Usage:
 *
 * const { name, email } = useMultipleContextSelectors(
 *   UserContext,
 *   {
 *     name: state => state.user.name,
 *     email: state => state.user.email,
 *   }
 * );
 */
export function useMultipleContextSelectors<T, S extends Record<string, any>>(
    Context: React.Context<T>,
    selectors: Record<keyof S, (state: T) => S[keyof S]>
): S {
    const context = useContext(Context);

    if (!context) {
        throw new Error('Context not found. Make sure the component is wrapped with the provider.');
    }

    return useMemo(() => {
        const result: any = {};
        for (const key in selectors) {
            result[key] = selectors[key](context);
        }
        return result;
    }, [context, selectors]);
}

/**
 * Example: Using context optimization
 *
 * // Create context
 * const UserContext = React.createContext<{
 *   user: { name: string; email: string };
 *   setUser: (user: any) => void;
 * } | null>(null);
 *
 * // In a component - this will ONLY re-render when user.name changes
 * function UserNameComponent() {
 *   const name = useContextSelector(UserContext, state => state.user.name);
 *   return <div>{name}</div>;
 * }
 *
 * // Without optimization - this would re-render whenever ANY context value changes
 * function UserNameComponentBad() {
 *   const { user } = useContext(UserContext)!;
 *   return <div>{user.name}</div>;
 * }
 */
