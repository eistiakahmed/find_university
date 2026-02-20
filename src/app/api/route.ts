import { NextResponse } from 'next/server';
import { connect } from '../lib/dbConnect';

interface University {
  _id: string;
  universityName: string;
  country: string;
  location: string;
  tuitionFee: number;
  ranking: number;
  establishedYear: number;
}

const universityCollection = connect<University>('universityCollection');

export async function GET(request: Request) {
  const result = await universityCollection.find({}).toArray();

  return NextResponse.json(result);
}
