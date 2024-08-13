import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
dotenv.config();
import fs from 'fs';
import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";

const secret_name = "rds!db-7c06b35d-9be7-47dd-8d1c-1b8ae8be40b6";

const client = new SecretsManagerClient({
    region: "us-east-1",
    credentials: {
      accessKeyId: process.env.AWSACCESS,
      secretAccessKey: process.env.AWSSECRET,
    }
  });

let secret;

console.log(client)

const getSecret = async () => {
  let response;
  try {
    response = await client.send(
      new GetSecretValueCommand({
        SecretId: secret_name,
        VersionStage: "AWSCURRENT", // VersionStage defaults to AWSCURRENT if unspecified
      })
    );
    secret = JSON.parse(response.SecretString);
    console.log("SECRET: ", secret);
  } catch (error) {
    throw error;
  }
};

await getSecret();

const pool = new Pool({
  user: process.env.PGUSER,
  password: secret.password,
  host: process.env.PGHOST,
  port: 5432,
  database: 'postgres',
  ssl: {
    ca: fs.readFileSync(process.env.PGSSLCA).toString()
  }
});

export { pool };
