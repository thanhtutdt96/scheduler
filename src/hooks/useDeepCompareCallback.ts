import React, { useCallback } from 'react';
import { useDeepCompareMemoize } from './useDeepCompareMemoize';

/**
 * `useDeepCompareCallback` will return a memoized version of the callback that
 * only changes if one of the `deps` has changed.
 *
 * @param callback A function that will be memoized by the hook
 * @param dependencies If present, the callback will only recomputed when some
 * value inside this array has changed
 *
 * Usage note: only use this if `deps` are objects or arrays that contain
 * objects. Otherwise you should just use React.useEffect.
 *
 */
function useDeepCompareCallback<T extends (...args: any[]) => any>(
  callback: T,
  dependencies: React.DependencyList,
) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback(callback, useDeepCompareMemoize(dependencies));
}

export default useDeepCompareCallback;
