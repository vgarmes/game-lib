## GameLib

Game Library app to keep track of my videogame collection.

This is a port to React/Nextjs of the [original project](https://github.com/vgarmes/my-game-library) which was developed in Ruby on Rails.

## Tech stack

- Typescript + React
- NextJS: React framework
- Prisma: Database ORM
- PostgreSQL: Database
- NextAuth.js: Authentication
- tRPC: End-to-end typesafe API

## Prerequisites

- Node.js and yarn installed
- A PostgreSQL database: In my case I use Postgres locally for the development database and [ElephantSQL](https://www.elephantsql.com/) for the production database.

## Development environment

Run `yarn` to install dependencies.

Fill required environment variables (see `./env-schema.js`)

Run `yarn dev` to start development server.

## Deployment to production

Use the following build command when deploying to production:

`prisma generate && prisma migrate deploy && next build`

This will generate the Prisma Client, apply migrations and build the Next.js project.

## Considerations on tRPC and Server Side Rendering

When enabling SSR, tRPC will use `getInitialProps` to prefetch all queries on the server ([see docs](https://trpc.io/docs/v9/ssr#q-can-i-use-getserversideprops-andor-getstaticprops-while-using-ssr)).

For the initial page load, `getInitialProps` will run on the server only, similarly to `getServerSideProps`. However, `getInitialProps` will then run on the client when navigating to a different route via the `next/link` component or by using `next/router`, unlike `getServerSideProps` that will make additional calls to the lambda.

However, if `getInitialProps` is used in a custom `_app.js` (this is the case of tRPC), and the page being navigated to implements `getServerSideProps`, then `getInitialProps` will run on the server. `getServerSideProps` will run but its props won't be passed to the page, so it can only be used for things like redirecting.
