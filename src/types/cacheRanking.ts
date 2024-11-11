import { NetworkRequest } from '../types';

export interface CacheRanking {
  rank: string;
  color: string;
  priority: number;
  matches: (request: NetworkRequest) => boolean;
}

export const cacheRankings: CacheRanking[] = [
  {
    rank: 'Optimal',
    color: '#2ecc71',
    priority: 1,
    matches: (request) => request['8.fulfilledBy'] === 'memory'
  },
  {
    rank: 'Excellent',
    color: '#27ae60',
    priority: 2,
    matches: (request) => {
      const fulfilledBy = request['8.fulfilledBy'];
      return fulfilledBy === 'service-worker' || 
             fulfilledBy === 'disk' ||
             fulfilledBy === 'push' ||
             fulfilledBy === 'prefetch' ||
             fulfilledBy === 'preloaded';
    }
  },
  {
    rank: 'Very Good',
    color: '#3498db',
    priority: 3,
    matches: (request) => request['parsed.cache-used'] === 'browser'
  },
  {
    rank: 'Good',
    color: '#f1c40f',
    priority: 4,
    matches: (request) => {
      // If fulfilled by something specific, don't count as CDN hit
      if (request['8.fulfilledBy']) {
        return false;
      }
      // Check for CloudFront cache hit
      const xCache = request['4.x-cache']?.toLowerCase() || '';
      return xCache.includes('hit from cloudfront');
    }
  },
  {
    rank: 'Uncached',
    color: '#e74c3c',
    priority: 5,
    matches: (request) => {
      // If fulfilled by something specific, don't count as uncached
      if (request['8.fulfilledBy']) {
        return false;
      }
      // Check for CloudFront cache miss
      const xCache = request['4.x-cache']?.toLowerCase() || '';
      return xCache.includes('miss from cloudfront') || !xCache;
    }
  }
];

export function getCacheRank(request: NetworkRequest): CacheRanking {
  return cacheRankings.find(rank => rank.matches(request)) || cacheRankings[cacheRankings.length - 1];
}