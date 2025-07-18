import { NextRequest, NextResponse } from 'next/server';
import { Client } from '@elastic/elasticsearch';

const es = new Client({ node: 'http://localhost:9200' });

const allowedColumns = ['region', 'industry', 'job_title', 'location'];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const column = searchParams.get('column');
    const search = searchParams.get('search') || '';

    if (!column || !allowedColumns.includes(column)) {
      return NextResponse.json({ error: 'Invalid or missing column' }, { status: 400 });
    }

    const aggs = {
      unique_values: {
        terms: {
          field: column + '.keyword',
          size: 100,
          order: { _count: 'desc' }
        }
      }
    };

    const query = search
      ? { wildcard: { [column]: `*${search}*` } }
      : { match_all: {} };

    const result = await es.search({
      index: 'master_table',
      size: 0,
      aggs,
      query
    });

    const values = result.aggregations.unique_values.buckets.map((b: any) => b.key);
    return NextResponse.json({ values });
  } catch (error) {
    console.error('Elasticsearch filter error:', error);
    return NextResponse.json({ error: 'Failed to fetch filter values' }, { status: 500 });
  }
}