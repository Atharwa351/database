import { NextRequest, NextResponse } from 'next/server';
import { Client } from '@elastic/elasticsearch';

const es = new Client({ node: 'http://localhost:9200' });
const allowedColumns = ['region', 'industry', 'job_title', 'location'];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '25');
    const filters: any = {};
    const paramsArray = Array.from(searchParams.entries());
    for (const [key, value] of paramsArray) {
      if (["page", "limit"].includes(key)) continue;
      if (allowedColumns.includes(key) && value) filters[key] = value.split(",");
    }
    const must = Object.entries(filters).map(([col, values]) => ({
      terms: { [col + '.keyword']: values as string[] }
    }));
    const query = must.length ? { bool: { must } } : { match_all: {} };
    const result = await es.search({
      index: 'master_table',
      from: (page - 1) * limit,
      size: limit,
      query
    });
    let total = 0;
    if (typeof result.hits.total === 'number') {
      total = result.hits.total;
    } else if (result.hits.total && typeof result.hits.total.value === 'number') {
      total = result.hits.total.value;
    }
    return NextResponse.json({
      data: result.hits.hits.map((hit: any) => hit._source),
      totalCount: total,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    console.error('Elasticsearch data error:', error);
    return NextResponse.json({ error: 'Failed to fetch master_table data' }, { status: 500 });
  }
}