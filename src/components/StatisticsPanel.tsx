import { NetworkRequest } from '../types';
import { SimpleBarChart } from './charts/SimpleBarChart';
import { DomainCacheChart } from './charts/DomainCacheChart';
import { DomainRequestChart } from './charts/DomainRequestChart';
import { getFileType } from '../utils/fileTypes';

interface StatisticsPanelProps {
  type: 'size-by-cache' | 'requests-by-cache' | 'size-by-pop' | 'requests-by-pop' | 
        'size-by-type' | 'requests-by-type' | 'domain-cache' | 'domain-requests';
  data: NetworkRequest[];
}

export function StatisticsPanel({ type, data }: StatisticsPanelProps) {
  switch (type) {
    case 'size-by-cache':
      return (
        <SimpleBarChart
          data={data}
          title="Total Size by Cache Status (KB)"
          groupByKey="4.x-cache"
          valueType="size"
        />
      );
    case 'requests-by-cache':
      return (
        <SimpleBarChart
          data={data}
          title="Request Count by Cache Status"
          groupByKey="4.x-cache"
          valueType="count"
        />
      );
    case 'size-by-pop':
      return (
        <SimpleBarChart
          data={data}
          title="Total Size by PoP (KB)"
          groupByKey="5.x-amz-cf-pop"
          valueType="size"
        />
      );
    case 'requests-by-pop':
      return (
        <SimpleBarChart
          data={data}
          title="Request Count by PoP"
          groupByKey="5.x-amz-cf-pop"
          valueType="count"
        />
      );
    case 'size-by-type':
      return (
        <SimpleBarChart
          data={data}
          title="Total Size by File Type (KB)"
          groupByKey={(req) => getFileType(req['2.url'])}
          valueType="size"
        />
      );
    case 'requests-by-type':
      return (
        <SimpleBarChart
          data={data}
          title="Request Count by File Type"
          groupByKey={(req) => getFileType(req['2.url'])}
          valueType="count"
        />
      );
    case 'domain-cache':
      return (
        <DomainCacheChart
          data={data}
          title="Top 10 Domains Cache Performance (KB)"
        />
      );
    case 'domain-requests':
      return (
        <DomainRequestChart
          data={data}
          title="Top 10 Domains Cache Performance (Requests)"
        />
      );
  }
}