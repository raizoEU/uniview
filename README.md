# uniview

**DO NOT SUBMIT THIS README.md TO THE INTERNET / SUBMISSION. ALTER IT FIRST.**

## Resources required to deploy your own version of this app, without using my .env:

- A database (Using postgres at the moment, with a free-tier Neon db)
- An [uploadthing](https://uploadthing.com/) account

**PLEASE NOTE:** You MUST set these up if you want to deploy this application on your own.

## Configuring for local development:

1. Use provided .env file or create your own:

```
BETTER_AUTH_SECRET=asdasdasdasdasdasdasdas
BETTER_AUTH_URL=http://localhost:3000
DATABASE_URL=""
UPLOADTHING_TOKEN=''
```

2. Install dependencies:

```
npm install
```

3. Start the server:

```
npm run dev
```

4. Open the app in your browser:

```
http://localhost:3000
```

## Deploying on Netlify

1. Create a Github repository:

- Create a new repository on the Github website.
- Run `git init` in this directory.
- Run `git remote add origin https://github.com/your-username/your-repo-name.git` to add the remote repository.
- Run `git add .` to add all files to the staging area.
- Run `git commit -m "Initial commit"` to commit the changes.
- Run `git push -u origin main` to push the changes to the remote repository.

2. Make a [Netlify](https://netlify.com/) account.
3. Once on the dashboard, find the add new site button, and select import from an existing project.
4. Select Github and link your account.
5. You can now import your repository that you've created.
6. It should recognise that you are using a Next.js app. Look for a Next.js badge to verify.
7. Press on Site Configuration and select Environment Variables.
8. Click add a variable (import from .env file) and add the following:
   _You can put either your own keys or the ones provided in .env in this directory:_

```
BETTER_AUTH_SECRET=asdasdasdasdasdasdasdas
BETTER_AUTH_URL="<CHANGE THIS TO YOUR NETLIFY URL>"
DATABASE_URL=""
UPLOADTHING_TOKEN=''
```

**NOTE:** If you are trying to deploy the project with all services provided by me, you will need to change the BETTER_AUTH_URL to match your deployed Netlify url.

9. Now click on Deploys on the left side, and select Trigger Deploy > Clear cache and deploy site.
10. Track the progress below, it should eventually be tagged as "Published".
11. You can now access the url set.

## How the project works

You have these main directories:
- app/ contains the Next.js app
- lib/ contains the server-side logic
- migrations/ contains the database migrations
- scripts/ contains the scripts for seeding the database
- app/api/ contains the API routes

These are the main aspects of the code. Components are rendered in the app/ directory. There are general components defined in the `components/` directory. These are commonly used throughout the app.

Next.js uses a file-based routing system. This means that the folder structure under `app/` is used to define the routes:
- [slug] is a dynamic route parameter that represents a unique identifier for a resource.
- [...slug] is a dynamic route parameter that represents a list of unique identifiers for a resource.
- _components/ contains components that are specific to the page of section of the app.

### Scripts

If you want to seed the database with some data, you can use the following scripts:

- `npm run db:seed` to seed universities

**NOTE:** This WILL overwrite existing data defined in the `schema.ts` file.

### Database schema

The database schema is defined in the `lib/model/schema.ts` file.

#### Adding new models in the schema to support new features

- Update `schema.ts`
- Run `npm run db:push` to push the changes to the database

Caveat: If your features require new relations, you will need to either:

- Add the relation to the schema file
- Run `npm run db:push` and then `npm run db:introspect`. This will generate some files in the `migrations/` folder.
- You will then need to then move the generated file to the `lib/model` folder, and update imports where necessary.

# Dependencies (and what they do)

- **next**: Framework for building React applications with server-side rendering and static site generation.
- **react**, **react-dom**: Core React libraries for building UI components.
- **typescript**: Adds TypeScript support for static type checking.
- **drizzle-orm**, **drizzle-kit**: SQL ORM for type-safe database interactions and migrations.
- **better-auth**: Authentication library for Next.js.
- **@trpc/client**, **@trpc/server**: End-to-end type-safe API framework.
- **@tanstack/react-query**: Data fetching and caching library for React.
- **@radix-ui/react-\***: UI components for accessibility and interactivity.
- **shadcn/ui** (indirectly via Radix): Component library using Radix UI and Tailwind CSS.
- **tailwindcss**, **tailwind-merge**, **tailwindcss-animate**: Utility-first CSS framework and helpers.
- **zod**: Schema validation for form and API validation.
- **@hookform/resolvers**, **react-hook-form**: Form handling and validation.
- **date-fns**: Date manipulation utilities.
- **lucide-react**: Icon library for React.
- **recharts**: Charting library for React.
- **nuqs**: URL state management for Next.js.
- **dotenv**: Loads environment variables from `.env` files.
- **mysql2**: MySQL database driver for Node.js.
- **@faker-js/faker**: Generates fake data for testing.
- **@uploadthing/react**, **uploadthing**: File uploads for Next.js.
- **@neondatabase/serverless**: Serverless PostgreSQL driver.
- **postcss**, **autoprefixer**: CSS processing tools.
- **clsx**: Utility for conditionally joining class names.
- **cmdk**: Command menu component for React.
- **react-day-picker**: Date picker component.
- **react-resizable-panels**: Resizable panel component.
- **sonner**: Toast notifications.
- **vaul**: Bottom-sheet component for React.
- **input-otp**: OTP input component.
- **libphonenumber-js**: Phone number parsing and formatting.
