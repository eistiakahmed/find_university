import { Collection, Document, MongoClient, ServerApiVersion } from 'mongodb';
// import * as dns from 'dns';
import * as dns from 'dns'

dns.setServers(['8.8.8.8', '8.8.4.4']);

const uri = process.env.MongoDB_URI as string;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

export const connect = <T extends Document = Document>(
  collection: string
): Collection<T> => {
  const database = process.env.DB_NAME as string;
  return client.db(database).collection<T>(collection);
};
