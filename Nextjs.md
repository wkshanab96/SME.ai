TITLE: Linking to Dynamic Segments (App Router)
DESCRIPTION: This snippet demonstrates how to create links to dynamic routes, such as individual blog posts, in the App Router. It shows mapping over an array of post data and using template literals to construct the `href` for each Next.js Link component based on a dynamic segment like the post slug.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/02-components/link.mdx#_snippet_9

LANGUAGE: TypeScript
CODE:
```
import Link from 'next/link'

interface Post {
  id: number
  title: string
  slug: string
}

export default function PostList({ posts }: { posts: Post[] }) {
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </li>
      ))}
    </ul>
  )
}
```

LANGUAGE: JavaScript
CODE:
```
import Link from 'next/link'

export default function PostList({ posts }) {
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </li>
      ))}
    </ul>
  )
}
```

----------------------------------------

TITLE: Server-Side Form Validation with Zod (TypeScript)
DESCRIPTION: Shows a Next.js Server Action (`'use server'`) that performs server-side validation of form data using the Zod library. It defines a Zod schema, parses the incoming `FormData`, and returns validation errors if the data is invalid. Requires the Zod library to be installed.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-building-your-application/02-data-fetching/03-server-actions-and-mutations.mdx#_snippet_9

LANGUAGE: TypeScript
CODE:
```
'use server'

import { z } from 'zod'

const schema = z.object({
  email: z.string({
    invalid_type_error: 'Invalid Email',
  }),
})

export default async function createUser(formData: FormData) {
  const validatedFields = schema.safeParse({
    email: formData.get('email'),
  })

  // Return early if the form data is invalid
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  // Mutate data
}
```

----------------------------------------

TITLE: Submitting Form Data to API Route - JavaScript
DESCRIPTION: This code snippet demonstrates how to submit form data to an API route in Next.js using JavaScript. It prevents the default form submission, creates a FormData object from the form, sends a POST request to the API route, and handles the response.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/02-pages/03-building-your-application/03-data-fetching/03-forms-and-mutations.mdx#_snippet_3

LANGUAGE: javascript
CODE:
```
export default function Page() {
  async function onSubmit(event) {
    event.preventDefault()

    const formData = new FormData(event.target)
    const response = await fetch('/api/submit', {
      method: 'POST',
      body: formData,
    })

    // Handle response if necessary
    const data = await response.json()
    // ...
  }

  return (
    <form onSubmit={onSubmit}>
      <input type="text" name="name" />
      <button type="submit">Submit</button>
    </form>
  )
}
```

----------------------------------------

TITLE: Updating Next.js, React, and React DOM
DESCRIPTION: This command updates Next.js, React, and React DOM to the latest versions using npm. It's a prerequisite for migrating to the App Router.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/migrating/app-router-migration.mdx#_snippet_0

LANGUAGE: bash
CODE:
```
npm install next@latest react@latest react-dom@latest
```

----------------------------------------

TITLE: Creating Database Session in Next.js App Router
DESCRIPTION: This asynchronous function creates a new database session for a given user ID in a Next.js App Router context. It calculates the session's expiration date, inserts a new record into a 'sessions' database table, retrieves the generated session ID, encrypts it, and stores the encrypted session data as a cookie in the user's browser for future optimistic authentication checks.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/authentication.mdx#_snippet_19

LANGUAGE: ts
CODE:
```
import cookies from 'next/headers'
import { db } from '@/app/lib/db'
import { encrypt } from '@/app/lib/session'

export async function createSession(id: number) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

  // 1. Create a session in the database
  const data = await db
    .insert(sessions)
    .values({
      userId: id,
      expiresAt,
    })
    // Return the session ID
    .returning({ id: sessions.id })

  const sessionId = data[0].id

  // 2. Encrypt the session ID
  const session = await encrypt({ sessionId, expiresAt })

  // 3. Store the session in cookies for optimistic auth checks
  const cookieStore = await cookies()
  cookieStore.set('session', session, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  })
}
```

LANGUAGE: js
CODE:
```
import cookies from 'next/headers'
import { db } from '@/app/lib/db'
import { encrypt } from '@/app/lib/session'

export async function createSession(id) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

  // 1. Create a session in the database
  const data = await db
    .insert(sessions)
    .values({
      userId: id,
      expiresAt,
    })
    // Return the session ID
    .returning({ id: sessions.id })

  const sessionId = data[0].id

  // 2. Encrypt the session ID
  const session = await encrypt({ sessionId, expiresAt })

  // 3. Store the session in cookies for optimistic auth checks
  const cookieStore = await cookies()
  cookieStore.set('session', session, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  })
}
```

----------------------------------------

TITLE: Installing Next.js 15 Using Codemod
DESCRIPTION: Command to automatically upgrade to the latest Next.js version using the upgrade codemod.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/upgrading/version-15.mdx#2025-04-21_snippet_0

LANGUAGE: bash
CODE:
```
npx @next/codemod@canary upgrade latest
```

----------------------------------------

TITLE: Handling Cookies in Next.js Route Handlers
DESCRIPTION: Example of reading and setting cookies in a Route Handler using the 'cookies' function from next/headers. This demonstrates how to access and manipulate cookies in both TypeScript and JavaScript.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-building-your-application/01-routing/13-route-handlers.mdx#2025-04-21_snippet_2

LANGUAGE: typescript
CODE:
```
import { cookies } from 'next/headers'

export async function GET(request: Request) {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')

  return new Response('Hello, Next.js!', {
    status: 200,
    headers: { 'Set-Cookie': `token=${token.value}` },
  })
}
```

LANGUAGE: javascript
CODE:
```
import { cookies } from 'next/headers'

export async function GET(request) {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')

  return new Response('Hello, Next.js!', {
    status: 200,
    headers: { 'Set-Cookie': `token=${token}` },
  })
}
```

----------------------------------------

TITLE: Creating Route Segment Loading UI (TSX/JSX)
DESCRIPTION: Define an instant loading state for a route segment by creating a `loading.js` or `loading.tsx` file. The component exported here provides fallback UI that is automatically wrapped in a Suspense boundary by Next.js and displayed while the actual page or layout content loads.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-building-your-application/01-routing/06-loading-ui-and-streaming.mdx#_snippet_0

LANGUAGE: tsx
CODE:
```
export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return <LoadingSkeleton />
}
```

LANGUAGE: jsx
CODE:
```
export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return <LoadingSkeleton />
}
```

----------------------------------------

TITLE: Checking Active Link Using usePathname (App Router)
DESCRIPTION: This snippet shows how to identify the active link in a navigation menu within the App Router. It uses the `usePathname` hook to get the current path and compares it to the `href` of each Next.js Link component, conditionally applying a CSS class like 'active' to highlight the current page.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/02-components/link.mdx#_snippet_10

LANGUAGE: TypeScript
CODE:
```
'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'

export function Links() {
  const pathname = usePathname()

  return (
    <nav>
      <Link className={`link ${pathname === '/' ? 'active' : ''}`} href="/">
        Home
      </Link>

      <Link
        className={`link ${pathname === '/about' ? 'active' : ''}`}
        href="/about"
      >
        About
      </Link>
    </nav>
  )
}
```

LANGUAGE: JavaScript
CODE:
```
'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'

export function Links() {
  const pathname = usePathname()

  return (
    <nav>
      <Link className={`link ${pathname === '/' ? 'active' : ''}`} href="/">
        Home
      </Link>

      <Link
        className={`link ${pathname === '/about' ? 'active' : ''}`}
        href="/about"
      >
        About
      </Link>
    </nav>
  )
}
```

----------------------------------------

TITLE: Creating Secure Session Cookie in Next.js App Router (JavaScript)
DESCRIPTION: This asynchronous function `createSession` encrypts a user ID and expiration time (7 days) using a separate `encrypt` function, then sets the resulting session string as an HTTP-only, secure cookie named 'session' using Next.js `cookies()` API. Recommended cookie options like `sameSite` and `path` are included.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/authentication.mdx#_snippet_8

LANGUAGE: js
CODE:
```
import 'server-only';
import { cookies } from 'next/headers';

export async function createSession(userId) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const session = await encrypt({ userId, expiresAt });
  const cookieStore = await cookies();

  cookieStore.set('session', session, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  });
}
```

----------------------------------------

TITLE: Using Server Action Passed as Prop in Client Component (TSX/JSX)
DESCRIPTION: Demonstrates how a Server Action defined elsewhere can be passed as a prop to a Client Component and then used as the value for a `<form>` element's `action` attribute. This allows logic defined on the server to handle form submissions from the client.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-building-your-application/02-data-fetching/03-server-actions-and-mutations.mdx#_snippet_3

LANGUAGE: tsx
CODE:
```
'use client'

export default function ClientComponent({
  updateItemAction,
}: {
  updateItemAction: (formData: FormData) => void
}) {
  return <form action={updateItemAction}>{/* ... */}</form>
}
```

LANGUAGE: jsx
CODE:
```
'use client'

export default function ClientComponent({ updateItemAction }) {
  return <form action={updateItemAction}>{/* ... */}</form>
}
```

----------------------------------------

TITLE: Wildcard Path Matching in Next.js Redirects
DESCRIPTION: This example illustrates how to match wildcard paths using the `*` character in the `source` route. The snippet captures any nested paths and redirects them to a specified `destination`, retaining the matched segments.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/05-config/01-next-config-js/redirects.mdx#2025-04-21_snippet_2

LANGUAGE: JavaScript
CODE:
```
module.exports = {
  async redirects() {
    return [
      {
        source: '/blog/:slug*',
        destination: '/news/:slug*',
        permanent: true,
      },
    ]
  },
}
```

----------------------------------------

TITLE: Remove <a> Tags From Link Components
DESCRIPTION: Remove `<a>` tags inside Link Components, or add a `legacyBehavior` prop to Links that cannot be auto-fixed.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/upgrading/codemods.mdx#_snippet_25

LANGUAGE: Terminal
CODE:
```
npx @next/codemod@latest new-link .
```

----------------------------------------

TITLE: Fetch User in Layout (Next.js) - TSX
DESCRIPTION: This Next.js Layout component demonstrates calling `getUser()` from the DAL to fetch user data. Since `getUser` internally includes the session verification, this pattern ensures the authentication check is performed when the layout fetches data, rather than performing the auth check directly in the layout.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/authentication.mdx#_snippet_30

LANGUAGE: TSX
CODE:
```
import { getUser } from "@/app/lib/dal";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  return (
    // ...
    <main>{children}</main>
    // ...
  );
}
```

----------------------------------------

TITLE: Redirecting Request with Next.js Middleware JavaScript
DESCRIPTION: This snippet demonstrates a basic Next.js Middleware function written in JavaScript that redirects any incoming request matching the configured `matcher` path to the `/home` URL using `NextResponse.redirect`. It requires importing `NextResponse` from `next/server`.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-building-your-application/01-routing/14-middleware.mdx#_snippet_1

LANGUAGE: javascript
CODE:
```
import { NextResponse } from 'next/server'

// This function can be marked `async` if using `await` inside
export function middleware(request) {
  return NextResponse.redirect(new URL('/home', request.url))
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: '/about/:path*',
}
```

----------------------------------------

TITLE: Importing Global Styles in app/layout.js
DESCRIPTION: This code snippet demonstrates how to import global styles in the `app/layout.js` file. This allows you to apply global styles to your entire application.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/migrating/app-router-migration.mdx#_snippet_43

LANGUAGE: jsx
CODE:
```
import '../styles/globals.css'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

----------------------------------------

TITLE: Passing Additional Arguments to Server Action via Bind (TSX/JSX)
DESCRIPTION: Shows how to use JavaScript's `bind()` method to pass additional, fixed arguments to a Server Action function before binding it to a form's `action` prop. This allows passing contextual data, like an item ID, alongside the form data during submission.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-building-your-application/02-data-fetching/03-server-actions-and-mutations.mdx#_snippet_5

LANGUAGE: tsx
CODE:
```
'use client'

import { updateUser } from './actions'

export function UserProfile({ userId }: { userId: string }) {
  const updateUserWithId = updateUser.bind(null, userId)

  return (
    <form action={updateUserWithId}>
      <input type="text" name="name" />
      <button type="submit">Update User Name</button>
    </form>
  )
}
```

LANGUAGE: jsx
CODE:
```
'use client'

import { updateUser } from './actions'

export function UserProfile({ userId }) {
  const updateUserWithId = updateUser.bind(null, userId)

  return (
    <form action={updateUserWithId}>
      <input type="text" name="name" />
      <button type="submit">Update User Name</button>
    </form>
  )
}
```

----------------------------------------

TITLE: Updating Internal Navigation to Use Next.js Link Component - JavaScript
DESCRIPTION: This snippet demonstrates how to replace an `<a>` element with the `Link` component from Next.js to enable client-side navigation within a Next.js application, thereby preventing full-page refreshes. The updated component ensures seamless transitions between pages.
SOURCE: https://github.com/vercel/next.js/blob/canary/errors/no-html-link-for-pages.mdx#2025-04-21_snippet_0

LANGUAGE: javascript
CODE:
```
function Home() {
  return (
    <div>
      <Link href="/about">About Us</Link>
    </div>
  )
}

export default Home
```

----------------------------------------

TITLE: Creating API Route for Form Submission - TypeScript
DESCRIPTION: This code snippet demonstrates creating an API route in Next.js using TypeScript to handle form submissions. It retrieves data from the request body, calls a function (createItem) to process the data, and sends a response with the created item's ID.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/02-pages/03-building-your-application/03-data-fetching/03-forms-and-mutations.mdx#_snippet_0

LANGUAGE: typescript
CODE:
```
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const data = req.body
  const id = await createItem(data)
  res.status(200).json({ id })
}
```

----------------------------------------

TITLE: Revalidating A Specific URL
DESCRIPTION: Demonstrates how to use `revalidatePath` to invalidate the cache for a single, specific URL path. This ensures that the next visit to '/blog/post-1' will fetch fresh data instead of using the cache.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/04-functions/revalidatePath.mdx#_snippet_1

LANGUAGE: typescript
CODE:
```
import { revalidatePath } from 'next/cache'
revalidatePath('/blog/post-1')
```

----------------------------------------

TITLE: Implementing Redirects in Next.js Route Handlers
DESCRIPTION: Example of implementing redirects in a Route Handler using the 'redirect' function from next/navigation. This demonstrates how to perform redirects in both TypeScript and JavaScript.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-building-your-application/01-routing/13-route-handlers.mdx#2025-04-21_snippet_4

LANGUAGE: typescript
CODE:
```
import { redirect } from 'next/navigation'

export async function GET(request: Request) {
  redirect('https://nextjs.org/')
}
```

LANGUAGE: javascript
CODE:
```
import { redirect } from 'next/navigation'

export async function GET(request) {
  redirect('https://nextjs.org/')
}
```

----------------------------------------

TITLE: Implementing Global Error Handling in Next.js with TypeScript
DESCRIPTION: TypeScript implementation of a global error boundary component for handling application-wide errors in Next.js. Must include html and body tags as it replaces the root layout when active.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/03-file-conventions/error.mdx#2025-04-21_snippet_2

LANGUAGE: typescript
CODE:
```
'use client' // Error boundaries must be Client Components

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    // global-error must include html and body tags
    <html>
      <body>
        <h2>Something went wrong!</h2>
        <button onClick={() => reset()}>Try again</button>
      </body>
    </html>
  )
}
```

----------------------------------------

TITLE: Handling Form Data with Server Action (TSX/JSX)
DESCRIPTION: Explains that Server Actions invoked via a `<form>`'s `action` attribute automatically receive the `FormData` object as their first argument. The example shows how to extract values for individual form fields from this object using `formData.get()`.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-building-your-application/02-data-fetching/03-server-actions-and-mutations.mdx#_snippet_4

LANGUAGE: tsx
CODE:
```
export default function Page() {
  async function createInvoice(formData: FormData) {
    'use server'

    const rawFormData = {
      customerId: formData.get('customerId'),
      amount: formData.get('amount'),
      status: formData.get('status'),
    }

    // mutate data
    // revalidate cache
  }

  return <form action={createInvoice}>...</form>
}
```

LANGUAGE: jsx
CODE:
```
export default function Page() {
  async function createInvoice(formData) {
    'use server'

    const rawFormData = {
      customerId: formData.get('customerId'),
      amount: formData.get('amount'),
      status: formData.get('status'),
    }

    // mutate data
    // revalidate cache
  }

  return <form action={createInvoice}>...</form>
}
```

----------------------------------------

TITLE: Revalidating Cache by Path in Server Action
DESCRIPTION: Demonstrates using the `revalidatePath` function within a Server Action (`createPost`) to clear the Next.js Data Cache for a specific path (`/posts`) after an operation (e.g., creating a post). This ensures that subsequent requests to that path fetch fresh data.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-building-your-application/02-data-fetching/03-server-actions-and-mutations.mdx#_snippet_24

LANGUAGE: ts
CODE:
```
'use server'

import { revalidatePath } from 'next/cache'

export async function createPost() {
  try {
    // ...
  } catch (error) {
    // ...
  }

  revalidatePath('/posts')
}
```

LANGUAGE: js
CODE:
```
'use server'

import { revalidatePath } from 'next/cache'

export async function createPost() {
  try {
    // ...
  } catch (error) {
    // ...
  }

  revalidatePath('/posts')
}
```

----------------------------------------

TITLE: Implementing Parallel Data Fetching with Promise.all in Next.js
DESCRIPTION: Demonstrates the parallel data fetching pattern where multiple independent data requests are initiated concurrently within the same route segment or component. By calling the async fetching functions (`getArtist`, `getAlbums`) and then awaiting their promises together using `Promise.all`, both requests run in parallel, potentially reducing the overall data loading time compared to sequential fetching. The component awaits the resolution of all promises before rendering.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-building-your-application/02-data-fetching/01-fetching.mdx#_snippet_8

LANGUAGE: typescript
CODE:
```
import Albums from './albums';

async function getArtist(username: string) {
  const res = await fetch(`https://api.example.com/artist/${username}`);
  return res.json();
}

async function getAlbums(username: string) {
  const res = await fetch(`https://api.example.com/artist/${username}/albums`);
  return res.json();
}

export default async function Page({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const artistData = getArtist(username);
  const albumsData = getAlbums(username);

  // Initiate both requests in parallel
  const [artist, albums] = await Promise.all([artistData, albumsData]);

  return (
    <>
      <h1>{artist.name}</h1>
      <Albums list={albums} />
    </>
  );
}
```

LANGUAGE: javascript
CODE:
```
import Albums from './albums';

async function getArtist(username) {
  const res = await fetch(`https://api.example.com/artist/${username}`);
  return res.json();
}

async function getAlbums(username) {
  const res = await fetch(`https://api.example.com/artist/${username}/albums`);
  return res.json();
}

export default async function Page({ params }) {
  const { username } = await params;
  const artistData = getArtist(username);
  const albumsData = getAlbums(username);

  // Initiate both requests in parallel
  const [artist, albums] = await Promise.all([artistData, albumsData]);

  return (
    <>
      <h1>{artist.name}</h1>
      <Albums list={albums} />
    </>
  );
}
```

----------------------------------------

TITLE: Checking if a Cookie Exists - JS
DESCRIPTION: This snippet illustrates how to use the `has` method to verify the existence of a specific cookie in a Next.js page component. It retrieves the cookie store asynchronously for this check.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/04-functions/cookies.mdx#2025-04-21_snippet_7

LANGUAGE: js
CODE:
```
import { cookies } from 'next/headers'

export default async function Page() {
  const cookieStore = await cookies()
  const hasCookie = cookieStore.has('theme')
  return '...'
}
```

----------------------------------------

TITLE: Implementing Authorization Check in App Router GET Handler (JS)
DESCRIPTION: Shows how to secure an App Router `GET` Route Handler in JavaScript. The code performs a two-step security check: first verifying user authentication via a session, and then checking for the 'admin' role to ensure proper authorization, returning appropriate HTTP status codes (401/403) for restricted access.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/authentication.mdx#_snippet_37

LANGUAGE: js
CODE:
```
import { verifySession } from '@/app/lib/dal'\n\nexport async function GET() {\n  // User authentication and role verification\n  const session = await verifySession()\n\n  // Check if the user is authenticated\n  if (!session) {\n    // User is not authenticated\n    return new Response(null, { status: 401 })\n  }\n\n  // Check if the user has the 'admin' role\n  if (session.user.role !== 'admin') {\n    // User is authenticated but does not have the right permissions\n    return new Response(null, { status: 403 })\n  }\n\n  // Continue for authorized users\n}
```

----------------------------------------

TITLE: Receiving Bound Arguments in Server Action (TS/JS)
DESCRIPTION: Demonstrates the function signature for a Server Action that receives additional arguments passed via `bind()`. The bound arguments (`userId` in this example) are received first, followed by the `FormData` object that is automatically provided when the action is invoked by a form.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-building-your-application/02-data-fetching/03-server-actions-and-mutations.mdx#_snippet_6

LANGUAGE: ts
CODE:
```
'use server'

export async function updateUser(userId: string, formData: FormData) {}
```

LANGUAGE: js
CODE:
```
'use server'

export async function updateUser(userId, formData) {}
```

----------------------------------------

TITLE: Using revalidatePath in a Server Action
DESCRIPTION: Demonstrates how to call `revalidatePath` within a Next.js Server Action. After performing a data submission (simulated by `submitForm()`), `revalidatePath('/')` is called to invalidate the cache for the root path, ensuring the UI reflects the changes on subsequent visits.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/04-functions/revalidatePath.mdx#_snippet_5

LANGUAGE: typescript
CODE:
```
'use server'

import { revalidatePath } from 'next/cache'

export default async function submit() {
  await submitForm()
  revalidatePath('/')
}
```

----------------------------------------

TITLE: Authenticated Data Fetching with Route Handlers (TypeScript)
DESCRIPTION: This TypeScript snippet governs data fetching capabilities through route handlers while verifying access authentication. If a session is invalid, the unauthorized function is invoked and a 401 page is rendered, safeguarding endpoint access.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/04-functions/unauthorized.mdx#2025-04-21_snippet_8

LANGUAGE: TypeScript
CODE:
```
import { NextRequest, NextResponse } from 'next/server'
import { verifySession } from '@/app/lib/dal'
import { unauthorized } from 'next/navigation'

export async function GET(req: NextRequest): Promise<NextResponse> {
  // Verify the user's session
  const session = await verifySession()

  // If no session exists, return a 401 and render unauthorized.tsx
  if (!session) {
    unauthorized()
  }

  // Fetch data
  // ...
}
```

----------------------------------------

TITLE: Set Priority with Local Import (App Router JSX)
DESCRIPTION: Demonstrates setting the `priority` prop for a local image imported directly into an App Router page. Marking the image with `priority` helps Next.js optimize preloading for improved LCP performance.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-building-your-application/06-optimizing/01-images.mdx#_snippet_7

LANGUAGE: jsx
CODE:
```
import Image from 'next/image'
import profilePic from '../public/me.png'

export default function Page() {
  return <Image src={profilePic} alt="Picture of the author" priority />
}
```

----------------------------------------

TITLE: Implementing Responsive Image using next/image (JSX)
DESCRIPTION: This snippet demonstrates using the `next/image` component to create a responsive image. It imports a local image, automatically setting dimensions, and applies `sizes="100vw"` along with inline styles (`width: '100%', height: 'auto'`) to ensure the image scales correctly with the viewport width.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-building-your-application/06-optimizing/01-images.mdx#_snippet_8

LANGUAGE: JSX
CODE:
```
import Image from 'next/image'
import mountains from '../public/mountains.jpg'

export default function Responsive() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <Image
        alt="Mountains"
        // Importing an image will
        // automatically set the width and height
        src={mountains}
        sizes="100vw"
        // Make the image display full width
        style={{
          width: '100%',
          height: 'auto',
        }}
      />
    </div>
  )
}
```

----------------------------------------

TITLE: Nesting Submit Button Using useFormStatus (JavaScript)
DESCRIPTION: Demonstrates how to integrate a `SubmitButton` component (which uses `useFormStatus` internally) within a form element that uses a Server Action. By nesting the button, it automatically gains access to the form's submission status to manage its disabled state.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-building-your-application/02-data-fetching/03-server-actions-and-mutations.mdx#_snippet_18

LANGUAGE: JavaScript
CODE:
```
import { SubmitButton } from './button'
import { createUser } from '@/app/actions'

export function Signup() {
  return (
    <form action={createUser}>
      {/* Other form elements */}
      <SubmitButton />
    </form>
  )
}
```

----------------------------------------

TITLE: Defining Font Variable in Next.js (TSX)
DESCRIPTION: This code snippet shows how to define a font variable using Next.js's font optimization features. It imports the Inter font from 'next/font/google' and initializes it with a CSS variable name. This allows the font to be referenced in CSS files.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/02-components/font.mdx#_snippet_46

LANGUAGE: TypeScript
CODE:
```
import { Inter } from 'next/font/google'
import styles from '../styles/component.module.css'

const inter = Inter({
  variable: '--font-inter',
})
```

----------------------------------------

TITLE: Fetching Data in Server Component with fetch API (Next.js)
DESCRIPTION: This snippet demonstrates how to fetch data in a Next.js Server Component using the fetch API. It retrieves blog posts from an API and renders them as a list.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/01-getting-started/06-fetching-data.mdx#2025-04-21_snippet_0

LANGUAGE: tsx
CODE:
```
export default async function Page() {
  const data = await fetch('https://api.vercel.app/blog')
  const posts = await data.json()
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}
```

LANGUAGE: jsx
CODE:
```
export default async function Page() {
  const data = await fetch('https://api.vercel.app/blog')
  const posts = await data.json()
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}
```

----------------------------------------

TITLE: Implementing Optimistic UI Updates with useOptimistic (TSX)
DESCRIPTION: Illustrates using the `useOptimistic` hook to provide instant UI feedback before a Server Action completes. It creates an optimistic state that immediately reflects the user's intended action, while the background action performs the actual data mutation. The UI renders the optimistic state until the action finishes.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-building-your-application/02-data-fetching/03-server-actions-and-mutations.mdx#_snippet_19

LANGUAGE: TSX
CODE:
```
'use client'

import { useOptimistic } from 'react'
import { send } from './actions'

type Message = {
  message: string
}

export function Thread({ messages }: { messages: Message[] }) {
  const [optimisticMessages, addOptimisticMessage] = useOptimistic<
    Message[],
    string
  >(messages, (state, newMessage) => [...state, { message: newMessage }])

  const formAction = async (formData: FormData) => {
    const message = formData.get('message') as string
    addOptimisticMessage(message)
    await send(message)
  }

  return (
    <div>
      {optimisticMessages.map((m, i) => (
        <div key={i}>{m.message}</div>
      ))}
      <form action={formAction}>
        <input type="text" name="message" />
        <button type="submit">Send</button>
      </form>
    </div>
  )
}
```

----------------------------------------

TITLE: Example Usage of unstable_cache in Next.js JSX Page Component
DESCRIPTION: This snippet provides a full example of using unstable_cache within a Next.js JSX App Router page component. It defines a cached function that returns user data, using the userId from the page parameters as part of the cache key, and includes options for tags and revalidation.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/04-functions/unstable_cache.mdx#_snippet_3

LANGUAGE: jsx
CODE:
```
import { unstable_cache } from 'next/cache';

export default async function Page({ params } }) {
  const { userId } = await params
  const getCachedUser = unstable_cache(
    async () => {
      return { id: userId };
    },
    [userId], // add the user ID to the cache key
    {
      tags: ["users"],
      revalidate: 60,
    }
  );

  //...
}
```

----------------------------------------

TITLE: Implementing Server-side Rendering with getServerSideProps in Next.js
DESCRIPTION: This code demonstrates how to implement Server-side Rendering in Next.js by using the getServerSideProps function. The function fetches data from an external API on every request and passes it to the Page component as props. This approach is useful for pages that need frequently updated data.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/02-pages/03-building-your-application/02-rendering/01-server-side-rendering.mdx#2025-04-21_snippet_0

LANGUAGE: jsx
CODE:
```
export default function Page({ data }) {
  // Render data...
}

// This gets called on every request
export async function getServerSideProps() {
  // Fetch data from external API
  const res = await fetch(`https://.../data`)
  const data = await res.json()

  // Pass data to the page via props
  return { props: { data } }
}
```

----------------------------------------

TITLE: Generating Dynamic OG Image with ImageResponse in TSX
DESCRIPTION: This code snippet demonstrates how to generate a dynamic Open Graph image using the ImageResponse constructor in a Next.js application. It fetches data for a blog post based on the slug parameter and renders the post title within a styled div. The ImageResponse constructor takes JSX and converts it into a PNG image.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/01-getting-started/10-metadata-and-og-images.mdx#_snippet_9

LANGUAGE: tsx
CODE:
```
import { ImageResponse } from 'next/og'
import { getPost } from '@/app/lib/data'

// Image metadata
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

// Image generation
export default async function Image({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug)

  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        style={{
          fontSize: 128,
          background: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {post.title}
      </div>
    )
  )
}
```

----------------------------------------

TITLE: Deleting Session Cookie in Next.js App Router (JavaScript)
DESCRIPTION: This asynchronous function `deleteSession` removes the session cookie named 'session' using the `delete` method provided by the Next.js `cookies()` API. This is typically used during a logout process.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/authentication.mdx#_snippet_14

LANGUAGE: js
CODE:
```
import 'server-only';
import { cookies } from 'next/headers';

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete('session');
}
```

----------------------------------------

TITLE: Define Page Component for Dynamic Segment in Next.js App Router
DESCRIPTION: This snippet shows how to define a page component that utilizes a dynamic route segment (`[slug]`) in the App Router. The component receives the dynamic segment value via the `params` prop, which is a Promise (in Next.js 15+). It demonstrates accessing the parameter using async/await and rendering it.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-building-your-application/01-routing/10-dynamic-routes.mdx#_snippet_0

LANGUAGE: tsx
CODE:
```
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  return <div>My Post: {slug}</div>
}
```

LANGUAGE: jsx
CODE:
```
export default async function Page({ params }) {
  const { slug } = await params
  return <div>My Post: {slug}</div>
}
```

----------------------------------------

TITLE: Migrate CRA to Next.js
DESCRIPTION: Migrates a Create React App project to Next.js, creating a Pages Router and necessary config to match behavior. Client-side only rendering is leveraged initially to prevent breaking compatibility due to `window` usage during SSR and can be enabled seamlessly to allow the gradual adoption of Next.js specific features.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/upgrading/codemods.mdx#_snippet_32

LANGUAGE: Terminal
CODE:
```
npx @next/codemod cra-to-next
```

----------------------------------------

TITLE: Conditionally Applying Headers with has and missing Next.js JavaScript
DESCRIPTION: This extensive snippet demonstrates using the `has` and `missing` arrays to apply headers only when specific request properties (headers, cookies, host, or queries) match or do not match a defined pattern. It shows examples matching the presence of a header, the absence of a header, matching multiple conditions (query and cookie), matching header values with capture groups, and matching the host.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/05-config/01-next-config-js/headers.mdx#_snippet_6

LANGUAGE: JavaScript
CODE:
```
module.exports = {
  async headers() {
    return [
      // if the header `x-add-header` is present,
      // the `x-another-header` header will be applied
      {
        source: '/:path*',
        has: [
          {
            type: 'header',
            key: 'x-add-header',
          },
        ],
        headers: [
          {
            key: 'x-another-header',
            value: 'hello',
          },
        ],
      },
      // if the header `x-no-header` is not present,
      // the `x-another-header` header will be applied
      {
        source: '/:path*',
        missing: [
          {
            type: 'header',
            key: 'x-no-header',
          },
        ],
        headers: [
          {
            key: 'x-another-header',
            value: 'hello',
          },
        ],
      },
      // if the source, query, and cookie are matched,
      // the `x-authorized` header will be applied
      {
        source: '/specific/:path*',
        has: [
          {
            type: 'query',
            key: 'page',
            // the page value will not be available in the
            // header key/values since value is provided and
            // doesn't use a named capture group e.g. (?<page>home)
            value: 'home',
          },
          {
            type: 'cookie',
            key: 'authorized',
            value: 'true',
          },
        ],
        headers: [
          {
            key: 'x-authorized',
            value: ':authorized',
          },
        ],
      },
      // if the header `x-authorized` is present and
      // contains a matching value, the `x-another-header` will be applied
      {
        source: '/:path*',
        has: [
          {
            type: 'header',
            key: 'x-authorized',
            value: '(?<authorized>yes|true)',
          },
        ],
        headers: [
          {
            key: 'x-another-header',
            value: ':authorized',
          },
        ],
      },
      // if the host is `example.com`,
      // this header will be applied
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'example.com',
          },
        ],
        headers: [
          {
            key: 'x-another-header',
            value: ':authorized',
          },
        ],
      },
    ]
  },
}
```

----------------------------------------

TITLE: Robots object type definition (TypeScript/TSX)
DESCRIPTION: Defines the TypeScript type signature for the `Robots` object expected when dynamically generating `robots.txt`. It details the structure of the `rules` property (single object or array) and includes optional `sitemap` and `host` properties.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/03-file-conventions/01-metadata/robots.mdx#_snippet_5

LANGUAGE: tsx
CODE:
```
type Robots = {
  rules:
    | {
        userAgent?: string | string[]
        allow?: string | string[]
        disallow?: string | string[]
        crawlDelay?: number
      }
    | Array<{
        userAgent: string | string[]
        allow?: string | string[]
        disallow?: string | string[]
        crawlDelay?: number
      }>
  sitemap?: string | string[]
  host?: string
}
```

----------------------------------------

TITLE: Generating ImageResponse in Route Handlers (app/api/route.js)
DESCRIPTION: Illustrates how to use `ImageResponse` within a Next.js Route Handler to dynamically generate an image at request time. It creates a simple layout with text elements and styles, then returns a new `ImageResponse` with the JSX element and specified width and height.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/04-functions/image-response.mdx#_snippet_1

LANGUAGE: js
CODE:
```
import { ImageResponse } from 'next/og'

export async function GET() {
  try {
    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'white',
            padding: '40px',
          }}
        >
          <div
            style={{
              fontSize: 60,
              fontWeight: 'bold',
              color: 'black',
              textAlign: 'center',
            }}
          >
            Welcome to My Site
          </div>
          <div
            style={{
              fontSize: 30,
              color: '#666',
              marginTop: '20px',
            }}
          >
            Generated with Next.js ImageResponse
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  } catch (e) {
    console.log(`${e.message}`)
    return new Response(`Failed to generate the image`, {
      status: 500,
    })
  }
}
```

----------------------------------------

TITLE: Creating Secure Session Cookie in Next.js App Router (TypeScript)
DESCRIPTION: This asynchronous function `createSession` encrypts a user ID and expiration time (7 days) using a separate `encrypt` function, then sets the resulting session string as an HTTP-only, secure cookie named 'session' using Next.js `cookies()` API. Recommended cookie options like `sameSite` and `path` are included.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/authentication.mdx#_snippet_7

LANGUAGE: ts
CODE:
```
import 'server-only';
import { cookies } from 'next/headers';

export async function createSession(userId: string) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const session = await encrypt({ userId, expiresAt });
  const cookieStore = await cookies();

  cookieStore.set('session', session, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  });
}
```

----------------------------------------

TITLE: Encrypting Session Payload with Jose in TypeScript
DESCRIPTION: This snippet defines an asynchronous function `encrypt` to sign and encrypt a given payload using the `jose` library with HS256 algorithm. It sets the protected header, issued at time, and expiration time (7 days) before signing with a key derived from a session secret environment variable. It requires the `server-only` package and a `SessionPayload` type definition.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/authentication.mdx#_snippet_5

LANGUAGE: tsx
CODE:
```
import 'server-only';
import { SignJWT, jwtVerify } from 'jose';
import { SessionPayload } from '@/app/lib/definitions';

const secretKey = process.env.SESSION_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

export async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(encodedKey);
}

export async function decrypt(session: string | undefined = '') {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ['HS256'],
    });
    return payload;
  } catch (error) {
    console.log('Failed to verify session');
  }
}
```

----------------------------------------

TITLE: Server Component Error Handling in Next.js
DESCRIPTION: Implementation of error handling in a Server Component, demonstrating how to handle fetch errors and conditionally render error messages.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-building-your-application/01-routing/05-error-handling.mdx#2025-04-23_snippet_2

LANGUAGE: typescript
CODE:
```
export default async function Page() {
  const res = await fetch(`https://...`)
  const data = await res.json()

  if (!res.ok) {
    return 'There was an error.'
  }

  return '...'
}
```

LANGUAGE: javascript
CODE:
```
export default async function Page() {
  const res = await fetch(`https://...`)
  const data = await res.json()

  if (!res.ok) {
    return 'There was an error.'
  }

  return '...'
}
```

----------------------------------------

TITLE: Deleting Cookies by Setting Empty Value
DESCRIPTION: Shows how to delete a cookie by setting its value to an empty string using the cookies().set() method in Next.js server actions.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/04-functions/cookies.mdx#2025-04-21_snippet_9

LANGUAGE: typescript
CODE:
```
'use server'

import { cookies } from 'next/headers'

export async function delete(data) {
  (await cookies()).set('name', '')
}
```

LANGUAGE: javascript
CODE:
```
'use server'

import { cookies } from 'next/headers'

export async function delete(data) {
  (await cookies()).set('name', '')
}
```

----------------------------------------

TITLE: Handling Headers in Next.js Route Handlers
DESCRIPTION: Example of reading and setting headers in a Route Handler using the 'headers' function from next/headers. This demonstrates how to access and manipulate headers in both TypeScript and JavaScript.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-building-your-application/01-routing/13-route-handlers.mdx#2025-04-21_snippet_3

LANGUAGE: typescript
CODE:
```
import { headers } from 'next/headers'

export async function GET(request: Request) {
  const headersList = await headers()
  const referer = headersList.get('referer')

  return new Response('Hello, Next.js!', {
    status: 200,
    headers: { referer: referer },
  })
}
```

LANGUAGE: javascript
CODE:
```
import { headers } from 'next/headers'

export async function GET(request) {
  const headersList = await headers()
  const referer = headersList.get('referer')

  return new Response('Hello, Next.js!', {
    status: 200,
    headers: { referer: referer },
  })
}
```

----------------------------------------

TITLE: On-demand Revalidation Server Action App Router TS
DESCRIPTION: Demonstrates how to use the `revalidatePath` function within a Next.js Server Action to clear the cache for a specific path (`/posts`) on demand. This is typically triggered by an event like adding a new post, ensuring the next request fetches fresh data.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-building-your-application/02-data-fetching/04-incremental-static-regeneration.mdx#_snippet_6

LANGUAGE: ts
CODE:
```
'use server'

import { revalidatePath } from 'next/cache'

export async function createPost() {
  // Invalidate the /posts route in the cache
  revalidatePath('/posts')
}
```

----------------------------------------

TITLE: Using the Link Component Next.js JSX
DESCRIPTION: Illustrates the basic usage of the built-in Next.js <Link> component in a JavaScript React Server Component. It shows how to import the component from 'next/link' and use it to create a link that navigates to the '/dashboard' route.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-building-your-application/01-routing/04-linking-and-navigating.mdx#_snippet_1

LANGUAGE: jsx
CODE:
```
import Link from 'next/link'

export default function Page() {
  return <Link href="/dashboard">Dashboard</Link>
}
```

----------------------------------------

TITLE: Using useActionState for Form Submission and State (TSX)
DESCRIPTION: Illustrates a Client Component using the `useActionState` hook to manage the state returned by a Server Action and its pending status. The hook provides the current state (`state`), a function to trigger the action (`formAction`), and a boolean indicating if the action is pending (`pending`). This state is then used to display messages and control UI elements.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-building-your-application/02-data-fetching/03-server-actions-and-mutations.mdx#_snippet_13

LANGUAGE: TSX
CODE:
```
'use client'

import { useActionState } from 'react'
import { createUser } from '@/app/actions'

const initialState = {
  message: '',
}

export function Signup() {
  const [state, formAction, pending] = useActionState(createUser, initialState)

  return (
    <form action={formAction}>
      <label htmlFor="email">Email</label>
      <input type="text" id="email" name="email" required />
      {/* ... */}
      <p aria-live="polite">{state?.message}</p>
      <button disabled={pending}>Sign up</button>
    </form>
  )
}
```

----------------------------------------

TITLE: Implementing Dynamic Redirects using Middleware and Edge Config
DESCRIPTION: Manages a large number of dynamic redirects programmatically within Next.js Middleware by fetching redirect rules from an external data source, demonstrated here using Vercel's Edge Config (`@vercel/edge-config`). The middleware checks if the incoming request path matches a key in the external configuration and performs a redirect if a rule is found. This approach avoids application redeployment for redirect updates.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-building-your-application/01-routing/07-redirecting.mdx#_snippet_10

LANGUAGE: TypeScript
CODE:
```
import { NextResponse, NextRequest } from 'next/server'
import { get } from '@vercel/edge-config'

type RedirectEntry = {
  destination: string
  permanent: boolean
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const redirectData = await get(pathname)

  if (redirectData && typeof redirectData === 'string') {
    const redirectEntry: RedirectEntry = JSON.parse(redirectData)
    const statusCode = redirectEntry.permanent ? 308 : 307
    return NextResponse.redirect(redirectEntry.destination, statusCode)
  }

  // No redirect found, continue without redirecting
  return NextResponse.next()
}
```

LANGUAGE: JavaScript
CODE:
```
import { NextResponse } from 'next/server'
import { get } from '@vercel/edge-config'

export async function middleware(request) {
  const pathname = request.nextUrl.pathname
  const redirectData = await get(pathname)

  if (redirectData) {
    const redirectEntry = JSON.parse(redirectData)
    const statusCode = redirectEntry.permanent ? 308 : 307
    return NextResponse.redirect(redirectEntry.destination, statusCode)
  }

  // No redirect found, continue without redirecting
  return NextResponse.next()
}
```

----------------------------------------

TITLE: Implementing Optimistic UI Updates with useOptimistic (JavaScript)
DESCRIPTION: Illustrates using the `useOptimistic` hook to provide instant UI feedback before a Server Action completes. It creates an optimistic state that immediately reflects the user's intended action, while the background action performs the actual data mutation. The UI renders the optimistic state until the action finishes.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-building-your-application/02-data-fetching/03-server-actions-and-mutations.mdx#_snippet_20

LANGUAGE: JavaScript
CODE:
```
'use client'

import { useOptimistic } from 'react'
import { send } from './actions'

export function Thread({ messages }) {
  const [optimisticMessages, addOptimisticMessage] = useOptimistic(
    messages,
    (state, newMessage) => [...state, { message: newMessage }]
  )

  const formAction = async (formData) => {
    const message = formData.get('message')
    addOptimisticMessage(message)
    await send(message)
  }

  return (
    <div>
      {optimisticMessages.map((m) => (
        <div>{m.message}</div>
      ))}
      <form action={formAction}>
        <input type="text" name="message" />
        <button type="submit">Send</button>
      </form>
    </div>
  )
}
```

----------------------------------------

TITLE: Securing Server Actions by Verifying User Role (JS)
DESCRIPTION: Illustrates securing a Next.js Server Action in JavaScript by checking the user's session and verifying if their role is 'admin' before executing the action. Unauthorized users are returned early. Assumes a `verifySession` function is available.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/authentication.mdx#_snippet_35

LANGUAGE: js
CODE:
```
'use server'\nimport { verifySession } from '@/app/lib/dal'\n\nexport async function serverAction() {\n  const session = await verifySession()\n  const userRole = session.user.role\n\n  // Return early if user is not authorized to perform the action\n  if (userRole !== 'admin') {\n    return null\n  }\n\n  // Proceed with the action for authorized users\n}
```

----------------------------------------

TITLE: Conditional Route Rendering in Typescript
DESCRIPTION: This code snippet shows how to conditionally render routes based on user role using Parallel Routes. The `checkUserRole` function determines the user's role, and the layout renders either the `admin` or `user` slot accordingly.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-building-your-application/01-routing/11-parallel-routes.mdx#2025-04-21_snippet_4

LANGUAGE: typescript
CODE:
```
import { checkUserRole } from '@/lib/auth'

export default function Layout({
  user,
  admin,
}: {
  user: React.ReactNode
  admin: React.ReactNode
}) {
  const role = checkUserRole()
  return role === 'admin' ? admin : user
}
```

----------------------------------------

TITLE: Removing Deprecated Webpack Configuration
DESCRIPTION: This snippet shows how to update the Next.js configuration by removing the deprecated 'future.webpack5' option, as webpack 5 is the default now. It is essential for maintaining compatibility with the latest Next.js versions.
SOURCE: https://github.com/vercel/next.js/blob/canary/errors/future-webpack5-moved-to-webpack5.mdx#2025-04-21_snippet_0

LANGUAGE: javascript
CODE:
```
module.exports = {
  future: {
    webpack5: false,
  },
}
```

----------------------------------------

TITLE: Redirecting Client-Side with useRouter (App Router, JavaScript)
DESCRIPTION: Illustrates client-side navigation using the `useRouter` hook in a Next.js App Router Client Component. It shows an example of using the `router.push()` method within a button's `onClick` event handler to programmatically navigate the user to a different page (`/dashboard`) without a full page reload.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-building-your-application/01-routing/07-redirecting.mdx#_snippet_5

LANGUAGE: javascript
CODE:
```
'use client'\n\nimport { useRouter } from 'next/navigation'\n\nexport default function Page() {\n  const router = useRouter()\n\n  return (\n    <button type="button" onClick={() => router.push('/dashboard')}>\n      Dashboard\n    </button>\n  )\n}
```

----------------------------------------

TITLE: Enable Verbose Logging in Next.js Dev
DESCRIPTION: This command starts the Next.js development server with verbose logging enabled. This provides more detailed information about what's happening during development, which can be helpful for debugging performance issues. It requires npm and a Next.js project.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/local-development.mdx#_snippet_4

LANGUAGE: bash
CODE:
```
next dev --verbose
```

----------------------------------------

TITLE: Generating Image with External Data JSX
DESCRIPTION: Demonstrates creating a dynamic Open Graph image in JSX that fetches data from an external API based on route parameters. It uses `async/await` and `fetch` to retrieve data and renders it within an `ImageResponse` component, including predefined `alt`, `size`, and `contentType` exports.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/03-file-conventions/01-metadata/opengraph-image.mdx#_snippet_21

LANGUAGE: jsx
CODE:
```
import { ImageResponse } from 'next/og'

export const alt = 'About Acme'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image({ params }) {
  const post = await fetch(`https://.../posts/${params.slug}`).then((res) =>
    res.json()
  )

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 48,
          background: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {post.title}
      </div>
    ),
    {
      ...size,
    }
  )
}
```

----------------------------------------

TITLE: Example of Matching Redirect Paths in Next.js
DESCRIPTION: This snippet shows how to use path matching in redirects. The `source` can include patterns like `:slug` to match specific paths and append them into the `destination`. It supports both simple path segments and more complex path structures using wildcards (`*`) and regex.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/05-config/01-next-config-js/redirects.mdx#2025-04-21_snippet_1

LANGUAGE: JavaScript
CODE:
```
module.exports = {
  async redirects() {
    return [
      {
        source: '/old-blog/:path*',
        destination: '/blog/:path*',
        permanent: false
      }
    ]
  },
}
```

----------------------------------------

TITLE: Displaying Form Loading State - JavaScript
DESCRIPTION: This code snippet demonstrates how to display a loading state during form submission in a Next.js component using JavaScript. It uses React state to track the loading state and disables the submit button while loading.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/02-pages/03-building-your-application/03-data-fetching/03-forms-and-mutations.mdx#_snippet_9

LANGUAGE: javascript
CODE:
```
import React, { useState } from 'react'

export default function Page() {
  const [isLoading, setIsLoading] = useState(false)

  async function onSubmit(event) {
    event.preventDefault()
    setIsLoading(true) // Set loading to true when the request starts

    try {
      const formData = new FormData(event.currentTarget)
      const response = await fetch('/api/submit', {
        method: 'POST',
        body: formData,
      })

      // Handle response if necessary
      const data = await response.json()
      // ...
    } catch (error) {
      // Handle error if necessary
      console.error(error)
    } finally {
      setIsLoading(false) // Set loading to false when the request completes
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <input type="text" name="name" />
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Submit'}
      </button>
    </form>
  )
}
```

----------------------------------------

TITLE: Exporting Dynamic Handling in Next.js
DESCRIPTION: This snippet demonstrates how to utilize the dynamic export feature in Next.js to enforce static or dynamic rendering for a page. By using 'export const dynamic = 'force-static'', the page will be statically rendered, while 'export const dynamic = 'force-dynamic'' allows the page to be dynamically generated regardless of content. This ensures clarity in rendering behavior and prevents runtime errors associated with static versus dynamic content.
SOURCE: https://github.com/vercel/next.js/blob/canary/errors/app-static-to-dynamic-error.mdx#2025-04-21_snippet_0

LANGUAGE: javascript
CODE:
```
export const dynamic = 'force-static';
```

LANGUAGE: javascript
CODE:
```
export const dynamic = 'force-dynamic';
```

----------------------------------------

TITLE: Permanently Redirecting with permanentRedirect (JavaScript)
DESCRIPTION: Shows how to use the `permanentRedirect` function in a Next.js Server Action (`updateUsername`) to perform a permanent 308 redirect. This example revalidates a cache tag after a placeholder database update and then redirects the user to the new permanent URL for the updated profile. Useful for permanent URL changes.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-building-your-application/01-routing/07-redirecting.mdx#_snippet_3

LANGUAGE: javascript
CODE:
```
'use server'\n\nimport { permanentRedirect } from 'next/navigation'\nimport { revalidateTag } from 'next/cache'\n\nexport async function updateUsername(username, formData) {\n  try {\n    // Call database\n  } catch (error) {\n    // Handle errors\n  }\n\n  revalidateTag('username') // Update all references to the username\n  permanentRedirect(`/profile/${username}`) // Navigate to the new user profile\n}
```

----------------------------------------

TITLE: Implementing revalidateTag in a Server Action
DESCRIPTION: Demonstrates how to integrate and use the `revalidateTag` function within a Next.js Server Action. It shows importing the function from `next/cache` and calling it with a specific tag ('posts') after performing an action that modifies data, thereby invalidating the relevant cache.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/04-functions/revalidateTag.mdx#_snippet_1

LANGUAGE: typescript
CODE:
```
'use server'

import { revalidateTag } from 'next/cache'

export default async function submit() {
  await addPost()
  revalidateTag('posts')
}
```

LANGUAGE: javascript
CODE:
```
'use server'

import { revalidateTag } from 'next/cache'

export default async function submit() {
  await addPost()
  revalidateTag('posts')
}
```

----------------------------------------

TITLE: Using Server Functions with Forms in React Components (TypeScript)
DESCRIPTION: Shows how to invoke a Server Function using the HTML form action attribute in TypeScript. The form automatically passes FormData to the Server Function when submitted.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/01-getting-started/07-updating-data.mdx#2025-04-21_snippet_8

LANGUAGE: typescript
CODE:
```
import { createPost } from '@/app/actions'

export function Form() {
  return (
    <form action={createPost}>
      <input type="text" name="title" />
      <input type="text" name="content" />
      <button type="submit">Create</button>
    </form>
  )
}
```

----------------------------------------

TITLE: Securing Server Actions by Verifying User Role (TS)
DESCRIPTION: Demonstrates how to implement authorization checks within a Next.js Server Action using TypeScript. It verifies the user's session and role ('admin') before allowing the action to proceed, returning early if the user is unauthorized. Requires a `verifySession` utility.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/authentication.mdx#_snippet_34

LANGUAGE: ts
CODE:
```
'use server'\nimport { verifySession } from '@/app/lib/dal'\n\nexport async function serverAction(formData: FormData) {\n  const session = await verifySession()\n  const userRole = session?.user?.role\n\n  // Return early if user is not authorized to perform the action\n  if (userRole !== 'admin') {\n    return null\n  }\n\n  // Proceed with the action for authorized users\n}
```

----------------------------------------

TITLE: Redirecting After Form Submission - TypeScript
DESCRIPTION: This code snippet demonstrates how to redirect the user to a different route after a successful form submission in a Next.js API route using TypeScript. It calls an addPost function, and redirects to a specific post page.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/02-pages/03-building-your-application/03-data-fetching/03-forms-and-mutations.mdx#_snippet_10

LANGUAGE: typescript
CODE:
```
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const id = await addPost()
  res.redirect(307, `/post/${id}`)
}
```

----------------------------------------

TITLE: Implementing Internationalized Routing in Next.js Middleware
DESCRIPTION: This code snippet shows how to implement internationalized routing using Next.js middleware. It checks for supported locales in the pathname and redirects to the appropriate localized route if necessary.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-building-your-application/01-routing/15-internationalization.mdx#2025-04-21_snippet_1

LANGUAGE: javascript
CODE:
```
import { NextResponse } from "next/server";

let locales = ['en-US', 'nl-NL', 'nl']

// Get the preferred locale, similar to the above or using a library
function getLocale(request) { ... }

export function middleware(request) {
  // Check if there is any supported locale in the pathname
  const { pathname } = request.nextUrl
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) return

  // Redirect if there is no locale
  const locale = getLocale(request)
  request.nextUrl.pathname = `/${locale}${pathname}`
  // e.g. incoming request is /products
  // The new URL is now /en-US/products
  return NextResponse.redirect(request.nextUrl)
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    '/((?!_next).*)',
    // Optional: only run on root (/) URL
    // '/'
  ],
}
```

----------------------------------------

TITLE: Memoizing Non-Fetch Data with React Cache
DESCRIPTION: Explains how to use the `cache` function provided by React to memoize data fetching logic that doesn't rely on the native `fetch` API, such as queries made with an ORM or direct database calls. Wrapping the async data function with `cache` ensures that subsequent calls with the same arguments within the request lifecycle will return the cached result instead of executing a new query.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-building-your-application/02-data-fetching/01-fetching.mdx#_snippet_6

LANGUAGE: javascript
CODE:
```
import { cache } from 'react';
import { db, posts, eq } from '@/lib/db'; // Example with Drizzle ORM
import { notFound } from 'next/navigation';

export const getPost = cache(async (id) => {
  const post = await db.query.posts.findFirst({
    where: eq(posts.id, parseInt(id)),
  });

  if (!post) notFound();
  return post;
});
```

----------------------------------------

TITLE: Invalidating Data with revalidateTag - Next.js Server Actions
DESCRIPTION: Illustrates how to use the `revalidateTag` function within a Next.js Server Action. Calling `revalidateTag` with a specific tag invalidates all cached data associated with that tag, forcing a re-fetch on the next request for components or functions that consumed the tagged data.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-building-your-application/02-data-fetching/04-incremental-static-regeneration.mdx#_snippet_10

LANGUAGE: ts
CODE:
```
'use server'

import { revalidateTag } from 'next/cache'

export async function createPost() {
  // Invalidate all data tagged with 'posts' in the cache
  revalidateTag('posts')
}
```

LANGUAGE: js
CODE:
```
'use server'

import { revalidateTag } from 'next/cache'

export async function createPost() {
  // Invalidate all data tagged with 'posts' in the cache
  revalidateTag('posts')
}
```

----------------------------------------

TITLE: Overriding MDX Components Locally in Next.js App Router (TSX)
DESCRIPTION: This code demonstrates how to override MDX components locally within a specific page in the Next.js app directory. It defines a custom `CustomH1` component and then creates an `overrideComponents` object to map the `h1` tag to the custom component. This override is then passed to the `Welcome` MDX component.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/mdx.mdx#_snippet_18

LANGUAGE: tsx
CODE:
```
import Welcome from '@/markdown/welcome.mdx'

function CustomH1({ children }) {
  return <h1 style={{ color: 'blue', fontSize: '100px' }}>{children}</h1>
}

const overrideComponents = {
  h1: CustomH1,
}

export default function Page() {
  return <Welcome components={overrideComponents} />
}
```

----------------------------------------

TITLE: Setting a Cookie - TSX
DESCRIPTION: This snippet demonstrates how to set a cookie in a Next.js application using the `cookies` function within a Server Action or Route Handler. It shows different methods to specify cookie attributes.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/04-functions/cookies.mdx#2025-04-21_snippet_4

LANGUAGE: tsx
CODE:
```
'use server'

import { cookies } from 'next/headers'

export async function create(data) {
  const cookieStore = await cookies()

  cookieStore.set('name', 'lee')
  // or
  cookieStore.set('name', 'lee', { secure: true })
  // or
  cookieStore.set({
    name: 'name',
    value: 'lee',
    httpOnly: true,
    path: '/',
  })
}
```

----------------------------------------

TITLE: Creating New User - Next.js App Router - TypeScript/JavaScript
DESCRIPTION: Implements a user signup action for the Next.js App Router. It handles validating form data, securely hashing the user's password using bcrypt, and inserting the new user record into a database. The function returns an object indicating an error if the database insertion fails.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/authentication.mdx#_snippet_0

LANGUAGE: TypeScript
CODE:
```
export async function signup(state: FormState, formData: FormData) {
  // 1. Validate form fields
  // ...

  // 2. Prepare data for insertion into database
  const { name, email, password } = validatedFields.data
  // e.g. Hash the user's password before storing it
  const hashedPassword = await bcrypt.hash(password, 10)

  // 3. Insert the user into the database or call an Auth Library's API
  const data = await db
    .insert(users)
    .values({
      name,
      email,
      password: hashedPassword,
    })
    .returning({ id: users.id })

  const user = data[0]

  if (!user) {
    return {
      message: 'An error occurred while creating your account.',
    }
  }

  // TODO:
  // 4. Create user session
  // 5. Redirect user
}
```

LANGUAGE: JavaScript
CODE:
```
export async function signup(state, formData) {
  // 1. Validate form fields
  // ...

  // 2. Prepare data for insertion into database
  const { name, email, password } = validatedFields.data
  // e.g. Hash the user's password before storing it
  const hashedPassword = await bcrypt.hash(password, 10)

  // 3. Insert the user into the database or call an Library API
  const data = await db
    .insert(users)
    .values({
      name,
      email,
      password: hashedPassword,
    })
    .returning({ id: users.id })

  const user = data[0]

  if (!user) {
    return {
      message: 'An error occurred while creating your account.',
    }
  }

  // TODO:
  // 4. Create user session
  // 5. Redirect user
}
```

----------------------------------------

TITLE: Revalidating Cache Tag in Next.js TypeScript
DESCRIPTION: Covers using the revalidateTag function in a TypeScript file to purge a cache entry tagged with 'my-data'. This snippet is part of an async submit function designed to revalidate tagged cache data.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/04-functions/cacheTag.mdx#2025-04-21_snippet_4

LANGUAGE: typescript
CODE:
```
'use server'

import { revalidateTag } from 'next/cache'

export default async function submit() {
  await addPost()
  revalidateTag('my-data')
}
```

----------------------------------------

TITLE: Setting X-Content-Type-Options Header - JavaScript
DESCRIPTION: This snippet shows how to include the `X-Content-Type-Options` header in your Next.js headers configuration. Setting the value to `'nosniff'` prevents browsers from "sniffing" the content type of a response and forcing the declared `Content-Type` header, which helps prevent malicious file uploads from being executed unexpectedly, enhancing security.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/05-config/01-next-config-js/headers.mdx#_snippet_18

LANGUAGE: js
CODE:
```
{
  key: 'X-Content-Type-Options',
  value: 'nosniff'
}
```

----------------------------------------

TITLE: Redirect in Next.js Server Component (TypeScript)
DESCRIPTION: This example demonstrates how to use the `redirect` function within a Next.js Server Component written in TypeScript. It fetches team data and redirects to the login page if the data is not found. The `redirect` function terminates the rendering of the route segment by throwing a `NEXT_REDIRECT` error.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/04-functions/redirect.mdx#2025-04-21_snippet_0

LANGUAGE: typescript
CODE:
```
import { redirect } from 'next/navigation'

async function fetchTeam(id: string) {
  const res = await fetch('https://...')
  if (!res.ok) return undefined
  return res.json()
}

export default async function Profile({
  params,
}: {  params: Promise<{ id: string }>}) {
  const { id } = await params
  const team = await fetchTeam(id)

  if (!team) {
    redirect('/login')
  }

  // ...
}
```

----------------------------------------

TITLE: Enabling Draft Mode in Next.js Route Handler (JavaScript)
DESCRIPTION: This code snippet shows how to enable Draft Mode in a Next.js Route Handler using JavaScript. It imports `draftMode` from `next/headers`, calls `draft.enable()` to enable Draft Mode, and returns a response indicating that Draft Mode is enabled. It requires the `next` package.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/04-functions/draft-mode.mdx#_snippet_3

LANGUAGE: javascript
CODE:
```
import { draftMode } from 'next/headers'

export async function GET(request) {
  const draft = await draftMode()
  draft.enable()
  return new Response('Draft mode is enabled')
}
```

----------------------------------------

TITLE: Verify User Session in DAL (Next.js/React Cache) - TSX
DESCRIPTION: This function verifies the user's session by retrieving a session cookie, decrypting it, and checking for a valid user ID. If the session is invalid or missing, it redirects to the login page. It uses React's `cache` API to memoize the result within a React render pass.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/authentication.mdx#_snippet_22

LANGUAGE: TSX
CODE:
```
import 'server-only'

import { cookies } from 'next/headers'
import { decrypt } from '@/app/lib/session'
import { cache } from 'react'
import { redirect } from 'next/navigation'

export const verifySession = cache(async () => {
  const cookie = (await cookies()).get('session')?.value
  const session = await decrypt(cookie)

  if (!session?.userId) {
    redirect('/login')
  }

  return { isAuth: true, userId: session.userId }
})
```

----------------------------------------

TITLE: Handling FormData in Next.js - JavaScript
DESCRIPTION: This JavaScript example shows how to extract FormData from a POST request, read specific field values, and return them in a JSON response.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-building-your-application/01-routing/13-route-handlers.mdx#2025-04-21_snippet_15

LANGUAGE: javascript
CODE:
```
export async function POST(request) {
  const formData = await request.formData()
  const name = formData.get('name')
  const email = formData.get('email')
  return Response.json({ name, email })
}
```

----------------------------------------

TITLE: Creating a Shared Dashboard Layout in Next.js (JSX)
DESCRIPTION: This code defines a shared layout for the /dashboard route and its sub-routes using JavaScript. It exports a React component that accepts a `children` prop, which will be populated with the child page or nested layout. The layout includes a navigation element and renders the children within a section.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-building-your-application/01-routing/03-layouts-and-templates.mdx#_snippet_1

LANGUAGE: javascript
CODE:
```
export default function DashboardLayout({
  children, // will be a page or nested layout
}) {
  return (
    <section>
      {/* Include shared UI here e.g. a header or sidebar */}
      <nav></nav>

      {children}
    </section>
  )
}
```

----------------------------------------

TITLE: Catch-all API Routes in Next.js
DESCRIPTION: Shows how to implement catch-all API routes that can handle multiple dynamic segments in the URL path.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/02-pages/03-building-your-application/01-routing/07-api-routes.mdx#2025-04-23_snippet_9

LANGUAGE: typescript
CODE:
```
import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { slug } = req.query
  res.end(`Post: ${slug.join(', ')}`)
}
```

LANGUAGE: javascript
CODE:
```
export default function handler(req, res) {
  const { slug } = req.query
  res.end(`Post: ${slug.join(', ')}`)
}
```

----------------------------------------

TITLE: Fetching Data with getStaticProps (TypeScript)
DESCRIPTION: This code snippet demonstrates how to use `getStaticProps` in a Next.js page to fetch data from an API and pass it as props to the page component. It includes type definitions for the data and uses `InferGetStaticPropsType` for type safety.  It fetches repository data from the GitHub API and returns it as props.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/02-pages/04-api-reference/03-functions/get-static-props.mdx#_snippet_0

LANGUAGE: TypeScript
CODE:
```
import type { InferGetStaticPropsType, GetStaticProps } from 'next'

type Repo = {
  name: string
  stargazers_count: number
}

export const getStaticProps = (async (context) => {
  const res = await fetch('https://api.github.com/repos/vercel/next.js')
  const repo = await res.json()
  return { props: { repo } }
}) satisfies GetStaticProps<{
  repo: Repo
}>

export default function Page({
  repo,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return repo.stargazers_count
}
```

----------------------------------------

TITLE: Loading Next.js Environment Variables for Testing (JavaScript)
DESCRIPTION: Demonstrates how to programmatically load environment variables using the `@next/env` package within a test setup like Jest. This ensures tests run with the same environment configuration rules as Next.js, loading variables from appropriate `.env` files based on the current directory and NODE_ENV. It requires the `@next/env` package.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/environment-variables.mdx#_snippet_11

LANGUAGE: javascript
CODE:
```
// The below can be used in a Jest global setup file or similar for your testing set-up
import { loadEnvConfig } from '@next/env'

export default async () => {
  const projectDir = process.cwd()
  loadEnvConfig(projectDir)
}
```

----------------------------------------

TITLE: Configuring Fetch Cache in Next.js (TS)
DESCRIPTION: Shows the syntax for using the `cache` option with the Next.js extended `fetch` function to explicitly control how the request interacts with the framework's Data Cache, specifying behaviors like `force-cache` or `no-store`.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/04-functions/fetch.mdx#_snippet_2

LANGUAGE: TypeScript
CODE:
```
fetch(`https://...`, { cache: 'force-cache' | 'no-store' })
```

----------------------------------------

TITLE: Creating a Layout Component with Client and Server Components in TypeScript
DESCRIPTION: This snippet combines Client and Server Components by defining a Layout component that includes a Server Component (Logo) and a Client Component (SearchBar). This structure optimizes the overall performance by reducing the Client JavaScript bundle size.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-building-your-application/03-rendering/03-composition-patterns.mdx#2025-04-21_snippet_13

LANGUAGE: typescript
CODE:
```
// SearchBar is a Client Component
import SearchBar from './searchbar'
// Logo is a Server Component
import Logo from './logo'

// Layout is a Server Component by default
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <nav>
        <Logo />
        <SearchBar />
      </nav>
      <main>{children}</main>
    </>
  )
}
```

----------------------------------------

TITLE: Programmatically Submitting Form with requestSubmit (JSX)
DESCRIPTION: Demonstrates a Client Component handling a keyboard event (`onKeyDown`) on a textarea. It checks for Cmd/Ctrl + Enter key presses and triggers the submission of the nearest parent form using `e.currentTarget.form?.requestSubmit()`. This requires the textarea to be nested within a `<form>` element.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-building-your-application/02-data-fetching/03-server-actions-and-mutations.mdx#_snippet_8

LANGUAGE: JSX
CODE:
```
'use client'

export function Entry() {
  const handleKeyDown = (e) => {
    if (
      (e.ctrlKey || e.metaKey) &&
      (e.key === 'Enter' || e.key === 'NumpadEnter')
    ) {
      e.preventDefault()
      e.currentTarget.form?.requestSubmit()
    }
  }

  return (
    <div>
      <textarea name="entry" rows={20} required onKeyDown={handleKeyDown} />
    </div>
  )
}
```

----------------------------------------

TITLE: Generating Static Params for Multiple Dynamic Segments Next.js TSX/JSX
DESCRIPTION: Demonstrates generating static parameters for routes with multiple dynamic segments (`[category]/[product]`). `generateStaticParams` returns an array of objects, where each object includes properties for all dynamic segments in that route level.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/04-functions/generate-static-params.mdx#_snippet_2

LANGUAGE: tsx
CODE:
```
export function generateStaticParams() {
  return [
    { category: 'a', product: '1' },
    { category: 'b', product: '2' },
    { category: 'c', product: '3' },
  ]
}

// Three versions of this page will be statically generated
// using the `params` returned by `generateStaticParams`
// - /products/a/1
// - /products/b/2
// - /products/c/3
export default async function Page({
  params,
}: {
  params: Promise<{ category: string; product: string }>
}) {
  const { category, product } = await params
  // ...
```

LANGUAGE: jsx
CODE:
```
export function generateStaticParams() {
  return [
    { category: 'a', product: '1' },
    { category: 'b', product: '2' },
    { category: 'c', product: '3' },
  ]
}

// Three versions of this page will be statically generated
// using the `params` returned by `generateStaticParams`
// - /products/a/1
// - /products/b/2
// - /products/c/3
export default async function Page({ params }) {
  const { category, product } = await params
  // ...
```

----------------------------------------

TITLE: Creating Server Functions with 'use server' Directive in TypeScript
DESCRIPTION: Defines asynchronous Server Functions for creating and deleting posts using the 'use server' directive within individual functions. Each function receives FormData and extracts relevant information for data operations.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/01-getting-started/07-updating-data.mdx#2025-04-21_snippet_0

LANGUAGE: typescript
CODE:
```
export async function createPost(formData: FormData) {
  'use server'
  const title = formData.get('title')
  const content = formData.get('content')

  // Update data
  // Revalidate cache
}

export async function deletePost(formData: FormData) {
  'use server'
  const id = formData.get('id')

  // Update data
  // Revalidate cache
}
```

----------------------------------------

TITLE: Adding Authentication/Authorization Check in Server Action
DESCRIPTION: Provides an example of implementing authorization checks within a Server Action (`addItem`). It demonstrates calling an external authentication utility (`auth`) to verify if the user is signed in and throwing an error if they are not authorized to perform the action.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-building-your-application/02-data-fetching/03-server-actions-and-mutations.mdx#_snippet_29

LANGUAGE: tsx
CODE:
```
'use server'

import { auth } from './lib'

export function addItem() {
  const { user } = auth()
  if (!user) {
    throw new Error('You must be signed in to perform this action')
  }

  // ...
}
```

----------------------------------------

TITLE: Conditionally Rewriting Paths in Next.js Middleware TypeScript
DESCRIPTION: This snippet demonstrates how to use conditional statements within the main Middleware function in TypeScript to rewrite requests based on the incoming path. It checks if the path starts with '/about' or '/dashboard' and uses `NextResponse.rewrite` to display content from a different URL without changing the browser's URL.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-building-your-application/01-routing/14-middleware.mdx#_snippet_6

LANGUAGE: typescript
CODE:
```
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/about')) {
    return NextResponse.rewrite(new URL('/about-2', request.url))
  }

  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.rewrite(new URL('/dashboard/user', request.url))
  }
}
```

----------------------------------------

TITLE: Using useActionState for Form Submission and State (JSX)
DESCRIPTION: Illustrates a Client Component using the `useActionState` hook to manage the state returned by a Server Action and its pending status. The hook provides the current state (`state`), a function to trigger the action (`formAction`), and a boolean indicating if the action is pending (`pending`). This state is then used to display messages and control UI elements.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-building-your-application/02-data-fetching/03-server-actions-and-mutations.mdx#_snippet_14

LANGUAGE: JSX
CODE:
```
'use client'

import { useActionState } from 'react'
import { createUser } from '@/app/actions'

const initialState = {
  message: '',
}

export function Signup() {
  const [state, formAction, pending] = useActionState(createUser, initialState)

  return (
    <form action={formAction}>
      <label htmlFor="email">Email</label>
      <input type="text" id="email" name="email" required />
      {/* ... */}
      <p aria-live="polite">{state?.message}</p>
      <button disabled={pending}>Sign up</button>
    </form>
  )
}
```

----------------------------------------

TITLE: Push Notification Manager Component - TypeScript
DESCRIPTION: This React component manages push notification subscriptions. It checks for service worker and PushManager support, registers a service worker, handles subscribing and unsubscribing, and sends test notifications.  It uses React's useState and useEffect hooks to manage the component's state and side effects. It also utilizes server actions to handle the actual subscribing, unsubscribing, and notification sending logic.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/progressive-web-apps.mdx#_snippet_4

LANGUAGE: typescript
CODE:
```
function PushNotificationManager() {
  const [isSupported, setIsSupported] = useState(false)
  const [subscription, setSubscription] = useState<PushSubscription | null>(
    null
  )
  const [message, setMessage] = useState('')

  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true)
      registerServiceWorker()
    }
  }, [])

  async function registerServiceWorker() {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
      updateViaCache: 'none',
    })
    const sub = await registration.pushManager.getSubscription()
    setSubscription(sub)
  }

  async function subscribeToPush() {
    const registration = await navigator.serviceWorker.ready
    const sub = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
      ),
    })
    setSubscription(sub)
    const serializedSub = JSON.parse(JSON.stringify(sub))
    await subscribeUser(serializedSub)
  }

  async function unsubscribeFromPush() {
    await subscription?.unsubscribe()
    setSubscription(null)
    await unsubscribeUser()
  }

  async function sendTestNotification() {
    if (subscription) {
      await sendNotification(message)
      setMessage('')
    }
  }

  if (!isSupported) {
    return <p>Push notifications are not supported in this browser.</p>
  }

  return (
    <div>
      <h3>Push Notifications</h3>
      {subscription ? (
        <>
          <p>You are subscribed to push notifications.</p>
          <button onClick={unsubscribeFromPush}>Unsubscribe</button>
          <input
            type="text"
            placeholder="Enter notification message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button onClick={sendTestNotification}>Send Test</button>
        </>
      ) : (
        <>
          <p>You are not subscribed to push notifications.</p>
          <button onClick={subscribeToPush}>Subscribe</button>
        </>
      )}
    </div>
  )
}
```

----------------------------------------

TITLE: Disabling Data Caching for fetch (JavaScript)
DESCRIPTION: This snippet shows how to prevent Next.js from caching the response of a specific `fetch` request. By setting the `cache` option to `'no-store'`, the data will be fetched directly from the external data source on every incoming request to the server, bypassing the Data Cache.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/04-deep-dive/caching.mdx#_snippet_3

LANGUAGE: javascript
CODE:
```
let data = await fetch('https://api.vercel.app/blog', { cache: 'no-store' })
```

----------------------------------------

TITLE: Implementing Caching for GET Route Handlers in Next.js
DESCRIPTION: Example of implementing caching for a GET route handler using the 'force-static' dynamic option. This demonstrates how to fetch data from an external API and cache the response.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-building-your-application/01-routing/13-route-handlers.mdx#2025-04-21_snippet_1

LANGUAGE: typescript
CODE:
```
export const dynamic = 'force-static'

export async function GET() {
  const res = await fetch('https://data.mongodb-api.com/...', {
    headers: {
      'Content-Type': 'application/json',
      'API-Key': process.env.DATA_API_KEY,
    },
  })
  const data = await res.json()

  return Response.json({ data })
}
```

LANGUAGE: javascript
CODE:
```
export const dynamic = 'force-static'

export async function GET() {
  const res = await fetch('https://data.mongodb-api.com/...', {
    headers: {
      'Content-Type': 'application/json',
      'API-Key': process.env.DATA_API_KEY,
    },
  })
  const data = await res.json()

  return Response.json({ data })
}
```

----------------------------------------

TITLE: Create Root Layout Component (App Router)
DESCRIPTION: Defines the required root layout component (`app/layout.tsx` or `app/layout.js`) for applications using the App Router. This component wraps all other routes and must include `<html>` and `<body>` tags.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/01-getting-started/01-installation.mdx#_snippet_3

LANGUAGE: tsx
CODE:
```
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

LANGUAGE: jsx
CODE:
```
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

----------------------------------------

TITLE: Fetching Data in Next.js Server Component (JSX)
DESCRIPTION: Illustrates using the Next.js extended `fetch` function with `async`/`await` within a Server Component (JavaScript/JSX) to fetch data from an API, parse it as JSON, and render a list dynamically.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/04-functions/fetch.mdx#_snippet_1

LANGUAGE: JSX
CODE:
```
export default async function Page() {
  let data = await fetch('https://api.vercel.app/blog')
  let posts = await data.json()
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}
```

----------------------------------------

TITLE: Configuring optimizePackageImports in Next.js
DESCRIPTION: Configuration example showing how to add packages to the optimizePackageImports experimental feature in next.config.js. This optimization ensures only used modules are loaded from large packages while maintaining the convenience of named exports.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/05-config/01-next-config-js/optimizePackageImports.mdx#2025-04-21_snippet_0

LANGUAGE: javascript
CODE:
```
module.exports = {
  experimental: {
    optimizePackageImports: ['package-name'],
  },
}
```

----------------------------------------

TITLE: Loading Scripts in Layout - TypeScript
DESCRIPTION: This code snippet demonstrates how to load a third-party script within a Next.js layout component using TypeScript.  The `Script` component from `next/script` is used to embed the script. The script will be loaded once when the layout is accessed. Requires `next/script` dependency.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/scripts.mdx#_snippet_0

LANGUAGE: tsx
CODE:
```
import Script from 'next/script'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <section>{children}</section>
      <Script src="https://example.com/script.js" />
    </>
  )
}
```

----------------------------------------

TITLE: Render Dashboard Based on Role (Next.js Server Component) - TSX
DESCRIPTION: This Next.js Server Component demonstrates role-based access control by calling `verifySession()` from the DAL. It retrieves the user's role from the session object and conditionally renders different dashboard components (`AdminDashboard`, `UserDashboard`) or redirects based on the role.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/authentication.mdx#_snippet_28

LANGUAGE: TSX
CODE:
```
import { verifySession } from '@/app/lib/dal'
import { redirect } from 'next/navigation'

export default async function Dashboard() {
  const session = await verifySession()
  const userRole = session?.user?.role // Assuming 'role' is part of the session object

  if (userRole === 'admin') {
    return <AdminDashboard />
  } else if (userRole === 'user') {
    return <UserDashboard />
  } else {
    redirect('/login')
  }
}
```

----------------------------------------

TITLE: Redirect in Next.js Client Component (JavaScript)
DESCRIPTION: This example shows how to use the `redirect` function in a Next.js Client Component using JavaScript. It checks if the current pathname starts with `/admin` and doesn't include `/login`. If both conditions are met, it redirects the user to `/admin/login`. When using `redirect` in a Client Component on initial page load during SSR, it will perform a server-side redirect.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/04-functions/redirect.mdx#2025-04-21_snippet_3

LANGUAGE: javascript
CODE:
```
'use client'

import { redirect, usePathname } from 'next/navigation'

export function ClientRedirect() {
  const pathname = usePathname()

  if (pathname.startsWith('/admin') && !pathname.includes('/login')) {
    redirect('/admin/login')
  }

  return <div>Login Page</div>
}
```

----------------------------------------

TITLE: Using useEffect for Client-Only Rendering (React/Next.js)
DESCRIPTION: Demonstrates how to use React's `useEffect` hook to ensure certain logic or rendering occurs only on the client side after hydration. This prevents hydration errors caused by logic or APIs that are not available server-side by conditionally rendering content based on a state updated within `useEffect`.
SOURCE: https://github.com/vercel/next.js/blob/canary/errors/react-hydration-error.mdx#_snippet_0

LANGUAGE: JSX
CODE:
```
import { useState, useEffect } from 'react';

export default function App() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return <h1>{isClient ? 'This is never prerendered' : 'Prerendered'}</h1>;
}
```

----------------------------------------

TITLE: Generating Secret Key - Terminal - Bash
DESCRIPTION: Provides a bash command using `openssl` to generate a cryptographically secure, random string encoded in base64. This output is suitable for use as a secret key, often stored in environment variables like `SESSION_SECRET`, for tasks such as signing authentication sessions.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/authentication.mdx#_snippet_3

LANGUAGE: Bash
CODE:
```
openssl rand -base64 32
```

----------------------------------------

TITLE: Fetching Redirect Data in Next.js App Route Handler (TypeScript)
DESCRIPTION: This TypeScript snippet for a Next.js App Route Handler (`app/api/redirects/route.ts`) receives a 'pathname' query parameter, looks it up in a local 'redirects.json' file, and returns the corresponding redirect entry as JSON. It handles cases where the pathname is missing or not found in the JSON file (accounting for Bloom filter false positives), returning a 400 status.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-building-your-application/01-routing/07-redirecting.mdx#_snippet_13

LANGUAGE: ts
CODE:
```
import { NextRequest, NextResponse } from 'next/server'
import redirects from '@/app/redirects/redirects.json'

type RedirectEntry = {
  destination: string
  permanent: boolean
}

export function GET(request: NextRequest) {
  const pathname = request.nextUrl.searchParams.get('pathname')
  if (!pathname) {
    return new Response('Bad Request', { status: 400 })
  }実は、これです。

  // Get the redirect entry from the redirects.json file
  const redirect = (redirects as Record<string, RedirectEntry>)[pathname]

  // Account for bloom filter false positives
  if (!redirect) {
    return new Response('No redirect', { status: 400 })
  }

  // Return the redirect entry
  return NextResponse.json(redirect)
}
```

----------------------------------------

TITLE: Output HTML for apple-icon.* - HTML
DESCRIPTION: Shows the HTML <link> tag with rel="apple-touch-icon" generated for an apple-icon file (e.g., .png). This tag is used specifically for touch devices like iPhones and iPads.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/03-file-conventions/01-metadata/app-icons.mdx#_snippet_2

LANGUAGE: html
CODE:
```
<link
  rel="apple-touch-icon"
  href="/apple-icon?<generated>"
  type="image/<generated>"
  sizes="<generated>"
/>
```

----------------------------------------

TITLE: Using next/image fill prop to Fill Container (JSX)
DESCRIPTION: This example shows how to make an image fill its parent container using the `next/image` component with the `fill` prop. The parent element is styled with `position: 'relative'`, and `objectFit: 'cover'` is used to control how the image scales within the container, ensuring no layout shift.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-building-your-application/06-optimizing/01-images.mdx#_snippet_9

LANGUAGE: JSX
CODE:
```
import Image from 'next/image'
import mountains from '../public/mountains.jpg'

export default function Fill() {
  return (
    <div
      style={{
        display: 'grid',
        gridGap: '8px',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, auto))',
      }}
    >
      <div style={{ position: 'relative', height: '400px' }}>
        <Image
          alt="Mountains"
          src={mountains}
          fill
          sizes="(min-width: 808px) 50vw, 100vw"
          style={{
            objectFit: 'cover', // cover, contain, none
          }}
        />
      </div>
      {/* And more images in the grid... */}
    </div>
  )
}
```

----------------------------------------

TITLE: Integrating Session Deletion into Server Action (TypeScript)
DESCRIPTION: This snippet shows a Next.js Server Action `logout` that handles user logout. It calls the `deleteSession` function to remove the session cookie and then uses the `redirect` API to navigate the user to the login page.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/authentication.mdx#_snippet_15

LANGUAGE: ts
CODE:
```
import { cookies } from 'next/headers';
import { deleteSession } from '@/app/lib/session';

export async function logout() {
  await deleteSession();
  redirect('/login');
}
```

----------------------------------------

TITLE: Using the Link Component Next.js TSX
DESCRIPTION: Demonstrates the basic usage of the built-in Next.js <Link> component in a TypeScript React Server Component. It shows how to import the component from 'next/link' and use it to create a link that navigates to the '/dashboard' route.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-building-your-application/01-routing/04-linking-and-navigating.mdx#_snippet_0

LANGUAGE: tsx
CODE:
```
import Link from 'next/link'

export default function Page() {
  return <Link href="/dashboard">Dashboard</Link>
}
```

----------------------------------------

TITLE: Initializing Google Analytics in App Router (TSX)
DESCRIPTION: This code snippet shows how to integrate Google Analytics into a Next.js application using the App Router and TypeScript. It uses the `GoogleAnalytics` component from `@next/third-parties/google` and includes it within the root layout component. The Google Analytics measurement ID is passed via the `gaId` prop.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/third-party-libraries.mdx#_snippet_8

LANGUAGE: tsx
CODE:
```
import { GoogleAnalytics } from '@next/third-parties/google'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
      <GoogleAnalytics gaId="G-XYZ" />
    </html>
  )
}
```

----------------------------------------

TITLE: Importing Server Functions in Client Components with JavaScript
DESCRIPTION: Demonstrates importing and using Server Functions in a Client Component with JavaScript. The Server Function is imported from a separate file and used as a form action.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/01-getting-started/07-updating-data.mdx#2025-04-21_snippet_7

LANGUAGE: javascript
CODE:
```
'use client'

import { createPost } from '@/app/actions'

export function Button() {
  return <button formAction={createPost}>Create</button>
}
```

----------------------------------------

TITLE: Static Metadata Definition in JavaScript
DESCRIPTION: This example demonstrates how to define static metadata using a `Metadata` object in a JavaScript `layout.js` or `page.js` file. It exports a `metadata` constant with `title` and `description` properties.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/01-getting-started/10-metadata-and-og-images.mdx#_snippet_2

LANGUAGE: JavaScript
CODE:
```
export const metadata = {
  title: 'My Blog',
  description: '...',
}

export default function Page() {}
```

----------------------------------------

TITLE: Updating Search Parameters in Next.js Client Components (JavaScript)
DESCRIPTION: A JavaScript client component that demonstrates how to update URL search parameters using both the useRouter hook and Link component. It includes a utility function to merge existing search parameters with new ones, working with the same functionality as the TypeScript version but without type annotations.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/04-functions/use-search-params.mdx#2025-04-21_snippet_7

LANGUAGE: jsx
CODE:
```
'use client'

export default function ExampleClientComponent() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Get a new searchParams string by merging the current
  // searchParams with a provided key/value pair
  const createQueryString = useCallback(
    (name, value) => {
      const params = new URLSearchParams(searchParams)
      params.set(name, value)

      return params.toString()
    },
    [searchParams]
  )

  return (
    <>
      <p>Sort By</p>

      {/* using useRouter */}
      <button
        onClick={() => {
          // <pathname>?sort=asc
          router.push(pathname + '?' + createQueryString('sort', 'asc'))
        }}
      >
        ASC
      </button>

      {/* using <Link> */}
      <Link
        href={
          // <pathname>?sort=desc
          pathname + '?' + createQueryString('sort', 'desc')
        }
      >
        DESC
      </Link>
    </>
  )
}
```

----------------------------------------

TITLE: Setting Request and Response Headers in Next.js Middleware
DESCRIPTION: Illustrates how to clone incoming request headers, set new headers on the request using `NextResponse.next()`, and set new headers directly on the outgoing `NextResponse`.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-building-your-application/01-routing/14-middleware.mdx#_snippet_9

LANGUAGE: typescript
CODE:
```
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Clone the request headers and set a new header `x-hello-from-middleware1`
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-hello-from-middleware1', 'hello');

  // You can also set request headers in NextResponse.next
  const response = NextResponse.next({
    request: {
      // New request headers
      headers: requestHeaders,
    },
  });

  // Set a new response header `x-hello-from-middleware2`
  response.headers.set('x-hello-from-middleware2', 'hello');
  return response;
}
```

LANGUAGE: javascript
CODE:
```
import { NextResponse } from 'next/server';

export function middleware(request) {
  // Clone the request headers and set a new header `x-hello-from-middleware1`
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-hello-from-middleware1', 'hello');

  // You can also set request headers in NextResponse.next
  const response = NextResponse.next({
    request: {
      // New request headers
      headers: requestHeaders,
    },
  });

  // Set a new response header `x-hello-from-middleware2`
  response.headers.set('x-hello-from-middleware2', 'hello');
  return response;
}
```

----------------------------------------

TITLE: Creating Cache Tags from External Data in TypeScript
DESCRIPTION: Details using fetched data to create dynamic cache tags in a TypeScript class. It demonstrates associating 'bookings-data' and data properties as cache tags.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/04-functions/cacheTag.mdx#2025-04-21_snippet_8

LANGUAGE: typescript
CODE:
```
import { unstable_cacheTag as cacheTag } from 'next/cache'

interface BookingsProps {
  type: string
}

export async function Bookings({ type = 'haircut' }: BookingsProps) {
  async function getBookingsData() {
    'use cache'
    const data = await fetch(`/api/bookings?type=${encodeURIComponent(type)}`)
    cacheTag('bookings-data', data.id)
    return data
  }
  return //...
}
```

----------------------------------------

TITLE: Deleting Session Cookie in Next.js App Router (TypeScript)
DESCRIPTION: This asynchronous function `deleteSession` removes the session cookie named 'session' using the `delete` method provided by the Next.js `cookies()` API. This is typically used during a logout process.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/authentication.mdx#_snippet_13

LANGUAGE: ts
CODE:
```
import 'server-only';
import { cookies } from 'next/headers';

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete('session');
}
```

----------------------------------------

TITLE: Role-based route protection (tsx)
DESCRIPTION: This snippet shows how to implement role-based route protection using the `forbidden` function in a Server Component. It checks if the user has the 'admin' role and calls `forbidden()` if they do not, preventing unauthorized access to the route. It assumes `verifySession` is fetching user session data, including their role.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/04-functions/forbidden.mdx#2025-04-21_snippet_4

LANGUAGE: tsx
CODE:
```
import { verifySession } from '@/app/lib/dal'
import { forbidden } from 'next/navigation'

export default async function AdminPage() {
  const session = await verifySession()

  // Check if the user has the 'admin' role
  if (session.role !== 'admin') {
    forbidden()
  }

  // Render the admin page for authorized users
  return (
    <main>
      <h1>Admin Dashboard</h1>
      <p>Welcome, {session.user.name}!</p>
    </main>
  )
}
```

----------------------------------------

TITLE: Accessing Request Headers and Cookies in Server Components (app)
DESCRIPTION: Demonstrates how to access request headers and cookies within Server Components in the `app` directory using the `headers` and `cookies` functions from `next/headers`.  The `getData` function fetches the authorization header.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/migrating/app-router-migration.mdx#_snippet_31

LANGUAGE: jsx
CODE:
```
import { cookies, headers } from 'next/headers'

async function getData() {
  const authHeader = (await headers()).get('authorization')

  return '...'
}

export default async function Page() {
  // You can use `cookies` or `headers` inside Server Components
  // directly or in your data fetching function
  const theme = (await cookies()).get('theme')
  const data = await getData()
  return '...'
}
```

----------------------------------------

TITLE: Async generateMetadata Function in Next.js
DESCRIPTION: This code snippet demonstrates how to use an asynchronous `generateMetadata` function to fetch data and generate metadata in Next.js. This is useful for scenarios where you need to retrieve data from an API or database to populate the metadata.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/04-functions/generate-metadata.mdx#_snippet_64

LANGUAGE: tsx
CODE:
```
import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Next.js',
  }
}
```

----------------------------------------

TITLE: Caching Entire Route Layout (TSX)
DESCRIPTION: Applies the `'use cache'` directive at the top of a Next.js App Router `layout.tsx` file. This marks the layout segment for prerendering and contributes to caching the entire route when combined with a cached page.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/01-directives/use-cache.mdx#_snippet_5

LANGUAGE: TSX
CODE:
```
'use cache'

export default function Layout({ children }: { children: ReactNode }) {
  return <div>{children}</div>
}
```

----------------------------------------

TITLE: Reporting Web Vitals with useReportWebVitals (Pages Router)
DESCRIPTION: This code snippet shows how to use the `useReportWebVitals` hook within the Pages Router in Next.js to report web vitals. It imports the hook and logs each metric to the console when it's available. The code is placed in `_app.js`.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/analytics.mdx#_snippet_1

LANGUAGE: jsx
CODE:
```
import { useReportWebVitals } from 'next/web-vitals'

function MyApp({ Component, pageProps }) {
  useReportWebVitals((metric) => {
    console.log(metric)
  })

  return <Component {...pageProps} />
}
```

----------------------------------------

TITLE: Type Safety for Metadata Object in Next.js
DESCRIPTION: This code snippet demonstrates how to add type safety to your metadata by using the `Metadata` type from Next.js. This helps ensure that your metadata conforms to the expected structure and prevents type-related errors.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/04-functions/generate-metadata.mdx#_snippet_62

LANGUAGE: tsx
CODE:
```
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Next.js',
}
```

----------------------------------------

TITLE: Configuring External Server Package in Next.js JS
DESCRIPTION: This snippet shows how to configure Next.js to exclude a specific package from being bundled for Server Components and Route Handlers. It uses the `serverExternalPackages` option in `next.config.js` to list packages that should be loaded via native Node.js `require`. Required dependency is Next.js.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/05-config/01-next-config-js/serverExternalPackages.mdx#_snippet_0

LANGUAGE: javascript
CODE:
```
/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['@acme/ui'],
}

module.exports = nextConfig
```

----------------------------------------

TITLE: Revalidating A Page Path
DESCRIPTION: Shows how to use `revalidatePath` with a dynamic page path and the 'page' type. This invalidates the cache for any URLs matching the specified page file pattern (e.g., `/blog/[slug]`) on the next visit, without affecting sub-pages.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/04-functions/revalidatePath.mdx#_snippet_2

LANGUAGE: typescript
CODE:
```
import { revalidatePath } from 'next/cache'
revalidatePath('/blog/[slug]', 'page')
// or with route groups
revalidatePath('/(main)/blog/[slug]', 'page')
```

----------------------------------------

TITLE: Managing Cookies in Next.js Route Handlers
DESCRIPTION: Demonstrates how to handle cookies in a Route Handler using the cookies() function from next/headers. Shows how to get, set, and delete cookies within a handler.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/03-file-conventions/route.mdx#2025-04-21_snippet_4

LANGUAGE: typescript
CODE:
```
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  const cookieStore = await cookies()

  const a = cookieStore.get('a')
  const b = cookieStore.set('b', '1')
  const c = cookieStore.delete('c')
}
```

LANGUAGE: javascript
CODE:
```
import { cookies } from 'next/headers'

export async function GET(request) {
  const cookieStore = await cookies()

  const a = cookieStore.get('a')
  const b = cookieStore.set('b', '1')
  const c = cookieStore.delete('c')
}
```

----------------------------------------

TITLE: Streaming Responses in Next.js - JavaScript
DESCRIPTION: This JavaScript snippet illustrates the handling of a streaming response with OpenAI's API, processing messages sent in a POST request and returning a stream response.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-building-your-application/01-routing/13-route-handlers.mdx#2025-04-21_snippet_9

LANGUAGE: javascript
CODE:
```
import { openai } from '@ai-sdk/openai'
import { StreamingTextResponse, streamText } from 'ai'

export async function POST(req) {
  const { messages } = await req.json()
  const result = await streamText({
    model: openai('gpt-4-turbo'),
    messages,
  })

  return new StreamingTextResponse(result.toAIStream())
}
```

----------------------------------------

TITLE: Applying CSS Variable to a Next.js Component (JSX)
DESCRIPTION: This code snippet demonstrates how to apply a CSS variable defined for a font to a Next.js component. It sets the `className` of the parent container to the font loader's `variable` value and the `className` of the text to a style defined in an external CSS file.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/02-components/font.mdx#_snippet_49

LANGUAGE: JavaScript
CODE:
```
<main className={inter.variable}>
  <p className={styles.text}>Hello World</p>
</main>
```

----------------------------------------

TITLE: Creating Cached Server-Only Data Utility with Preload (TS)
DESCRIPTION: Defines a data fetching utility (`getItem`) that utilizes React's `cache` to memoize responses and the `server-only` package to ensure it's never included in client bundles. It also exports a `preload` function that simply calls the cached `getItem` without awaiting it, supporting the early data fetching pattern.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-building-your-application/02-data-fetching/01-fetching.mdx#_snippet_11

LANGUAGE: TS
CODE:
```
import { cache } from 'react'
import 'server-only'

export const preload = (id: string) => {
  void getItem(id)
}

export const getItem = cache(async (id: string) => {
  // ...
})
```

LANGUAGE: JS
CODE:
```
import { cache } from 'react'
import 'server-only'

export const preload = (id) => {
  void getItem(id)
}

export const getItem = cache(async (id) => {
  // ...
})
```

----------------------------------------

TITLE: Importing and Using Script Component (App Router, JSX)
DESCRIPTION: This code snippet demonstrates importing the `Script` component from `next/script` and using it to load an external script in a Next.js application within the `app` directory. It showcases the basic usage of the `Script` component with the required `src` prop, using JSX syntax. The `Dashboard` function is a simple functional component that renders the script.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/02-components/script.mdx#_snippet_1

LANGUAGE: jsx
CODE:
```
import Script from 'next/script'

export default function Dashboard() {
  return (
    <>
      <Script src="https://example.com/script.js" />
    </>
  )
}
```

----------------------------------------

TITLE: Redirecting Client-Side with useRouter (App Router, TypeScript)
DESCRIPTION: Illustrates client-side navigation using the `useRouter` hook in a Next.js App Router Client Component. It shows an example of using the `router.push()` method within a button's `onClick` event handler to programmatically navigate the user to a different page (`/dashboard`) without a full page reload.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-building-your-application/01-routing/07-redirecting.mdx#_snippet_4

LANGUAGE: typescript
CODE:
```
'use client'\n\nimport { useRouter } from 'next/navigation'\n\nexport default function Page() {\n  const router = useRouter()\n\n  return (\n    <button type="button" onClick={() => router.push('/dashboard')}>\n      Dashboard\n    </button>\n  )\n}
```

----------------------------------------

TITLE: Handling Server Action Response with useActionState (TypeScript)
DESCRIPTION: Demonstrates a Next.js Server Action designed to work with the `useActionState` hook. It accepts `prevState` and `formData`, performs an asynchronous operation (simulated fetch), and returns a serializable object (error message) on failure or uses `redirect` on success.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-building-your-application/02-data-fetching/03-server-actions-and-mutations.mdx#_snippet_11

LANGUAGE: TypeScript
CODE:
```
'use server'

import { redirect } from 'next/navigation'

export async function createUser(prevState: any, formData: FormData) {
  const res = await fetch('https://...')
  const json = await res.json()

  if (!res.ok) {
    return { message: 'Please enter a valid email' }
  }

  redirect('/dashboard')
}
```

----------------------------------------

TITLE: Updating Post Server Action (Inline) - TSX/JSX
DESCRIPTION: Demonstrates using `'use server'` inline within an asynchronous function (`updatePost`) defined inside a Next.js Server Component page. This server function handles form data, saves the post, and then revalidates the page path using `revalidatePath` from `next/cache`.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/01-directives/use-server.mdx#_snippet_3

LANGUAGE: tsx
CODE:
```
import { EditPost } from './edit-post'\nimport { revalidatePath } from 'next/cache'\n\nexport default async function PostPage({ params }: { params: { id: string } }) {\n  const post = await getPost(params.id)\n\n  async function updatePost(formData: FormData) {\n    'use server'\n    await savePost(params.id, formData)\n    revalidatePath(`/posts/${params.id}`)\n  }\n\n  return <EditPost updatePostAction={updatePost} post={post} />\n}
```

LANGUAGE: jsx
CODE:
```
import { EditPost } from './edit-post'\nimport { revalidatePath } from 'next/cache'\n\nexport default async function PostPage({ params }) {\n  const post = await getPost(params.id)\n\n  async function updatePost(formData) {\n    'use server'\n    await savePost(params.id, formData)\n    revalidatePath(`/posts/${params.id}`)\n  }\n\n  return <EditPost updatePostAction={updatePost} post={post} />\n}
```

----------------------------------------

TITLE: Extending Web Request API with User Agent in Next.js using TypeScript
DESCRIPTION: This TypeScript snippet demonstrates a middleware function in Next.js that utilizes a user agent helper to determine the device type (e.g., mobile, desktop) from the request. It modifies the request URL parameters based on the device type and uses NextResponse to rewrite the URL. Dependencies include 'next/server' for accessing NextRequest, NextResponse, and the userAgent function.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/04-functions/userAgent.mdx#2025-04-21_snippet_0

LANGUAGE: TypeScript
CODE:
```
import { NextRequest, NextResponse, userAgent } from 'next/server'

export function middleware(request: NextRequest) {
  const url = request.nextUrl
  const { device } = userAgent(request)

  // device.type can be: 'mobile', 'tablet', 'console', 'smarttv',
  // 'wearable', 'embedded', or undefined (for desktop browsers)
  const viewport = device.type || 'desktop'

  url.searchParams.set('viewport', viewport)
  return NextResponse.rewrite(url)
}
```

----------------------------------------

TITLE: Accessing Session Data in Client Component via Context (JSX)
DESCRIPTION: Shows a Client Component written in JSX that utilizes a `useSession` hook from an authentication library to retrieve session details. This data is then used, for example, to perform client-side data fetching (`useSWR`) based on the authenticated user's ID.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/authentication.mdx#_snippet_40

LANGUAGE: jsx
CODE:
```
"use client";\n\nimport { useSession } from "auth-lib";\n\nexport default function Profile() {\n  const { userId } = useSession();\n  const { data } = useSWR(`/api/user/${userId}`, fetcher)\n\n  return (\n    // ...\n  );\n}
```

----------------------------------------

TITLE: Using history.pushState for Query Params Next.js JSX
DESCRIPTION: Shows using the native window.history.pushState method in a JavaScript Client Component to update URL search parameters. It uses the useSearchParams hook to get current params and constructs a new URL with updated sorting parameters ('asc' or 'desc') without triggering a full page reload.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-building-your-application/01-routing/04-linking-and-navigating.mdx#_snippet_7

LANGUAGE: jsx
CODE:
```
'use client'

import { useSearchParams } from 'next/navigation'

export default function SortProducts() {
  const searchParams = useSearchParams()

  function updateSorting(sortOrder) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('sort', sortOrder)
    window.history.pushState(null, '', `?${params.toString()}`)
  }

  return (
    <>
      <button onClick={() => updateSorting('asc')}>Sort Ascending</button>
      <button onClick={() => updateSorting('desc')}>Sort Descending</button>
    </>
  )
}
```

----------------------------------------

TITLE: Setting a default title in Next.js with TypeScript
DESCRIPTION: This code snippet shows how to set a default title using `title.default` in a Next.js application with TypeScript. This default title will be used for child route segments that do not define their own title.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/04-functions/generate-metadata.mdx#_snippet_5

LANGUAGE: tsx
CODE:
```
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    default: 'Acme',
  },
}
```

----------------------------------------

TITLE: Type-Safe API Routes with TypeScript
DESCRIPTION: Demonstrates how to add TypeScript type safety to API routes using NextApiRequest and NextApiResponse types, including response data typing.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/02-pages/03-building-your-application/01-routing/07-api-routes.mdx#2025-04-23_snippet_7

LANGUAGE: typescript
CODE:
```
import type { NextApiRequest, NextApiResponse } from 'next'

type ResponseData = {
  message: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  res.status(200).json({ message: 'Hello from Next.js!' })
}
```

----------------------------------------

TITLE: Wrapping Root Layout with Context Provider (TSX)
DESCRIPTION: Illustrates wrapping the root layout of a Next.js App Router application with a React context provider (`ContextProvider`). This pattern allows child Client Components access to the context data, but Server Components rendered before the client side will not have access to this context.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/authentication.mdx#_snippet_38

LANGUAGE: tsx
CODE:
```
import { ContextProvider } from 'auth-lib'\n\nexport default function RootLayout({ children }) {\n  return (\n    <html lang="en">\n      <body>\n        <ContextProvider>{children}</ContextProvider>\n      </body>\n    </html>\n  )\n}
```

----------------------------------------

TITLE: Defining Data Preloading Pattern in React Component (TSX)
DESCRIPTION: Defines a `preload` utility function alongside a main async React component. The `preload` function eagerly initiates data fetching (`getItem`) using `void` to prevent waiting for the promise, while the component awaits the same data during rendering. This allows the data to start fetching before the component fully renders.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-building-your-application/02-data-fetching/01-fetching.mdx#_snippet_9

LANGUAGE: TSX
CODE:
```
import { getItem } from '@/utils/get-item'

export const preload = (id: string) => {
  // void evaluates the given expression and returns undefined
  // https://developer.mozilla.org/docs/Web/JavaScript/Reference/Operators/void
  void getItem(id)
}
export default async function Item({ id }: { id: string }) {
  const result = await getItem(id)
  // ...
}
```

LANGUAGE: JSX
CODE:
```
import { getItem } from '@/utils/get-item'

export const preload = (id) => {
  // void evaluates the given expression and returns undefined
  // https://developer.mozilla.org/docs/Web/JavaScript/Reference/Operators/void
  void getItem(id)
}
export default async function Item({ id }) {
  const result = await getItem(id)
  // ...
}
```

----------------------------------------

TITLE: Configuring Next.js Rewrites to External URLs (JavaScript)
DESCRIPTION: This snippet demonstrates how to configure Next.js rewrites to direct incoming requests to external URLs. This is useful for incrementally migrating an application to Next.js by proxying certain paths to an existing website. Parameters captured in the 'source' path (e.g., ':slug') can be used in the external 'destination' URL.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/05-config/01-next-config-js/rewrites.mdx#_snippet_10

LANGUAGE: JavaScript
CODE:
```
module.exports = {
  async rewrites() {
    return [
      {
        source: '/blog',
        destination: 'https://example.com/blog',
      },
      {
        source: '/blog/:slug',
        destination: 'https://example.com/blog/:slug', // Matched parameters can be used in the destination
      },
    ]
  },
}
```

----------------------------------------

TITLE: Example Usage of unstable_cache in Next.js TSX Page Component
DESCRIPTION: This snippet provides a full example of using unstable_cache within a Next.js TSX App Router page component. It defines a cached function that returns user data, using the userId from the page parameters as part of the cache key, and includes options for tags and revalidation.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/04-functions/unstable_cache.mdx#_snippet_2

LANGUAGE: tsx
CODE:
```
import { unstable_cache } from 'next/cache'

export default async function Page({
  params,
}: {
  params: Promise<{ userId: string }>
}) {
  const { userId } = await params
  const getCachedUser = unstable_cache(
    async () => {
      return { id: userId }
    },
    [userId], // add the user ID to the cache key
    {
      tags: ['users'],
      revalidate: 60,
    }
  )

  //...
}
```

----------------------------------------

TITLE: Dashboard Layout Component (JSX)
DESCRIPTION: Defines a dashboard layout component in JavaScript using Next.js. It accepts a `children` prop, which is rendered within a `<section>` element. This layout can be used to wrap dashboard-specific content.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/03-file-conventions/layout.mdx#_snippet_1

LANGUAGE: jsx
CODE:
```
export default function DashboardLayout({ children }) {
  return <section>{children}</section>
}
```

----------------------------------------

TITLE: Handling Custom Component Children with Next.js Link
DESCRIPTION: These snippets show how to use a custom component, like one created with styled-components, as the child of `Link`. It requires adding the `passHref` prop to ensure the `href` attribute is passed to the underlying `<a>` tag and `legacyBehavior` for compatibility with older Link behavior.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/02-components/link.mdx#_snippet_13

LANGUAGE: TSX
CODE:
```
import Link from 'next/link'
import styled from 'styled-components'

// This creates a custom component that wraps an <a> tag
const RedLink = styled.a`
  color: red;
`

function NavLink({ href, name }) {
  return (
    <Link href={href} passHref legacyBehavior>
      <RedLink>{name}</RedLink>
    </Link>
  )
}

export default NavLink
```

LANGUAGE: JSX
CODE:
```
import Link from 'next/link'
import styled from 'styled-components'

// This creates a custom component that wraps an <a> tag
const RedLink = styled.a`
  color: red;
`

function NavLink({ href, name }) {
  return (
    <Link href={href} passHref legacyBehavior>
      <RedLink>{name}</RedLink>
    </Link>
  )
}

export default NavLink
```

----------------------------------------

TITLE: Creating a Server Component with Data Fetching (TypeScript)
DESCRIPTION: This code snippet demonstrates how to create a Server Component in Next.js using TypeScript. It imports a Client Component, fetches data using the fetch API, and passes the fetched data as props to the Client Component.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/migrating/app-router-migration.mdx#_snippet_20

LANGUAGE: tsx
CODE:
```
// Import your Client Component
import HomePage from './home-page'

async function getPosts() {
  const res = await fetch('https://...')
  const posts = await res.json()
  return posts
}

export default async function Page() {
  // Fetch data directly in a Server Component
  const recentPosts = await getPosts()
  // Forward fetched data to your Client Component
  return <HomePage recentPosts={recentPosts} />
}
```

----------------------------------------

TITLE: Handling Client-Side Navigation with onNavigate (App Router)
DESCRIPTION: This snippet shows how to use the `onNavigate` prop on a Next.js Link component in the App Router. This event handler is triggered only during client-side SPA navigation and receives an event object with a `preventDefault()` method, allowing custom logic or cancellation of the navigation.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/02-components/link.mdx#_snippet_8

LANGUAGE: TypeScript
CODE:
```
import Link from 'next/link'

export default function Page() {
  return (
    <Link
      href="/dashboard"
      onNavigate={(e) => {
        // Only executes during SPA navigation
        console.log('Navigating...')

        // Optionally prevent navigation
        // e.preventDefault()
      }}
    >
      Dashboard
    </Link>
  )
}
```

LANGUAGE: JavaScript
CODE:
```
import Link from 'next/link'

export default function Page() {
  return (
    <Link
      href="/dashboard"
      onNavigate={(e) => {
        // Only executes during SPA navigation
        console.log('Navigating...')

        // Optionally prevent navigation
        // e.preventDefault()
      }}
    >
      Dashboard
    </Link>
  )
}
```

----------------------------------------

TITLE: Fetching Redirect Data in Next.js Pages API Route (JavaScript)
DESCRIPTION: This JavaScript snippet for a Next.js Pages API Route (`pages/api/redirects.js`) handles GET requests, extracts the 'pathname' from the query string, and looks it up in a local 'redirects.json' file. It returns the redirect entry as JSON if found or a 400 status if the pathname is missing or not found in the file (accounting for Bloom filter false positives).
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-building-your-application/01-routing/07-redirecting.mdx#_snippet_16

LANGUAGE: js
CODE:
```
import redirects from '@/app/redirects/redirects.json'

export default function handler(req, res) {
  const pathname = req.query.pathname
  if (!pathname) {
    return res.status(400).json({ message: 'Bad Request' })
  }

  // Get the redirect entry from the redirects.json file
  const redirect = redirects[pathname]

  // Account for bloom filter false positives
  if (!redirect) {
    return res.status(400).json({ message: 'No redirect' })
  }

  // Return the redirect entry
  return res.json(redirect)
}
```

----------------------------------------

TITLE: Using Loaded Env Vars in Config File (next/env, Next.js)
DESCRIPTION: After loading environment variables using `@next/env`, you can import the configuration file and access variables via `process.env` in external config files like ORM configurations.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/environment-variables.mdx#_snippet_6

LANGUAGE: typescript
CODE:
```
import './envConfig.ts'

export default defineConfig({
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
})
```

LANGUAGE: javascript
CODE:
```
import './envConfig.js'

export default defineConfig({
  dbCredentials: {
    connectionString: process.env.DATABASE_URL,
  },
})
```

----------------------------------------

TITLE: Implementing ISR Dynamic Route Pages Router TSX
DESCRIPTION: Implements ISR for a dynamic route using Next.js Pages Router. It defines `getStaticPaths` to determine which paths to pre-render at build time and `getStaticProps` to fetch data for each path and set the `revalidate` option for time-based cache invalidation (60 seconds). The `Page` component receives the fetched post data as props.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-building-your-application/02-data-fetching/04-incremental-static-regeneration.mdx#_snippet_2

LANGUAGE: tsx
CODE:
```
import type { GetStaticPaths, GetStaticProps } from 'next'

interface Post {
  id: string
  title: string
  content: string
}

interface Props {
  post: Post
}

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await fetch('https://api.vercel.app/blog').then((res) =>
    res.json()
  )
  const paths = posts.map((post: Post) => ({
    params: { id: String(post.id) },
  }))

  // We'll prerender only these paths at build time.
  // { fallback: 'blocking' } will server-render pages
  // on-demand if the path doesn't exist.
  return { paths, fallback: false }
}

export const getStaticProps: GetStaticProps<Props> = async ({
  params,
}: {
  params: { id: string }
}) => {
  const post = await fetch(`https://api.vercel.app/blog/${params.id}`).then(
    (res) => res.json()
  )

  return {
    props: { post },
    // Next.js will invalidate the cache when a
    // request comes in, at most once every 60 seconds.
    revalidate: 60,
  }
}

export default function Page({ post }: Props) {
  return (
    <main>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </main>
  )
}
```

----------------------------------------

TITLE: Revalidating Cache After Server Function Updates with JavaScript
DESCRIPTION: Demonstrates revalidating the Next.js cache after data updates in a JavaScript Server Function. Uses revalidatePath to refresh cached data on the posts path.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/01-getting-started/07-updating-data.mdx#2025-04-21_snippet_17

LANGUAGE: javascript
CODE:
```
import { revalidatePath } from 'next/cache'

export async function createPost(formData) {
  'use server'
  // Update data
  // ...
  revalidatePath('/posts')
}
```

----------------------------------------

TITLE: Wrapping Dynamic Component in Suspense for PPR (JSX)
DESCRIPTION: Demonstrates wrapping the dynamic `User` component with `React.Suspense` within a PPR-enabled page (`experimental_ppr = true`). This allows the static parts of the page to be prerendered while the dynamic `User` component's content is streamed later, showing a `AvatarSkeleton` fallback initially.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-building-your-application/03-rendering/04-partial-prerendering.mdx#_snippet_8

LANGUAGE: JSX
CODE:
```
import { Suspense } from 'react'
import { User, AvatarSkeleton } from './user'

export const experimental_ppr = true

export default function Page() {
  return (
    <section>
      <h1>This will be prerendered</h1>
      <Suspense fallback={<AvatarSkeleton />}>
        <User />
      </Suspense>
    </section>
  )
}
```

----------------------------------------

TITLE: Server-Side Post Creation and Redirection in Next.js TypeScript
DESCRIPTION: This TypeScript code describes how to handle post creation on the server side using Next.js. The 'createPost' function processes the form data and uses 'redirect' to navigate to the new post immediately after creation.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/02-components/form.mdx#2025-04-21_snippet_16

LANGUAGE: TypeScript
CODE:
```
'use server'
import { redirect } from 'next/navigation'

export async function createPost(formData: FormData) {
  // Create a new post
  // ...

  // Redirect to the new post
  redirect(`/posts/${data.id}`)
}
```

----------------------------------------

TITLE: Disabling Draft Mode in Next.js Route Handler (TypeScript)
DESCRIPTION: This code snippet shows how to disable Draft Mode in a Next.js Route Handler using TypeScript. It imports `draftMode` from `next/headers`, calls `draft.disable()` to disable Draft Mode, and returns a response indicating that Draft Mode is disabled. It requires the `next` package.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/04-functions/draft-mode.mdx#_snippet_4

LANGUAGE: typescript
CODE:
```
import { draftMode } from 'next/headers'

export async function GET(request: Request) {
  const draft = await draftMode()
  draft.disable()
  return new Response('Draft mode is disabled')
}
```

----------------------------------------

TITLE: Incremental Static Regeneration with fetch in app
DESCRIPTION: This code snippet shows how to use `fetch` with the `revalidate` option in the `app` directory to cache a request for a specified duration. It fetches posts from an API within a server component.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/migrating/app-router-migration.mdx#_snippet_39

LANGUAGE: jsx
CODE:
```
async function getPosts() {
  const res = await fetch(`https://.../posts`, { next: { revalidate: 60 } })
  const data = await res.json()

  return data.posts
}

export default async function PostList() {
  const posts = await getPosts()

  return posts.map((post) => <div>{post.name}</div>)
}
```

----------------------------------------

TITLE: Defining a GET Route Handler in Next.js
DESCRIPTION: Basic example of creating a GET route handler in TypeScript and JavaScript. This demonstrates the minimal setup required for handling GET requests in a Next.js app.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-building-your-application/01-routing/13-route-handlers.mdx#2025-04-21_snippet_0

LANGUAGE: typescript
CODE:
```
export async function GET(request: Request) {}
```

LANGUAGE: javascript
CODE:
```
export async function GET(request) {}
```

----------------------------------------

TITLE: Handling Dynamic Route Parameters in Next.js Route Handlers
DESCRIPTION: Shows how to access dynamic route parameters in a Route Handler using the context.params object. The example demonstrates how to extract the 'team' parameter from a dynamic route.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/03-file-conventions/route.mdx#2025-04-21_snippet_3

LANGUAGE: typescript
CODE:
```
export async function GET(
  request: Request,
  { params }: { params: Promise<{ team: string }> }
) {
  const { team } = await params
}
```

LANGUAGE: javascript
CODE:
```
export async function GET(request, { params }) {
  const { team } = await params
}
```

----------------------------------------

TITLE: Accessing Environment Variable - JavaScript
DESCRIPTION: Demonstrates how to access the value of an environment variable named `SESSION_SECRET` within a JavaScript file using the standard `process.env` object. This is a common pattern for retrieving configuration values, such as sensitive keys, during application runtime.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/authentication.mdx#_snippet_4

LANGUAGE: JavaScript
CODE:
```
const secretKey = process.env.SESSION_SECRET
```

----------------------------------------

TITLE: Advanced URL Redirection in NextResponse - TypeScript
DESCRIPTION: Demonstrates how to build a redirect URL from an incoming request, appending query parameters based on request context.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/04-functions/next-response.mdx#2025-04-21_snippet_7

LANGUAGE: typescript
CODE:
```
import { NextResponse } from 'next/server'

// Given an incoming request...
const loginUrl = new URL('/login', request.url)
// Add ?from=/incoming-url to the /login URL
loginUrl.searchParams.set('from', request.nextUrl.pathname)
// And redirect to the new URL
return NextResponse.redirect(loginUrl)
```

----------------------------------------

TITLE: Updating Session Cookie Expiration in Next.js App Router (TypeScript)
DESCRIPTION: This asynchronous function `updateSession` retrieves the session cookie, decrypts its payload, and if valid, resets the cookie's expiration time to 7 days from the current moment using the Next.js `cookies()` API. This is useful for extending a user's login session.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/authentication.mdx#_snippet_11

LANGUAGE: ts
CODE:
```
import 'server-only';
import { cookies } from 'next/headers';
import { decrypt } from '@/app/lib/session';

export async function updateSession() {
  const session = (await cookies()).get('session')?.value;
  const payload = await decrypt(session);

  if (!session || !payload) {
    return null;
  }

  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const cookieStore = await cookies();
  cookieStore.set('session', session, {
    httpOnly: true,
    secure: true,
    expires: expires,
    sameSite: 'lax',
    path: '/',
  });
}
```

----------------------------------------

TITLE: preconnect usage with ReactDOM in Next.js
DESCRIPTION: This code demonstrates how to use ReactDOM.preconnect to preemptively initiate a connection to an origin in a Next.js application. It accepts a URL and optional crossOrigin settings.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/04-functions/generate-metadata.mdx#_snippet_72

LANGUAGE: tsx
CODE:
```
ReactDOM.preconnect(href: string, options?: { crossOrigin?: string })
```

----------------------------------------

TITLE: Using next/link with replace Prop
DESCRIPTION: Shows how to use the boolean `replace` prop to modify browser history behavior. When `replace` is set to `true`, navigating via the link replaces the current entry in the history stack instead of adding a new one.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/02-components/link.mdx#_snippet_2

LANGUAGE: TypeScript
CODE:
```
import Link from 'next/link'

export default function Page() {
  return (
    <Link href="/dashboard" replace>
      Dashboard
    </Link>
  )
}
```

LANGUAGE: JavaScript
CODE:
```
import Link from 'next/link'

export default function Page() {
  return (
    <Link href="/dashboard" replace>
      Dashboard
    </Link>
  )
}
```

LANGUAGE: TypeScript
CODE:
```
import Link from 'next/link'

export default function Home() {
  return (
    <Link href="/dashboard" replace>
      Dashboard
    </Link>
  )
}
```

LANGUAGE: JavaScript
CODE:
```
import Link from 'next/link'

export default function Home() {
  return (
    <Link href="/dashboard" replace>
      Dashboard
    </Link>
  )
}
```

----------------------------------------

TITLE: Navigating to a Predefined Route with useRouter (JSX)
DESCRIPTION: This snippet showcases how to use the router.push method to navigate to a predefined route, in this case, '/about'. It imports the useRouter hook, accesses the router object, and calls router.push within an onClick handler to initiate the navigation.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/02-pages/04-api-reference/03-functions/use-router.mdx#_snippet_1

LANGUAGE: jsx
CODE:
```
import { useRouter } from 'next/router'

export default function Page() {
  const router = useRouter()

  return (
    <button type="button" onClick={() => router.push('/about')}>
      Click me
    </button>
  )
}
```

----------------------------------------

TITLE: Initializing Inter font in _app.js (Pages Router)
DESCRIPTION: This code snippet demonstrates how to import and initialize the Inter font from `next/font/google` within the `pages/_app.js` file for the Next.js Pages Router. It configures the font with a latin subset and applies the font's class name to the `main` element.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/02-components/font.mdx#_snippet_2

LANGUAGE: jsx
CODE:
```
import { Inter } from 'next/font/google'

// If loading a variable font, you don't need to specify the font weight
const inter = Inter({ subsets: ['latin'] })

export default function MyApp({ Component, pageProps }) {
  return (
    <main className={inter.className}>
      <Component {...pageProps} />
    </main>
  )
}
```

----------------------------------------

TITLE: Reading Cookies in Next.js API Route (TypeScript)
DESCRIPTION: This code snippet demonstrates how to read cookies within a Next.js API route using TypeScript. It imports necessary types from 'next', defines an asynchronous handler function, accesses the 'authorization' cookie from the request's cookies object, and uses it. The handler function takes a NextApiRequest and NextApiResponse as arguments.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/02-pages/03-building-your-application/03-data-fetching/03-forms-and-mutations.mdx#_snippet_14

LANGUAGE: typescript
CODE:
```
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const auth = req.cookies.authorization
  // ...
}
```

----------------------------------------

TITLE: Running Dev Server
DESCRIPTION: This code snippet shows the command to run the Next.js development server, usually using npm. This command initiates the build and serves the Next.js application for local development. Requires Node.js environment with npm installed.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/scripts.mdx#_snippet_6

LANGUAGE: Terminal
CODE:
```
npm run dev
```

----------------------------------------

TITLE: Using Next.js Image Component
DESCRIPTION: Example of implementing the Next.js Image component for optimized image loading. The component includes essential properties like src, alt, width, and height for proper image rendering.
SOURCE: https://github.com/vercel/next.js/blob/canary/errors/no-img-element.mdx#2025-04-23_snippet_0

LANGUAGE: jsx
CODE:
```
import Image from 'next/image'

function Home() {
  return (
    <Image
      src="https://example.com/hero.jpg"
      alt="Landscape picture"
      width={800}
      height={500}
    />
  )
}

export default Home
```

----------------------------------------

TITLE: Using Server Functions with Forms in React Components (JavaScript)
DESCRIPTION: Demonstrates using a Server Function with an HTML form in JavaScript. The form passes all input values as FormData to the Server Function when the form is submitted.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/01-getting-started/07-updating-data.mdx#2025-04-21_snippet_9

LANGUAGE: javascript
CODE:
```
import { createPost } from '@/app/actions'

export function Form() {
  return (
    <form action={createPost}>
      <input type="text" name="title" />
      <input type="text" name="content" />
      <button type="submit">Create</button>
    </form>
  )
}
```

----------------------------------------

TITLE: Configuring Next.js Rewrites with Has/Missing Conditions (JavaScript)
DESCRIPTION: This snippet demonstrates how to define rewrite rules in next.config.js that are conditionally applied based on the presence or absence of specific headers, cookies, host, or query parameters using the 'has' and 'missing' fields. Each object in the 'has' or 'missing' array specifies the type ('header', 'cookie', 'host', 'query'), the 'key' to check, and an optional 'value' (which can be a regex for capture groups). All conditions in 'has' must match, and none in 'missing' must match for the rewrite to apply.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/05-config/01-next-config-js/rewrites.mdx#_snippet_9

LANGUAGE: JavaScript
CODE:
```
module.exports = {
  async rewrites() {
    return [
      // if the header `x-rewrite-me` is present,
      // this rewrite will be applied
      {
        source: '/:path*',
        has: [
          {
            type: 'header',
            key: 'x-rewrite-me',
          },
        ],
        destination: '/another-page',
      },
      // if the header `x-rewrite-me` is not present,
      // this rewrite will be applied
      {
        source: '/:path*',
        missing: [
          {
            type: 'header',
            key: 'x-rewrite-me',
          },
        ],
        destination: '/another-page',
      },
      // if the source, query, and cookie are matched,
      // this rewrite will be applied
      {
        source: '/specific/:path*',
        has: [
          {
            type: 'query',
            key: 'page',
            // the page value will not be available in the
            // destination since value is provided and doesn't
            // use a named capture group e.g. (?<page>home)
            value: 'home',
          },
          {
            type: 'cookie',
            key: 'authorized',
            value: 'true',
          },
        ],
        destination: '/:path*/home',
      },
      // if the header `x-authorized` is present and
      // contains a matching value, this rewrite will be applied
      {
        source: '/:path*',
        has: [
          {
            type: 'header',
            key: 'x-authorized',
            value: '(?<authorized>yes|true)',
          },
        ],
        destination: '/home?authorized=:authorized',
      },
      // if the host is `example.com`,
      // this rewrite will be applied
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'example.com',
          },\n        ],
        destination: '/another-page',
      },
    ]
  },
}
```

----------------------------------------

TITLE: Implementing Server Actions for Push Notifications - JavaScript
DESCRIPTION: This code defines server actions for subscribing and unsubscribing users, and sending push notifications using the web-push library. It uses environment variables for VAPID keys. In a production environment, the subscription data should be stored in a database.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/progressive-web-apps.mdx#_snippet_9

LANGUAGE: jsx
CODE:
```
'use server';

import webpush from 'web-push';

webpush.setVapidDetails(
  '<mailto:your-email@example.com>',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

let subscription= null;

export async function subscribeUser(sub) {
  subscription = sub;
  // In a production environment, you would want to store the subscription in a database
  // For example: await db.subscriptions.create({ data: sub })
  return { success: true };
}

export async function unsubscribeUser() {
  subscription = null;
  // In a production environment, you would want to remove the subscription from the database
  // For example: await db.subscriptions.delete({ where: { ... } })
  return { success: true };
}

export async function sendNotification(message) {
  if (!subscription) {
    throw new Error('No subscription available');
  }

  try {
    await webpush.sendNotification(
      subscription,
      JSON.stringify({
        title: 'Test Notification',
        body: message,
        icon: '/icon.png',
      })
    );
    return { success: true };
  } catch (error) {
    console.error('Error sending push notification:', error);
    return { success: false, error: 'Failed to send notification' };
  }
}

```

----------------------------------------

TITLE: Basic Form Component Usage in TypeScript React
DESCRIPTION: Demonstrates how to use the Next.js Form component to create a simple search form that appends the query parameter to the URL on submission. This example shows the TypeScript implementation in app directory structure.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/02-components/form.mdx#2025-04-21_snippet_0

LANGUAGE: tsx
CODE:
```
import Form from 'next/form'

export default function Page() {
  return (
    <Form action="/search">
      {/* On submission, the input value will be appended to
          the URL, e.g. /search?query=abc */}
      <input name="query" />
      <button type="submit">Submit</button>
    </Form>
  )
}
```

----------------------------------------

TITLE: Memoizing Data Fetching with React Cache in TypeScript
DESCRIPTION: This code snippet demonstrates how to use React's `cache` function to memoize a data fetching function, ensuring that the data is only fetched once even when the function is called multiple times. It imports `cache` from 'react' and a database query function from '@/app/lib/db'. The `getPost` function is memoized using `cache` and fetches a post from the database based on the provided slug.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/01-getting-started/10-metadata-and-og-images.mdx#_snippet_5

LANGUAGE: typescript
CODE:
```
import { cache } from 'react'
import { db } from '@/app/lib/db'

// getPost will be used twice, but execute only once
export const getPost = cache(async (slug: string) => {
  const res = await db.query.posts.findFirst({ where: eq(posts.slug, slug) })
  return res
})
```

----------------------------------------

TITLE: Using Third-Party Components in Client Components
DESCRIPTION: Example showing how to properly use third-party components that rely on client-side features within a Client Component marked with the 'use client' directive.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-building-your-application/03-rendering/03-composition-patterns.mdx#2025-04-21_snippet_3

LANGUAGE: typescript
CODE:
```
'use client'

import { useState } from 'react'
import { Carousel } from 'acme-carousel'

export default function Gallery() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div>
      <button onClick={() => setIsOpen(true)}>View pictures</button>

      {/* Works, since Carousel is used within a Client Component */}
      {isOpen && <Carousel />}
    </div>
  )
}
```

LANGUAGE: javascript
CODE:
```
'use client'

import { useState } from 'react'
import { Carousel } from 'acme-carousel'

export default function Gallery() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div>
      <button onClick={() => setIsOpen(true)}>View pictures</button>

      {/*  Works, since Carousel is used within a Client Component */}
      {isOpen && <Carousel />}
    </div>
  )
}
```

----------------------------------------

TITLE: Getting Cookies - TSX
DESCRIPTION: This snippet demonstrates how to read a specific cookie in a Next.js page component using the `cookies` function. The cookie is retrieved asynchronously, showing the current theme from the cookie store.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/04-functions/cookies.mdx#2025-04-21_snippet_0

LANGUAGE: tsx
CODE:
```
import { cookies } from 'next/headers'

export default async function Page() {
  const cookieStore = await cookies()
  const theme = cookieStore.get('theme')
  return '...'
}
```

----------------------------------------

TITLE: Creating Post with Server Action in Next.js TypeScript
DESCRIPTION: This TypeScript snippet demonstrates the creation of a post using a server action in a Next.js application. It uses the 'createPost' function, invoked during form submission as the action, to perform server-side operations.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/02-components/form.mdx#2025-04-21_snippet_14

LANGUAGE: TypeScript
CODE:
```
import Form from 'next/form'
import { createPost } from '@/posts/actions'

export default function Page() {
  return (
    <Form action={createPost}>
      <input name="title" />
      {/* ... */}
      <button type="submit">Create Post</button>
    </Form>
  )
}
```

----------------------------------------

TITLE: Applying CSS Variable to a Next.js Component (TSX)
DESCRIPTION: This code snippet demonstrates how to apply a CSS variable defined for a font to a Next.js component. It sets the `className` of the parent container to the font loader's `variable` value and the `className` of the text to a style defined in an external CSS file.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/02-components/font.mdx#_snippet_48

LANGUAGE: TypeScript
CODE:
```
<main className={inter.variable}>
  <p className={styles.text}>Hello World</p>
</main>
```

----------------------------------------

TITLE: Getting all Cookies with NextRequest
DESCRIPTION: This snippet demonstrates how to retrieve all cookies or cookies with a specific name using the `getAll` method of the `request.cookies` object in Next.js. It shows examples of retrieving all cookies with the name 'experiments' and all cookies without specifying a name.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/04-functions/next-request.mdx#2025-04-21_snippet_2

LANGUAGE: typescript
CODE:
```
// Given incoming request /home
// [
//   { name: 'experiments', value: 'new-pricing-page', Path: '/home' },
//   { name: 'experiments', value: 'winter-launch', Path: '/home' },
// ]
request.cookies.getAll('experiments')
// Alternatively, get all cookies for the request
request.cookies.getAll()
```

----------------------------------------

TITLE: Creating a Service Worker for Push Notifications
DESCRIPTION: This JavaScript code defines a service worker that listens for 'push' events and displays a notification. It also listens for 'notificationclick' events and opens a new window.  The URL in `clients.openWindow` should be replaced with your application's URL.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/progressive-web-apps.mdx#_snippet_13

LANGUAGE: js
CODE:
```
self.addEventListener('push', function (event) {
  if (event.data) {
    const data = event.data.json()
    const options = {
      body: data.body,
      icon: data.icon || '/icon.png',
      badge: '/badge.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: '2',
      },
    }
    event.waitUntil(self.registration.showNotification(data.title, options))
  }
})

self.addEventListener('notificationclick', function (event) {
  console.log('Notification click received.')
  event.notification.close()
  event.waitUntil(clients.openWindow('<https://your-website.com>'))
})

```

----------------------------------------

TITLE: Rewriting URL in NextResponse - TypeScript
DESCRIPTION: Proxies a request to a new URL while keeping the original URL displayed in the browser. Useful for handling internal redirections.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/04-functions/next-response.mdx#2025-04-21_snippet_8

LANGUAGE: typescript
CODE:
```
import { NextResponse } from 'next/server'

// Incoming request: /about, browser shows /about
// Rewritten request: /proxy, browser shows /about
return NextResponse.rewrite(new URL('/proxy', request.url))
```

----------------------------------------

TITLE: Fetch User Data in DAL (Next.js/React Cache) - JSX
DESCRIPTION: This function fetches specific columns (id, name, email) for the authenticated user from the database after verifying the session using `verifySession()`. It returns the user object or null if the session is invalid or an error occurs. It also uses React's `cache` API.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/authentication.mdx#_snippet_25

LANGUAGE: JSX
CODE:
```
export const getUser = cache(async () => {
  const session = await verifySession()
  if (!session) return null

  try {
    const data = await db.query.users.findMany({
      where: eq(users.id, session.userId),
      // Explicitly return the columns you need rather than the whole user object
      columns: {
        id: true,
        name: true,
        email: true,
      },
    })

    const user = data[0]

    return user
  } catch (error) {
    console.log('Failed to fetch user')
    return null
  }
})
```

----------------------------------------

TITLE: Using Style Property with Next.js Image Component
DESCRIPTION: Example of applying custom CSS styles to a Next.js Image component using the style property. This shows how to create a circular profile image with a border.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/02-components/image.mdx#2025-04-21_snippet_7

LANGUAGE: jsx
CODE:
```
const imageStyle = {
  borderRadius: '50%',
  border: '1px solid #fff',
}

export default function ProfileImage() {
  return <Image src="..." style={imageStyle} />
}
```

----------------------------------------

TITLE: Handling FormData in Next.js - TypeScript
DESCRIPTION: This TypeScript snippet illustrates how to read FormData from a request in a POST route. It retrieves specific fields from the FormData and returns them as a JSON response.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-building-your-application/01-routing/13-route-handlers.mdx#2025-04-21_snippet_14

LANGUAGE: typescript
CODE:
```
export async function POST(request: Request) {
  const formData = await request.formData()
  const name = formData.get('name')
  const email = formData.get('email')
  return Response.json({ name, email })
}
```

----------------------------------------

TITLE: Overriding the Error Component in Next.js
DESCRIPTION: This example demonstrates how to override the default `Error` component in Next.js by defining a custom component in `pages/_error.js`. The custom `Error` component receives a `statusCode` prop and displays an error message based on whether the error occurred on the server or client. The `getInitialProps` method is used to determine the status code.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/02-pages/03-building-your-application/01-routing/08-custom-error.mdx#_snippet_2

LANGUAGE: jsx
CODE:
```
function Error({ statusCode }) {
  return (
    <p>
      {statusCode
        ? `An error ${statusCode} occurred on server`
        : 'An error occurred on client'}
    </p>
  )
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404
  return { statusCode }
}

export default Error
```

----------------------------------------

TITLE: Using useFormStatus for Search Button in Next.js JavaScript
DESCRIPTION: This JavaScript snippet shows how to use the 'useFormStatus' hook to create a 'SearchButton' component providing feedback on form submission state in a Next.js application.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/02-components/form.mdx#2025-04-21_snippet_11

LANGUAGE: JavaScript
CODE:
```
'use client'
import { useFormStatus } from 'react-dom'

export default function SearchButton() {
  const status = useFormStatus()
  return (
    <button type="submit">{status.pending ? 'Searching...' : 'Search'}</button>
  )
}
```

----------------------------------------

TITLE: Using useRouter, usePathname, useSearchParams in a Client Component (JSX)
DESCRIPTION: This code snippet demonstrates how to use the useRouter, usePathname, and useSearchParams hooks from 'next/navigation' within a Client Component in a Next.js application. These hooks are used for routing and accessing the current pathname and search parameters. The 'use client' directive indicates that this is a Client Component.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/migrating/app-router-migration.mdx#_snippet_23

LANGUAGE: jsx
CODE:
```
'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'

export default function ExampleClientComponent() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // ...
}
```

----------------------------------------

TITLE: Configuring CircleCI Cache for Next.js Builds
DESCRIPTION: This YAML configuration for CircleCI includes the Next.js cache directory in the save_cache step. It saves both node_modules and the Next.js cache, improving build performance.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/ci-build-caching.mdx#2025-04-23_snippet_0

LANGUAGE: yaml
CODE:
```
steps:
  - save_cache:
      key: dependency-cache-{{ checksum "yarn.lock" }}
      paths:
        - ./node_modules
        - ./.next/cache
```

----------------------------------------

TITLE: Using revalidate in getStaticProps (JavaScript)
DESCRIPTION: This code snippet demonstrates how to use the `revalidate` property in `getStaticProps` to enable Incremental Static Regeneration (ISR). It fetches posts from an API and sets `revalidate` to 10 seconds, meaning Next.js will attempt to re-generate the page at most once every 10 seconds when a request comes in.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/02-pages/04-api-reference/03-functions/get-static-props.mdx#_snippet_3

LANGUAGE: JavaScript
CODE:
```
// This function gets called at build time on server-side.
// It may be called again, on a serverless function, if
// revalidation is enabled and a new request comes in
export async function getStaticProps() {
  const res = await fetch('https://.../posts')
  const posts = await res.json()

  return {
    props: {
      posts,
    },
    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once every 10 seconds
    revalidate: 10, // In seconds
  }
}
```

----------------------------------------

TITLE: Configuring Next.js Fallback Rewrites (JavaScript)
DESCRIPTION: This snippet illustrates how to set up a fallback rewrite rule that catches requests that do not match any other Next.js routes or configured rewrites. By returning an object with a 'fallback' array, you define rules that are only checked as a last resort, typically used to proxy remaining paths to an existing application for incremental adoption.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/05-config/01-next-config-js/rewrites.mdx#_snippet_12

LANGUAGE: JavaScript
CODE:
```
module.exports = {
  async rewrites() {
    return {
      fallback: [
        {
          source: '/:path*',
          destination: `https://custom-routes-proxying-endpoint.vercel.app/:path*`,
        },
      ],
    }
  },
}
```

----------------------------------------

TITLE: Loading Scripts in Layout - JavaScript
DESCRIPTION: This code snippet demonstrates how to load a third-party script within a Next.js layout component using JavaScript.  The `Script` component from `next/script` is used to embed the script. The script will be loaded once when the layout is accessed. Requires `next/script` dependency.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/scripts.mdx#_snippet_1

LANGUAGE: jsx
CODE:
```
import Script from 'next/script'

export default function DashboardLayout({ children }) {
  return (
    <>
      <section>{children}</section>
      <Script src="https://example.com/script.js" />
    </>
  )
}
```

----------------------------------------

TITLE: Upgrading to Latest Next.js Version Using Codemod
DESCRIPTION: Uses the Next.js codemod tool to automatically upgrade your application to the latest version. This is the recommended approach as it handles necessary code changes automatically.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/01-getting-started/12-upgrading.mdx#2025-04-21_snippet_0

LANGUAGE: bash
CODE:
```
npx @next/codemod@canary upgrade latest
```

----------------------------------------

TITLE: Implementing Sequential Data Fetching in Next.js
DESCRIPTION: Illustrates the sequential data fetching pattern where data fetching in nested components depends on data from parent components. The `Page` component fetches artist data, and the `Playlists` component, rendered as a child, fetches playlists using the `artistID` received as a prop. This pattern can introduce latency if dependencies are deep, but is necessary when one fetch requires the result of another.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-building-your-application/02-data-fetching/01-fetching.mdx#_snippet_7

LANGUAGE: typescript
CODE:
```
import { Suspense } from 'react';

export default async function Page({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  // Get artist information
  const artist = await getArtist(username);

  return (
    <>
      <h1>{artist.name}</h1>
      {/* Show fallback UI while the Playlists component is loading */}
      <Suspense fallback={<div>Loading...</div>}>
        {/* Pass the artist ID to the Playlists component */}
        <Playlists artistID={artist.id} />
      </Suspense>
    </>
  );
}

async function Playlists({ artistID }: { artistID: string }) {
  // Use the artist ID to fetch playlists
  const playlists = await getArtistPlaylists(artistID);

  return (
    <ul>
      {playlists.map((playlist) => (
        <li key={playlist.id}>{playlist.name}</li>
      ))}
    </ul>
  );
}
```

LANGUAGE: javascript
CODE:
```
import { Suspense } from 'react';

export default async function Page({ params }) {
  const { username } = await params;
  // Get artist information
  const artist = await getArtist(username);

  return (
    <>
      <h1>{artist.name}</h1>
      {/* Show fallback UI while the Playlists component is loading */}
      <Suspense fallback={<div>Loading...</div>}>
        {/* Pass the artist ID to the Playlists component */}
        <Playlists artistID={artist.id} />
      </Suspense>
    </>
  );
}

async function Playlists({ artistID }) {
  // Use the artist ID to fetch playlists
  const playlists = await getArtistPlaylists(artistID);

  return (
    <ul>
      {playlists.map((playlist) => (
        <li key={playlist.id}>{playlist.name}</li>
      ))}
    </ul>
  );
}
```

----------------------------------------

TITLE: Implementing Theme Detection with Picture Element in Next.js
DESCRIPTION: This snippet demonstrates how to use the getImageProps function from Next.js to create a theme-aware image using the HTML picture element. It provides different sources for light and dark modes.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/02-components/image.mdx#2025-04-21_snippet_34

LANGUAGE: jsx
CODE:
```
import { getImageProps } from 'next/image'

export default function Page() {
  const common = { alt: 'Theme Example', width: 800, height: 400 }
  const {
    props: { srcSet: dark },
  } = getImageProps({ ...common, src: '/dark.png' })
  const {
    props: { srcSet: light, ...rest },
  } = getImageProps({ ...common, src: '/light.png' })

  return (
    <picture>
      <source media="(prefers-color-scheme: dark)" srcSet={dark} />
      <source media="(prefers-color-scheme: light)" srcSet={light} />
      <img {...rest} />
    </picture>
  )
}
```

----------------------------------------

TITLE: Defining Dynamic Paths with generateStaticParams in app directory
DESCRIPTION: This code snippet shows how to use `generateStaticParams` in the `app` directory to define dynamic routes. It returns an array of objects, where each object represents a route parameter. This simplified API is designed for use within layouts.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/migrating/app-router-migration.mdx#_snippet_35

LANGUAGE: jsx
CODE:
```
// `app` directory
import PostLayout from '@/components/post-layout'

export async function generateStaticParams() {
  return [{ id: '1' }, { id: '2' }]
}

async function getPost(params) {
  const res = await fetch(`https://.../posts/${(await params).id}`)
  const post = await res.json()

  return post
}

export default async function Post({ params }) {
  const post = await getPost(params)

  return <PostLayout post={post} />
}
```

----------------------------------------

TITLE: Creating a Client Component in Next.js (TypeScript)
DESCRIPTION: This code snippet demonstrates how to create a Client Component in Next.js using TypeScript. The 'use client' directive is added to the top of the file to define it as a Client Component. It receives data as props and renders a list of posts.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/migrating/app-router-migration.mdx#_snippet_18

LANGUAGE: tsx
CODE:
```
'use client'

// This is a Client Component (same as components in the `pages` directory)
// It receives data as props, has access to state and effects, and is
// prerendered on the server during the initial page load.
export default function HomePage({ recentPosts }) {
  return (
    <div>
      {recentPosts.map((post) => (
        <div key={post.id}>{post.title}</div>
      ))}
    </div>
  )
}
```

----------------------------------------

TITLE: Implementing Basic Next.js Middleware with TypeScript
DESCRIPTION: A TypeScript example of implementing middleware in Next.js that redirects requests to the '/home' path. The config object uses a matcher to apply the middleware only to paths matching '/about/:path*'.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/03-file-conventions/middleware.mdx#2025-04-21_snippet_0

LANGUAGE: typescript
CODE:
```
import { NextResponse, NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  return NextResponse.redirect(new URL('/home', request.url))
}

export const config = {
  matcher: '/about/:path*',
}
```

----------------------------------------

TITLE: Applying Font with className in React
DESCRIPTION: This code snippet demonstrates how to apply a font to a paragraph element using the `className` property. It imports a font object (e.g., 'inter') and applies its `className` to the paragraph.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/02-components/font.mdx#_snippet_44

LANGUAGE: TypeScript
CODE:
```
<p className={inter.className}>Hello, Next.js!</p>
```

----------------------------------------

TITLE: Unit Testing Middleware Response Handling in Next.js (JS)
DESCRIPTION: Demonstrates unit testing a full Next.js middleware function response using experimental utilities from `next/experimental/testing/server`. It shows how to create a `NextRequest`, await the middleware response, and then use functions like `isRewrite` and `getRewrittenUrl` to assert the response type and rewritten URL. `getRedirectUrl` could be used for redirects.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-building-your-application/01-routing/14-middleware.mdx#_snippet_18

LANGUAGE: javascript
CODE:
```
import { isRewrite, getRewrittenUrl } from 'next/experimental/testing/server'

const request = new NextRequest('https://nextjs.org/docs')
const response = await middleware(request)
expect(isRewrite(response)).toEqual(true)
expect(getRewrittenUrl(response)).toEqual('https://other-domain.com/docs')
// getRedirectUrl could also be used if the response were a redirect
```

----------------------------------------

TITLE: Enabling Server-Side Debugging with --inspect Flag
DESCRIPTION: This snippet demonstrates how to enable server-side debugging in Next.js by using the `--inspect` flag. It shows how to pass this flag to the Node.js process using the `NODE_OPTIONS` environment variable. It also describes how to update the `dev` script in `package.json` to include the `--inspect` flag for consistent debugging. Requires Node.js.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/debugging.mdx#_snippet_1

LANGUAGE: Bash
CODE:
```
NODE_OPTIONS='--inspect' next dev
```

----------------------------------------

TITLE: Configuring Next.js for URL Imports
DESCRIPTION: This code snippet shows how to configure Next.js to allow importing modules from specified external URL prefixes by modifying the `next.config.js` file.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/05-config/01-next-config-js/urlImports.mdx#2025-04-21_snippet_0

LANGUAGE: javascript
CODE:
```
module.exports = {
  experimental: {
    urlImports: ['https://example.com/assets/', 'https://cdn.skypack.dev'],
  },
};
```

----------------------------------------

TITLE: Client Component Form (JavaScript)
DESCRIPTION: This example shows a client component with a form, written in JavaScript, which triggers a server action to handle form submission and redirect. The action is called `navigate` and imported from `./actions`.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/04-functions/redirect.mdx#2025-04-21_snippet_7

LANGUAGE: javascript
CODE:
```
'use client'

import { navigate } from './actions'

export function ClientRedirect() {
  return (
    <form action={navigate}>
      <input type="text" name="id" />
      <button>Submit</button>
    </form>
  )
}
```

----------------------------------------

TITLE: Convert Base64 to Uint8Array - TypeScript
DESCRIPTION: This function converts a base64 string to a Uint8Array, which is required for the applicationServerKey when subscribing to push notifications. It handles padding and replaces URL-safe characters before decoding the base64 string using the window.atob() method. The resulting raw data is then converted to a Uint8Array and returned.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/progressive-web-apps.mdx#_snippet_2

LANGUAGE: typescript
CODE:
```
function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}
```

----------------------------------------

TITLE: Migrating index.html Content to Root Layout (TypeScript)
DESCRIPTION: This code migrates the content of the old `index.html` file to the new root layout component (`layout.tsx`) in a Next.js application. It includes the `<html>`, `<head>`, and `<body>` tags, as well as the necessary meta tags and links. The `children` prop is rendered within the `<div id="root">` element.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/migrating/from-create-react-app.mdx#_snippet_4

LANGUAGE: tsx
CODE:
```
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>React App</title>
        <meta name="description" content="Web site created..." />
      </head>
      <body>
        <div id="root">{children}</div>
      </body>
    </html>
  )
}
```

----------------------------------------

TITLE: Conditionally Rewriting Paths in Next.js Middleware JavaScript
DESCRIPTION: This snippet demonstrates how to use conditional statements within the main Middleware function in JavaScript to rewrite requests based on the incoming path. It checks if the path starts with '/about' or '/dashboard' and uses `NextResponse.rewrite` to display content from a different URL without changing the browser's URL.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-building-your-application/01-routing/14-middleware.mdx#_snippet_7

LANGUAGE: javascript
CODE:
```
import { NextResponse } from 'next/server'

export function middleware(request) {
  if (request.nextUrl.pathname.startsWith('/about')) {
    return NextResponse.rewrite(new URL('/about-2', request.url))
  }

  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.rewrite(new URL('/dashboard/user', request.url))
  }
}
```

----------------------------------------

TITLE: Importing Server Functions in Client Components with TypeScript
DESCRIPTION: Shows how to import and use Server Functions in a Client Component with TypeScript. The Server Function is imported from a separate file and used as a form action.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/01-getting-started/07-updating-data.mdx#2025-04-21_snippet_6

LANGUAGE: typescript
CODE:
```
'use client'

import { createPost } from '@/app/actions'

export function Button() {
  return <button formAction={createPost}>Create</button>
}
```

----------------------------------------

TITLE: Defining Image Size TSX
DESCRIPTION: Defines the static `size` export for Open Graph or Twitter images in a TSX file. This object specifies the width and height in pixels for the generated image, used by Next.js to set the appropriate meta tags in the HTML head.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/03-file-conventions/01-metadata/opengraph-image.mdx#_snippet_14

LANGUAGE: tsx
CODE:
```
export const size = { width: 1200, height: 630 }

export default function Image() {}
```

----------------------------------------

TITLE: Using Wrapped Client Components in Server Components
DESCRIPTION: Example showing how to use a properly wrapped third-party component within a Server Component after it has been marked as a Client Component.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-building-your-application/03-rendering/03-composition-patterns.mdx#2025-04-21_snippet_6

LANGUAGE: typescript
CODE:
```
import Carousel from './carousel'

export default function Page() {
  return (
    <div>
      <p>View pictures</p>

      {/*  Works, since Carousel is a Client Component */}
      <Carousel />
    </div>
  )
}
```

LANGUAGE: javascript
CODE:
```
import Carousel from './carousel'

export default function Page() {
  return (
    <div>
      <p>View pictures</p>

      {/*  Works, since Carousel is a Client Component */}
      <Carousel />
    </div>
  )
}
```

----------------------------------------

TITLE: Using shared data fetching function with getStaticProps (JavaScript)
DESCRIPTION: This snippet shows how to use a shared function (`loadPosts`) to fetch data in `getStaticProps`. This is helpful for re-using the data-fetching logic between `getStaticProps` and API routes, keeping the code DRY and maintainable.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/02-pages/03-building-your-application/03-data-fetching/01-get-static-props.mdx#_snippet_5

LANGUAGE: javascript
CODE:
```
// pages/blog.js
import { loadPosts } from '../lib/load-posts'

// This function runs only on the server side
export async function getStaticProps() {
  // Instead of fetching your `/api` route you can call the same
  // function directly in `getStaticProps`
  const posts = await loadPosts()

  // Props returned will be passed to the page component
  return { props: { posts } }
}
```

----------------------------------------

TITLE: Caching Async Function Output (JavaScript)
DESCRIPTION: Applies the `'use cache'` directive to a standalone asynchronous function (`getData`). This caches the function's return value based on its serializable arguments, useful for caching data fetching or complex computations.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/01-directives/use-cache.mdx#_snippet_13

LANGUAGE: JavaScript
CODE:
```
export async function getData() {
  'use cache'

  const data = await fetch('/api/data')
  return data
}
```

----------------------------------------

TITLE: Creating a Theme-Aware Image Component in Next.js (TypeScript)
DESCRIPTION: This TypeScript React component wraps two Next.js Image components to display different images based on the user's theme preference. It uses the CSS module from the previous snippet.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/02-components/image.mdx#2025-04-21_snippet_32

LANGUAGE: tsx
CODE:
```
import styles from './theme-image.module.css'
import Image, { ImageProps } from 'next/image'

type Props = Omit<ImageProps, 'src' | 'priority' | 'loading'> & {
  srcLight: string
  srcDark: string
}

const ThemeImage = (props: Props) => {
  const { srcLight, srcDark, ...rest } = props

  return (
    <>
      <Image {...rest} src={srcLight} className={styles.imgLight} />
      <Image {...rest} src={srcDark} className={styles.imgDark} />
    </>
  )
}
```

----------------------------------------

TITLE: Implementing Server Actions Error Handling in Next.js
DESCRIPTION: Server action implementation that handles form submission errors and redirects. Uses form validation and returns error messages instead of throwing exceptions.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-building-your-application/01-routing/05-error-handling.mdx#2025-04-23_snippet_0

LANGUAGE: typescript
CODE:
```
'use server'

import { redirect } from 'next/navigation'

export async function createUser(prevState: any, formData: FormData) {
  const res = await fetch('https://...')
  const json = await res.json()

  if (!res.ok) {
    return { message: 'Please enter a valid email' }
  }

  redirect('/dashboard')
}
```

LANGUAGE: javascript
CODE:
```
'use server'

import { redirect } from 'next/navigation'

export async function createUser(prevState, formData) {
  const res = await fetch('https://...')
  const json = await res.json()

  if (!res.ok) {
    return { message: 'Please enter a valid email' }
  }

  redirect('/dashboard')
}
```

----------------------------------------

TITLE: Implementing Title Tag in Next.js _app.js
DESCRIPTION: Demonstrates the correct way to implement a title tag in a Next.js application using next/head in _app.js. This approach ensures proper title updates across page renders.
SOURCE: https://github.com/vercel/next.js/blob/canary/errors/no-document-title.mdx#2025-04-21_snippet_0

LANGUAGE: jsx
CODE:
```
import React from 'react'
import Head from 'next/head'

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>My new cool app</title>
      </Head>
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
```

----------------------------------------

TITLE: Handling Synchronous and Asynchronous Pages in React Components using TypeScript
DESCRIPTION: This snippet demonstrates the migration of synchronous React component handling to asynchronous by leveraging `use` from React to handle promise-based data. It involves transforming `Params` and `SearchParams` to promise-based structures to fetch data asynchronously, simplifying the logic for data fetching in component rendering.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/upgrading/version-15.mdx#2025-04-21_snippet_6

LANGUAGE: tsx
CODE:
```
"use client"\n\n// Before\ntype Params = { slug: string }\ntype SearchParams = { [key: string]: string | string[] | undefined }\n\nexport default function Page({\n  params,\n  searchParams,\n}: {\n  params: Params\n  searchParams: SearchParams\n}) {\n  const { slug } = params\n  const { query } = searchParams\n}\n\n// After\nimport { use } from 'react'\n\ntype Params = Promise<{ slug: string }>\ntype SearchParams = Promise<{ [key: string]: string | string[] | undefined }>\n\nexport default function Page(props: {\n  params: Params\n  searchParams: SearchParams\n}) {\n  const params = use(props.params)\n  const searchParams = use(props.searchParams)\n  const slug = params.slug\n  const query = searchParams.query\n}
```

----------------------------------------

TITLE: Accessing Request Headers and Cookies in Server Components (app)
DESCRIPTION: Demonstrates how to access request headers and cookies within Server Components in the `app` directory using the `headers` and `cookies` functions from `next/headers`.  The `getData` function fetches the authorization header.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/migrating/app-router-migration.mdx#_snippet_30

LANGUAGE: tsx
CODE:
```
import { cookies, headers } from 'next/headers'

async function getData() {
  const authHeader = (await headers()).get('authorization')

  return '...'
}

export default async function Page() {
  // You can use `cookies` or `headers` inside Server Components
  // directly or in your data fetching function
  const theme = (await cookies()).get('theme')
  const data = await getData()
  return '...'
}
```

----------------------------------------

TITLE: Page Component with Params (Client Component) - TypeScript
DESCRIPTION: This code defines a client component that receives route parameters. It extracts the 'slug' parameter from the params prop, which is a promise, using React's `use` hook. This allows reading the promise within a client component, which cannot be async itself.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/03-file-conventions/layout.mdx#_snippet_12

LANGUAGE: TypeScript
CODE:
```
'use client'

import { use } from 'react'

export default function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = use(params)
}
```

----------------------------------------

TITLE: Setting Max Duration in Next.js JS
DESCRIPTION: This snippet demonstrates how to set the `maxDuration` option in a JavaScript file to limit the execution time of server-side logic (rendering or API handling) for a Next.js route segment. This setting is used by deployment platforms.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/03-file-conventions/route-segment-config.mdx#_snippet_11

LANGUAGE: js
CODE:
```
export const maxDuration = 5
```

----------------------------------------

TITLE: Implementing revalidateTag in a Route Handler
DESCRIPTION: Illustrates how to create a Next.js Route Handler endpoint that triggers cache revalidation using `revalidateTag`. The example sets up a GET handler that reads a cache tag from the request's search parameters and calls `revalidateTag` with the retrieved value, returning a JSON response indicating success.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/04-functions/revalidateTag.mdx#_snippet_2

LANGUAGE: typescript
CODE:
```
import type { NextRequest } from 'next/server'
import { revalidateTag } from 'next/cache'

export async function GET(request: NextRequest) {
  const tag = request.nextUrl.searchParams.get('tag')
  revalidateTag(tag)
  return Response.json({ revalidated: true, now: Date.now() })
}
```

LANGUAGE: javascript
CODE:
```
import { revalidateTag } from 'next/cache'

export async function GET(request) {
  const tag = request.nextUrl.searchParams.get('tag')
  revalidateTag(tag)
  return Response.json({ revalidated: true, now: Date.now() })
}
```

----------------------------------------

TITLE: Revalidating Cache Tag in Next.js JavaScript
DESCRIPTION: Demonstrates how to use the revalidateTag function in JavaScript to revalidate cached data tagged with 'my-data'. It is part of the server-side submit function.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/04-functions/cacheTag.mdx#2025-04-21_snippet_5

LANGUAGE: javascript
CODE:
```
'use server'

import { revalidateTag } from 'next/cache'

export default async function submit() {
  await addPost()
  revalidateTag('my-data')
}
```

----------------------------------------

TITLE: Processing Webhooks in Next.js - TypeScript
DESCRIPTION: This TypeScript snippet provides an implementation for receiving and processing webhooks. It captures the payload and handles errors gracefully, returning appropriate responses.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-building-your-application/01-routing/13-route-handlers.mdx#2025-04-21_snippet_18

LANGUAGE: typescript
CODE:
```
export async function POST(request: Request) {
  try {
    const text = await request.text()
    // Process the webhook payload
  } catch (error) {
    return new Response(`Webhook error: ${error.message}`, {
      status: 400,
    })
  }

  return new Response('Success!', {
    status: 200,
  })
}
```

----------------------------------------

TITLE: Setting Placeholder Property on Next.js Image Component
DESCRIPTION: Example of setting the placeholder property on a Next.js Image component. This property determines what to display while the image is loading, with options for blur, empty space, or a data URL.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/02-components/image.mdx#2025-04-21_snippet_6

LANGUAGE: js
CODE:
```
placeholder = 'empty' // "empty" | "blur" | "data:image/..."
```

----------------------------------------

TITLE: Tab Groups Layout in Typescript
DESCRIPTION: This code snippet demonstrates how to create tab groups using Parallel Routes and a layout within a slot. It defines a layout component with navigation links to different subpages within the `@analytics` slot.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-building-your-application/01-routing/11-parallel-routes.mdx#2025-04-21_snippet_6

LANGUAGE: typescript
CODE:
```
import Link from 'next/link'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <nav>
        <Link href="/page-views">Page Views</Link>
        <Link href="/visitors">Visitors</Link>
      </nav>
      <div>{children}</div>
    </>
  )
}
```

----------------------------------------

TITLE: Accessing MDX Metadata in Next.js App Router (TypeScript)
DESCRIPTION: This code snippet demonstrates how to import a MDX file and its metadata in a Next.js app router page using TypeScript. It imports a `BlogPost` component and its associated `metadata` from a MDX file, logs the metadata to the console, and renders the `BlogPost` component.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/mdx.mdx#_snippet_33

LANGUAGE: tsx
CODE:
```
import BlogPost, { metadata } from '@/content/blog-post.mdx'

export default function Page() {
  console.log('metadata: ', metadata)
  //=> { author: 'John Doe' }
  return <BlogPost />
}
```

----------------------------------------

TITLE: Template Nesting Output Example
DESCRIPTION: This code snippet demonstrates how a template is rendered between a layout and its children in Next.js. The template is given a unique key.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-building-your-application/01-routing/03-layouts-and-templates.mdx#_snippet_8

LANGUAGE: jsx
CODE:
```
<Layout>
  {/* Note that the template is given a unique key. */}
  <Template key={routeParam}>{children}</Template>
</Layout>
```

----------------------------------------

TITLE: Custom Image Loader (TypeScript)
DESCRIPTION: This code defines a custom image loader function for Next.js. It constructs a URL for Cloudinary based on the provided image source, width, and quality parameters.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/static-exports.mdx#_snippet_7

LANGUAGE: tsx
CODE:
```
export default function cloudinaryLoader({
  src,
  width,
  quality,
}: {
  src: string
  width: number
  quality?: number
}) {
  const params = ['f_auto', 'c_limit', `w_${width}`, `q_${quality || 'auto'}`]
  return `https://res.cloudinary.com/demo/image/upload/${params.join(
    ','
  )}${src}`
}
```

----------------------------------------

TITLE: Defining a Theme Provider Component in TypeScript
DESCRIPTION: This snippet defines a ThemeProvider component that utilizes the createContext function to provide the theme context. The component is marked as a Client Component with the 'use client' directive, enabling it to be used in Server Components.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-building-your-application/03-rendering/03-composition-patterns.mdx#2025-04-21_snippet_9

LANGUAGE: typescript
CODE:
```
'use client'

import { createContext } from 'react'

export const ThemeContext = createContext({})

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return <ThemeContext.Provider value="dark">{children}</ThemeContext.Provider>
}
```

----------------------------------------

TITLE: Incorrect Usage of Client-Side Component in Server Component
DESCRIPTION: Example showing how using a third-party component that relies on client-side features directly in a Server Component will cause an error.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-building-your-application/03-rendering/03-composition-patterns.mdx#2025-04-21_snippet_4

LANGUAGE: typescript
CODE:
```
import { Carousel } from 'acme-carousel'

export default function Page() {
  return (
    <div>
      <p>View pictures</p>

      {/* Error: `useState` can not be used within Server Components */}
      <Carousel />
    </div>
  )
}
```

LANGUAGE: javascript
CODE:
```
import { Carousel } from 'acme-carousel'

export default function Page() {
  return (
    <div>
      <p>View pictures</p>

      {/*  Error: `useState` can not be used within Server Components */}
      <Carousel />
    </div>
  )
}
```

----------------------------------------

TITLE: Importing Named Exports with next/dynamic
DESCRIPTION: This code snippet demonstrates how to dynamically import a named export from a module using `next/dynamic`.  The `import()` function returns a Promise that resolves to the module, and the `.then()` method is used to extract the named export. In this case, the `Hello` function is imported and used as the dynamically loaded component.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/lazy-loading.mdx#_snippet_5

LANGUAGE: jsx
CODE:
```
import dynamic from 'next/dynamic'

const ClientComponent = dynamic(() =>
  import('../components/hello').then((mod) => mod.Hello)
)
```

----------------------------------------

TITLE: Configuring Remote Image Patterns in Next.js
DESCRIPTION: Shows how to configure allowed remote image patterns in next.config.js. This example demonstrates setting up a specific AWS S3 bucket as an allowed image source.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/01-getting-started/04-images-and-fonts.mdx#2025-04-21_snippet_3

LANGUAGE: ts
CODE:
```
import { NextConfig } from 'next'

const config: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 's3.amazonaws.com',
        port: '',
        pathname: '/my-bucket/**',
        search: '',
      },
    ],
  },
}

export default config
```

LANGUAGE: js
CODE:
```
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 's3.amazonaws.com',
        port: '',
        pathname: '/my-bucket/**',
        search: '',
      },
    ],
  },
}
```

----------------------------------------

TITLE: Conditional Data Fetching in Draft Mode
DESCRIPTION: This code snippet demonstrates how to conditionally fetch data based on whether Draft Mode is enabled. It imports `draftMode` from `next/headers` and fetches data from a draft or production endpoint based on the `isEnabled` property. This allows previewing draft content without affecting the live site.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/draft-mode.mdx#_snippet_8

LANGUAGE: jsx
CODE:
```
// page that fetches data
import { draftMode } from 'next/headers'

async function getData() {
  const { isEnabled } = await draftMode()

  const url = isEnabled
    ? 'https://draft.example.com'
    : 'https://production.example.com'

  const res = await fetch(url)

  return res.json()
}

export default async function Page() {
  const { title, desc } = await getData()

  return (
    <main>
      <h1>{title}</h1>
      <p>{desc}</p>
    </main>
  )
}
```

----------------------------------------

TITLE: Redirect with Server Action in Next.js (TypeScript)
DESCRIPTION: This example demonstrates how to use the `redirect` function within a Server Action in Next.js using TypeScript. It defines a `navigate` function that takes form data and redirects the user to a specific post based on the provided ID. This demonstrates how to use redirect within server actions.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/04-functions/redirect.mdx#2025-04-21_snippet_4

LANGUAGE: typescript
CODE:
```
'use server'

import { redirect } from 'next/navigation'

export async function navigate(data: FormData) {
  redirect(`/posts/${data.get('id')}`)
}
```

----------------------------------------

TITLE: Setting a Custom Response Size Limit in API Routes on Next.js
DESCRIPTION: This snippet demonstrates how to set a custom response size limit for an API Route in Next.js. By using the responseLimit key, developers can define their own size threshold in bytes or string format, allowing more control over the API response.
SOURCE: https://github.com/vercel/next.js/blob/canary/errors/api-routes-response-size-limit.mdx#2025-04-21_snippet_1

LANGUAGE: javascript
CODE:
```
export const config = {
  api: {
    responseLimit: '8mb',
  },
}
```

----------------------------------------

TITLE: Importing Global CSS in Root Layout (app directory) - TypeScript
DESCRIPTION: Imports the global CSS file into the root layout component in the `app` directory. This ensures that the styles are applied to every route in the application. The component uses TypeScript.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-building-your-application/05-styling/01-css.mdx#_snippet_6

LANGUAGE: typescript
CODE:
```
// These styles apply to every route in the application
import './global.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

----------------------------------------

TITLE: Creating Client Component for Web Vitals in App Router
DESCRIPTION: This snippet shows how to create a dedicated client component (`web-vitals.js`) in the Next.js App Router to encapsulate the `useReportWebVitals` hook. By adding the `'use client'` directive, the component can use hooks, and it's typically imported into the root layout to enable Web Vitals reporting for the application, logging metrics to the console.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/04-functions/use-report-web-vitals.mdx#_snippet_1

LANGUAGE: jsx
CODE:
```
'use client'

import { useReportWebVitals } from 'next/web-vitals'

export function WebVitals() {
  useReportWebVitals((metric) => {
    console.log(metric)
  })

  return null
}
```

----------------------------------------

TITLE: Fetching Data with Caching Strategies in App Router (TSX)
DESCRIPTION: This code demonstrates how to fetch data with different caching strategies in the App Router using React Server Components and the `fetch()` API. It shows examples of static caching, dynamic fetching (no-store), and revalidated caching.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/migrating/app-router-migration.mdx#_snippet_24

LANGUAGE: tsx
CODE:
```
export default async function Page() {
  // This request should be cached until manually invalidated.
  // Similar to `getStaticProps`.
  // `force-cache` is the default and can be omitted.
  const staticData = await fetch(`https://...`, { cache: 'force-cache' })

  // This request should be refetched on every request.
  // Similar to `getServerSideProps`.
  const dynamicData = await fetch(`https://...`, { cache: 'no-store' })

  // This request should be cached with a lifetime of 10 seconds.
  // Similar to `getStaticProps` with the `revalidate` option.
  const revalidatedData = await fetch(`https://...`, {
    next: { revalidate: 10 },
  })

  return <div>...</div>
}
```

----------------------------------------

TITLE: Implementing Custom Trailing Slash Handling in Next.js Middleware (JS)
DESCRIPTION: Shows how to implement custom logic in Next.js middleware (`middleware.js`) to handle trailing slashes based on specific path prefixes (`/docs`, `/blog`). If a path matches a legacy prefix, it proceeds; otherwise, it applies a redirect if a trailing slash is missing and the path is not a file. Requires `skipTrailingSlashRedirect` to be enabled in `next.config.js`.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-building-your-application/01-routing/14-middleware.mdx#_snippet_14

LANGUAGE: javascript
CODE:
```
const legacyPrefixes = ['/docs', '/blog']

export default async function middleware(req) {
  const { pathname } = req.nextUrl

  if (legacyPrefixes.some((prefix) => pathname.startsWith(prefix))) {
    return NextResponse.next()
  }

  // apply trailing slash handling
  if (
    !pathname.endsWith('/') &&
    !pathname.match(/((?!\.well-known(?:\/.*)?)(?:[^/]+\/)*[^/]+\.\w+)/)
  ) {
    return NextResponse.redirect(
      new URL(`${req.nextUrl.pathname}/`, req.nextUrl)
    )
  }
}
```

----------------------------------------

TITLE: Implementing Fallback Pages with getStaticPaths and getStaticProps in Next.js
DESCRIPTION: This code demonstrates how to create a dynamic post page with fallback functionality using Next.js. It includes the use of useRouter to detect fallback state, getStaticPaths to define pre-rendered paths, and getStaticProps for data fetching.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/02-pages/04-api-reference/03-functions/get-static-paths.mdx#2025-04-23_snippet_4

LANGUAGE: jsx
CODE:
```
import { useRouter } from 'next/router'

function Post({ post }) {
  const router = useRouter()

  // If the page is not yet generated, this will be displayed
  // initially until getStaticProps() finishes running
  if (router.isFallback) {
    return <div>Loading...</div>
  }

  // Render post...
}

// This function gets called at build time
export async function getStaticPaths() {
  return {
    // Only `/posts/1` and `/posts/2` are generated at build time
    paths: [{ params: { id: '1' } }, { params: { id: '2' } }],
    // Enable statically generating additional pages
    // For example: `/posts/3`
    fallback: true,
  }
}

// This also gets called at build time
export async function getStaticProps({ params }) {
  // params contains the post `id`.
  // If the route is like /posts/1, then params.id is 1
  const res = await fetch(`https://.../posts/${params.id}`)
  const post = await res.json()

  // Pass post data to the page via props
  return {
    props: { post },
    // Re-generate the post at most once per second
    // if a request comes in
    revalidate: 1,
  }
}

export default Post
```

----------------------------------------

TITLE: Logging User Activity After Mutation in Next.js Route Handler (JS)
DESCRIPTION: This JavaScript example shows the use of `after` within a Next.js Route Handler (a POST request) to log user actions post-mutation. It accesses `cookies` and `headers` inside the `after` callback, demonstrating how request information can be used for analytics or logging after the primary response is sent.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/04-functions/after.mdx#_snippet_3

LANGUAGE: js
CODE:
```
import { after } from 'next/server';
import { cookies, headers } from 'next/headers';
import { logUserAction } from '@/app/utils';

export async function POST(request) {
  // Perform mutation
  // ...

  // Log user activity for analytics
  after(async () => {
    const userAgent = (await headers().get('user-agent')) || 'unknown';
    const sessionCookie =
      (await cookies().get('session-id'))?.value || 'anonymous';

    logUserAction({ sessionCookie, userAgent });
  });

  return new Response(JSON.stringify({ status: 'success' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
```

----------------------------------------

TITLE: Using Font Definitions in a React Component (JSX)
DESCRIPTION: This code snippet shows how to import and use the defined font variables in a React component using JavaScript. It imports the font objects and applies them to different text elements using either `className` or `style` properties.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/02-components/font.mdx#_snippet_54

LANGUAGE: JSX
CODE:
```
import { inter, lora, sourceCodePro700, greatVibes } from '../styles/fonts'

export default function Page() {
  return (
    <div>
      <p className={inter.className}>Hello world using Inter font</p>
      <p style={lora.style}>Hello world using Lora font</p>
      <p className={sourceCodePro700.className}>
        Hello world using Source_Sans_3 font with weight 700
      </p>
      <p className={greatVibes.className}>My title in Great Vibes font</p>
    </div>
  )
}
```

----------------------------------------

TITLE: Configuring Fetch Cache in Next.js JS
DESCRIPTION: This snippet shows how to set the `fetchCache` option in a JavaScript file for a Next.js route segment. It overrides the default `fetch` caching behavior and accepts various string values to control static vs. dynamic fetching based on the provided options.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/03-file-conventions/route-segment-config.mdx#_snippet_5

LANGUAGE: js
CODE:
```
export const fetchCache = 'auto'
// 'auto' | 'default-cache' | 'only-cache'
// 'force-cache' | 'force-no-store' | 'default-no-store' | 'only-no-store'
```

----------------------------------------

TITLE: Fetching CMS data with getStaticProps (TypeScript)
DESCRIPTION: This snippet shows an example of fetching data from a CMS using `getStaticProps` in a Next.js page. It fetches a list of blog posts and passes them as props to the `Blog` component. This is a typical use case for static site generation with data from a headless CMS.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/02-pages/03-building-your-application/03-data-fetching/01-get-static-props.mdx#_snippet_2

LANGUAGE: typescript
CODE:
```
// posts will be populated at build time by getStaticProps()
export default function Blog({ posts }) {
  return (
    <ul>
      {posts.map((post) => (
        <li>{post.title}</li>
      ))}
    </ul>
  )
}

// This function gets called at build time on server-side.
// It won't be called on client-side, so you can even do
// direct database queries.
export async function getStaticProps() {
  // Call an external API endpoint to get posts.
  // You can use any data fetching library
  const res = await fetch('https://.../posts')
  const posts = await res.json()

  // By returning { props: { posts } }, the Blog component
  // will receive `posts` as a prop at build time
  return {
    props: {
      posts,
    },
  }
}
```

----------------------------------------

TITLE: Implement generateStaticParams for Static Generation in Next.js
DESCRIPTION: This snippet demonstrates how to use the `generateStaticParams` function to statically generate dynamic routes at build time. The function fetches data (e.g., blog posts) and returns an array of objects, where each object provides the specific parameter values (e.g., `slug`) for pre-rendering a route.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-building-your-application/01-routing/10-dynamic-routes.mdx#_snippet_1

LANGUAGE: tsx
CODE:
```
export async function generateStaticParams() {
  const posts = await fetch('https://.../posts').then((res) => res.json())

  return posts.map((post) => ({
    slug: post.slug,
  }))
}
```

LANGUAGE: jsx
CODE:
```
export async function generateStaticParams() {
  const posts = await fetch('https://.../posts').then((res) => res.json())

  return posts.map((post) => ({
    slug: post.slug,
  }))
}
```

----------------------------------------

TITLE: Fetching Data in App Router with Server Components (JSX)
DESCRIPTION: This code demonstrates how to fetch data inside a React Server Component in the App Router. It uses the `fetch()` API with the `no-store` cache option to prevent caching, similar to `getServerSideProps`. The fetched data is then used to render a list of projects.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/migrating/app-router-migration.mdx#_snippet_28

LANGUAGE: jsx
CODE:
```
// `app` directory

// This function can be named anything
async function getProjects() {
  const res = await fetch(`https://...`, { cache: 'no-store' })
  const projects = await res.json()

  return projects
}

export default async function Dashboard() {
  const projects = await getProjects()

  return (
    <ul>
      {projects.map((project) => (
        <li key={project.id}>{project.name}</li>
      ))}
    </ul>
  )
}
```

----------------------------------------

TITLE: Rendering MDX in a Page Component (App Router - TSX)
DESCRIPTION: Shows how to import and render an MDX file within a Next.js page component using the app router and Typescript.  The MDX content is imported and rendered within the Page component.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/mdx.mdx#_snippet_9

LANGUAGE: tsx
CODE:
```
import Welcome from '@/markdown/welcome.mdx'

export default function Page() {
  return <Welcome />
}
```

----------------------------------------

TITLE: Control Dynamic Segment Handling in Next.js (TSX/JS)
DESCRIPTION: Define the behavior when a dynamic segment is requested that was not included in the `generateStaticParams` output. Export `dynamicParams` as `true` (default) to generate segments on demand, or `false` to return a 404.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/03-file-conventions/route-segment-config.mdx#_snippet_2

LANGUAGE: TypeScript
CODE:
```
export const dynamicParams = true // true | false,
```

LANGUAGE: JavaScript
CODE:
```
export const dynamicParams = true // true | false,
```

----------------------------------------

TITLE: Defining Public Environment Variable (NEXT_PUBLIC_, Next.js)
DESCRIPTION: Prefixing an environment variable with `NEXT_PUBLIC_` makes its value accessible in the browser by inlining it into the JavaScript bundle at build time.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/environment-variables.mdx#_snippet_8

LANGUAGE: txt
CODE:
```
NEXT_PUBLIC_ANALYTICS_ID=abcdefghijk
```

----------------------------------------

TITLE: User Provider with Context (TypeScript)
DESCRIPTION: This code implements a React Context Provider for managing user data in a Next.js application using TypeScript.  It creates a `UserContext` and a custom hook `useUser` for accessing the context. The `UserProvider` component accepts a `userPromise` prop (a Promise of user data) and makes it available to its children through the context. This pattern enables easier access to the user data from Client Components.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/single-page-applications.mdx#_snippet_2

LANGUAGE: typescript
CODE:
```
'use client';

import { createContext, useContext, ReactNode } from 'react';

type User = any;
type UserContextType = {
  userPromise: Promise<User | null>;
};

const UserContext = createContext<UserContextType | null>(null);

export function useUser(): UserContextType {
  let context = useContext(UserContext);
  if (context === null) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

export function UserProvider({
  children,
  userPromise
}: {
  children: ReactNode;
  userPromise: Promise<User | null>;
}) {
  return (
    <UserContext.Provider value={{ userPromise }}>
      {children}
    </UserContext.Provider>
  );
}
```

----------------------------------------

TITLE: Conditionally importing NodeSDK for OpenTelemetry (TypeScript)
DESCRIPTION: Conditionally imports the `instrumentation.node.ts` file based on the `NEXT_RUNTIME` environment variable. This ensures that `NodeSDK`, which is not compatible with the edge runtime, is only imported when the application is running in a Node.js environment. This approach is used in `instrumentation.ts`.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/open-telemetry.mdx#_snippet_4

LANGUAGE: typescript
CODE:
```
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./instrumentation.node.ts')
  }
}
```

----------------------------------------

TITLE: Accessing Dynamic searchParams Prop Triggering Dynamism (TypeScript)
DESCRIPTION: Defines an asynchronous component that receives `searchParams` as a prop (potentially from a dynamic source). Accessing the value (`await searchParams`) causes this specific component to be rendered dynamically during the request, even if its parent was prerendered.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-building-your-application/03-rendering/04-partial-prerendering.mdx#_snippet_11

LANGUAGE: TypeScript
CODE:
```
export async function Table({
  searchParams,
}: {
  searchParams: Promise<{ sort: string }>
}) {
  const sort = (await searchParams).sort === 'true'
  return '...'
}
```

----------------------------------------

TITLE: Using Theme Provider in Layout with TypeScript
DESCRIPTION: This snippet demonstrates how to utilize the ThemeProvider within the RootLayout component. By wrapping children with the ThemeProvider, all components can access the theme context.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-building-your-application/03-rendering/03-composition-patterns.mdx#2025-04-21_snippet_11

LANGUAGE: typescript
CODE:
```
import ThemeProvider from './theme-provider'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
```

----------------------------------------

TITLE: Async Headers API Usage in Next.js 15
DESCRIPTION: Example showing both recommended async and temporary sync usage of the headers API in Next.js 15.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/upgrading/version-15.mdx#2025-04-21_snippet_3

LANGUAGE: tsx
CODE:
```
import { headers } from 'next/headers'

// Before
const headersList = headers()
const userAgent = headersList.get('user-agent')

// After
const headersList = await headers()
const userAgent = headersList.get('user-agent')
```

LANGUAGE: tsx
CODE:
```
import { headers, type UnsafeUnwrappedHeaders } from 'next/headers'

// Before
const headersList = headers()
const userAgent = headersList.get('user-agent')

// After
const headersList = headers() as unknown as UnsafeUnwrappedHeaders
// will log a warning in dev
const userAgent = headersList.get('user-agent')
```

----------------------------------------

TITLE: Applying Tailwind CSS Classes in TSX
DESCRIPTION: This TypeScript (TSX) example shows how to apply Tailwind CSS utility classes to a heading element within a Next.js page component. The classes `text-3xl`, `font-bold`, and `underline` are used to style the text.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/tailwind-css.mdx#_snippet_7

LANGUAGE: tsx
CODE:
```
export default function Page() {
  return <h1 className="text-3xl font-bold underline">Hello, Next.js!</h1>
}
```

----------------------------------------

TITLE: Implementing Per-Page Layouts with TypeScript in Next.js
DESCRIPTION: A TypeScript implementation of a page component with a custom layout. It defines the getLayout function that wraps the page content in multiple layout components.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/02-pages/03-building-your-application/01-routing/01-pages-and-layouts.mdx#2025-04-21_snippet_5

LANGUAGE: tsx
CODE:
```
import type { ReactElement } from 'react'
import Layout from '../components/layout'
import NestedLayout from '../components/nested-layout'
import type { NextPageWithLayout } from './_app'

const Page: NextPageWithLayout = () => {
  return <p>hello world</p>
}

Page.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout>
      <NestedLayout>{page}</NestedLayout>
    </Layout>
  )
}

export default Page
```

----------------------------------------

TITLE: Prefetching pages with router.prefetch
DESCRIPTION: This code snippet demonstrates how to use `router.prefetch` to prefetch a page, enhancing client-side transitions after a login. It uses `useCallback` for the form submission handler and `useEffect` to prefetch the dashboard page after the component mounts. This improves the user experience by reducing navigation latency.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/02-pages/04-api-reference/03-functions/use-router.mdx#_snippet_8

LANGUAGE: jsx
CODE:
```
import { useCallback, useEffect } from 'react'
import { useRouter } from 'next/router'

export default function Login() {
  const router = useRouter()
  const handleSubmit = useCallback((e) => {
    e.preventDefault()

    fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        /* Form data */
      }),
    }).then((res) => {
      // Do a fast client-side transition to the already prefetched dashboard page
      if (res.ok) router.push('/dashboard')
    })
  }, [])

  useEffect(() => {
    // Prefetch the dashboard page
    router.prefetch('/dashboard')
  }, [router])

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button type="submit">Login</button>
    </form>
  )
}
```

----------------------------------------

TITLE: Bundle All Packages in next.config.js (Pages Router)
DESCRIPTION: Configures the `bundlePagesRouterDependencies` option in `next.config.js` to automatically bundle all packages, which is the default behavior in the App Router. This is applicable for the Pages Router.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/package-bundling.mdx#_snippet_5

LANGUAGE: javascript
CODE:
```
/** @type {import('next').NextConfig} */
const nextConfig = {
  bundlePagesRouterDependencies: true,
}

module.exports = nextConfig
```

----------------------------------------

TITLE: Install Prompt Component - JavaScript
DESCRIPTION: This React component provides a prompt for iOS users to install the app to their home screen. It checks if the device is iOS and if the app is already running in standalone mode. If the app is not already installed on an iOS device, it displays instructions on how to add it to the home screen.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/progressive-web-apps.mdx#_snippet_7

LANGUAGE: jsx
CODE:
```
function InstallPrompt() {
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    setIsIOS(
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
    );

    setIsStandalone(window.matchMedia('(display-mode: standalone)').matches);
  }, []);

  if (isStandalone) {
    return null; // Don't show install button if already installed
  }

  return (
    <div>
      <h3>Install App</h3>
      <button>Add to Home Screen</button>
      {isIOS && (
        <p>
          To install this app on your iOS device, tap the share button
          <span role="img" aria-label="share icon">
            {' '}
            ⎋{' '}
          </span>
          and then "Add to Home Screen"
          <span role="img" aria-label="plus icon">
            {' '}
            ➕{' '}
          </span>
          .
        </p>
      )}
    </div>
  );
}

export default function Page() {
  return (
    <div>
      <PushNotificationManager />
      <InstallPrompt />
    </div>
  );
}
```

----------------------------------------

TITLE: Create mdx-components.js for MDX Components (JavaScript)
DESCRIPTION: This JavaScript code defines a `useMDXComponents` function that allows you to override or extend the default MDX components. This file is required when using `@next/mdx` with the App Router in Next.js.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/mdx.mdx#_snippet_4

LANGUAGE: JavaScript
CODE:
```
export function useMDXComponents(components) {
  return {
    ...components,
  }
}
```

----------------------------------------

TITLE: Caching Dynamic Pages with getServerSideProps (TypeScript)
DESCRIPTION: This TypeScript snippet shows how to set HTTP `Cache-Control` headers on the response object (`context.res`) within a `getServerSideProps` function. It includes directives like `s-maxage` and `stale-while-revalidate` to manage the caching behavior of server-rendered pages, allowing for fresh data on subsequent requests while serving stale data immediately.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/05-config/01-next-config-js/headers.mdx#_snippet_11

LANGUAGE: ts
CODE:
```
import { GetStaticProps, GetStaticPaths, GetServerSideProps } from 'next'

// This value is considered fresh for ten seconds (s-maxage=10).
// If a request is repeated within the next 10 seconds, the previously
// cached value will still be fresh. If the request is repeated before 59 seconds,
// the cached value will be stale but still render (stale-while-revalidate=59).
//
// In the background, a revalidation request will be made to populate the cache
// with a fresh value. If you refresh the page, you will see the new value.
export const getServerSideProps = (async (context) => {
  context.res.setHeader(
    'Cache-Control',
    'public, s-maxage=10, stale-while-revalidate=59'
  )

  return {
    props: {},
  }
}) satisfies GetServerSideProps
```

----------------------------------------

TITLE: Fetching Data with useEffect in Next.js
DESCRIPTION: This snippet demonstrates how to use React's 'useEffect' to perform data fetching on a Next.js page. It shows how to handle asynchronous API requests and manage loading states. Ensure you handle errors gracefully to enhance user experience.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/02-pages/03-building-your-application/02-rendering/05-client-side-rendering.mdx#2025-04-21_snippet_0

LANGUAGE: jsx
CODE:
```
import React, { useState, useEffect } from 'react'

export function Page() {
  const [data, setData] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('https://api.example.com/data')
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const result = await response.json()
      setData(result)
    }

    fetchData().catch((e) => {
      // handle the error as needed
      console.error('An error occurred while fetching the data: ', e)
    })
  }, [])

  return <p>{data ? `Your data: ${data}` : 'Loading...'}</p>
}

```

----------------------------------------

TITLE: Layout with Dynamic Route Parameters (TSX)
DESCRIPTION: Defines a layout component in TypeScript that uses dynamic route parameters in Next.js. It accepts a `params` prop, which is a promise that resolves to an object containing the dynamic route parameters. The example shows how to access the `team` parameter.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/03-file-conventions/layout.mdx#_snippet_4

LANGUAGE: tsx
CODE:
```
export default async function Layout({
  params,
}: {
  params: Promise<{ team: string }>
}) {
  const { team } = await params
}
```

----------------------------------------

TITLE: Using Font Definitions in a React Component (TSX)
DESCRIPTION: This code snippet shows how to import and use the defined font variables in a React component using TypeScript. It imports the font objects and applies them to different text elements using either `className` or `style` properties.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/02-components/font.mdx#_snippet_53

LANGUAGE: TSX
CODE:
```
import { inter, lora, sourceCodePro700, greatVibes } from '../styles/fonts'

export default function Page() {
  return (
    <div>
      <p className={inter.className}>Hello world using Inter font</p>
      <p style={lora.style}>Hello world using Lora font</p>
      <p className={sourceCodePro700.className}>
        Hello world using Source_Sans_3 font with weight 700
      </p>
      <p className={greatVibes.className}>My title in Great Vibes font</p>
    </div>
  )
}
```

----------------------------------------

TITLE: Deleting a Cookie with NextRequest
DESCRIPTION: This snippet demonstrates how to delete a cookie using the `delete` method of the `request.cookies` object in Next.js. It deletes the cookie named 'experiments'.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/04-functions/next-request.mdx#2025-04-21_snippet_3

LANGUAGE: typescript
CODE:
```
// Returns true for deleted, false is nothing is deleted
request.cookies.delete('experiments')
```

----------------------------------------

TITLE: Adding Tags to fetch Cache (Next.js)
DESCRIPTION: Illustrates how to assign one or more tags to a fetch cache entry using the `next.tags` option, enabling fine-grained revalidation later via `revalidateTag`.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/04-deep-dive/caching.mdx#_snippet_7

LANGUAGE: JSX
CODE:
```
fetch(`https://...`, { next: { tags: ['a', 'b', 'c'] } })
```

----------------------------------------

TITLE: Error Boundary Implementation in Next.js
DESCRIPTION: Client-side error boundary component that handles uncaught exceptions and provides error recovery functionality.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-building-your-application/01-routing/05-error-handling.mdx#2025-04-23_snippet_3

LANGUAGE: typescript
CODE:
```
'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div>
      <h2>Something went wrong!</h2>
      <button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Try again
      </button>
    </div>
  )
}
```

LANGUAGE: javascript
CODE:
```
'use client'

import { useEffect } from 'react'

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div>
      <h2>Something went wrong!</h2>
      <button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Try again
      </button>
    </div>
  )
}
```

----------------------------------------

TITLE: Controlling Dynamic Params with generateStaticParams Subset Next.js TSX/JSX
DESCRIPTION: Combines generating a subset of static paths with setting `dynamicParams = false`. This config ensures that requests for dynamic segments *not* generated at build time will result in a 404 error.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/04-functions/generate-static-params.mdx#_snippet_6

LANGUAGE: tsx
CODE:
```
// All posts besides the top 10 will be a 404
export const dynamicParams = false

export async function generateStaticParams() {
  const posts = await fetch('https://.../posts').then((res) => res.json())
  const topPosts = posts.slice(0, 10)

  return topPosts.map((post) => ({
    slug: post.slug,
  }))
}
```

LANGUAGE: jsx
CODE:
```
// All posts besides the top 10 will be a 404
export const dynamicParams = false

export async function generateStaticParams() {
  const posts = await fetch('https://.../posts').then((res) => res.json())
  const topPosts = posts.slice(0, 10)

  return topPosts.map((post) => ({
    slug: post.slug,
  }))
}
```

----------------------------------------

TITLE: Enabling Styled Components in next.config.js
DESCRIPTION: This code snippet demonstrates how to enable styled-components in the `next.config.js` file. By setting `styledComponents` to `true` within the `compiler` options, you instruct Next.js to process styled-components during compilation.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/css-in-js.mdx#_snippet_4

LANGUAGE: javascript
CODE:
```
module.exports = {
  compiler: {
    styledComponents: true,
  },
}
```

----------------------------------------

TITLE: Using the redirect Function Next.js TSX
DESCRIPTION: Illustrates the use of the redirect function in a TypeScript Server Component to perform server-side redirects. It's imported from 'next/navigation'. The example redirects to '/login' or '/join' based on the result of an asynchronous data fetch within a dynamic route segment page.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-building-your-application/01-routing/04-linking-and-navigating.mdx#_snippet_4

LANGUAGE: tsx
CODE:
```
import { redirect } from 'next/navigation'

async function fetchTeam(id: string) {
  const res = await fetch('https://...')
  if (!res.ok) return undefined
  return res.json()
}

export default async function Profile({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  if (!id) {
    redirect('/login')
  }

  const team = await fetchTeam(id)
  if (!team) {
    redirect('/join')
  }

  // ...
}
```

----------------------------------------

TITLE: Configuring Redirects with i18n Support in Next.js - JavaScript
DESCRIPTION: Defines the `i18n` configuration for locales in a Next.js application, allowing automatic prefixing of sources and destinations in redirect rules. It establishes how the application should handle locales, either by setting them automatically or defining them explicitly when `locale: false` is used. Supports matching specific locale paths even when prefixing is not automatic.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/05-config/01-next-config-js/redirects.mdx#2025-04-21_snippet_6

LANGUAGE: JavaScript
CODE:
```
module.exports = {
  i18n: {
    locales: ['en', 'fr', 'de'],
    defaultLocale: 'en',
  },

  async redirects() {
    return [
      {
        source: '/with-locale', // automatically handles all locales
        destination: '/another', // automatically passes the locale on
        permanent: false,
      },
      {
        // does not handle locales automatically since locale: false is set
        source: '/nl/with-locale-manual',
        destination: '/nl/another',
        locale: false,
        permanent: false,
      },
      {
        // this matches '/' since `en` is the defaultLocale
        source: '/en',
        destination: '/en/another',
        locale: false,
        permanent: false,
      },
      // it's possible to match all locales even when locale: false is set
      {
        source: '/:locale/page',
        destination: '/en/newpage',
        permanent: false,
        locale: false,
      },
      {
        // this gets converted to /(en|fr|de)/(.*) so will not match the top-level
        // `/` or `/fr` routes like /:path* would
        source: '/(.*)',
        destination: '/another',
        permanent: false,
      },
    ]
  },
}
```

----------------------------------------

TITLE: Fetching Data in App Router with Server Components (TSX)
DESCRIPTION: This code demonstrates how to fetch data inside a React Server Component in the App Router. It uses the `fetch()` API with the `no-store` cache option to prevent caching, similar to `getServerSideProps`. The fetched data is then used to render a list of projects.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/migrating/app-router-migration.mdx#_snippet_27

LANGUAGE: tsx
CODE:
```
// `app` directory

// This function can be named anything
async function getProjects() {
  const res = await fetch(`https://...`, { cache: 'no-store' })
  const projects = await res.json()

  return projects
}

export default async function Dashboard() {
  const projects = await getProjects()

  return (
    <ul>
      {projects.map((project) => (
        <li key={project.id}>{project.name}</li>
      ))}
    </ul>
  )
}
```

----------------------------------------

TITLE: Redirecting to Login Page in Middleware (After - Correct)
DESCRIPTION: This code snippet shows the correct approach for handling authorization in Next.js Middleware v12.2+ by redirecting the user to a login page if they are not authenticated. It sets a 'from' query parameter to retain the original intended destination.
SOURCE: https://github.com/vercel/next.js/blob/canary/errors/returning-response-body-in-middleware.mdx#2025-04-21_snippet_1

LANGUAGE: typescript
CODE:
```
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { isAuthValid } from './lib/auth'

export function middleware(request: NextRequest) {
  // Example function to validate auth
  if (isAuthValid(request)) {
    return NextResponse.next()
  }

  request.nextUrl.searchParams.set('from', request.nextUrl.pathname)
  request.nextUrl.pathname = '/login'

  return NextResponse.redirect(request.nextUrl)
}
```

----------------------------------------

TITLE: Using useParams in TypeScript with Next.js
DESCRIPTION: The example demonstrates how to use the useParams hook in a TypeScript context. It retrieves dynamic parameters from the current URL and logs them. This component is designed as a Client Component and requires Next.js version that supports Client Components.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/04-functions/use-params.mdx#2025-04-21_snippet_0

LANGUAGE: tsx
CODE:
```
'use client'

import { useParams } from 'next/navigation'

export default function ExampleClientComponent() {
  const params = useParams<{ tag: string; item: string }>()

  // Route -> /shop/[tag]/[item]
  // URL -> /shop/shoes/nike-air-max-97
  // `params` -> { tag: 'shoes', item: 'nike-air-max-97' }
  console.log(params)

  return '...'
}

```

----------------------------------------

TITLE: Using Google Fonts with Next.js Font Module
DESCRIPTION: Demonstrates how to use Google Fonts with the next/font module. This example shows importing and applying a Google Font to the root layout.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/01-getting-started/04-images-and-fonts.mdx#2025-04-21_snippet_4

LANGUAGE: tsx
CODE:
```
import { Geist } from 'next/font/google'

const geist = Geist({
  subsets: ['latin'],
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={geist.className}>
      <body>{children}</body>
    </html>
  )
}
```

LANGUAGE: jsx
CODE:
```
import { Geist } from 'next/font/google'

const geist = Geist({
  subsets: ['latin'],
})

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={geist.className}>
      <body>{children}</body>
    </html>
  )
}
```

----------------------------------------

TITLE: Using useRouter, usePathname, useSearchParams in a Client Component (TSX)
DESCRIPTION: This code snippet demonstrates how to use the useRouter, usePathname, and useSearchParams hooks from 'next/navigation' within a Client Component in a Next.js application. These hooks are used for routing and accessing the current pathname and search parameters. The 'use client' directive indicates that this is a Client Component.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/migrating/app-router-migration.mdx#_snippet_22

LANGUAGE: tsx
CODE:
```
'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'

export default function ExampleClientComponent() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // ...
}
```

----------------------------------------

TITLE: Defining Server Functions in a Separate File with JavaScript
DESCRIPTION: Shows how to create Server Functions in a dedicated JavaScript file by placing the 'use server' directive at the top of the file, making all exports Server Functions.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/01-getting-started/07-updating-data.mdx#2025-04-21_snippet_5

LANGUAGE: javascript
CODE:
```
'use server'

export async function createPost() {}
```

----------------------------------------

TITLE: Handling Specific Web Vitals in Pages Router
DESCRIPTION: This example illustrates how to use a `switch` statement within the `useReportWebVitals` callback function in `pages/_app.js` to perform specific actions based on the `name` of the reported metric. This allows developers to handle individual Web Vitals like FCP or LCP differently, integrating with analytics or logging systems as needed.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/04-functions/use-report-web-vitals.mdx#_snippet_3

LANGUAGE: jsx
CODE:
```
import { useReportWebVitals } from 'next/web-vitals'

function MyApp({ Component, pageProps }) {
  useReportWebVitals((metric) => {
    switch (metric.name) {
      case 'FCP': {
        // handle FCP results
        break
      }
      case 'LCP': {
        // handle LCP results
        break
      }
      // ... handle other metrics (TTFB, FID, CLS, INP)
    }
  })

  return <Component {...pageProps} />
}
```

----------------------------------------

TITLE: Loading External Library Dynamically (Pages Router)
DESCRIPTION: This code snippet showcases how to dynamically load an external library (`fuse.js`) using `import()` within the `pages` router. This allows for loading libraries only when they are needed, improving initial page load times.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/lazy-loading.mdx#_snippet_9

LANGUAGE: jsx
CODE:
```
import { useState } from 'react'

const names = ['Tim', 'Joe', 'Bel', 'Lee']

export default function Page() {
  const [results, setResults] = useState()

  return (
    <div>
      <input
        type="text"
        placeholder="Search"
        onChange={async (e) => {
          const { value } = e.currentTarget
          // Dynamically load fuse.js
          const Fuse = (await import('fuse.js')).default
          const fuse = new Fuse(names)

          setResults(fuse.search(value))
        }}
      />
      <pre>Results: {JSON.stringify(results, null, 2)}</pre>
    </div>
  )
}
```

----------------------------------------

TITLE: Client-Side Error Handling with useActionState in Next.js
DESCRIPTION: React component implementing client-side error handling using useActionState hook. Displays error messages from server actions and handles form submission state.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-building-your-application/01-routing/05-error-handling.mdx#2025-04-23_snippet_1

LANGUAGE: typescript
CODE:
```
'use client'

import { useActionState } from 'react'
import { createUser } from '@/app/actions'

const initialState = {
  message: '',
}

export function Signup() {
  const [state, formAction, pending] = useActionState(createUser, initialState)

  return (
    <form action={formAction}>
      <label htmlFor="email">Email</label>
      <input type="text" id="email" name="email" required />
      {/* ... */}
      <p aria-live="polite">{state?.message}</p>
      <button disabled={pending}>Sign up</button>
    </form>
  )
}
```

LANGUAGE: javascript
CODE:
```
'use client'

import { useActionState } from 'react'
import { createUser } from '@/app/actions'

const initialState = {
  message: '',
}

export function Signup() {
  const [state, formAction, pending] = useActionState(createUser, initialState)

  return (
    <form action={formAction}>
      <label htmlFor="email">Email</label>
      <input type="text" id="email" name="email" required />
      {/* ... */}
      <p aria-live="polite">{state?.message}</p>
      <button disabled={pending}>Sign up</button>
    </form>
  )
}
```

----------------------------------------

TITLE: getServerSideProps with redirect return - JavaScript
DESCRIPTION: This example demonstrates how to redirect a user from within `getServerSideProps` using the `redirect` property. If the data fetch fails, the user is redirected to the specified `destination`.  The `permanent` property controls whether the redirect is permanent (308) or temporary (307).
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/02-pages/04-api-reference/03-functions/get-server-side-props.mdx#_snippet_4

LANGUAGE: JavaScript
CODE:
```
export async function getServerSideProps(context) {
  const res = await fetch(`https://.../data`)
  const data = await res.json()

  if (!data) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  return {
    props: {}, // will be passed to the page component as props
  }
}
```

----------------------------------------

TITLE: Submitting Form Data to API Route - TypeScript
DESCRIPTION: This code snippet demonstrates how to submit form data to an API route in Next.js using TypeScript. It prevents the default form submission, creates a FormData object from the form, sends a POST request to the API route, and handles the response.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/02-pages/03-building-your-application/03-data-fetching/03-forms-and-mutations.mdx#_snippet_2

LANGUAGE: typescript
CODE:
```
import { FormEvent } from 'react'

export default function Page() {
  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const response = await fetch('/api/submit', {
      method: 'POST',
      body: formData,
    })

    // Handle response if necessary
    const data = await response.json()
    // ...
  }

  return (
    <form onSubmit={onSubmit}>
      <input type="text" name="name" />
      <button type="submit">Submit</button>
    </form>
  )
}
```

----------------------------------------

TITLE: Streaming Responses in Next.js - TypeScript
DESCRIPTION: This snippet shows how to implement a streaming response using OpenAI's API in a POST request. It demonstrates building a stream from messages passed in the request body.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-building-your-application/01-routing/13-route-handlers.mdx#2025-04-21_snippet_8

LANGUAGE: typescript
CODE:
```
import { openai } from '@ai-sdk/openai'
import { StreamingTextResponse, streamText } from 'ai'

export async function POST(req: Request) {
  const { messages } = await req.json()
  const result = await streamText({
    model: openai('gpt-4-turbo'),
    messages,
  })

  return new StreamingTextResponse(result.toAIStream())
}
```

----------------------------------------

TITLE: Setting Session Cookie in Next.js Pages Router API Route (JavaScript)
DESCRIPTION: This snippet demonstrates setting a session cookie within a Next.js Pages Router API route handler. It encrypts session data from the request body using a separate `encrypt` function and then uses the `cookie` library's `serialize` function to create an HTTP-only, secure cookie with a one-week expiration, setting it in the response headers.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/authentication.mdx#_snippet_18

LANGUAGE: js
CODE:
```
import { serialize } from 'cookie';
import { encrypt } from '@/app/lib/session';

export default function handler(req, res) {
  const sessionData = req.body;
  const encryptedSessionData = encrypt(sessionData);

  const cookie = serialize('session', encryptedSessionData, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // One week
    path: '/',
  });
  res.setHeader('Set-Cookie', cookie);
  res.status(200).json({ message: 'Successfully set cookie!' });
}
```

----------------------------------------

TITLE: Enabling Node.js Runtime for Next.js Middleware (JS)
DESCRIPTION: Configures Next.js to enable the experimental Node.js runtime for middleware by adding `nodeMiddleware: true` within the `experimental` object in the `next.config.js` file. This feature is experimental and requires a canary build of Next.js.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-building-your-application/01-routing/14-middleware.mdx#_snippet_20

LANGUAGE: javascript
CODE:
```
const nextConfig = {
  experimental: {
    nodeMiddleware: true,
  },
}

export default nextConfig
```

----------------------------------------

TITLE: Handling Filtering with Search Parameters in Next.js
DESCRIPTION: Demonstrates how to implement filtering, pagination, and sorting using the searchParams prop in a Next.js page component. The example extracts and provides default values for query parameters.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/03-file-conventions/page.mdx#2025-04-21_snippet_4

LANGUAGE: tsx
CODE:
```
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { page = '1', sort = 'asc', query = '' } = await searchParams

  return (
    <div>
      <h1>Product Listing</h1>
      <p>Search query: {query}</p>
      <p>Current page: {page}</p>
      <p>Sort order: {sort}</p>
    </div>
  )
}
```

LANGUAGE: jsx
CODE:
```
export default async function Page({ searchParams }) {
  const { page = '1', sort = 'asc', query = '' } = await searchParams

  return (
    <div>
      <h1>Product Listing</h1>
      <p>Search query: {query}</p>
      <p>Current page: {page}</p>
      <p>Sort order: {sort}</p>
    </div>
  )
}
```

----------------------------------------

TITLE: Sending Google Analytics events (App Router - JSX)
DESCRIPTION: This code snippet demonstrates how to send events to Google Analytics using the `sendGAEvent` function from `@next/third-parties/google` within an App Router component. It defines a button that, when clicked, dispatches a custom event named 'buttonClicked' with the value 'xyz'. The `'use client'` directive indicates that this is a client-side component.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/third-party-libraries.mdx#_snippet_13

LANGUAGE: jsx
CODE:
```
'use client'

import { sendGAEvent } from '@next/third-parties/google'

export function EventButton() {
  return (
    <div>
      <button
        onClick={() => sendGAEvent('event', 'buttonClicked', { value: 'xyz' })
      >
        Send Event
      </button>
    </div>
  )
}
```

----------------------------------------

TITLE: Enabling Standalone Output in Next.js Configuration (JavaScript)
DESCRIPTION: Configures Next.js to output a standalone build directory (`.next/standalone`) containing only necessary files for production deployment, including a minimal `server.js`. This directory can be deployed without `node_modules`.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/05-config/01-next-config-js/output.mdx#_snippet_0

LANGUAGE: javascript
CODE:
```
module.exports = {
  output: 'standalone',
}
```

----------------------------------------

TITLE: Defining NextResponse Class for Next.js Middleware/Edge
DESCRIPTION: This JavaScript code defines the `NextResponse` class, extending the standard `Response`. It includes custom logic for handling request headers in middleware via `handleMiddlewareField`, manages cookies using a Proxy wrapping `ResponseCookies`, and provides static methods for creating specific response types like `json`, `redirect`, `rewrite`, and `next`. It relies on imported utilities and spec extensions.
SOURCE: https://github.com/vercel/next.js/blob/canary/turbopack/crates/turbopack-ecmascript/tests/tree-shaker/analyzer/next-response/output.md#_snippet_18

LANGUAGE: javascript
CODE:
```
import { validateURL } from '../utils';
import { NextURL } from '../next-url';
import { toNodeOutgoingHttpHeaders } from '../utils';
import { ResponseCookies } from './cookies';
import { stringifyCookie } from '../../web/spec-extension/cookies';
import { ReflectAdapter } from './adapters/reflect';
import '../../web/spec-extension/cookies';
import '../next-url';
import '../utils';
import './adapters/reflect';
import './cookies';
const INTERNALS = Symbol('internal response');
const REDIRECTS = new Set([
    301,
    302,
    303,
    307,
    308
]);
function handleMiddlewareField(init, headers) {
    var _init_request;
    if (init == null ? void 0 : (_init_request = init.request) == null ? void 0 : _init_request.headers) {
        if (!(init.request.headers instanceof Headers)) {
            throw new Error('request.headers must be an instance of Headers');
        }
        const keys = [];
        for (const [key, value] of init.request.headers){
            headers.set('x-middleware-request-' + key, value);
            keys.push(key);
        }
        headers.set('x-middleware-override-headers', keys.join(','));
    }
}
class NextResponse extends Response {
    constructor(body, init = {}){
        super(body, init);
        const headers = this.headers;
        const cookies = new ResponseCookies(headers);
        const cookiesProxy = new Proxy(cookies, {
            get (target, prop, receiver) {
                switch(prop){
                    case 'delete':
                    case 'set':
                        {
                            return (...args)=>{
                                const result = Reflect.apply(target[prop], target, args);
                                const newHeaders = new Headers(headers);
                                if (result instanceof ResponseCookies) {
                                    headers.set('x-middleware-set-cookie', result.getAll().map((cookie)=>stringifyCookie(cookie)).join(','));
                                }
                                handleMiddlewareField(init, newHeaders);
                                return result;
                            };
                        }
                    default:
                        return ReflectAdapter.get(target, prop, receiver);
                }
            }
        });
        this[INTERNALS] = {
            cookies: cookiesProxy,
            url: init.url ? new NextURL(init.url, {
                headers: toNodeOutgoingHttpHeaders(headers),
                nextConfig: init.nextConfig
            }) : undefined
        };
    }
    [Symbol.for('edge-runtime.inspect.custom')]() {
        return {
            cookies: this.cookies,
            url: this.url,
            body: this.body,
            bodyUsed: this.bodyUsed,
            headers: Object.fromEntries(this.headers),
            ok: this.ok,
            redirected: this.redirected,
            status: this.status,
            statusText: this.statusText,
            type: this.type
        };
    }
    get cookies() {
        return this[INTERNALS].cookies;
    }
    static json(body, init) {
        const response = Response.json(body, init);
        return new NextResponse(response.body, response);
    }
    static redirect(url, init) {
        const status = typeof init === 'number' ? init : (init == null ? void 0 : init.status) ?? 307;
        if (!REDIRECTS.has(status)) {
            throw new RangeError('Failed to execute "redirect" on "response": Invalid status code');
        }
        const initObj = typeof init === 'object' ? init : {};
        const headers = new Headers(initObj == null ? void 0 : initObj.headers);
        headers.set('Location', validateURL(url));
        return new NextResponse(null, {
            ...initObj,
            headers,
            status
        });
    }
    static rewrite(destination, init) {
        const headers = new Headers(init == null ? void 0 : init.headers);
        headers.set('x-middleware-rewrite', validateURL(destination));
        handleMiddlewareField(init, headers);
        return new NextResponse(null, {
            ...init,
            headers
        });
    }
    static next(init) {
        const headers = new Headers(init == null ? void 0 : init.headers);
        headers.set('x-middleware-next', '1');
        handleMiddlewareField(init, headers);
        return new NextResponse(null, {
            ...init,
            headers
        });
    }
}
export { NextResponse };
export { INTERNALS as a } from "__TURBOPACK_VAR__" assert {
    __turbopack_var__: true
};
export { REDIRECTS as b } from "__TURBOPACK_VAR__" assert {
    __turbopack_var__: true
};
export { handleMiddlewareField as c } from "__TURBOPACK_VAR__" assert {
    __turbopack_var__: true
};
export { NextResponse as d } from "__TURBOPACK_VAR__" assert {
    __turbopack_var__: true
};
export { };
```

----------------------------------------

TITLE: Configuring width, initialScale, maximumScale, and userScalable (JSX)
DESCRIPTION: This code snippet demonstrates configuring width, initialScale, maximumScale, and userScalable properties in the viewport using JavaScript. It exports a viewport object with these properties set.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/04-functions/generate-viewport.mdx#_snippet_11

LANGUAGE: jsx
CODE:
```
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  // Also supported but less commonly used
  // interactiveWidget: 'resizes-visual',
}
```

----------------------------------------

TITLE: Nesting Functional Component Children in Next.js Link
DESCRIPTION: These snippets illustrate how to use a functional component as the child of `Link`. In addition to `passHref` and `legacyBehavior`, the functional component must be wrapped in `React.forwardRef` to correctly pass the `ref` needed by the `Link` component. Examples are provided for both TSX and JSX in App Router and Pages Router contexts.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/02-components/link.mdx#_snippet_14

LANGUAGE: TSX
CODE:
```
import Link from 'next/link'
import React from 'react'

// Define the props type for MyButton
interface MyButtonProps {
  onClick?: React.MouseEventHandler<HTMLAnchorElement>
  href?: string
}

// Use React.ForwardRefRenderFunction to properly type the forwarded ref
const MyButton: React.ForwardRefRenderFunction<
  HTMLAnchorElement,
  MyButtonProps
> = ({ onClick, href }, ref) => {
  return (
    <a href={href} onClick={onClick} ref={ref}>
      Click Me
    </a>
  )
}

// Use React.forwardRef to wrap the component
const ForwardedMyButton = React.forwardRef(MyButton)

export default function Page() {
  return (
    <Link href="/about" passHref legacyBehavior>
      <ForwardedMyButton />
    </Link>
  )
}
```

LANGUAGE: JSX
CODE:
```
import Link from 'next/link'
import React from 'react'

// `onClick`, `href`, and `ref` need to be passed to the DOM element
// for proper handling
const MyButton = React.forwardRef(({ onClick, href }, ref) => {
  return (
    <a href={href} onClick={onClick} ref={ref}>
      Click Me
    </a>
  )
})

// Add a display name for the component (useful for debugging)
MyButton.displayName = 'MyButton'

export default function Page() {
  return (
    <Link href="/about" passHref legacyBehavior>
      <MyButton />
    </Link>
  )
}

```

LANGUAGE: TSX
CODE:
```
import Link from 'next/link'
import React from 'react'

// Define the props type for MyButton
interface MyButtonProps {
  onClick?: React.MouseEventHandler<HTMLAnchorElement>
  href?: string
}

// Use React.ForwardRefRenderFunction to properly type the forwarded ref
const MyButton: React.ForwardRefRenderFunction<
  HTMLAnchorElement,
  MyButtonProps
> = ({ onClick, href }, ref) => {
  return (
    <a href={href} onClick={onClick} ref={ref}>
      Click Me
    </a>
  )
}

// Use React.forwardRef to wrap the component
const ForwardedMyButton = React.forwardRef(MyButton)

export default function Home() {
  return (
    <Link href="/about" passHref legacyBehavior>
      <ForwardedMyButton />
    </Link>
  )
}
```

LANGUAGE: JSX
CODE:
```
import Link from 'next/link'
import React from 'react'

// `onClick`, `href`, and `ref` need to be passed to the DOM element
// for proper handling
const MyButton = React.forwardRef(({ onClick, href }, ref) => {
  return (
    <a href={href} onClick={onClick} ref={ref}>
      Click Me
    </a>
  )
})

// Add a display name for the component (useful for debugging)
MyButton.displayName = 'MyButton'

export default function Home() {
  return (
    <Link href="/about" passHref legacyBehavior>
      <MyButton />
    </Link>
  )
}
```

----------------------------------------

TITLE: Reading HTTP Request Headers with Next.js in TypeScript
DESCRIPTION: This snippet illustrates how to use the `headers` function in a TypeScript-based Next.js application to read HTTP request headers asynchronously. The `headers` function returns a read-only Web Headers object, and the `get` method is used to retrieve specific header values, such as the 'user-agent'. This approach requires no parameters and provides read-only access to headers.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/04-functions/headers.mdx#2025-04-21_snippet_0

LANGUAGE: typescript
CODE:
```
import { headers } from 'next/headers'

export default async function Page() {
  const headersList = await headers()
  const userAgent = headersList.get('user-agent')
}
```

----------------------------------------

TITLE: Using Localized Dictionary in Next.js Page Component
DESCRIPTION: This snippet shows how to use the getDictionary function to fetch and apply localized strings in a Next.js page component, with both TypeScript and JavaScript versions.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-building-your-application/01-routing/15-internationalization.mdx#2025-04-21_snippet_5

LANGUAGE: typescript
CODE:
```
import { getDictionary } from './dictionaries'

export default async function Page({
  params,
}: {
  params: Promise<{ lang: 'en' | 'nl' }>
}) {
  const { lang } = await params
  const dict = await getDictionary(lang) // en
  return <button>{dict.products.cart}</button> // Add to Cart
}
```

LANGUAGE: javascript
CODE:
```
import { getDictionary } from './dictionaries'

export default async function Page({ params }) {
  const { lang } = await params
  const dict = await getDictionary(lang) // en
  return <button>{dict.products.cart}</button> // Add to Cart
}
```

----------------------------------------

TITLE: Enable Rust-based MDX Compiler in Next.js
DESCRIPTION: This code snippet shows how to enable the experimental Rust-based MDX compiler in Next.js by setting the `mdxRs` flag to `true` within the `experimental` section of the `next.config.js` file. This configuration is necessary to utilize the new compiler for MDX file processing.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/mdx.mdx#_snippet_44

LANGUAGE: javascript
CODE:
```
module.exports = withMDX({
  experimental: {
    mdxRs: true,
  },
})
```

----------------------------------------

TITLE: Fetching Data with getInitialProps in JavaScript
DESCRIPTION: This code snippet showcases how to use `getInitialProps` within a Next.js page component written in JavaScript to fetch data from an API and pass it as props to the component. Similar to the TypeScript example, it fetches the number of stars for the Next.js repository from GitHub.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/02-pages/04-api-reference/03-functions/get-initial-props.mdx#2025-04-21_snippet_1

LANGUAGE: javascript
CODE:
```
Page.getInitialProps = async (ctx) => {
  const res = await fetch('https://api.github.com/repos/vercel/next.js')
  const json = await res.json()
  return { stars: json.stargazers_count }
}

export default function Page({ stars }) {
  return stars
}
```

----------------------------------------

TITLE: Disable Webpack Cache in Next.js Configuration
DESCRIPTION: This snippet shows how to disable the Webpack cache in your Next.js application. By modifying the Webpack configuration within your `next.config.mjs` file, you can set the cache type to 'memory' to reduce disk usage.  The example explicitly sets `config.cache` to an empty object effectively disabling it.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/memory-usage.mdx#_snippet_4

LANGUAGE: javascript
CODE:
```
/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (
    config,
    { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }
  ) => {
    if (config.cache && !dev) {
      config.cache = Object.freeze({
        type: 'memory',
      })
    }
    // Important: return the modified config
    return config
  },
}

export default nextConfig
```

----------------------------------------

TITLE: Adding Subtitles to a Video in Next.js
DESCRIPTION: This code snippet shows how to add subtitles to a video displayed in a Next.js application, where the video and subtitle files are hosted on Vercel Blob. It fetches both the video URL and the subtitle file URL using `list` from `@vercel/blob` and includes a `<track>` element within the `<video>` tag to display the subtitles.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/videos.mdx#_snippet_6

LANGUAGE: jsx
CODE:
```
async function VideoComponent({ fileName }) {
  const { blobs } = await list({
    prefix: fileName,
    limit: 2,
  })
  const { url } = blobs[0]
  const { url: captionsUrl } = blobs[1]

  return (
    <video controls preload="none" aria-label="Video player">
      <source src={url} type="video/mp4" />
      <track src={captionsUrl} kind="subtitles" srcLang="en" label="English" />
      Your browser does not support the video tag.
    </video>
  )
}
```

----------------------------------------

TITLE: Accessing Dynamic Route Parameters in Generated Image - JSX
DESCRIPTION: Demonstrates how the default export function in a generated image file (like opengraph-image.js or twitter-image.js) receives a `params` prop. This prop contains the dynamic route parameters, allowing the image content to be customized based on the specific route being accessed.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/03-file-conventions/01-metadata/opengraph-image.mdx#_snippet_10

LANGUAGE: JSX
CODE:
```
export default function Image({ params }) {
  // ...
}
```

----------------------------------------

TITLE: Implementing Layout with Client Component in TypeScript
DESCRIPTION: This code demonstrates how to implement a layout component in Next.js using TypeScript, incorporating a Client Component to handle dynamic data. The layout receives children as a prop and renders them within a main element, alongside the ClientComponent.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/03-file-conventions/layout.mdx#_snippet_8

LANGUAGE: typescript
CODE:
```
import { ClientComponent } from '@/app/ui/ClientComponent'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ClientComponent />
      {/* Other Layout UI */}
      <main>{children}</main>
    </>
  )
}
```

----------------------------------------

TITLE: Creating a Nested Blog Layout in Next.js
DESCRIPTION: Implements a layout component specifically for the blog section. This nested layout wraps all pages under the /blog route, providing shared UI elements.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/01-getting-started/03-layouts-and-pages.mdx#2025-04-21_snippet_4

LANGUAGE: tsx
CODE:
```
export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <section>{children}</section>
}
```

LANGUAGE: jsx
CODE:
```
export default function BlogLayout({ children }) {
  return <section>{children}</section>
}
```

----------------------------------------

TITLE: Using useRouter for Navigation in Next.js - TSX
DESCRIPTION: This snippet demonstrates how to use the useRouter hook from Next.js to programmatically navigate to the '/dashboard' route when a button is clicked. It imports useRouter from 'next/navigation' and creates a button that uses the router's push method to navigate.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/04-functions/use-router.mdx#2025-04-21_snippet_0

LANGUAGE: tsx
CODE:
```
'use client'

import { useRouter } from 'next/navigation'

export default function Page() {
  const router = useRouter()

  return (
    <button type="button" onClick={() => router.push('/dashboard/')}> 
      Dashboard
    </button>
  )
}

```

----------------------------------------

TITLE: Inline Server Functions in Server Components with TypeScript
DESCRIPTION: Demonstrates how to define an inline Server Function directly within a Server Component in TypeScript. The function is marked with the 'use server' directive inside the component.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/01-getting-started/07-updating-data.mdx#2025-04-21_snippet_2

LANGUAGE: typescript
CODE:
```
export default function Page() {
  // Server Action
  async function createPost(formData: FormData) {
    'use server'
    // ...
  }

  return <></>
}
```

----------------------------------------

TITLE: Using revalidatePath in a Route Handler
DESCRIPTION: Provides examples of using `revalidatePath` within a Next.js Route Handler (both TypeScript and JavaScript versions). The handler reads a 'path' query parameter from the request and calls `revalidatePath` with that value, returning a JSON response indicating the result.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/04-functions/revalidatePath.mdx#_snippet_6

LANGUAGE: typescript
CODE:
```
import { revalidatePath } from 'next/cache'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const path = request.nextUrl.searchParams.get('path')

  if (path) {
    revalidatePath(path)
    return Response.json({ revalidated: true, now: Date.now() })
  }

  return Response.json({
    revalidated: false,
    now: Date.now(),
    message: 'Missing path to revalidate',
  })
}
```

LANGUAGE: javascript
CODE:
```
import { revalidatePath } from 'next/cache'

export async function GET(request) {
  const path = request.nextUrl.searchParams.get('path')

  if (path) {
    revalidatePath(path)
    return Response.json({ revalidated: true, now: Date.now() })
  }

  return Response.json({
    revalidated: false,
    now: Date.now(),
    message: 'Missing path to revalidate',
  })
}
```

----------------------------------------

TITLE: Check and Display Draft Mode Status in Next.js (TypeScript)
DESCRIPTION: This code snippet demonstrates how to check and display the current Draft Mode status within a Next.js Server Component using TypeScript. It retrieves the status using `draftMode()` and renders a paragraph indicating whether Draft Mode is currently enabled or disabled.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/04-functions/draft-mode.mdx#_snippet_6

LANGUAGE: typescript
CODE:
```
import { draftMode } from 'next/headers'

export default async function Page() {
  const { isEnabled } = await draftMode()
  return (
    <main>
      <h1>My Blog Post</h1>
      <p>Draft Mode is currently {isEnabled ? 'Enabled' : 'Disabled'}</p>
    </main>
  )
}
```

----------------------------------------

TITLE: Implementing a Basic API Route in Next.js (TypeScript)
DESCRIPTION: This snippet demonstrates how to create a simple API route that returns a JSON response with a status code of 200. It uses TypeScript for type safety.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/02-pages/03-building-your-application/01-routing/07-api-routes.mdx#2025-04-23_snippet_0

LANGUAGE: typescript
CODE:
```
import type { NextApiRequest, NextApiResponse } from 'next'

type ResponseData = {
  message: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  res.status(200).json({ message: 'Hello from Next.js!' })
}
```

----------------------------------------

TITLE: Implementing permanentRedirect in Server Component
DESCRIPTION: Example of using permanentRedirect to redirect users when a resource is not found, specifically in a team profile page server component with dynamic routing
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/04-functions/permanentRedirect.mdx#2025-04-21_snippet_1

LANGUAGE: jsx
CODE:
```
import { permanentRedirect } from 'next/navigation'

async function fetchTeam(id) {
  const res = await fetch('https://...')
  if (!res.ok) return undefined
  return res.json()
}

export default async function Profile({ params }) {
  const { id } = await params
  const team = await fetchTeam(id)
  if (!team) {
    permanentRedirect('/login')
  }

  // ...
}
```

----------------------------------------

TITLE: Displaying Content Based on Route Parameters in Next.js
DESCRIPTION: Example showing how to display content based on the dynamic route parameters in a Next.js page component. The params object is awaited to access the specific route segment values.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/03-file-conventions/page.mdx#2025-04-21_snippet_3

LANGUAGE: tsx
CODE:
```
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  return <h1>Blog Post: {slug}</h1>
}
```

LANGUAGE: jsx
CODE:
```
export default async function Page({ params }) {
  const { slug } = await params
  return <h1>Blog Post: {slug}</h1>
}
```

----------------------------------------

TITLE: Fetching Data with getStaticProps (JavaScript)
DESCRIPTION: This code snippet demonstrates how to use `getStaticProps` in a Next.js page to fetch data from an API and pass it as props to the page component. It fetches repository data from the GitHub API and returns it as props. The component then renders the number of stargazers.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/02-pages/04-api-reference/03-functions/get-static-props.mdx#_snippet_1

LANGUAGE: JavaScript
CODE:
```
export async function getStaticProps() {
  const res = await fetch('https://api.github.com/repos/vercel/next.js')
  const repo = await res.json()
  return { props: { repo } }
}

export default function Page({ repo }) {
  return repo.stargazers_count
}
```

----------------------------------------

TITLE: Defining Environment Variables in .env File (Next.js)
DESCRIPTION: Next.js automatically loads environment variables from `.env` files into `process.env`. Variables defined here are typically available on the server-side.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/environment-variables.mdx#_snippet_0

LANGUAGE: txt
CODE:
```
DB_HOST=localhost
DB_USER=myuser
DB_PASS=mypassword
```

----------------------------------------

TITLE: Creating a Static sitemap.xml in Next.js
DESCRIPTION: Demonstrates the structure of a simple, manually created `sitemap.xml` file placed in the `app` directory. It lists basic page URLs with optional metadata like `lastmod`, `changefreq`, and `priority` according to the sitemaps.org protocol. This approach is suitable for smaller sites with infrequent changes.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/03-file-conventions/01-metadata/sitemap.mdx#_snippet_0

LANGUAGE: XML
CODE:
```
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://acme.com</loc>
    <lastmod>2023-04-06T15:02:24.021Z</lastmod>
    <changefreq>yearly</changefreq>
    <priority>1</priority>
  </url>
  <url>
    <loc>https://acme.com/about</loc>
    <lastmod>2023-04-06T15:02:24.021Z</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://acme.com/blog</loc>
    <lastmod>2023-04-06T15:02:24.021Z</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.5</priority>
  </url>
</urlset>
```

----------------------------------------

TITLE: API Route Handler in app (TypeScript)
DESCRIPTION: This code snippet demonstrates a basic API Route Handler in the `app` directory using TypeScript. It defines an asynchronous GET function that accepts a Request object.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/migrating/app-router-migration.mdx#_snippet_40

LANGUAGE: typescript
CODE:
```
export async function GET(request: Request) {}
```

----------------------------------------

TITLE: Configuring Static Export in Next.js
DESCRIPTION: This snippet configures Next.js to generate a static export of the application. By setting `output: 'export'` in `next.config.js`, Next.js will create an `out` directory containing the HTML, CSS, and JavaScript assets for the application after running `next build`. Note that server features are not supported with static exports.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/single-page-applications.mdx#_snippet_17

LANGUAGE: typescript
CODE:
```
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export',
}

export default nextConfig
```

----------------------------------------

TITLE: Configuring Robots Metadata in Next.js
DESCRIPTION: This code snippet demonstrates how to configure robots metadata, including index, follow, nocache, and Google-specific directives like noimageindex, max-video-preview, max-image-preview, and max-snippet. The metadata is exported as a constant named `metadata`.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/04-functions/generate-metadata.mdx#_snippet_22

LANGUAGE: tsx
CODE:
```
import type { Metadata } from 'next'

export const metadata: Metadata = {
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}
```

----------------------------------------

TITLE: Dashboard Layout with Params (Server Component) - JavaScript
DESCRIPTION: This code defines a server component layout for a dashboard that receives route parameters. It extracts the 'team' parameter from the params prop, which is now a promise, and uses it to personalize the dashboard header. The children prop renders the content of the specific dashboard page.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/03-file-conventions/layout.mdx#_snippet_11

LANGUAGE: JavaScript
CODE:
```
export default async function DashboardLayout({ children, params }) {
  const { team } = await params

  return (
    <section>
      <header>
        <h1>Welcome to {team}'s Dashboard</h1>
      </header>
      <main>{children}</main>
    </section>
  )
}
```

----------------------------------------

TITLE: Memoizing Data Fetching with React Cache in JavaScript
DESCRIPTION: This JavaScript code snippet demonstrates how to use React's `cache` function to memoize a data fetching function, ensuring that the data is only fetched once even when the function is called multiple times. It imports `cache` from 'react' and a database query function from '@/app/lib/db'. The `getPost` function is memoized using `cache` and fetches a post from the database based on the provided slug.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/01-getting-started/10-metadata-and-og-images.mdx#_snippet_6

LANGUAGE: javascript
CODE:
```
import { cache } from 'react'
import { db } from '@/app/lib/db'

// getPost will be used twice, but execute only once
export const getPost = cache(async (slug) => {
  const res = await db.query.posts.findFirst({ where: eq(posts.slug, slug) })
  return res
})
```

----------------------------------------

TITLE: Generating Open Graph Image with ImageResponse (app/opengraph-image.tsx)
DESCRIPTION: Shows how to use `ImageResponse` in a `opengraph-image.tsx` file to generate Open Graph images, either at build time or dynamically. It defines metadata like `alt`, `size`, and `contentType`, and then exports an `Image` function that returns a new `ImageResponse` with a JSX element and size options.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/04-functions/image-response.mdx#_snippet_2

LANGUAGE: tsx
CODE:
```
import { ImageResponse } from 'next/og'

// Image metadata
export const alt = 'My site'
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

// Image generation
export default async function Image() {
  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        style={{
          fontSize: 128,
          background: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        My site
      </div>
    ),
    // ImageResponse options
    {
      // For convenience, we can re-use the exported opengraph-image
      // size config to also set the ImageResponse's width and height.
      ...size,
    }
  )
}
```

----------------------------------------

TITLE: Configuring Allowed Origins for Server Actions (Next.js JS)
DESCRIPTION: Configures the `experimental.serverActions.allowedOrigins` option in `next.config.js`. This setting defines a list of trusted origins, including support for wildcards, from which Server Actions are permitted to be invoked. This is an advanced security measure for scenarios involving reverse proxies or different backend architectures.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-building-your-application/02-data-fetching/03-server-actions-and-mutations.mdx#_snippet_31

LANGUAGE: JavaScript
CODE:
```
/** @type {import('next').NextConfig} */
module.exports = {
  experimental: {
    serverActions: {
      allowedOrigins: ['my-proxy.com', '*.my-proxy.com'],
    },
  },
}
```

----------------------------------------

TITLE: Disabling Scroll on Link Navigation (App Router)
DESCRIPTION: Shows how to prevent Next.js from scrolling to the top or a hash ID when navigating using `<Link>` in the App Router by passing `scroll={false}`. This overrides the default behavior of maintaining scroll position or scrolling to the top if the target element is out of view.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/02-components/link.mdx#_snippet_17

LANGUAGE: JSX
CODE:
```
import Link from 'next/link'

export default function Page() {
  return (
    <Link href="/#hashid" scroll={false}>
      Disables scrolling to the top
    </Link>
  )
}
```

LANGUAGE: TSX
CODE:
```
import Link from 'next/link'

export default function Page() {
  return (
    <Link href="/#hashid" scroll={false}>
      Disables scrolling to the top
    </Link>
  )
}
```

----------------------------------------

TITLE: Returning Non-UI Content in Next.js - JavaScript
DESCRIPTION: This JavaScript snippet illustrates the generation of an RSS feed response in a GET request. It returns XML content that is compliant with the RSS feed format.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-building-your-application/01-routing/13-route-handlers.mdx#2025-04-21_snippet_21

LANGUAGE: javascript
CODE:
```
export async function GET() {
  return new Response(`<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">

<channel>
  <title>Next.js Documentation</title>
  <link>https://nextjs.org/docs</link>
  <description>The React Framework for the Web</description>
</channel>

</rss>`)
}
```

----------------------------------------

TITLE: Importing Global CSS in Root Layout (TypeScript)
DESCRIPTION: Imports a global CSS file in the root layout to apply styles to every route in the application. This example uses TypeScript and React.ReactNode for type safety.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/01-getting-started/05-css.mdx#_snippet_4

LANGUAGE: TypeScript
CODE:
```
// These styles apply to every route in the application
import './global.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

----------------------------------------

TITLE: Managing Configuration Changes in Next.js with JavaScript
DESCRIPTION: This snippet covers the adjustment of Next.js config files to accommodate changes in features such as `bundlePagesExternals` and `serverComponentsExternalPackages`, showing their transition to stable releases as `bundlePagesRouterDependencies` and `serverExternalPackages`. This maintenance is vital for managing build and deployment aspects efficiently.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/upgrading/version-15.mdx#2025-04-21_snippet_12

LANGUAGE: js
CODE:
```
/** @type {import('next').NextConfig} */\nconst nextConfig = {\n  // Before\n  experimental: {\n    bundlePagesExternals: true,\n  },\n\n  // After\n  bundlePagesRouterDependencies: true,\n}\n\nmodule.exports = nextConfig
```

LANGUAGE: js
CODE:
```
/** @type {import('next').NextConfig} */\nconst nextConfig = {\n  // Before\n  experimental: {\n    serverComponentsExternalPackages: ['package-name'],\n  },\n\n  // After\n  serverExternalPackages: ['package-name'],\n}\n\nmodule.exports = nextConfig
```

----------------------------------------

TITLE: Creating a Basic Page in Next.js
DESCRIPTION: Defines a simple page component that renders a heading. In Next.js, pages are created by exporting a default React component from a page file.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/01-getting-started/03-layouts-and-pages.mdx#2025-04-21_snippet_0

LANGUAGE: tsx
CODE:
```
export default function Page() {
  return <h1>Hello Next.js!</h1>
}
```

LANGUAGE: jsx
CODE:
```
export default function Page() {
  return <h1>Hello Next.js!</h1>
}
```

----------------------------------------

TITLE: Configuring exportPathMap in next.config.js
DESCRIPTION: This code snippet shows how to configure the `exportPathMap` function in `next.config.js` to correctly map static routes to Next.js pages, including dynamically routed pages. It highlights the correct way to define a path that matches a dynamically routed page with parameters.
SOURCE: https://github.com/vercel/next.js/blob/canary/errors/export-path-mismatch.mdx#2025-04-21_snippet_0

LANGUAGE: javascript
CODE:
```
module.exports = {
  exportPathMap: function () {
    return {
      '/': { page: '/' },
      // '/blog/nextjs': { page: '/blog/[post]/comment/[id]' },        // wrong
      '/blog/nextjs/comment/1': { page: '/blog/[post]/comment/[id]' }, // correct
    }
  },
}
```

----------------------------------------

TITLE: Defining a Root Layout in Next.js (TSX)
DESCRIPTION: This code defines the root layout for the Next.js application using TypeScript. It's a required layout that wraps all routes and includes the `html` and `body` tags. The component accepts a `children` prop, which represents the content of the application.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-building-your-application/01-routing/03-layouts-and-templates.mdx#_snippet_2

LANGUAGE: typescript
CODE:
```
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {/* Layout UI */}
        <main>{children}</main>
      </body>
    </html>
  )
}
```

----------------------------------------

TITLE: Create App Router Home Page (App Router)
DESCRIPTION: Defines the home page component (`app/page.tsx` or `app/page.js`) for applications using the App Router. This component is rendered at the root route (`/`).
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/01-getting-started/01-installation.mdx#_snippet_4

LANGUAGE: tsx
CODE:
```
export default function Page() {
  return <h1>Hello, Next.js!</h1>
}
```

LANGUAGE: jsx
CODE:
```
export default function Page() {
  return <h1>Hello, Next.js!</h1>
}
```

----------------------------------------

TITLE: Importing External Stylesheet (app directory) - TypeScript
DESCRIPTION: Imports an external stylesheet (Bootstrap CSS) into the root layout component in the `app` directory. This allows using styles from external packages. The component uses TypeScript.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-building-your-application/05-styling/01-css.mdx#_snippet_11

LANGUAGE: typescript
CODE:
```
import 'bootstrap/dist/css/bootstrap.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="container">{children}</body>
    </html>
  )
}
```

----------------------------------------

TITLE: Configuring Ably in Next.js App
DESCRIPTION: This code snippet configures the Ably SDK using the @ably-labs/react-hooks library within a Next.js application. It sets the authentication URL and client ID, utilizing environment variables for dynamic configuration.
SOURCE: https://github.com/vercel/next.js/blob/canary/examples/with-ably/README.md#_snippet_4

LANGUAGE: javascript
CODE:
```
import { configureAbly } from "@ably-labs/react-hooks";

const prefix = process.env.API_ROOT || "";
const clientId =
  Math.random().toString(36).substring(2, 15) +
  Math.random().toString(36).substring(2, 15);

configureAbly({
  authUrl: `${prefix}/api/createTokenRequest?clientId=${clientId}`,
  clientId: clientId,
});

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;
```

----------------------------------------

TITLE: Setting Permissions-Policy Header - JavaScript
DESCRIPTION: This snippet demonstrates how to add the `Permissions-Policy` header to your Next.js headers configuration. This header allows you to selectively enable or disable browser features and APIs (like camera, microphone, geolocation) for your site and any embedded content (iframes), providing fine-grained control over browser capabilities.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/05-config/01-next-config-js/headers.mdx#_snippet_17

LANGUAGE: js
CODE:
```
{
  key: 'Permissions-Policy',
  value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()'
}
```

----------------------------------------

TITLE: Passing Dynamic searchParams Prop Without Immediate Dynamism (JSX)
DESCRIPTION: Demonstrates passing the dynamic `searchParams` prop received by the page component to a child component (`Table`). The page itself remains potentially prerenderable if it doesn't access dynamic APIs directly, deferring dynamism to the child component.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-building-your-application/03-rendering/04-partial-prerendering.mdx#_snippet_10

LANGUAGE: JSX
CODE:
```
import { Table } from './table'

export default function Page({ searchParams }) {
  return (
    <section>
      <h1>This will be prerendered</h1>
      <Table searchParams={searchParams} />
    </section>
  )
}
```

----------------------------------------

TITLE: Invoking Server Functions in Event Handlers with TypeScript
DESCRIPTION: Shows how to invoke a Server Function from an onClick event handler in a TypeScript Client Component. It updates the local state with the returned value from the Server Function.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/01-getting-started/07-updating-data.mdx#2025-04-21_snippet_12

LANGUAGE: typescript
CODE:
```
'use client'

import { incrementLike } from './actions'
import { useState } from 'react'

export default function LikeButton({ initialLikes }: { initialLikes: number }) {
  const [likes, setLikes] = useState(initialLikes)

  return (
    <>
      <p>Total Likes: {likes}</p>
      <button
        onClick={async () => {
          const updatedLikes = await incrementLike()
          setLikes(updatedLikes)
        }}
      >
        Like
      </button>
    </>
  )
}
```

----------------------------------------

TITLE: Importing Component-Specific CSS (JSX)
DESCRIPTION: This code snippet shows how to import CSS styles required by a third-party component directly within the component file. It uses React hooks (`useState`) and a dialog component (`@reach/dialog`) to manage the dialog's visibility. The CSS for the dialog is imported from `@reach/dialog/styles.css`.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-building-your-application/05-styling/01-css.mdx#_snippet_14

LANGUAGE: JSX
CODE:
```
import { useState } from 'react'
import { Dialog } from '@reach/dialog'
import VisuallyHidden from '@reach/visually-hidden'
import '@reach/dialog/styles.css'

function ExampleDialog(props) {
  const [showDialog, setShowDialog] = useState(false)
  const open = () => setShowDialog(true)
  const close = () => setShowDialog(false)

  return (
    <div>
      <button onClick={open}>Open Dialog</button>
      <Dialog isOpen={showDialog} onDismiss={close}>
        <button className="close-button" onClick={close}>
          <VisuallyHidden>Close</VisuallyHidden>
          <span aria-hidden>×</span>
        </button>
        <p>Hello there. I am a dialog</p>
      </Dialog>
    </div>
  )
}
```

----------------------------------------

TITLE: Implementing Search Component with Suspense in JavaScript
DESCRIPTION: Shows how to properly wrap a search component using useSearchParams within a Suspense boundary to prevent client-side rendering issues. The example demonstrates the correct implementation pattern for JavaScript.
SOURCE: https://github.com/vercel/next.js/blob/canary/errors/missing-suspense-with-csr-bailout.mdx#2025-04-21_snippet_1

LANGUAGE: jsx
CODE:
```
'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function Search() {
  const searchParams = useSearchParams()

  return <input placeholder="Search..." />
}

export function Searchbar() {
  return (
    // You could have a loading skeleton as the `fallback` too
    <Suspense>
      <Search />
    </Suspense>
  )
}
```

----------------------------------------

TITLE: Configuring basePath in Next.js Configuration
DESCRIPTION: Set the base path for the entire Next.js application by modifying the next.config.js file. This allows deployment under a specific sub-path like '/docs'.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/05-config/01-next-config-js/basePath.mdx#2025-04-21_snippet_0

LANGUAGE: javascript
CODE:
```
module.exports = {
  basePath: '/docs',
}
```

----------------------------------------

TITLE: Fetching CMS data with getStaticProps (JavaScript)
DESCRIPTION: This snippet shows an example of fetching data from a CMS using `getStaticProps` in a Next.js page. It fetches a list of blog posts and passes them as props to the `Blog` component. This is a typical use case for static site generation with data from a headless CMS.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/02-pages/03-building-your-application/03-data-fetching/01-get-static-props.mdx#_snippet_3

LANGUAGE: javascript
CODE:
```
// posts will be populated at build time by getStaticProps()
export default function Blog({ posts }) {
  return (
    <ul>
      {posts.map((post) => (
        <li>{post.title}</li>
      ))}
    </ul>
  )
}

// This function gets called at build time on server-side.
// It won't be called on client-side, so you can even do
// direct database queries.
export async function getStaticProps() {
  // Call an external API endpoint to get posts.
  // You can use any data fetching library
  const res = await fetch('https://.../posts')
  const posts = await res.json()

  // By returning { props: { posts } }, the Blog component
  // will receive `posts` as a prop at build time
  return {
    props: {
      posts,
    },
  }
}
```

----------------------------------------

TITLE: Managing Cookies in Next.js Middleware
DESCRIPTION: Demonstrates how to get, check for existence, get all, delete cookies from an incoming `NextRequest` using the `RequestCookies` API and how to set cookies on an outgoing `NextResponse` using the `ResponseCookies` API.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-building-your-application/01-routing/14-middleware.mdx#_snippet_8

LANGUAGE: typescript
CODE:
```
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Assume a "Cookie:nextjs=fast" header to be present on the incoming request
  // Getting cookies from the request using the `RequestCookies` API
  let cookie = request.cookies.get('nextjs');
  console.log(cookie); // => { name: 'nextjs', value: 'fast', Path: '/' }
  const allCookies = request.cookies.getAll();
  console.log(allCookies); // => [{ name: 'nextjs', value: 'fast' }]

  request.cookies.has('nextjs'); // => true
  request.cookies.delete('nextjs');
  request.cookies.has('nextjs'); // => false

  // Setting cookies on the response using the `ResponseCookies` API
  const response = NextResponse.next();
  response.cookies.set('vercel', 'fast');
  response.cookies.set({
    name: 'vercel',
    value: 'fast',
    path: '/',
  });
  cookie = response.cookies.get('vercel');
  console.log(cookie); // => { name: 'vercel', value: 'fast', Path: '/' }
  // The outgoing response will have a `Set-Cookie:vercel=fast;path=/` header.

  return response;
}
```

LANGUAGE: javascript
CODE:
```
import { NextResponse } from 'next/server';

export function middleware(request) {
  // Assume a "Cookie:nextjs=fast" header to be present on the incoming request
  // Getting cookies from the request using the `RequestCookies` API
  let cookie = request.cookies.get('nextjs');
  console.log(cookie); // => { name: 'nextjs', value: 'fast', Path: '/' }
  const allCookies = request.cookies.getAll();
  console.log(allCookies); // => [{ name: 'nextjs', value: 'fast' }]

  request.cookies.has('nextjs'); // => true
  request.cookies.delete('nextjs');
  request.cookies.has('nextjs'); // => false

  // Setting cookies on the response using the `ResponseCookies` API
  const response = NextResponse.next();
  response.cookies.set('vercel', 'fast');
  response.cookies.set({
    name: 'vercel',
    value: 'fast',
    path: '/',
  });
  cookie = response.cookies.get('vercel');
  console.log(cookie); // => { name: 'vercel', value: 'fast', Path: '/' }
  // The outgoing response will have a `Set-Cookie:vercel=fast;path=/test` header.

  return response;
}
```

----------------------------------------

TITLE: Correct Link Component Usage in Next.js
DESCRIPTION: Example showing the correct way to use Next.js Link component by passing children, either as direct text content or with an anchor tag when using legacyBehavior.
SOURCE: https://github.com/vercel/next.js/blob/canary/errors/link-no-children.mdx#2025-04-21_snippet_1

LANGUAGE: jsx
CODE:
```
import Link from 'next/link'

export default function Home() {
  return (
    <>
      <Link href="/about">To About</Link>
      // or
      <Link href="/about" legacyBehavior>
        <a>To About</a>
      </Link>
    </>
  )
}
```

----------------------------------------

TITLE: Checking Draft Mode Status in Next.js Server Component (TypeScript)
DESCRIPTION: This code snippet demonstrates how to check if Draft Mode is enabled within a Next.js Server Component using TypeScript.  It imports the `draftMode` function from `next/headers` and uses its `isEnabled` property to determine the current Draft Mode status.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/04-functions/draft-mode.mdx#_snippet_0

LANGUAGE: typescript
CODE:
```
import { draftMode } from 'next/headers'

export default async function Page() {
  const { isEnabled } = await draftMode()
}
```

----------------------------------------

TITLE: Initializing Global MDX Components with Next.js (TSX)
DESCRIPTION: This code defines a `useMDXComponents` function that allows customizing built-in MDX components like `h1` and `img`. It imports `Image` from `next/image` and overrides the default components with custom styles and properties. This customization affects all MDX files in the application.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/mdx.mdx#_snippet_16

LANGUAGE: tsx
CODE:
```
import type { MDXComponents } from 'mdx/types'
import Image, { ImageProps } from 'next/image'

// This file allows you to provide custom React components
// to be used in MDX files. You can import and use any
// React component you want, including inline styles,
// components from other libraries, and more.

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Allows customizing built-in components, e.g. to add styling.
    h1: ({ children }) => (
      <h1 style={{ color: 'red', fontSize: '48px' }}>{children}</h1>
    ),
    img: (props) => (
      <Image
        sizes="100vw"
        style={{ width: '100%', height: 'auto' }}
        {...(props as ImageProps)}
      />
    ),
    ...components,
  }
}
```

----------------------------------------

TITLE: Generating robots.txt with default rules (TypeScript)
DESCRIPTION: Shows how to dynamically generate a `robots.txt` file by exporting a function from `app/robots.ts`. The function returns a `MetadataRoute.Robots` object with default rules for all user agents, allowing access except for `/private/`, and includes a sitemap URL.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/03-file-conventions/01-metadata/robots.mdx#_snippet_1

LANGUAGE: ts
CODE:
```
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/private/',
    },
    sitemap: 'https://acme.com/sitemap.xml',
  }
}
```

----------------------------------------

TITLE: Using a Custom Loader in next.config.js
DESCRIPTION: This example shows how to define a custom image loader in next.config.js for using a cloud provider outside of Next.js's built-in optimization API. This custom loader must export a default function that returns a formatted URL for the image.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/02-components/image.mdx#2025-04-21_snippet_18

LANGUAGE: js
CODE:
```
module.exports = {
  images: {
    loader: 'custom',
    loaderFile: './my/image/loader.js',
  },
}

```

LANGUAGE: js
CODE:
```
'use client'

export default function myImageLoader({ src, width, quality }) {
  return `https://example.com/${src}?w=${width}&q=${quality || 75}`
}

```

----------------------------------------

TITLE: Rendering Unauthorized Page with Login UI (JavaScript)
DESCRIPTION: The JavaScript equivalent of rendering a 401 error page featuring a login UI. This component ensures unauthorized users have the capability to log in using a Login component.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/04-functions/unauthorized.mdx#2025-04-21_snippet_5

LANGUAGE: JavaScript
CODE:
```
import Login from '@/app/components/Login'

export default function UnauthorizedPage() {
  return (
    <main>
      <h1>401 - Unauthorized</h1>
      <p>Please log in to access this page.</p>
      <Login />
    </main>
  )
}
```

----------------------------------------

TITLE: Configuring Environment Variables in next.config.js (JavaScript)
DESCRIPTION: This code snippet demonstrates how to configure environment variables in the `next.config.js` file. The `env` object is added to the `module.exports` object, allowing you to define custom environment variables that will be available during the build process.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/05-config/01-next-config-js/env.mdx#_snippet_0

LANGUAGE: js
CODE:
```
module.exports = {
  env: {
    customKey: 'my-value',
  },
}
```

----------------------------------------

TITLE: Enabling Draft Mode in Next.js Route Handler (TypeScript)
DESCRIPTION: This code snippet shows how to enable Draft Mode in a Next.js Route Handler using TypeScript. It imports `draftMode` from `next/headers`, calls `draft.enable()` to enable Draft Mode, and returns a response indicating that Draft Mode is enabled. It requires the `next` package.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/04-functions/draft-mode.mdx#_snippet_2

LANGUAGE: typescript
CODE:
```
import { draftMode } from 'next/headers'

export async function GET(request: Request) {
  const draft = await draftMode()
  draft.enable()
  return new Response('Draft mode is enabled')
}
```

----------------------------------------

TITLE: Configuring Viewport Meta Tags in Next.js _app.js
DESCRIPTION: Demonstrates the correct implementation of viewport meta tags using next/head in the Next.js _app.js file. This approach ensures proper deduplication of meta tags and prevents unexpected behavior.
SOURCE: https://github.com/vercel/next.js/blob/canary/errors/no-document-viewport-meta.mdx#2025-04-21_snippet_0

LANGUAGE: jsx
CODE:
```
import Head from 'next/head'

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="viewport-fit=cover" />
      </Head>
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
```

----------------------------------------

TITLE: Using useFormStatus for Search Button in Next.js TypeScript
DESCRIPTION: Utilizing the 'useFormStatus' hook in TypeScript, this snippet defines a 'SearchButton' component to provide immediate feedback on the form's pending state during search queries in a Next.js application.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/02-components/form.mdx#2025-04-21_snippet_10

LANGUAGE: TypeScript
CODE:
```
'use client'
import { useFormStatus } from 'react-dom'

export default function SearchButton() {
  const status = useFormStatus()
  return (
    <button type="submit">{status.pending ? 'Searching...' : 'Search'}</button>
  )
}
```

----------------------------------------

TITLE: Handling Query Parameters in Next.js - JavaScript
DESCRIPTION: This snippet demonstrates how to access query parameters in a GET route using a plain request object. It retrieves the 'query' parameter from the request's URL.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-building-your-application/01-routing/13-route-handlers.mdx#2025-04-21_snippet_7

LANGUAGE: javascript
CODE:
```
export function GET(request) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('query')
  // query is "hello" for /api/search?query=hello
}
```

----------------------------------------

TITLE: Using history.pushState for Query Params Next.js TSX
DESCRIPTION: Demonstrates using the native window.history.pushState method in a TypeScript Client Component to update URL search parameters. It uses the useSearchParams hook to get current params and constructs a new URL with updated sorting parameters ('asc' or 'desc') without triggering a full page reload.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-building-your-application/01-routing/04-linking-and-navigating.mdx#_snippet_6

LANGUAGE: tsx
CODE:
```
'use client'

import { useSearchParams } from 'next/navigation'

export default function SortProducts() {
  const searchParams = useSearchParams()

  function updateSorting(sortOrder: string) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('sort', sortOrder)
    window.history.pushState(null, '', `?${params.toString()}`)
  }

  return (
    <>
      <button onClick={() => updateSorting('asc')}>Sort Ascending</button>
      <button onClick={() => updateSorting('desc')}>Sort Descending</button>
    </>
  )
}
```

----------------------------------------

TITLE: Loading Third-Party Scripts with Next.js Script Component
DESCRIPTION: This snippet demonstrates how to use the Next.js Script component to load third-party scripts asynchronously. It imports the Script component from 'next/script' and uses it within a React functional component.
SOURCE: https://github.com/vercel/next.js/blob/canary/errors/no-sync-scripts.mdx#2025-04-21_snippet_0

LANGUAGE: jsx
CODE:
```
import Script from 'next/script'

function Home() {
  return (
    <div class="container">
      <Script src="https://third-party-script.js"></Script>
      <div>Home Page</div>
    </div>
  )
}

export default Home
```

----------------------------------------

TITLE: Implementing Next.js Middleware with NextURL Clone
DESCRIPTION: Demonstrates the recommended approach for URL handling in Next.js Middleware by cloning NextURL and modifying its pathname. This method properly handles configuration settings like basePath and locale.
SOURCE: https://github.com/vercel/next.js/blob/canary/errors/middleware-relative-urls.mdx#2025-04-21_snippet_0

LANGUAGE: typescript
CODE:
```
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone()
  url.pathname = '/dest'
  return NextResponse.rewrite(url)
}
```

----------------------------------------

TITLE: Creating a Root Layout in Next.js
DESCRIPTION: Implements a root layout component that wraps child pages. Root layouts are required and must contain html and body tags to define the document structure.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/01-getting-started/03-layouts-and-pages.mdx#2025-04-21_snippet_1

LANGUAGE: tsx
CODE:
```
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {/* Layout UI */}
        {/* Place children where you want to render a page or nested layout */}
        <main>{children}</main>
      </body>
    </html>
  )
}
```

LANGUAGE: jsx
CODE:
```
export default function DashboardLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {/* Layout UI */}
        {/* Place children where you want to render a page or nested layout */}
        <main>{children}</main>
      </body>
    </html>
  )
}
```

----------------------------------------

TITLE: Check and Display Draft Mode Status in Next.js (JavaScript)
DESCRIPTION: This code snippet demonstrates how to check and display the current Draft Mode status within a Next.js Server Component using JavaScript. It retrieves the status using `draftMode()` and renders a paragraph indicating whether Draft Mode is currently enabled or disabled.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/04-functions/draft-mode.mdx#_snippet_7

LANGUAGE: javascript
CODE:
```
import { draftMode } from 'next/headers'

export default async function Page() {
  const { isEnabled } = await draftMode()
  return (
    <main>
      <h1>My Blog Post</h1>
      <p>Draft Mode is currently {isEnabled ? 'Enabled' : 'Disabled'}</p>
    </main>
  )
}
```

----------------------------------------

TITLE: Installing @vercel/otel and OpenTelemetry dependencies
DESCRIPTION: Installs the necessary npm packages for using `@vercel/otel` to instrument a Next.js application with OpenTelemetry. This includes `@vercel/otel`, `@opentelemetry/sdk-logs`, `@opentelemetry/api-logs` and `@opentelemetry/instrumentation`. These packages provide the core functionalities for OpenTelemetry integration.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/open-telemetry.mdx#_snippet_0

LANGUAGE: bash
CODE:
```
npm install @vercel/otel @opentelemetry/sdk-logs @opentelemetry/api-logs @opentelemetry/instrumentation
```

----------------------------------------

TITLE: Configure Tailwind CSS Content Paths
DESCRIPTION: This snippet shows how to configure the `content` array in `tailwind.config.js` to specify which files Tailwind CSS should scan for classes. This helps avoid scanning unnecessary files and directories, improving build performance.  Incorrect configuration may slow down your build.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/local-development.mdx#_snippet_3

LANGUAGE: jsx
CODE:
```
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}', // Good
    // This might be too broad
    // It will match `packages/**/node_modules` too
    // '../../packages/**/*.{js,ts,jsx,tsx}',
  ],
}
```

LANGUAGE: jsx
CODE:
```
module.exports = {
  content: [
    // Better - only scans the 'src' folder
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx}',
  ],
}
```

----------------------------------------

TITLE: Applying use cache Directive (TSX/JSX)
DESCRIPTION: Illustrates the placement of the `'use cache'` directive at different scopes: at the top of a file to cache all its exports, inside a React component function definition, and inside a regular asynchronous function definition. The directive must be a string literal.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/01-directives/use-cache.mdx#_snippet_2

LANGUAGE: TSX
CODE:
```
// File level
'use cache'

export default async function Page() {
  // ...
}

// Component level
export async function MyComponent() {
  'use cache'
  return <></>
}

// Function level
export async function getData() {
  'use cache'
  const data = await fetch('/api/data')
  return data
}
```

----------------------------------------

TITLE: Accessing Environment Variables in a React Component (JSX)
DESCRIPTION: This code snippet shows how to access environment variables defined in `next.config.js` within a React component.  `process.env.customKey` is used to access the value of the 'customKey' environment variable. Next.js replaces this expression with the actual value during build time.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/05-config/01-next-config-js/env.mdx#_snippet_1

LANGUAGE: jsx
CODE:
```
function Page() {
  return <h1>The value of customKey is: {process.env.customKey}</h1>
}

export default Page
```

----------------------------------------

TITLE: Configuring Jest with next/jest (TypeScript)
DESCRIPTION: This code snippet shows how to configure Jest to work with Next.js using the `next/jest` transformer in a TypeScript environment. It imports necessary modules, defines a configuration object, and exports the configured Jest setup.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/testing/jest.mdx#_snippet_3

LANGUAGE: typescript
CODE:
```
import type { Config } from 'jest'
import nextJest from 'next/jest.js'

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
})

// Add any custom config to be passed to Jest
const config: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  // Add more setup options before each test is run
  // setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config)
```

----------------------------------------

TITLE: Caching Dynamic Pages with getServerSideProps (JavaScript)
DESCRIPTION: This JavaScript snippet shows how to set HTTP `Cache-Control` headers on the response object (`res`) within a `getServerSideProps` function. It includes directives like `s-maxage` and `stale-while-revalidate` to manage the caching behavior of server-rendered pages, allowing for fresh data on subsequent requests while serving stale data immediately.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/05-config/01-next-config-js/headers.mdx#_snippet_12

LANGUAGE: js
CODE:
```
// This value is considered fresh for ten seconds (s-maxage=10).
// If a request is repeated within the next 10 seconds, the previously
// cached value will still be fresh. If the request is repeated before 59 seconds,
// the cached value will be stale but still render (stale-while-revalidate=59).
//
// In the background, a revalidation request will be made to populate the cache
// with a fresh value. If you refresh the page, you will see the new value.
export async function getServerSideProps({ req, res }) {
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=10, stale-while-revalidate=59'
  )

  return {
    props: {},
  }
}
```

----------------------------------------

TITLE: Loading Custom Fonts for ImageResponse in Next.js
DESCRIPTION: This code snippet demonstrates how to load a custom font file and use it within the ImageResponse component in a Next.js application. It reads the font file from the file system and passes it as data to the ImageResponse options. The font is loaded from the 'assets/Inter-SemiBold.ttf' file.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/04-functions/image-response.mdx#_snippet_3

LANGUAGE: typescript
CODE:
```
import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

// Image metadata
export const alt = 'My site'
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

// Image generation
export default async function Image() {
  // Font loading, process.cwd() is Next.js project directory
  const interSemiBold = await readFile(
    join(process.cwd(), 'assets/Inter-SemiBold.ttf')
  )

  return new ImageResponse(
    (
      // ...
    ),
    // ImageResponse options
    {
      // For convenience, we can re-use the exported opengraph-image
      // size config to also set the ImageResponse's width and height.
      ...size,
      fonts: [
        {
          name: 'Inter',
          data: interSemiBold,
          style: 'normal',
          weight: 400,
        },
      ],
    }
  )
}
```

----------------------------------------

TITLE: Disabling Static Image Imports in Next.js Config (JavaScript)
DESCRIPTION: This configuration snippet for `next.config.js` provides an alternative solution to the `_document.js` image import error. By setting `images.disableStaticImages` to `true`, it disables Next.js's built-in static image loader, which can prevent the error if you are not relying on `next/image` for importing static images.
SOURCE: https://github.com/vercel/next.js/blob/canary/errors/custom-document-image-import.mdx#_snippet_1

LANGUAGE: javascript
CODE:
```
module.exports = {
  images: {
    disableStaticImages: true,
  },
}
```

----------------------------------------

TITLE: Using Public Env Vars in Client/Server Components (Pages Router, Next.js)
DESCRIPTION: Variables prefixed with `NEXT_PUBLIC_` can be accessed anywhere in your code, including client-side code, as their values are inlined during the build process.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/environment-variables.mdx#_snippet_9

LANGUAGE: javascript
CODE:
```
import setupAnalyticsService from '../lib/my-analytics-service'

// 'NEXT_PUBLIC_ANALYTICS_ID' can be used here as it's prefixed by 'NEXT_PUBLIC_'.
// It will be transformed at build time to `setupAnalyticsService('abcdefghijk')`.
setupAnalyticsService(process.env.NEXT_PUBLIC_ANALYTICS_ID)

function HomePage() {
  return <h1>Hello World</h1>
}

export default HomePage
```

----------------------------------------

TITLE: Specifying a Web Application Manifest (JSX)
DESCRIPTION: This code snippet demonstrates how to specify a web application manifest file in the metadata of a Next.js application. The 'manifest' property should contain the URL of the manifest file.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/04-functions/generate-metadata.mdx#_snippet_28

LANGUAGE: jsx
CODE:
```
export const metadata = {
  manifest: 'https://nextjs.org/manifest.json',
}
```

----------------------------------------

TITLE: Setting Up Environment Variables - Bash
DESCRIPTION: This snippet shows how to copy a sample environment configuration file to a new `.env.local` file, which is controlled by Git. No special prerequisites are needed except standard Bash access. The command helps set up environment variables necessary for the project’s operation.
SOURCE: https://github.com/vercel/next.js/blob/canary/examples/cms-buttercms/README.md#2025-04-21_snippet_2

LANGUAGE: bash
CODE:
```
cp .env.local.example .env.local
```

----------------------------------------

TITLE: Using Remote Image in App Router (JSX)
DESCRIPTION: Shows how to use the `next/image` component with a remote image URL in an App Router page. Unlike local images, explicit `width` and `height` props are required for remote images as Next.js cannot determine these dimensions at build time.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-building-your-application/06-optimizing/01-images.mdx#_snippet_4

LANGUAGE: jsx
CODE:
```
import Image from 'next/image'

export default function Page() {
  return (
    <Image
      src="https://s3.amazonaws.com/my-bucket/profile.png"
      alt="Picture of the author"
      width={500}
      height={500}
    />
  )
}
```

----------------------------------------

TITLE: Incorrect Usage of React Hook in Server Component (JSX)
DESCRIPTION: This code snippet shows the incorrect usage of a React client hook (useEffect) in a Server Component, which causes an error.
SOURCE: https://github.com/vercel/next.js/blob/canary/errors/react-client-hook-in-server-component.mdx#2025-04-21_snippet_0

LANGUAGE: jsx
CODE:
```
import { useEffect } from 'react'

export default function Example() {
  useEffect(() => {
    console.log('in useEffect')
  })
  return <p>Hello world</p>
}
```

----------------------------------------

TITLE: Using forbidden in Server Component (jsx)
DESCRIPTION: This snippet demonstrates how to use the `forbidden` function within a Server Component to protect a route based on user roles. It imports `verifySession` and `forbidden`, verifies the user's session, checks if the user has the 'admin' role, and calls `forbidden()` if the user does not have the required role, rendering a 403 error page.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/04-functions/forbidden.mdx#2025-04-21_snippet_3

LANGUAGE: jsx
CODE:
```
import { verifySession } from '@/app/lib/dal'
import { forbidden } from 'next/navigation'

export default async function AdminPage() {
  const session = await verifySession()

  // Check if the user has the 'admin' role
  if (session.role !== 'admin') {
    forbidden()
  }

  // Render the admin page for authorized users
  return <></>
}
```

----------------------------------------

TITLE: Setting VAPID keys in .env file
DESCRIPTION: This shows how to set the VAPID public and private keys in the .env file, which will then be available via `process.env`.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/progressive-web-apps.mdx#_snippet_12

LANGUAGE: env
CODE:
```
NEXT_PUBLIC_VAPID_PUBLIC_KEY=your_public_key_here
VAPID_PRIVATE_KEY=your_private_key_here
```

----------------------------------------

TITLE: Implementing Client-side Data Fetching with SWR in React
DESCRIPTION: This snippet shows how to use the SWR library for client-side data fetching in React. It demonstrates fetching profile data with automatic caching and revalidation, and handles loading and error states.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/02-pages/03-building-your-application/03-data-fetching/05-client-side.mdx#2025-04-23_snippet_1

LANGUAGE: jsx
CODE:
```
import useSWR from 'swr'

const fetcher = (...args) => fetch(...args).then((res) => res.json())

function Profile() {
  const { data, error } = useSWR('/api/profile-data', fetcher)

  if (error) return <div>Failed to load</div>
  if (!data) return <div>Loading...</div>

  return (
    <div>
      <h1>{data.name}</h1>
      <p>{data.bio}</p>
    </div>
  )
}
```

----------------------------------------

TITLE: Implementing Conditional Redirects with Next.js Middleware
DESCRIPTION: Uses `NextResponse.redirect` within a Next.js Middleware function to conditionally redirect incoming requests based on arbitrary logic, such as checking authentication status. If the condition is met (e.g., not authenticated), the function returns a redirect response to a specified URL. This method provides flexibility for dynamic redirection rules.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-building-your-application/01-routing/07-redirecting.mdx#_snippet_9

LANGUAGE: TypeScript
CODE:
```
import { NextResponse, NextRequest } from 'next/server'
import { authenticate } from 'auth-provider'

export function middleware(request: NextRequest) {
  const isAuthenticated = authenticate(request)

  // If the user is authenticated, continue as normal
  if (isAuthenticated) {
    return NextResponse.next()
  }

  // Redirect to login page if not authenticated
  return NextResponse.redirect(new URL('/login', request.url))
}

export const config = {
  matcher: '/dashboard/:path*',
}
```

LANGUAGE: JavaScript
CODE:
```
import { NextResponse } from 'next/server'
import { authenticate } from 'auth-provider'

export function middleware(request) {
  const isAuthenticated = authenticate(request)

  // If the user is authenticated, continue as normal
  if (isAuthenticated) {
    return NextResponse.next()
  }

  // Redirect to login page if not authenticated
  return NextResponse.redirect(new URL('/login', request.url))
}
```

----------------------------------------

TITLE: Getting Cookies - JS
DESCRIPTION: This snippet illustrates reading a specific cookie in a Next.js page component using the `cookies` function. The asynchronous operation retrieves the theme from the cookie store.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/04-functions/cookies.mdx#2025-04-21_snippet_1

LANGUAGE: js
CODE:
```
import { cookies } from 'next/headers'

export default async function Page() {
  const cookieStore = await cookies()
  const theme = cookieStore.get('theme')
  return '...'
}
```

----------------------------------------

TITLE: Configuring imageSizes in next.config.js
DESCRIPTION: This snippet shows how to define imageSizes in next.config.js, which specifies the list of image widths for images that use the sizes prop. The sizes must be smaller than the smallest deviceSizes to work correctly.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/02-components/image.mdx#2025-04-21_snippet_20

LANGUAGE: js
CODE:
```
module.exports = {
  images: {
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
}

```

----------------------------------------

TITLE: Generating Next.js Web Manifest Dynamically (TypeScript)
DESCRIPTION: This TypeScript code snippet demonstrates how to create a dynamic manifest file in Next.js by defining an asynchronous function in `app/manifest.ts`. The function returns an object conforming to the `MetadataRoute.Manifest` type, allowing for programmatic generation of manifest properties. This approach is cached by default unless dynamic features are used.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/03-file-conventions/01-metadata/manifest.mdx#_snippet_1

LANGUAGE: typescript
CODE:
```
import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Next.js App',
    short_name: 'Next.js App',
    description: 'Next.js App',
    start_url: '/',
    display: 'standalone',
    background_color: '#fff',
    theme_color: '#fff',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  }
}
```

----------------------------------------

TITLE: Next.js Server Action Dead Code Elimination Example
DESCRIPTION: Illustrates how Next.js automatically removes unused Server Actions during the build process. Actions that are exported but not referenced by their secure ID in the client bundle (like `deleteUserAction` here) are eliminated, preventing public access and improving security.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-building-your-application/02-data-fetching/03-server-actions-and-mutations.mdx#_snippet_28

LANGUAGE: jsx
CODE:
```
// app/actions.js
'use server'

// This action **is** used in our application, so Next.js
// will create a secure ID to allow the client to reference
// and call the Server Action.
export async function updateUserAction(formData) {}

// This action **is not** used in our application, so Next.js
// will automatically remove this code during `next build`
// and will not create a public endpoint.
export async function deleteUserAction(formData) {}
```

----------------------------------------

TITLE: Sending Web Vitals Results to Google Analytics
DESCRIPTION: This example illustrates how to send reported Web Vitals metrics directly to Google Analytics using the `window.gtag` function, assuming Google Analytics has been initialized appropriately. It formats the metric data, converting values to integers and using the metric `id` and `name` as event parameters, while setting `non_interaction` to true.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/04-functions/use-report-web-vitals.mdx#_snippet_7

LANGUAGE: js
CODE:
```
useReportWebVitals(metric => {
  // Use `window.gtag` if you initialized Google Analytics as this example:
  // https://github.com/vercel/next.js/blob/canary/examples/with-google-analytics
  window.gtag('event', metric.name, {
    value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value), // values must be integers
    event_label: metric.id, // id unique to current page load
    non_interaction: true, // avoids affecting bounce rate.
  });
})
```

----------------------------------------

TITLE: Displaying Video using Vercel Blob URL in Next.js
DESCRIPTION: This code snippet demonstrates how to display a video in a Next.js application using the video's URL from Vercel Blob. It uses React Suspense to handle the loading state while fetching the video URL. The `VideoComponent` asynchronously fetches the Blob URL and renders a `<video>` tag.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/videos.mdx#_snippet_5

LANGUAGE: jsx
CODE:
```
import { Suspense } from 'react'
import { list } from '@vercel/blob'

export default function Page() {
  return (
    <Suspense fallback={<p>Loading video...</p>}>
      <VideoComponent fileName="my-video.mp4" />
    </Suspense>
  )
}

async function VideoComponent({ fileName }) {
  const { blobs } = await list({
    prefix: fileName,
    limit: 1,
  })
  const { url } = blobs[0]

  return (
    <video controls preload="none" aria-label="Video player">
      <source src={url} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  )
}
```

----------------------------------------

TITLE: Setting metadata in app directory (JavaScript)
DESCRIPTION: This code snippet shows how to set metadata, such as the page title, in the app directory. It exports a metadata object with the title property set to 'My Page Title'.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/migrating/app-router-migration.mdx#_snippet_17

LANGUAGE: jsx
CODE:
```
export const metadata = {
  title: 'My Page Title',
}

export default function Page() {
  return '...'
}
```

----------------------------------------

TITLE: Default PostCSS configuration for Next.js (JSON)
DESCRIPTION: This is the default PostCSS configuration used by Next.js. It includes `postcss-flexbugs-fixes` and `postcss-preset-env` with specific Autoprefixer settings to ensure flexbox compatibility.  It disables custom properties and targets stage 3 features. Requires `postcss-flexbugs-fixes` and `postcss-preset-env` as installed dependencies.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/02-pages/02-guides/post-css.mdx#_snippet_3

LANGUAGE: json
CODE:
```
{
  "plugins": [
    "postcss-flexbugs-fixes",
    [
      "postcss-preset-env",
      {
        "autoprefixer": {
          "flexbox": "no-2009"
        },
        "stage": 3,
        "features": {
          "custom-properties": false
        }
      }
    ]
  ]
}
```

----------------------------------------

TITLE: Importing and Using Connection in Next.js Page (TypeScript)
DESCRIPTION: This snippet demonstrates how to import and use the `connection` function within a Next.js page written in TypeScript. It delays rendering until a user request is detected, allowing dynamic rendering with changing results using elements like `Math.random()`.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/04-functions/connection.mdx#2025-04-21_snippet_0

LANGUAGE: typescript
CODE:
```
import { connection } from 'next/server'\n\nexport default async function Page() {\n  await connection()\n  // Everything below will be excluded from prerendering\n  const rand = Math.random()\n  return <span>{rand}</span>\n}
```

----------------------------------------

TITLE: Wrapping Root Layout with Style Registry (TypeScript)
DESCRIPTION: This code snippet shows how to wrap the children of the root layout with the `StyledComponentsRegistry` component. This ensures that styled-components are properly initialized and rendered within the Next.js application. The `RootLayout` component is a Server Component.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/css-in-js.mdx#_snippet_7

LANGUAGE: typescript
CODE:
```
import StyledComponentsRegistry from './lib/registry'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html>
      <body>
        <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
      </body>
    </html>
  )
}
```

----------------------------------------

TITLE: Creating a Search Form in Next.js JavaScript
DESCRIPTION: This JavaScript snippet shows how to create a search form that redirects to a results page in a Next.js application. It makes use of the 'next/form' import and the form is configured to use '/search' as its action. Upon submission, the search query is appended to the URL as parameters.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/02-components/form.mdx#2025-04-21_snippet_5

LANGUAGE: JavaScript
CODE:
```
import Form from 'next/form'

export default function Page() {
  return (
    <Form action="/search">
      <input name="query" />
      <button type="submit">Submit</button>
    </Form>
  )
}
```

----------------------------------------

TITLE: Defining Metadata in Next.js
DESCRIPTION: This code snippet demonstrates how to define metadata for a Next.js page or layout using JSDoc type hints. It exports a metadata object with a title property.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/04-functions/generate-metadata.mdx#_snippet_67

LANGUAGE: javascript
CODE:
```
/** @type {import("next").Metadata} */
export const metadata = {
  title: 'Next.js',
}
```

----------------------------------------

TITLE: Fix: Re-exporting default component only in Next.js
DESCRIPTION: This code snippet demonstrates the recommended approach of re-exporting only the default component to resolve the error. This prevents accidental inclusion of server-side code in the browser build.
SOURCE: https://github.com/vercel/next.js/blob/canary/errors/export-all-in-page.mdx#2025-04-21_snippet_4

LANGUAGE: jsx
CODE:
```
export { default } from './example-b'
```

----------------------------------------

TITLE: Implementing getServerSideProps with TypeScript in Next.js
DESCRIPTION: This example demonstrates how to fetch data from GitHub API using getServerSideProps in a TypeScript Next.js page. It defines type interfaces and uses them to properly type the props and response data.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/02-pages/03-building-your-application/03-data-fetching/03-get-server-side-props.mdx#2025-04-21_snippet_0

LANGUAGE: tsx
CODE:
```
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next'

type Repo = {
  name: string
  stargazers_count: number
}

export const getServerSideProps = (async () => {
  // Fetch data from external API
  const res = await fetch('https://api.github.com/repos/vercel/next.js')
  const repo: Repo = await res.json()
  // Pass data to the page via props
  return { props: { repo } }
}) satisfies GetServerSideProps<{ repo: Repo }>

export default function Page({
  repo,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <main>
      <p>{repo.stargazers_count}</p>
    </main>
  )
}
```

----------------------------------------

TITLE: Static robots.txt configuration
DESCRIPTION: Demonstrates how to create a static `robots.txt` file directly in the root of the `app` directory. It sets a rule for all user agents (`*`), allowing access to all paths except `/private/`, and specifies the location of a sitemap.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/03-file-conventions/01-metadata/robots.mdx#_snippet_0

LANGUAGE: txt
CODE:
```
User-Agent: *
Allow: /
Disallow: /private/

Sitemap: https://acme.com/sitemap.xml
```

----------------------------------------

TITLE: Install Prompt Component - TypeScript
DESCRIPTION: This React component provides a prompt for iOS users to install the app to their home screen. It checks if the device is iOS and if the app is already running in standalone mode. If the app is not already installed on an iOS device, it displays instructions on how to add it to the home screen.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/progressive-web-apps.mdx#_snippet_6

LANGUAGE: typescript
CODE:
```
function InstallPrompt() {
  const [isIOS, setIsIOS] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)

  useEffect(() => {
    setIsIOS(
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
    )

    setIsStandalone(window.matchMedia('(display-mode: standalone)').matches)
  }, [])

  if (isStandalone) {
    return null // Don't show install button if already installed
  }

  return (
    <div>
      <h3>Install App</h3>
      <button>Add to Home Screen</button>
      {isIOS && (
        <p>
          To install this app on your iOS device, tap the share button
          <span role="img" aria-label="share icon">
            {' '}
            ⎋{' '}
          </span>
          and then "Add to Home Screen"
          <span role="img" aria-label="plus icon">
            {' '}
            ➕{' '}
          </span>.
        </p>
      )}
    </div>
  )
}

export default function Page() {
  return (
    <div>
      <PushNotificationManager />
      <InstallPrompt />
    </div>
  )
}
```

----------------------------------------

TITLE: Reporting Web Vitals with useReportWebVitals (App Router)
DESCRIPTION: This code snippet demonstrates how to use the `useReportWebVitals` hook in a component within the App Router in Next.js to report web vitals. A separate client component `WebVitals` is created to use the hook and is then imported into the layout file.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/analytics.mdx#_snippet_2

LANGUAGE: jsx
CODE:
```
'use client'

import { useReportWebVitals } from 'next/web-vitals'

export function WebVitals() {
  useReportWebVitals((metric) => {
    console.log(metric)
  })
}
```

LANGUAGE: jsx
CODE:
```
import { WebVitals } from './_components/web-vitals'

export default function Layout({ children }) {
  return (
    <html>
      <body>
        <WebVitals />
        {children}
      </body>
    </html>
  )
}
```

----------------------------------------

TITLE: 404 Not Found Error Handling
DESCRIPTION: Implementation of 404 error handling using Next.js notFound function and custom not-found page component.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/01-getting-started/08-error-handling.mdx#2025-04-21_snippet_3

LANGUAGE: typescript
CODE:
```
import { getPostBySlug } from '@/lib/posts'

export default async function Page({ params }: { params: { slug: string } }) {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  return <div>{post.title}</div>
}
```

LANGUAGE: javascript
CODE:
```
import { getPostBySlug } from '@/lib/posts'

export default async function Page({ params }) {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  return <div>{post.title}</div>
}
```

----------------------------------------

TITLE: GraphQL Mutation for Creating a Post
DESCRIPTION: This GraphQL mutation creates a new 'Post' entry in the Grafbase backend.  It takes title, slug, and a nested comment as input, and returns the id and slug of the newly created post.
SOURCE: https://github.com/vercel/next.js/blob/canary/examples/with-grafbase/README.md#2025-04-21_snippet_3

LANGUAGE: graphql
CODE:
```
mutation {
  postCreate(
    input: {
      title: "I love Next.js!"
      slug: "i-love-nextjs"
      comments: [{ create: { message: "me too!" } }]
    }
  ) {
    post {
      id
      slug
    }
  }
}
```

----------------------------------------

TITLE: Root Layout Component (JSX)
DESCRIPTION: Defines a root layout component in JavaScript using Next.js. It accepts a `children` prop, which is rendered within the `<body>` of the `<html>` tag. This layout is used to define the structure of all pages in the application.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/03-file-conventions/layout.mdx#_snippet_3

LANGUAGE: jsx
CODE:
```
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

----------------------------------------

TITLE: Page Component with CSS Modules and BaseButton (TSX)
DESCRIPTION: This code defines a `Page` component that imports and uses the `BaseButton` component. It also imports its own CSS module and applies the `primary` class. This demonstrates how CSS Modules can be used in conjunction with component imports to style a page.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-building-your-application/05-styling/01-css.mdx#_snippet_17

LANGUAGE: TSX
CODE:
```
import { BaseButton } from './base-button'
import styles from './page.module.css'

export default function Page() {
  return <BaseButton className={styles.primary} />
}
```

----------------------------------------

TITLE: Setting Cookies in API Route - TypeScript
DESCRIPTION: This code snippet demonstrates how to set a cookie in a Next.js API route using TypeScript. It uses the setHeader method on the response object to set the Set-Cookie header.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/02-pages/03-building-your-application/03-data-fetching/03-forms-and-mutations.mdx#_snippet_12

LANGUAGE: typescript
CODE:
```
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.setHeader('Set-Cookie', 'username=lee; Path=/; HttpOnly')
  res.status(200).send('Cookie has been set.')
}
```

----------------------------------------

TITLE: Styled Components Registry Component (TypeScript)
DESCRIPTION: This code defines a React component, `StyledComponentsRegistry`, that manages server-side rendering of styled-components. It uses `useServerInsertedHTML` to inject the collected CSS styles into the `<head>` of the HTML. It leverages the `ServerStyleSheet` from `styled-components` to collect and manage the styles.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/css-in-js.mdx#_snippet_5

LANGUAGE: typescript
CODE:
```
'use client'

import React, { useState } from 'react'
import { useServerInsertedHTML } from 'next/navigation'
import { ServerStyleSheet, StyleSheetManager } from 'styled-components'

export default function StyledComponentsRegistry({
  children,
}: {
  children: React.ReactNode
}) {
  // Only create stylesheet once with lazy initial state
  // x-ref: https://reactjs.org/docs/hooks-reference.html#lazy-initial-state
  const [styledComponentsStyleSheet] = useState(() => new ServerStyleSheet())

  useServerInsertedHTML(() => {
    const styles = styledComponentsStyleSheet.getStyleElement()
    styledComponentsStyleSheet.instance.clearTag()
    return <>{styles}</>
  })

  if (typeof window !== 'undefined') return <>{children}</>

  return (
    <StyleSheetManager sheet={styledComponentsStyleSheet.instance}>
      {children}
    </StyleSheetManager>
  )
}
```

----------------------------------------

TITLE: Configuring SWC Plugins in Next.js
DESCRIPTION: This code snippet demonstrates how to configure SWC plugins in `next.config.js`.  `swcPlugins` accepts an array of tuples for configuring plugins. A tuple for the plugin contains the path to the plugin and an object for plugin configuration. The path to the plugin can be an npm module package name or an absolute path to the `.wasm` binary itself.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/03-architecture/nextjs-compiler.mdx#_snippet_15

LANGUAGE: javascript
CODE:
```
module.exports = {
  experimental: {
    swcPlugins: [
      [
        'plugin',
        {
          ...pluginOptions,
        },
      ],
    ],
  },
}
```

----------------------------------------

TITLE: Streaming Data with use Hook in Client Component (Next.js)
DESCRIPTION: This snippet demonstrates how to stream data from a Server Component to a Client Component using React's use hook in Next.js. It fetches blog posts and passes them as a promise to a Client Component.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/01-getting-started/06-fetching-data.mdx#2025-04-21_snippet_2

LANGUAGE: tsx
CODE:
```
import Posts from '@/app/ui/posts
import { Suspense } from 'react'

export default function Page() {
  // Don't await the data fetching function
  const posts = getPosts()

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Posts posts={posts} />
    </Suspense>
  )
}
```

LANGUAGE: jsx
CODE:
```
import Posts from '@/app/ui/posts
import { Suspense } from 'react'

export default function Page() {
  // Don't await the data fetching function
  const posts = getPosts()

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Posts posts={posts} />
    </Suspense>
  )
}
```

----------------------------------------

TITLE: Replacing Options with noStore Function
DESCRIPTION: This JavaScript snippet shows a similar implementation of the unstable_noStore function for usage in situations where passing cache-related options to fetch is not desirable. The function prevents server components from being cached and statically rendered in a Next.js application. Dependencies include the next package, and this code is useful when db.query operations are involved. It expects setup for async operations and no specific input parameters are required.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/04-functions/unstable_noStore.mdx#2025-04-21_snippet_1

LANGUAGE: jsx
CODE:
```
import { unstable_noStore as noStore } from 'next/cache';

export default async function ServerComponent() {
  noStore();
  const result = await db.query(...);
  ...
}
```

----------------------------------------

TITLE: Using CSS variables for multiple fonts in Next.js (JavaScript)
DESCRIPTION: This code snippet demonstrates how to use CSS variables to apply multiple fonts in a Next.js application using JavaScript. It imports Inter and Roboto_Mono fonts, assigns CSS variables to them, and applies these variables to the html element.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/02-components/font.mdx#_snippet_33

LANGUAGE: jsx
CODE:
```
import { Inter, Roboto_Mono } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const roboto_mono = Roboto_Mono({
  subsets: ['latin'],
  variable: '--font-roboto-mono',
  display: 'swap',
})

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${roboto_mono.variable}`}>
      <body>
        <h1>My App</h1>
        <div>{children}</div>
      </body>
    </html>
  )
}
```

----------------------------------------

TITLE: Disabling Static Image Imports in Next.js
DESCRIPTION: This snippet demonstrates how to disable the import of static images in Next.js. This is particularly useful when integrating other plugins that may conflict with static imports.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/02-components/image.mdx#2025-04-21_snippet_25

LANGUAGE: javascript
CODE:
```
module.exports = {
  images: {
    disableStaticImages: true,
  },
}
```

----------------------------------------

TITLE: Fetching Data with SWR in Next.js
DESCRIPTION: This snippet illustrates how to use the SWR data-fetching library in a Next.js page. It manages loading and error states simply, providing a cleaner approach to client-side data fetching while improving performance through caching and revalidation.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/02-pages/03-building-your-application/02-rendering/05-client-side-rendering.mdx#2025-04-21_snippet_1

LANGUAGE: jsx
CODE:
```
import useSWR from 'swr'

export function Page() {
  const { data, error, isLoading } = useSWR(
    'https://api.example.com/data',
    fetcher
  )

  if (error) return <p>Failed to load.</p>
  if (isLoading) return <p>Loading...</p>

  return <p>Your Data: {data}</p>
}

```

----------------------------------------

TITLE: Initializing Open Graph Metadata in Next.js (Basic)
DESCRIPTION: This code snippet demonstrates how to define basic Open Graph metadata properties such as title, description, URL, siteName, images, videos, audio, locale, and type within a Next.js application. The metadata is exported as a constant named `metadata`.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/04-functions/generate-metadata.mdx#_snippet_18

LANGUAGE: jsx
CODE:
```
export const metadata = {
  openGraph: {
    title: 'Next.js',
    description: 'The React Framework for the Web',
    url: 'https://nextjs.org',
    siteName: 'Next.js',
    images: [
      {
        url: 'https://nextjs.org/og.png', // Must be an absolute URL
        width: 800,
        height: 600,
      },
      {
        url: 'https://nextjs.org/og-alt.png', // Must be an absolute URL
        width: 1800,
        height: 1600,
        alt: 'My custom alt',
      },
    ],
    videos: [
      {
        url: 'https://nextjs.org/video.mp4', // Must be an absolute URL
        width: 800,
        height: 600,
      },
    ],
    audio: [
      {
        url: 'https://nextjs.org/audio.mp3', // Must be an absolute URL
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
}
```

----------------------------------------

TITLE: Enabling Draft Mode
DESCRIPTION: This code snippet imports the `draftMode` function from `next/headers` and enables draft mode. The `draftMode().enable()` method sets a cookie that enables draft mode for subsequent requests.  The route handler then responds with a confirmation message.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/draft-mode.mdx#_snippet_2

LANGUAGE: typescript
CODE:
```
import { draftMode } from 'next/headers'

export async function GET(request: Request) {
  const draft = await draftMode()
  draft.enable()
  return new Response('Draft mode is enabled')
}
```

----------------------------------------

TITLE: Running Next.js CLI Commands - Bash
DESCRIPTION: This snippet shows the standard command structure for interacting with the Next.js command-line interface using `npx`. It illustrates how to specify a command and pass options to control the CLI's behavior.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/06-cli/next.mdx#_snippet_0

LANGUAGE: bash
CODE:
```
npx next [command] [options]
```

----------------------------------------

TITLE: Implementing getStaticPaths with TypeScript
DESCRIPTION: Example of implementing getStaticPaths and getStaticProps in a Next.js dynamic route using TypeScript. Shows how to fetch and type GitHub repository data.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/02-pages/04-api-reference/03-functions/get-static-paths.mdx#2025-04-23_snippet_0

LANGUAGE: typescript
CODE:
```
import type {
  InferGetStaticPropsType,
  GetStaticProps,
  GetStaticPaths,
} from 'next'

type Repo = {
  name: string
  stargazers_count: number
}

export const getStaticPaths = (async () => {
  return {
    paths: [
      {
        params: {
          name: 'next.js',
        },
      },
    ],
    fallback: true,
  }
}) satisfies GetStaticPaths

export const getStaticProps = (async (context) => {
  const res = await fetch('https://api.github.com/repos/vercel/next.js')
  const repo = await res.json()
  return { props: { repo } }
}) satisfies GetStaticProps<{
  repo: Repo
}>

export default function Page({
  repo,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return repo.stargazers_count
}
```

----------------------------------------

TITLE: Adding Additional Attributes to Script Tag in Next.js (JSX)
DESCRIPTION: This code snippet demonstrates how to add additional attributes, such as `id`, `nonce`, and custom data attributes, to the `<script>` tag using the `next/script` component. It is designed to be used within a client component, as indicated by the `'use client'` directive. The additional attributes are directly passed to the `Script` component.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/scripts.mdx#_snippet_15

LANGUAGE: jsx
CODE:
```
import Script from 'next/script'

export default function Page() {
  return (
    <>
      <Script
        src="https://example.com/script.js"
        id="example-script"
        nonce="XUENAJFW"
        data-test="script"
      />
    </>
  )
}
```

----------------------------------------

TITLE: Transform App Router Runtime Config
DESCRIPTION: This codemod transforms the Route Segment Config `runtime` value from `experimental-edge` to `edge` in App Router.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/upgrading/codemods.mdx#_snippet_1

LANGUAGE: bash
CODE:
```
npx @next/codemod@latest app-dir-runtime-config-experimental-edge .
```

----------------------------------------

TITLE: Creating Database Session via Next.js Pages Router API Route
DESCRIPTION: This Next.js API route handler, intended for the Pages Router, processes incoming requests to create a new database session. It expects user details in the request body, generates a unique session ID (using a hypothetical `generateSessionId` function), inserts this ID along with the user ID and creation timestamp into the database, and responds with the new session ID upon success or an error message on failure.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/authentication.mdx#_snippet_20

LANGUAGE: ts
CODE:
```
import db from '../../lib/db'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const user = req.body
    const sessionId = generateSessionId()
    await db.insertSession({
      sessionId,
      userId: user.id,
      createdAt: new Date(),
    })

    res.status(200).json({ sessionId })
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' })
  }
}
```

LANGUAGE: js
CODE:
```
import db from '../../lib/db'

export default async function handler(req, res) {
  try {
    const user = req.body
    const sessionId = generateSessionId()
    await db.insertSession({
      sessionId,
      userId: user.id,
      createdAt: new Date(),
    })

    res.status(200).json({ sessionId })
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' })
  }
}
```

----------------------------------------

TITLE: Caching Page with Nested Component (TSX)
DESCRIPTION: Shows a `page.tsx` file where the page itself uses `'use cache'`. It renders an imported asynchronous component (`Users`). The nested component benefits from the caching behavior applied at the page level.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/01-directives/use-cache.mdx#_snippet_8

LANGUAGE: TSX
CODE:
```
'use cache'

async function Users() {
  const users = await fetch('/api/users')
  // loop through users
}

export default function Page() {
  return (
    <main>
      <Users />
    </main>
  )
}
```

----------------------------------------

TITLE: Route Change Detection with usePathname in Next.js
DESCRIPTION: Shows how to use usePathname along with useSearchParams and useEffect to respond to route changes in a Client Component.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/04-functions/use-pathname.mdx#2025-04-21_snippet_1

LANGUAGE: tsx
CODE:
```
'use client'

import { usePathname, useSearchParams } from 'next/navigation'

function ExampleClientComponent() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  useEffect(() => {
    // Do something here...
  }, [pathname, searchParams])
}
```

LANGUAGE: jsx
CODE:
```
'use client'

import { usePathname, useSearchParams } from 'next/navigation'

function ExampleClientComponent() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  useEffect(() => {
    // Do something here...
  }, [pathname, searchParams])
}
```

----------------------------------------

TITLE: Handling Web Vitals Metrics by Name (App Router, JSX)
DESCRIPTION: This JavaScript code snippet shows how to handle specific web vital metrics by their `name` property using a switch statement inside the `useReportWebVitals` hook within the App Router in Next.js. It handles First Contentful Paint (FCP) and Largest Contentful Paint (LCP) metrics as examples.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/analytics.mdx#_snippet_5

LANGUAGE: jsx
CODE:
```
'use client'

import { useReportWebVitals } from 'next/web-vitals'

export function WebVitals() {
  useReportWebVitals((metric) => {
    switch (metric.name) {
      case 'FCP': {
        // handle FCP results
      }
      case 'LCP': {
        // handle LCP results
      }
      // ...
    }
  })
}
```

----------------------------------------

TITLE: Integrating Session Deletion into Server Action (JavaScript)
DESCRIPTION: This snippet shows a Next.js Server Action `logout` that handles user logout. It calls the `deleteSession` function to remove the session cookie and then uses the `redirect` API to navigate the user to the login page.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/authentication.mdx#_snippet_16

LANGUAGE: js
CODE:
```
import { cookies } from 'next/headers';
import { deleteSession } from '@/app/lib/session';

export async function logout() {
  await deleteSession();
  redirect('/login');
}
```

----------------------------------------

TITLE: Correct Token Caching Implementation in Next.js
DESCRIPTION: Improved implementation where random UUID generation is moved inside the cached function scope.
SOURCE: https://github.com/vercel/next.js/blob/canary/errors/next-prerender-crypto.mdx#2025-04-21_snippet_1

LANGUAGE: jsx
CODE:
```
async function getCachedDate(token: string) {
  "use cache"
  const token = crypto.getRandomUUID()
  return db.query(token, ...)
}

export default async function Page() {
  const data = await getCachedData();
  return ...
}
```

----------------------------------------

TITLE: Configuring Next.js Rewrites with Trailing Slash (JavaScript)
DESCRIPTION: This snippet shows how to define rewrite rules when the Next.js application is configured to use trailing slashes (`trailingSlash: true`). Both the 'source' and 'destination' paths should include a trailing slash to match the application's routing behavior and ensure compatibility with the destination server if it also expects trailing slashes. This applies to both internal and external rewrites.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/05-config/01-next-config-js/rewrites.mdx#_snippet_11

LANGUAGE: JavaScript
CODE:
```
module.exports = {
  trailingSlash: true,
  async rewrites() {
    return [
      {
        source: '/blog/',
        destination: 'https://example.com/blog/',
      },
      {
        source: '/blog/:path*/',
        destination: 'https://example.com/blog/:path*/',
      },
    ]
  },
}
```

----------------------------------------

TITLE: Forwarding Headers with NextResponse.next() - TypeScript
DESCRIPTION: Demonstrates how to forward modified headers in a response using NextResponse.next(). This allows you to enrich the request with additional metadata.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/04-functions/next-response.mdx#2025-04-21_snippet_10

LANGUAGE: typescript
CODE:
```
import { NextResponse } from 'next/server'

// Given an incoming request...
const newHeaders = new Headers(request.headers)
// Add a new header
newHeaders.set('x-version', '123')
// And produce a response with the new headers
return NextResponse.next({
  request: {
    // New request headers
    headers: newHeaders,
  },
})
```

----------------------------------------

TITLE: Register OpenTelemetry in instrumentation.ts
DESCRIPTION: Registers OpenTelemetry for observability. This function is called once when a new Next.js server instance is initiated. It imports `registerOTel` from `@vercel/otel` and calls it with the application name 'next-app'.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/03-file-conventions/instrumentation.mdx#_snippet_0

LANGUAGE: typescript
CODE:
```
import { registerOTel } from '@vercel/otel'

export function register() {
  registerOTel('next-app')
}
```

----------------------------------------

TITLE: Checking Cookie Existence with NextRequest
DESCRIPTION: This snippet demonstrates how to check if a cookie exists using the `has` method of the `request.cookies` object in Next.js. It checks if the cookie named 'experiments' exists.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/04-functions/next-request.mdx#2025-04-21_snippet_4

LANGUAGE: typescript
CODE:
```
// Returns true if cookie exists, false if it does not
request.cookies.has('experiments')
```

----------------------------------------

TITLE: Defining MDX Components with useMDXComponents in JavaScript
DESCRIPTION: This JavaScript code snippet defines a function `useMDXComponents` that accepts an object of MDX components and returns a new object with the provided components merged with the existing ones. The function is exported for use in a Next.js application. No explicit type definitions are used here.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/03-file-conventions/mdx-components.mdx#_snippet_1

LANGUAGE: javascript
CODE:
```
export function useMDXComponents(components) {
  return {
    ...components,
  }
}
```

----------------------------------------

TITLE: Importing and Using Connection in Next.js Page (JavaScript)
DESCRIPTION: This snippet shows how to utilize the `connection` function within a JavaScript file in a Next.js application, enabling dynamic content changes upon user requests and leveraging APIs like `Math.random()` for different rendering outputs.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/04-functions/connection.mdx#2025-04-21_snippet_1

LANGUAGE: javascript
CODE:
```
import { connection } from 'next/server'\n\nexport default async function Page() {\n  await connection()\n  // Everything below will be excluded from prerendering\n  const rand = Math.random()\n  return <span>{rand}</span>\n}
```

----------------------------------------

TITLE: Encrypting and Decrypting Session Payload with Jose in JavaScript
DESCRIPTION: This snippet defines asynchronous functions `encrypt` and `decrypt` using the `jose` library. The `encrypt` function signs a payload with HS256, setting expiration to 7 days. The `decrypt` function verifies a session string using HS256 and returns the payload, handling verification errors. Both functions use a shared secret key from environment variables.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/authentication.mdx#_snippet_6

LANGUAGE: jsx
CODE:
```
import 'server-only';
import { SignJWT, jwtVerify } from 'jose';

const secretKey = process.env.SESSION_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

export async function encrypt(payload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(encodedKey);
}

export async function decrypt(session) {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ['HS256'],
    });
    return payload;
  } catch (error) {
    console.log('Failed to verify session');
  }
}
```

----------------------------------------

TITLE: Implementing Art Direction for Responsive Images in Next.js
DESCRIPTION: This code snippet shows how to use getImageProps to create responsive images with different sources for mobile and desktop views, demonstrating art direction techniques.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/02-components/image.mdx#2025-04-21_snippet_35

LANGUAGE: jsx
CODE:
```
import { getImageProps } from 'next/image'

export default function Home() {
  const common = { alt: 'Art Direction Example', sizes: '100vw' }
  const {
    props: { srcSet: desktop },
  } = getImageProps({
    ...common,
    width: 1440,
    height: 875,
    quality: 80,
    src: '/desktop.jpg',
  })
  const {
    props: { srcSet: mobile, ...rest },
  } = getImageProps({
    ...common,
    width: 750,
    height: 1334,
    quality: 70,
    src: '/mobile.jpg',
  })

  return (
    <picture>
      <source media="(min-width: 1000px)" srcSet={desktop} />
      <source media="(min-width: 500px)" srcSet={mobile} />
      <img {...rest} style={{ width: '100%', height: 'auto' }} />
    </picture>
  )
}
```

----------------------------------------

TITLE: Environment variables for Cloudflare Turnstile
DESCRIPTION: These are the environment variables required to connect the Next.js app to Cloudflare Turnstile.  `NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY` is the public site key and `CLOUDFLARE_TURNSTILE_SECRET_KEY` is the secret key.
SOURCE: https://github.com/vercel/next.js/blob/canary/examples/cloudflare-turnstile/README.md#2025-04-21_snippet_4

LANGUAGE: plaintext
CODE:
```
- `NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY`
- `CLOUDFLARE_TURNSTILE_SECRET_KEY`
```

----------------------------------------

TITLE: Ensuring Authenticated Mutations with Server Actions (JavaScript)
DESCRIPTION: In JavaScript, this snippet ensures only authenticated users perform server-side actions such as data mutations. It confirms user sessions and applies unauthorized functions for session failures.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/04-functions/unauthorized.mdx#2025-04-21_snippet_7

LANGUAGE: JavaScript
CODE:
```
'use server'

import { verifySession } from '@/app/lib/dal'
import { unauthorized } from 'next/navigation'
import db from '@/app/lib/db'

export async function updateProfile(data) {
  const session = await verifySession()

  // If the user is not authenticated, return a 401
  if (!session) {
    unauthorized()
  }

  // Proceed with mutation
  // ...
}
```

----------------------------------------

TITLE: Creating URL Instances from External Sources
DESCRIPTION: This snippet shows how to create a URL object for an external asset and log its pathname in JavaScript, demonstrating integration with `import.meta.url`.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/05-config/01-next-config-js/urlImports.mdx#2025-04-21_snippet_5

LANGUAGE: javascript
CODE:
```
const logo = new URL('https://example.com/assets/file.txt', import.meta.url)

console.log(logo.pathname)

// prints "/_next/static/media/file.a9727b5d.txt"
```

----------------------------------------

TITLE: Implementing getStaticPaths with JavaScript in Next.js Dynamic Routes
DESCRIPTION: JavaScript implementation of getStaticPaths and getStaticProps for Next.js dynamic routes. Shows how to define static paths, fetch data from an external API, and render the page with the fetched data.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/02-pages/03-building-your-application/03-data-fetching/02-get-static-paths.mdx#2025-04-21_snippet_1

LANGUAGE: jsx
CODE:
```
export async function getStaticPaths() {
  return {
    paths: [
      {
        params: {
          name: 'next.js',
        },
      }, // See the "paths" section below
    ],
    fallback: true, // false or "blocking"
  }
}

export async function getStaticProps() {
  const res = await fetch('https://api.github.com/repos/vercel/next.js')
  const repo = await res.json()
  return { props: { repo } }
}

export default function Page({ repo }) {
  return repo.stargazers_count
}
```

----------------------------------------

TITLE: Linking to Dynamic Routes with Next.js Link
DESCRIPTION: These snippets demonstrate how to generate links for dynamic route segments using template literals within the `href` prop. It shows examples for both the Pages Router (`pages/blog/[slug].js`) and App Router (`app/blog/[slug]/page.js`) conventions.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/02-components/link.mdx#_snippet_12

LANGUAGE: TSX
CODE:
```
import Link from 'next/link'

function Posts({ posts }) {
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </li>
      ))}
    </ul>
  )
}
```

LANGUAGE: JSX
CODE:
```
import Link from 'next/link'

function Posts({ posts }) {
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </li>
      ))}
    </ul>
  )
}

export default Posts
```

LANGUAGE: TSX
CODE:
```
import Link from 'next/link'

export default function Page({ posts }) {
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </li>
      ))}
    </ul>
  )
}
```

LANGUAGE: JSX
CODE:
```
import Link from 'next/link'

export default function Page({ posts }) {
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </li>
      ))}
    </ul>
  )
}
```

----------------------------------------

TITLE: Disabling Scroll on Router Push (App Router)
DESCRIPTION: Demonstrates how to disable the default scrolling behavior when using `router.push()` or `router.replace()` in the App Router by providing the `scroll: false` option within the options object argument. This gives programmatic control over scroll on navigation.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/02-components/link.mdx#_snippet_18

LANGUAGE: JSX
CODE:
```
// useRouter
import { useRouter } from 'next/navigation'

const router = useRouter()

router.push('/dashboard', { scroll: false })
```

----------------------------------------

TITLE: Creating a Custom 404 Page in Next.js
DESCRIPTION: This code snippet demonstrates how to create a custom 404 page in a Next.js application.  It defines a React functional component named `Custom404` that returns a simple heading indicating the page was not found.  This component is placed in `pages/404.js`, which Next.js automatically recognizes and serves for 404 errors.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/02-pages/03-building-your-application/01-routing/08-custom-error.mdx#_snippet_0

LANGUAGE: jsx
CODE:
```
export default function Custom404() {
  return <h1>404 - Page Not Found</h1>
}
```

----------------------------------------

TITLE: Convert Base64 to Uint8Array - JavaScript
DESCRIPTION: This function converts a base64 string to a Uint8Array, which is required for the applicationServerKey when subscribing to push notifications. It handles padding and replaces URL-safe characters before decoding the base64 string using the window.atob() method. The resulting raw data is then converted to a Uint8Array and returned.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/progressive-web-apps.mdx#_snippet_3

LANGUAGE: javascript
CODE:
```
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/')

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}
```

----------------------------------------

TITLE: Create Next.js App with Meilisearch Example (pnpm)
DESCRIPTION: This command uses pnpm to create a new Next.js application based on the with-meilisearch example. It initializes the project with all the necessary files and configurations to integrate with Meilisearch.
SOURCE: https://github.com/vercel/next.js/blob/canary/examples/with-meilisearch/README.md#_snippet_2

LANGUAGE: bash
CODE:
```
pnpm create next-app --example with-meilisearch with-meilisearch-app
```

----------------------------------------

TITLE: Composing Server Components inside Client Components in JavaScript
DESCRIPTION: This JavaScript example demonstrates how to compose a Server Component as a child of a Client Component in a Next.js page. By passing the Server Component as children, it can be rendered on the server independently from the Client Component that will be hydrated on the client.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-building-your-application/03-rendering/03-composition-patterns.mdx#2025-04-21_snippet_20

LANGUAGE: jsx
CODE:
```
// This pattern works:
// You can pass a Server Component as a child or prop of a
// Client Component.
import ClientComponent from './client-component'
import ServerComponent from './server-component'

// Pages in Next.js are Server Components by default
export default function Page() {
  return (
    <ClientComponent>
      <ServerComponent />
    </ClientComponent>
  )
}
```

----------------------------------------

TITLE: Creating custom OpenTelemetry span (TypeScript)
DESCRIPTION: Demonstrates how to create a custom span using the OpenTelemetry API. The `fetchGithubStars` function creates a span named 'fetchGithubStars' to track the execution of the `getValue` function.  The span is started and ended explicitly to capture the duration of the operation.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/open-telemetry.mdx#_snippet_9

LANGUAGE: typescript
CODE:
```
import { trace } from '@opentelemetry/api'

export async function fetchGithubStars() {
  return await trace
    .getTracer('nextjs-example')
    .startActiveSpan('fetchGithubStars', async (span) => {
      try {
        return await getValue()
      } finally {
        span.end()
      }
    })
}
```

----------------------------------------

TITLE: Set Default Revalidation Time for Routes in Next.js (TS/JS)
DESCRIPTION: Specify the default data revalidation frequency for a layout, page, or route handler by exporting the `revalidate` variable. Set to `false` for infinite cache (default), `0` to force dynamic rendering, or a number (seconds) for time-based revalidation.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/03-file-conventions/route-segment-config.mdx#_snippet_3

LANGUAGE: TypeScript
CODE:
```
export const revalidate = false
// false | 0 | number
```

LANGUAGE: JavaScript
CODE:
```
export const revalidate = false
// false | 0 | number
```

----------------------------------------

TITLE: Using useSelectedLayoutSegment in Typescript
DESCRIPTION: This code snippet demonstrates how to use `useSelectedLayoutSegment` hook to read the active route segment within a specific slot. The `parallelRoutesKey` parameter ('auth' in this case) is used to specify the slot for which the active segment is being retrieved.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-building-your-application/01-routing/11-parallel-routes.mdx#2025-04-21_snippet_2

LANGUAGE: typescript
CODE:
```
'use client'

import { useSelectedLayoutSegment } from 'next/navigation'

export default function Layout({ auth }: { auth: React.ReactNode }) {
  const loginSegment = useSelectedLayoutSegment('auth')
  // ...
}
```

----------------------------------------

TITLE: Overriding MDX Components Locally in Next.js Pages Router (JSX)
DESCRIPTION: This code demonstrates how to override MDX components locally within a specific page in the Next.js pages directory. It defines a custom `CustomH1` component and then creates an `overrideComponents` object to map the `h1` tag to the custom component. This override is then passed to the `Welcome` MDX component.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/mdx.mdx#_snippet_21

LANGUAGE: jsx
CODE:
```
import Welcome from '@/markdown/welcome.mdx'

function CustomH1({ children }) {
  return <h1 style={{ color: 'blue', fontSize: '100px' }}>{children}</h1>
}

const overrideComponents = {
  h1: CustomH1,
}

export default function Page() {
  return <Welcome components={overrideComponents} />
}
```

----------------------------------------

TITLE: Using sizes Property with Next.js Image Component
DESCRIPTION: Example of setting the sizes property on a Next.js Image component to optimize loading based on viewport size. The sizes attribute helps browsers determine which image size to download from the srcset based on different breakpoints.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/02-components/image.mdx#2025-04-21_snippet_3

LANGUAGE: jsx
CODE:
```
import Image from 'next/image'

export default function Page() {
  return (
    <div className="grid-element">
      <Image
        fill
        src="/example.png"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </div>
  )
}
```

----------------------------------------

TITLE: Determining Locale from Request Headers in JavaScript
DESCRIPTION: This snippet demonstrates how to determine the user's preferred locale based on the Accept-Language header using the @formatjs/intl-localematcher and negotiator libraries.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-building-your-application/01-routing/15-internationalization.mdx#2025-04-21_snippet_0

LANGUAGE: javascript
CODE:
```
import { match } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'

let headers = { 'accept-language': 'en-US,en;q=0.5' }
let languages = new Negotiator({ headers }).languages()
let locales = ['en-US', 'nl-NL', 'nl']
let defaultLocale = 'en-US'

match(languages, locales, defaultLocale) // -> 'en-US'
```

----------------------------------------

TITLE: Cypress E2E Configuration (JavaScript)
DESCRIPTION: Configures Cypress for End-to-End (E2E) testing using JavaScript. Defines the `setupNodeEvents` function within the `e2e` configuration block.  Requires the `cypress` package to be installed.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/testing/cypress.mdx#_snippet_5

LANGUAGE: javascript
CODE:
```
const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {},
  },
})
```

----------------------------------------

TITLE: Configuring Apple Web App Metadata in Next.js
DESCRIPTION: This code snippet demonstrates how to configure metadata for Apple web apps within a Next.js application. It includes settings for iTunes app ID and argument, as well as Apple web app title, status bar style, and startup images. The metadata is exported as part of the `metadata` object.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/04-functions/generate-metadata.mdx#_snippet_36

LANGUAGE: jsx
CODE:
```
export const metadata = {
  itunes: {
    appId: 'myAppStoreID',
    appArgument: 'myAppArgument',
  },
  appleWebApp: {
    title: 'Apple Web App',
    statusBarStyle: 'black-translucent',
    startupImage: [
      '/assets/startup/apple-touch-startup-image-768x1004.png',
      {
        url: '/assets/startup/apple-touch-startup-image-1536x2008.png',
        media: '(device-width: 768px) and (device-height: 1024px)',
      },
    ],
  },
}
```

----------------------------------------

TITLE: Initializing Login Page Component in Next.js
DESCRIPTION: Creates a basic login page component that renders a Login component, demonstrating the main login route implementation
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-building-your-application/01-routing/11-parallel-routes.mdx#2025-04-21_snippet_8

LANGUAGE: tsx
CODE:
```
import { Login } from '@\/app\/ui\/login'

export default function Page() {
  return <Login \/>
}
```

LANGUAGE: jsx
CODE:
```
import { Login } from '@\/app\/ui\/login'

export default function Page() {
  return <Login \/>
}
```

----------------------------------------

TITLE: Setting metadataBase for URL Composition in Next.js
DESCRIPTION: This code snippet demonstrates how to set the metadataBase option to define a base URL for metadata fields that require fully qualified URLs. It also shows how to configure alternates and openGraph metadata.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/04-functions/generate-metadata.mdx#_snippet_14

LANGUAGE: jsx
CODE:
```
export const metadata = {
  metadataBase: new URL('https://acme.com'),
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/en-US',
      'de-DE': '/de-DE',
    },
  },
  openGraph: {
    images: '/og-image.png',
  },
}
```

----------------------------------------

TITLE: HTML Output for Multiple Meta Tags
DESCRIPTION: This HTML snippet shows the output generated when using an array value for custom metadata. It demonstrates how multiple meta tags with the same name are rendered in the `<head>` section.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/04-functions/generate-metadata.mdx#_snippet_61

LANGUAGE: html
CODE:
```
<meta name="custom" content="meta1" /> <meta name="custom" content="meta2" />
```

----------------------------------------

TITLE: Extending Webpack Alias in Next.js
DESCRIPTION: This code snippet demonstrates how to correctly extend the webpack alias configuration in `next.config.js` instead of replacing it. This ensures that Next.js' internal aliases, such as 'private-next-pages', are not inadvertently removed, preventing the 'Invalid webpack resolve alias' error.  It takes the existing `config` object as input and modifies its `resolve.alias` property by merging the existing aliases with the new custom aliases.
SOURCE: https://github.com/vercel/next.js/blob/canary/errors/config-resolve-alias.mdx#2025-04-21_snippet_0

LANGUAGE: javascript
CODE:
```
"webpack(config) {\n  config.resolve.alias = {\n    ...config.resolve.alias,\n    // your aliases\n  }\n}"
```

----------------------------------------

TITLE: Running ESLint on Staged Files with lint-staged (js)
DESCRIPTION: This snippet demonstrates how to configure lint-staged to run `next lint` on staged files. It defines a `buildEslintCommand` function that constructs the command to run ESLint with the `--file` flag for each staged file. This is useful for ensuring that only changed files are linted before committing.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/05-config/03-eslint.mdx#_snippet_9

LANGUAGE: js
CODE:
```
const path = require('path')

const buildEslintCommand = (filenames) =>
  `next lint --fix --file ${filenames
    .map((f) => path.relative(process.cwd(), f))
    .join(' --file ')}`

module.exports = {
  '*.{js,jsx,ts,tsx}': [buildEslintCommand],
}
```

----------------------------------------

TITLE: Using use Hook in Client Component (Next.js)
DESCRIPTION: This example shows how to use React's use hook in a Next.js Client Component to read a promise passed from a Server Component. It renders a list of blog posts once the promise resolves.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/01-getting-started/06-fetching-data.mdx#2025-04-21_snippet_3

LANGUAGE: tsx
CODE:
```
'use client'
import { use } from 'react'

export default function Posts({
  posts,
}: {
  posts: Promise<{ id: string; title: string }[]>
}) {
  const allPosts = use(posts)

  return (
    <ul>
      {allPosts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}
```

LANGUAGE: jsx
CODE:
```
'use client'
import { use } from 'react'

export default function Posts({ posts }) {
  const posts = use(posts)

  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}
```

----------------------------------------

TITLE: Implementing Granular Streaming with Suspense (Next.js)
DESCRIPTION: This snippet demonstrates how to implement granular streaming in a Next.js page using React's Suspense component. It immediately renders static content while streaming in dynamic content wrapped in a Suspense boundary.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/01-getting-started/06-fetching-data.mdx#2025-04-21_snippet_6

LANGUAGE: tsx
CODE:
```
import { Suspense } from 'react'
import BlogList from '@/components/BlogList'
import BlogListSkeleton from '@/components/BlogListSkeleton'

export default function BlogPage() {
  return (
    <div>
      {/* This content will be sent to the client immediately */}
      <header>
        <h1>Welcome to the Blog</h1>
        <p>Read the latest posts below.</p>
      </header>
      <main>
        {/* Any content wrapped in a <Suspense> boundary will be streamed */}
        <Suspense fallback={<BlogListSkeleton />}>
          <BlogList />
        </Suspense>
      </main>
    </div>
  )
}
```

LANGUAGE: jsx
CODE:
```
import { Suspense } from 'react'
import BlogList from '@/components/BlogList'
import BlogListSkeleton from '@/components/BlogListSkeleton'

export default function BlogPage() {
  return (
    <div>
      {/* This content will be sent to the client immediately */}
      <header>
        <h1>Welcome to the Blog</h1>
        <p>Read the latest posts below.</p>
      </header>
      <main>
        {/* Any content wrapped in a <Suspense> boundary will be streamed */}
        <Suspense fallback={<BlogListSkeleton />}>
          <BlogList />
        </Suspense>
      </main>
    </div>
  )
}
```

----------------------------------------

TITLE: Specifying Node.js Runtime in Next.js Middleware Config (JS)
DESCRIPTION: Specifies the Node.js runtime for the Next.js middleware by exporting a `config` object with the `runtime` property set to `'nodejs'` in the `middleware.js` file. This must be used in conjunction with enabling `nodeMiddleware: true` in `next.config.js/ts`.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-building-your-application/01-routing/14-middleware.mdx#_snippet_21

LANGUAGE: javascript
CODE:
```
export const config = {
  runtime: 'nodejs',
}
```

----------------------------------------

TITLE: Exporting PostCSS Configuration as an Object (Correct)
DESCRIPTION: This snippet demonstrates the correct way to export PostCSS configuration as a plain object. It uses process.env to access environment information for determining plugin configuration.
SOURCE: https://github.com/vercel/next.js/blob/canary/errors/postcss-function.mdx#2025-04-21_snippet_1

LANGUAGE: javascript
CODE:
```
module.exports = {
  plugins: {
    'postcss-plugin': process.env.NODE_ENV === 'production' ? {} : false,
  },
}
```

----------------------------------------

TITLE: Creating Loading Component in TypeScript for Next.js
DESCRIPTION: This snippet demonstrates how to create a loading component in TypeScript for Next.js. It exports a default function that returns a simple loading message, which can be customized to display a loading skeleton component.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/03-file-conventions/loading.mdx#2025-04-21_snippet_0

LANGUAGE: tsx
CODE:
```
export default function Loading() {
  // Or a custom loading skeleton component
  return <p>Loading...</p>
}
```

----------------------------------------

TITLE: Configuring React Compiler for Opt-in Mode (JavaScript)
DESCRIPTION: Configuration in next.config.js to set the React Compiler to 'annotation' compilation mode for opt-in usage.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/05-config/01-next-config-js/reactCompiler.mdx#2025-04-23_snippet_4

LANGUAGE: javascript
CODE:
```
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    reactCompiler: {
      compilationMode: 'annotation',
    },
  },
}

module.exports = nextConfig
```

----------------------------------------

TITLE: Implementing Client-Side Counter Component in TypeScript
DESCRIPTION: Example of a client component using the 'use client' directive with React useState hook. Shows implementation of a basic counter with increment functionality.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/01-directives/use-client.mdx#2025-04-21_snippet_0

LANGUAGE: tsx
CODE:
```
'use client'

import { useState } from 'react'

export default function Counter() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  )
}
```

----------------------------------------

TITLE: Logging HMR Cache Refreshes in Fetches
DESCRIPTION: Enables logging for fetch requests restored from the Server Components HMR cache. Requires setting `logging.fetches.hmrRefreshes` to `true` in `next.config.js`. This feature is specifically for development mode use.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/05-config/01-next-config-js/logging.mdx#2025-04-21_snippet_1

LANGUAGE: JavaScript
CODE:
```
module.exports = {
  logging: {
    fetches: {
      hmrRefreshes: true,
    },
  },
}
```

----------------------------------------

TITLE: Update Static Image Imports in Next.js
DESCRIPTION: Demonstrates how to update static image imports when migrating from CRA to Next.js.  It shows how to convert absolute import paths for images imported from `/public` into relative imports.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/migrating/from-create-react-app.mdx#_snippet_19

LANGUAGE: TypeScript
CODE:
```
// Before
import logo from '/logo.png'

// After
import logo from '../public/logo.png'
```

----------------------------------------

TITLE: Checking if a Cookie Exists - TSX
DESCRIPTION: This snippet demonstrates the use of the `has` method to check for the existence of a specific cookie in a Next.js page component. It asynchronously retrieves the cookie store to perform the check.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/04-functions/cookies.mdx#2025-04-21_snippet_6

LANGUAGE: tsx
CODE:
```
import { cookies } from 'next/headers'

export default async function Page() {
  const cookieStore = await cookies()
  const hasCookie = cookieStore.has('theme')
  return '...'
}
```

----------------------------------------

TITLE: Wrapping Component with ErrorBoundary in Next.js
DESCRIPTION: This snippet shows how to integrate the ErrorBoundary component in a Next.js application by wrapping the main `Component` prop in the `pages/_app.js` file. Prior import of the ErrorBoundary is necessary. This setup ensures that any unexpected errors in the app are caught and handled gracefully, preventing the entire app from crashing.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/02-pages/03-building-your-application/06-configuring/12-error-handling.mdx#2025-04-21_snippet_1

LANGUAGE: JavaScript
CODE:
```
// Import the ErrorBoundary component
import ErrorBoundary from '../components/ErrorBoundary'

function MyApp({ Component, pageProps }) {
  return (
    // Wrap the Component prop with ErrorBoundary component
    <ErrorBoundary>
      <Component {...pageProps} />
    </ErrorBoundary>
  )
}

export default MyApp
```

----------------------------------------

TITLE: Accessing Dynamic Route Parameters in Next.js
DESCRIPTION: Shows how to access dynamic route parameters using the params prop in a Next.js page component. The params object is a promise that contains route segment parameters defined in the file path.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/03-file-conventions/page.mdx#2025-04-21_snippet_1

LANGUAGE: tsx
CODE:
```
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
}
```

LANGUAGE: jsx
CODE:
```
export default async function Page({ params }) {
  const { slug } = await params
}
```

----------------------------------------

TITLE: Configuring Cache Profiles in Next.js JavaScript
DESCRIPTION: This JavaScript snippet illustrates adding a cache profile configuration in Next.js's next.config.js file. It defines cache settings for a 'blog' profile with 'stale', 'revalidate', and 'expire' properties, utilizing the 'dynamicIO' flag in the experimental section.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/05-config/01-next-config-js/cacheLife.mdx#2025-04-21_snippet_1

LANGUAGE: JavaScript
CODE:
```
module.exports = {
  experimental: {
    dynamicIO: true,
    cacheLife: {
      blog: {
        stale: 3600, // 1 hour
        revalidate: 900, // 15 minutes
        expire: 86400, // 1 day
      },
    },
  },
}
```

----------------------------------------

TITLE: RootLayout Component with Metadata (JSX)
DESCRIPTION: This code defines the RootLayout component in a Next.js application, including metadata configuration for title and description. It uses JavaScript (JSX) for the component structure.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/migrating/from-create-react-app.mdx#_snippet_7

LANGUAGE: jsx
CODE:
```
export const metadata = {
  title: 'React App',
  description: 'Web site created with Next.js.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div id="root">{children}</div>
      </body>
    </html>
  )
}
```

----------------------------------------

TITLE: Using Remote Images with Next.js Image Component
DESCRIPTION: Illustrates how to use remote images with the Next.js Image component. This example shows the need to manually specify width and height for remote images.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/01-getting-started/04-images-and-fonts.mdx#2025-04-21_snippet_2

LANGUAGE: tsx
CODE:
```
import Image from 'next/image'

export default function Page() {
  return (
    <Image
      src="https://s3.amazonaws.com/my-bucket/profile.png"
      alt="Picture of the author"
      width={500}
      height={500}
    />
  )
}
```

LANGUAGE: jsx
CODE:
```
import Image from 'next/image'

export default function Page() {
  return (
    <Image
      src="https://s3.amazonaws.com/my-bucket/profile.png"
      alt="Picture of the author"
      width={500}
      height={500}
    />
  )
}
```

----------------------------------------

TITLE: Accessing Session Data in Client Component via Context (TSX)
DESCRIPTION: Demonstrates using a custom hook (`useSession`) provided by an authentication library to access user session data within a Client Component (`'use client'`). This allows client-side operations like fetching user-specific data using `useSWR`, dependent on the session information.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/authentication.mdx#_snippet_39

LANGUAGE: tsx
CODE:
```
"use client";\n\nimport { useSession } from "auth-lib";\n\nexport default function Profile() {\n  const { userId } = useSession();\n  const { data } = useSWR(`/api/user/${userId}`, fetcher)\n\n  return (\n    // ...\n  );\n}
```

----------------------------------------

TITLE: Rendering Unauthorized Page with Login UI (TypeScript)
DESCRIPTION: This snippet defines a TypeScript component for rendering a 401 error page with a login UI, aiming to guide unauthorized users to authenticate themselves. It utilizes a Login component to facilitate user login.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/04-functions/unauthorized.mdx#2025-04-21_snippet_4

LANGUAGE: TypeScript
CODE:
```
import Login from '@/app/components/Login'

export default function UnauthorizedPage() {
  return (
    <main>
      <h1>401 - Unauthorized</h1>
      <p>Please log in to access this page.</p>
      <Login />
    </main>
  )
}
```

----------------------------------------

TITLE: Setting X-Frame-Options Header - JavaScript
DESCRIPTION: This snippet shows how to configure the `X-Frame-Options` header in your Next.js headers array. Setting the value to `'SAMEORIGIN'` prevents the site from being displayed within an `iframe` unless the embedding page is from the same origin, mitigating clickjacking vulnerabilities. Note that this header is superseded by CSP's `frame-ancestors`.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/05-config/01-next-config-js/headers.mdx#_snippet_16

LANGUAGE: js
CODE:
```
{
  key: 'X-Frame-Options',
  value: 'SAMEORIGIN'
}
```

----------------------------------------

TITLE: Getting a Cookie with NextRequest
DESCRIPTION: This snippet shows how to retrieve the value of a cookie using the `get` method of the `request.cookies` object in Next.js. It retrieves the value of the cookie named 'show-banner'.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/04-functions/next-request.mdx#2025-04-21_snippet_1

LANGUAGE: typescript
CODE:
```
// Given incoming request /home
// { name: 'show-banner', value: 'false', Path: '/home' }
request.cookies.get('show-banner')
```

----------------------------------------

TITLE: Generating Sitemaps in TypeScript with Next.js
DESCRIPTION: This TypeScript snippet demonstrates how to use the generateSitemaps function to generate multiple sitemaps based on product ID ranges. The snippet fetches products and returns sitemap data with URLs and last modification dates. Dependencies include a function to fetch product details and a constant for base URL definitions.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/04-functions/generate-sitemaps.mdx#2025-04-21_snippet_0

LANGUAGE: TypeScript
CODE:
```
import { BASE_URL } from '@/app/lib/constants'

export async function generateSitemaps() {
  // Fetch the total number of products and calculate the number of sitemaps needed
  return [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }]
}

export default async function sitemap({
  id,
}: {
  id: number
}): Promise<MetadataRoute.Sitemap> {
  // Google's limit is 50,000 URLs per sitemap
  const start = id * 50000
  const end = start + 50000
  const products = await getProducts(
    `SELECT id, date FROM products WHERE id BETWEEN ${start} AND ${end}`
  )
  return products.map((product) => ({
    url: `${BASE_URL}/product/${product.id}`,
    lastModified: product.date,
  }))
}
```

----------------------------------------

TITLE: Using useSelectedLayoutSegment in Javascript
DESCRIPTION: This code snippet demonstrates how to use `useSelectedLayoutSegment` hook to read the active route segment within a specific slot. The `parallelRoutesKey` parameter ('auth' in this case) is used to specify the slot for which the active segment is being retrieved.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-building-your-application/01-routing/11-parallel-routes.mdx#2025-04-21_snippet_3

LANGUAGE: javascript
CODE:
```
'use client'

import { useSelectedLayoutSegment } from 'next/navigation'

export default function Layout({ auth }) {
  const loginSegment = useSelectedLayoutSegment('auth')
  // ...
}
```

----------------------------------------

TITLE: Generating Dynamic Metadata with generateMetadata Function in Next.js (TSX)
DESCRIPTION: This code snippet demonstrates how to generate dynamic metadata in a Next.js application using the `generateMetadata` function. It fetches product data based on the `id` parameter and uses it to set the page title and open graph images. It also shows how to access and extend metadata from parent segments using the `parent` parameter.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/04-functions/generate-metadata.mdx#_snippet_2

LANGUAGE: tsx
CODE:
```
import type { Metadata, ResolvingMetadata } from 'next'

type Props = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // read route params
  const { id } = await params

  // fetch data
  const product = await fetch(`https://.../${id}`).then((res) => res.json())

  // optionally access and extend (rather than replace) parent metadata
  const previousImages = (await parent).openGraph?.images || []

  return {
    title: product.title,
    openGraph: {
      images: ['/some-specific-page-image.jpg', ...previousImages],
    },
  }
}

export default function Page({ params, searchParams }: Props) {}
```

----------------------------------------

TITLE: Defining a Basic Page Component in Next.js
DESCRIPTION: Example showing how to define a basic page component in Next.js using the page.js file. The component receives params and searchParams as props, which are promises containing route parameters and URL query parameters.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/03-file-conventions/page.mdx#2025-04-21_snippet_0

LANGUAGE: tsx
CODE:
```
export default function Page({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  return <h1>My Page</h1>
}
```

LANGUAGE: jsx
CODE:
```
export default function Page({ params, searchParams }) {
  return <h1>My Page</h1>
}
```

----------------------------------------

TITLE: Basic CLI Command for Next.js Project Creation
DESCRIPTION: The fundamental command to create a new Next.js application using npx, allowing optional project naming and configuration options.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/06-cli/create-next-app.mdx#2025-04-21_snippet_0

LANGUAGE: bash
CODE:
```
npx create-next-app@latest [project-name] [options]
```

----------------------------------------

TITLE: Importing EdgeQL query builder - TypeScript
DESCRIPTION: This is an example of how to import the generated EdgeQL query builder in a TypeScript file. It imports the default export from the `dbschema/edgeql-js` directory, aliasing it to `e`. This allows you to use the query builder in your application code.
SOURCE: https://github.com/vercel/next.js/blob/canary/examples/with-edgedb/README.md#_snippet_10

LANGUAGE: typescript
CODE:
```
import e from "./dbschema/edgeql-js";
```

----------------------------------------

TITLE: Route Announcer Implementation in Next.js
DESCRIPTION: Automatically announces page transitions for screen readers using document title, H1 element, or URL pathname
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/03-architecture/accessibility.mdx#2025-04-21_snippet_0

LANGUAGE: javascript
CODE:
```
// Route announcer checks:
// 1. document.title
// 2. <h1> element
// 3. URL pathname
```

----------------------------------------

TITLE: Correct Next.js Link Usage with Single Child
DESCRIPTION: Example showing the correct implementation of Next.js Link component with a single anchor tag child, which is the recommended approach before Next.js 13.0.
SOURCE: https://github.com/vercel/next.js/blob/canary/errors/link-multiple-children.mdx#2025-04-21_snippet_1

LANGUAGE: jsx
CODE:
```
import Link from 'next/link'

export default function Home() {
  return (
    <Link href="/about">
      <a>To About</a>
    </Link>
  )
}
```

----------------------------------------

TITLE: Next.js Image Config (Wildcard Hostname)
DESCRIPTION: This code snippet demonstrates using a wildcard pattern for the hostname in `remotePatterns` within the `next.config.js` file. It enables loading images from any subdomain of example.com.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/02-pages/04-api-reference/01-components/image-legacy.mdx#_snippet_7

LANGUAGE: javascript
CODE:
```
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.example.com',
        port: '',
        search: '',
      },
    ],
  },
}
```

----------------------------------------

TITLE: Configuring Custom Image Loader in Next.js
DESCRIPTION: Configure a custom image loader in next.config.js to use an external image optimization service or cloud provider. The loader file must export a function that generates image URLs.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/05-config/01-next-config-js/images.mdx#2025-04-21_snippet_0

LANGUAGE: js
CODE:
```
module.exports = {
  images: {
    loader: 'custom',
    loaderFile: './my/image/loader.js',
  },
}
```

LANGUAGE: js
CODE:
```
export default function myImageLoader({ src, width, quality }) {
  return `https://example.com/${src}?w=${width}&q=${quality || 75}`
}
```

----------------------------------------

TITLE: Using a Server Action in a Client Component (TypeScript)
DESCRIPTION: This snippet shows how to import and use a Server Action within a client component in Next.js using TypeScript. The `create` function, which is defined as a Server Action, is imported and called when the button is clicked. This allows client components to trigger server-side logic directly without the need for explicit API calls.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/single-page-applications.mdx#_snippet_15

LANGUAGE: typescript
CODE:
```
'use client'

import { create } from './actions'

export function Button() {
  return <button onClick={() => create()}>Create</button>
}
```

----------------------------------------

TITLE: Configuring SWR Fallback with SWRConfig in Next.js (JavaScript)
DESCRIPTION: This snippet demonstrates how to configure SWR's fallback data using the SWRConfig component in a Next.js application using JavaScript. The getUser() function, assumed to be a server-side function, is used to pre-populate the SWR cache with user data for the '/api/user' key. This allows client components to immediately access the data without an initial loading state. The component reading this data will suspend.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/single-page-applications.mdx#_snippet_7

LANGUAGE: javascript
CODE:
```
import { SWRConfig } from 'swr'
import { getUser } from './user' // some server-side function

export default function RootLayout({ children }) {
  return (
    <SWRConfig
      value={{
        fallback: {
          // We do NOT await getUser() here
          // Only components that read this data will suspend
          '/api/user': getUser(),
        },
      }}
    >
      {children}
    </SWRConfig>
  )
}
```

----------------------------------------

TITLE: Implementing a Single Shared Layout with Custom App in Next.js
DESCRIPTION: Using a custom App component to apply a consistent layout across all pages in a Next.js application. This approach preserves component state when navigating between pages, providing a Single-Page Application experience.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/02-pages/03-building-your-application/01-routing/01-pages-and-layouts.mdx#2025-04-21_snippet_2

LANGUAGE: jsx
CODE:
```
import Layout from '../components/layout'

export default function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  )
}
```

----------------------------------------

TITLE: Importing and Displaying Image in Next.js App (JSX)
DESCRIPTION: This snippet demonstrates the recommended way to handle images that need to be displayed on every page by moving the image import and rendering logic from `_document.js` to `pages/_app.js`. It uses the `next/image` component to render the image after importing it.
SOURCE: https://github.com/vercel/next.js/blob/canary/errors/custom-document-image-import.mdx#_snippet_0

LANGUAGE: jsx
CODE:
```
import yourImage from 'path/to/your/image'
import Image from 'next/image'

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Image src={yourImage} alt="your_image_description" />
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
```

----------------------------------------

TITLE: Importing and Using the MDX Layout
DESCRIPTION: This code demonstrates how to import the MDX layout component and wrap the MDX content within it. It exports a default function that renders the MDX content within the layout.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/mdx.mdx#_snippet_31

LANGUAGE: mdx
CODE:
```
import MdxLayout from '../components/mdx-layout'

# Welcome to my MDX page!

export default function MDXPage({ children }) {
  return <MdxLayout>{children}</MdxLayout>

}
```

----------------------------------------

TITLE: Using afterInteractive Strategy (App Router, JSX)
DESCRIPTION: This code snippet shows how to use the `afterInteractive` strategy with the `Script` component in a Next.js application using the App Router.  It loads the script after some hydration has occurred. This is the default strategy.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/02-components/script.mdx#_snippet_5

LANGUAGE: jsx
CODE:
```
import Script from 'next/script'

export default function Page() {
  return (
    <>
      <Script src="https://example.com/script.js" strategy="afterInteractive" />
    </>
  )
}
```

----------------------------------------

TITLE: Styled Components Registry Component (JavaScript)
DESCRIPTION: This code defines a React component, `StyledComponentsRegistry`, that manages server-side rendering of styled-components. It uses `useServerInsertedHTML` to inject the collected CSS styles into the `<head>` of the HTML. It leverages the `ServerStyleSheet` from `styled-components` to collect and manage the styles.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/css-in-js.mdx#_snippet_6

LANGUAGE: javascript
CODE:
```
'use client'

import React, { useState } from 'react'
import { useServerInsertedHTML } from 'next/navigation'
import { ServerStyleSheet, StyleSheetManager } from 'styled-components'

export default function StyledComponentsRegistry({ children }) {
  // Only create stylesheet once with lazy initial state
  // x-ref: https://reactjs.org/docs/hooks-reference.html#lazy-initial-state
  const [styledComponentsStyleSheet] = useState(() => new ServerStyleSheet())

  useServerInsertedHTML(() => {
    const styles = styledComponentsStyleSheet.getStyleElement()
    styledComponentsStyleSheet.instance.clearTag()
    return <>{styles}</>
  })

  if (typeof window !== 'undefined') return <>{children}</>

  return (
    <StyleSheetManager sheet={styledComponentsStyleSheet.instance}>
      {children}
    </StyleSheetManager>
  )
}
```

----------------------------------------

TITLE: Defining Image Content Type JSX
DESCRIPTION: Defines the static `contentType` export for Open Graph or Twitter images in a JSX file. This string specifies the MIME type of the generated image, typically 'image/png', which is used by Next.js to set the appropriate meta tag in the HTML head.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/03-file-conventions/01-metadata/opengraph-image.mdx#_snippet_18

LANGUAGE: jsx
CODE:
```
export const contentType = 'image/png'

export default function Image() {}
```

----------------------------------------

TITLE: Invalidating Tagged Cache in JavaScript
DESCRIPTION: Shows the use of revalidateTag in JavaScript for clearing pieces of cache. The operation takes place in the updateBookings function to handle cache invalidation for 'bookings-data'.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/04-functions/cacheTag.mdx#2025-04-21_snippet_11

LANGUAGE: javascript
CODE:
```
'use server'

import { revalidateTag } from 'next/cache'

export async function updateBookings() {
  await updateBookingData()
  revalidateTag('bookings-data')
}
```

----------------------------------------

TITLE: Setting Referrer-Policy Header - JavaScript
DESCRIPTION: This snippet demonstrates how to add the `Referrer-Policy` header to your Next.js headers configuration. The example value `'origin-when-cross-origin'` specifies that when navigating to a different origin, only the origin (scheme, host, and port) of the referring URL should be sent in the `Referer` header, controlling how much information is leaked to external sites.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/05-config/01-next-config-js/headers.mdx#_snippet_19

LANGUAGE: js
CODE:
```
{
  key: 'Referrer-Policy',
  value: 'origin-when-cross-origin'
}
```

----------------------------------------

TITLE: Configuring Metadata in Next.js Layout (TypeScript)
DESCRIPTION: This code snippet demonstrates how to configure metadata for a Next.js application using the `Metadata` type and exporting a `metadata` object. It defines the title and description of the application, which are used for SEO and web shareability. The `RootLayout` component is a server component that wraps the application's content.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/migrating/from-vite.mdx#_snippet_11

LANGUAGE: TypeScript
CODE:
```
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My App',
  description: 'My App is a...'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <div id="root">{children}</div>
      </body>
    </html>
  )
}
```

----------------------------------------

TITLE: Using Local Images with Next.js Image Component
DESCRIPTION: Shows how to use locally stored images with the Next.js Image component. This example demonstrates automatic width and height detection for local images.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/01-getting-started/04-images-and-fonts.mdx#2025-04-21_snippet_1

LANGUAGE: tsx
CODE:
```
import Image from 'next/image'
import profilePic from './me.png'

export default function Page() {
  return (
    <Image
      src={profilePic}
      alt="Picture of the author"
      // width={500} automatically provided
      // height={500} automatically provided
      // blurDataURL="data:..." automatically provided
      // placeholder="blur" // Optional blur-up while loading
    />
  )
}
```

LANGUAGE: jsx
CODE:
```
import Image from 'next/image'
import profilePic from './me.png'

export default function Page() {
  return (
    <Image
      src={profilePic}
      alt="Picture of the author"
      // width={500} automatically provided
      // height={500} automatically provided
      // blurDataURL="data:..." automatically provided
      // placeholder="blur" // Optional blur-up while loading
    />
  )
}
```

----------------------------------------

TITLE: Configuring Static Export in Next.js
DESCRIPTION: This code snippet shows how to configure a Next.js application for static export by setting the `output` property to `'export'` in the `next.config.js` file. It also demonstrates optional configurations such as `trailingSlash`, `skipTrailingSlashRedirect`, and `distDir`.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/static-exports.mdx#_snippet_0

LANGUAGE: javascript
CODE:
```
/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  output: 'export',

  // Optional: Change links `/me` -> `/me/` and emit `/me.html` -> `/me/index.html`
  // trailingSlash: true,

  // Optional: Prevent automatic `/me` -> `/me/`, instead preserve `href`
  // skipTrailingSlashRedirect: true,

  // Optional: Change the output directory `out` -> `dist`
  // distDir: 'dist',
}

module.exports = nextConfig
```

----------------------------------------

TITLE: Creating Next.js app with Redis example using yarn
DESCRIPTION: This command uses yarn to create a new Next.js application named 'roadmap' based on the 'with-redis' example. This bootstraps the project with the necessary dependencies and configuration for using Redis with Upstash.
SOURCE: https://github.com/vercel/next.js/blob/canary/examples/with-redis/README.md#2025-04-21_snippet_1

LANGUAGE: bash
CODE:
```
yarn create next-app --example with-redis roadmap
```

----------------------------------------

TITLE: Configuring deviceSizes in next.config.js
DESCRIPTION: This snippet demonstrates the configuration of deviceSizes in next.config.js to specify expected device widths for serving images in a responsive format. The default list of sizes serves as breakpoints.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/02-components/image.mdx#2025-04-21_snippet_19

LANGUAGE: js
CODE:
```
module.exports = {
  images: {
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  },
}

```

----------------------------------------

TITLE: Clear Draft Mode Cookie (TypeScript)
DESCRIPTION: This TypeScript code snippet shows how to disable Draft Mode by setting the `enable` property to `false` in `res.setDraftMode`. This clears the Draft Mode cookie.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/02-pages/02-guides/draft-mode.mdx#_snippet_6

LANGUAGE: TypeScript
CODE:
```
export default function handler(req, res) {
  res.setDraftMode({ enable: false })
}
```

----------------------------------------

TITLE: Importing External Stylesheet (TypeScript)
DESCRIPTION: Imports an external stylesheet (Bootstrap) in the root layout. This allows the application to use styles defined in the external library. This example uses TypeScript and React.ReactNode for type safety.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/01-getting-started/05-css.mdx#_snippet_6

LANGUAGE: TypeScript
CODE:
```
import 'bootstrap/dist/css/bootstrap.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="container">{children}</body>
    </html>
  )
}
```

----------------------------------------

TITLE: Setting metadataBase in a Next.js app layout (TSX)
DESCRIPTION: This code snippet demonstrates how to set the metadataBase option in a Next.js app layout using TypeScript (TSX).
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/04-functions/generate-metadata.mdx#_snippet_16

LANGUAGE: tsx
CODE:
```
import type { Metadata } from 'next'

export const metadata: Metadata = {
  metadataBase: new URL('https://acme.com'),
}
```

----------------------------------------

TITLE: Securing Pages Router API Route (JS)
DESCRIPTION: Illustrates securing a Pages Router API Route in JavaScript. The `handler` function checks if a user session exists via `getSession` and confirms the user possesses the 'admin' role before allowing access, sending 401 HTTP responses with error messages for failed authentication or authorization.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/authentication.mdx#_snippet_42

LANGUAGE: js
CODE:
```
export default async function handler(req, res) {\n  const session = await getSession(req)\n\n  // Check if the user is authenticated\n  if (!session) {\n    res.status(401).json({\n      error: 'User is not authenticated',\n    })\n    return\n  }\n\n  // Check if the user has the 'admin' role\n  if (session.user.role !== 'admin') {\n    res.status(401).json({\n      error: 'Unauthorized access: User does not have admin privileges.',\n    })\n    return\n  }\n\n  // Proceed with the route for authorized users\n  // ... implementation of the API Route\n}
```

----------------------------------------

TITLE: Configuring Dynamic Code Evaluation in Next.js
DESCRIPTION: This code snippet shows how to configure Next.js to allow specific files to ignore dynamic code evaluation checks using an unstable configuration setting. The key parameter is the 'unstable_allowDynamic' configuration, which lists file paths or glob patterns. This allows certain static analysis checks to be bypassed, especially when dynamic code is inaccessible during runtime. This configuration is crucial to prevent unintended runtime errors on Edge platforms while maintaining flexibility in code structure.
SOURCE: https://github.com/vercel/next.js/blob/canary/errors/edge-dynamic-code-evaluation.mdx#2025-04-21_snippet_1

LANGUAGE: typescript
CODE:
```
export const config = {\n  unstable_allowDynamic: [\n    '/lib/utilities.js', // allows a single file\n    '**/node_modules/function-bind/**', // use a glob to allow anything in the function-bind 3rd party module\n  ],\n}
```

----------------------------------------

TITLE: Add TypeScript Type Definition for Dynamic Params in Next.js
DESCRIPTION: This snippet illustrates how to add a TypeScript type annotation to the `params` prop of a page component in a dynamic route. This ensures type safety when accessing the dynamic segment value, defining the structure and types of the expected parameters based on the route segments.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-building-your-application/01-routing/10-dynamic-routes.mdx#_snippet_2

LANGUAGE: tsx
CODE:
```
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  return <h1>My Page</h1>
}
```

----------------------------------------

TITLE: Customizing Sass Options (additionalData) | Next.js Config (TS/JS)
DESCRIPTION: Configures Sass options within the Next.js configuration file (`next.config.ts` or `next.config.js`). This example shows how to use `additionalData` to inject content, like global variables or mixins, into all Sass files.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/sass.mdx#_snippet_1

LANGUAGE: ts
CODE:
```
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  sassOptions: {
    additionalData: `$var: red;`,
  },
}

export default nextConfig
```

LANGUAGE: js
CODE:
```
/** @type {import('next').NextConfig} */

const nextConfig = {
  sassOptions: {
    additionalData: `$var: red;`,
  },
}

module.exports = nextConfig
```

----------------------------------------

TITLE: Enabling Draft Mode in API Route (JavaScript)
DESCRIPTION: This JavaScript code snippet shows how to enable Draft Mode by setting a cookie using `res.setDraftMode({ enable: true })` within an API route handler function. This sets a cookie that triggers Draft Mode for statically generated pages on subsequent requests.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/02-pages/02-guides/draft-mode.mdx#_snippet_0

LANGUAGE: JavaScript
CODE:
```
export default function handler(req, res) {
  // ...
  res.setDraftMode({ enable: true })
  // ...
}
```

----------------------------------------

TITLE: Importing and using Roboto font with weight specification in a Next.js app layout
DESCRIPTION: This code snippet demonstrates how to import the Roboto font from next/font/google and apply it to the root layout of a Next.js application. It specifies a font weight of '400' because it's not a variable font. The font is applied using the className property.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/02-components/font.mdx#_snippet_16

LANGUAGE: tsx
CODE:
```
import { Roboto } from 'next/font/google'

const roboto = Roboto({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={roboto.className}>
      <body>{children}</body>
    </html>
  )
}
```

----------------------------------------

TITLE: Passing Uncached Data via Children in Next.js Cache Component
DESCRIPTION: Demonstrates how to pass non-serializable or uncached data (`uncachedData`) to a component marked with the `'use cache'` directive (`CacheComponent`) by rendering components that consume this data inside the cached component's `children` prop. The cached component fetches its own cached data (`cachedData`) and renders the `children` alongside its cached content.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/01-directives/use-cache.mdx#_snippet_14

LANGUAGE: tsx
CODE:
```
export default async function Page() {
  const uncachedData = await getData()
  return (
    <CacheComponent>
      <DynamicComponent data={uncachedData} />
    </CacheComponent>
  )
}

async function CacheComponent({ children }: { children: ReactNode }) {
  'use cache'
  const cachedData = await fetch('/api/cached-data')
  return (
    <div>
      <PrerenderedComponent data={cachedData} />
      {children}
    </div>
  )
}
```

LANGUAGE: jsx
CODE:
```
export default async function Page() {
  const uncachedData = await getData()
  return (
    <CacheComponent>
      <DynamicComponent data={uncachedData} />
    </CacheComponent>
  )
}

async function CacheComponent({ children }) {
  'use cache'
  const cachedData = await fetch('/api/cached-data')
  return (
    <div>
      <PrerenderedComponent data={cachedData} />
      {children}
    </div>
  )
}
```

----------------------------------------

TITLE: Configuring Global Unoptimized Images in Next.js
DESCRIPTION: Configuration example for setting all images to be unoptimized in a Next.js application by modifying the next.config.js file. This is useful when optimization isn't needed for most images in a project.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/02-components/image.mdx#2025-04-21_snippet_13

LANGUAGE: js
CODE:
```
module.exports = {
  images: {
    unoptimized: true,
  },
}
```

----------------------------------------

TITLE: Defining Server Functions in a Separate File with TypeScript
DESCRIPTION: Demonstrates how to define Server Functions in a dedicated TypeScript file by placing the 'use server' directive at the top of the file, making all exports Server Functions.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/01-getting-started/07-updating-data.mdx#2025-04-21_snippet_4

LANGUAGE: typescript
CODE:
```
'use server'

export async function createPost() {}
```

----------------------------------------

TITLE: Implementing Cache Headers with getServerSideProps in Next.js
DESCRIPTION: This example demonstrates how to add caching headers to getServerSideProps responses, using stale-while-revalidate to improve performance while keeping content fresh. The response will be cached for 10 seconds with a 59-second stale period.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/02-pages/03-building-your-application/03-data-fetching/03-get-server-side-props.mdx#2025-04-21_snippet_2

LANGUAGE: jsx
CODE:
```
// This value is considered fresh for ten seconds (s-maxage=10).
// If a request is repeated within the next 10 seconds, the previously
// cached value will still be fresh. If the request is repeated before 59 seconds,
// the cached value will be stale but still render (stale-while-revalidate=59).
//
// In the background, a revalidation request will be made to populate the cache
// with a fresh value. If you refresh the page, you will see the new value.
export async function getServerSideProps({ req, res }) {
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=10, stale-while-revalidate=59'
  )

  return {
    props: {},
  }
}
```

----------------------------------------

TITLE: Disabling Scroll to Top on Route Change in Next.js - JSX
DESCRIPTION: This example demonstrates how to use the useRouter hook to navigate without resetting the scroll position to the top of the page by passing a second argument with scroll set to false.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/04-functions/use-router.mdx#2025-04-21_snippet_4

LANGUAGE: jsx
CODE:
```
'use client'

import { useRouter } from 'next/navigation'

export default function Page() {
  const router = useRouter()

  return (
    <button
      type="button"
      onClick={() => router.push('/dashboard', { scroll: false })}
    >
      Dashboard
    </button>
  )
}

```

----------------------------------------

TITLE: Generating Image with Local Assets TSX
DESCRIPTION: Illustrates using Node.js runtime APIs (`node:path`, `node:fs/promises`) to read a local image file (`logo.png`) and include it in an Open Graph image generated by `ImageResponse` in a TSX file. The image data is converted to an `ArrayBuffer` for use as the `src` attribute of an `<img>` element.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/03-file-conventions/01-metadata/opengraph-image.mdx#_snippet_22

LANGUAGE: tsx
CODE:
```
import { ImageResponse } from 'next/og'
import { join } from 'node:path'
import { readFile } from 'node:fs/promises'

export default async function Image() {
  const logoData = await readFile(join(process.cwd(), 'logo.png'))
  const logoSrc = Uint8Array.from(logoData).buffer

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <img src={logoSrc} height="100" />
      </div>
    )
  )
}
```

----------------------------------------

TITLE: Creating and Relating Movie and Person Nodes in Neo4j (Cypher)
DESCRIPTION: The snippet includes several Neo4j Cypher queries that create nodes representing movies and persons, and it defines various relationships between them such as ACTED_IN, DIRECTED, PRODUCED, and WROTE. Each node is created using the CREATE statement, specifying properties like movie title, release year, or person's birth date. The snippet establishes many-to-many relationships showing actors' roles in movies or directors' involvement in film creation. The code operates under the assumption that a Neo4j database environment is set up and the Cypher language is supported.
SOURCE: https://github.com/vercel/next.js/blob/canary/examples/with-neo4j/movie-sample.md#2025-04-21_snippet_1

LANGUAGE: Cypher
CODE:
```
(TomH)-[:ACTED_IN {roles:['Joe Fox']}]->(YouveGotMail),
(MegR)-[:ACTED_IN {roles:['Kathleen Kelly']}]->(YouveGotMail),
(GregK)-[:ACTED_IN {roles:['Frank Navasky']}]->(YouveGotMail),
(ParkerP)-[:ACTED_IN {roles:['Patricia Eden']}]->(YouveGotMail),
(DaveC)-[:ACTED_IN {roles:['Kevin Jackson']}]->(YouveGotMail),
(SteveZ)-[:ACTED_IN {roles:['George Pappas']}]->(YouveGotMail),
(NoraE)-[:DIRECTED]->(YouveGotMail)

CREATE (SleeplessInSeattle:Movie {title:'Sleepless in Seattle', released:1993, tagline:'What if someone you never met, someone you never saw, someone you never knew was the only someone for you?'})
CREATE (RitaW:Person {name:'Rita Wilson', born:1956})
CREATE (BillPull:Person {name:'Bill Pullman', born:1953})
CREATE (VictorG:Person {name:'Victor Garber', born:1949})
CREATE (RosieO:Person {name:"Rosie O'Donnell", born:1962})
CREATE
(TomH)-[:ACTED_IN {roles:['Sam Baldwin']}]->(SleeplessInSeattle),
(MegR)-[:ACTED_IN {roles:['Annie Reed']}]->(SleeplessInSeattle),
(RitaW)-[:ACTED_IN {roles:['Suzy']}]->(SleeplessInSeattle),
(BillPull)-[:ACTED_IN {roles:['Walter']}]->(SleeplessInSeattle),
(VictorG)-[:ACTED_IN {roles:['Greg']}]->(SleeplessInSeattle),
(RosieO)-[:ACTED_IN {roles:['Becky']}]->(SleeplessInSeattle),
(NoraE)-[:DIRECTED]->(SleeplessInSeattle)

CREATE (JoeVersustheVolcano:Movie {title:'Joe Versus the Volcano', released:1990, tagline:'A story of love, lava and burning desire.'})
CREATE (JohnS:Person {name:'John Patrick Stanley', born:1950})
CREATE (Nathan:Person {name:'Nathan Lane', born:1956})
CREATE
(TomH)-[:ACTED_IN {roles:['Joe Banks']}]->(JoeVersustheVolcano),
(MegR)-[:ACTED_IN {roles:['DeDe', 'Angelica Graynamore', 'Patricia Graynamore']}]->(JoeVersustheVolcano),
(Nathan)-[:ACTED_IN {roles:['Baw']}]->(JoeVersustheVolcano),
(JohnS)-[:DIRECTED]->(JoeVersustheVolcano)

CREATE (WhenHarryMetSally:Movie {title:'When Harry Met Sally', released:1998, tagline:'Can two friends sleep together and still love each other in the morning?'})
CREATE (BillyC:Person {name:'Billy Crystal', born:1948})
CREATE (CarrieF:Person {name:'Carrie Fisher', born:1956})
CREATE (BrunoK:Person {name:'Bruno Kirby', born:1949})
CREATE
(BillyC)-[:ACTED_IN {roles:['Harry Burns']}]->(WhenHarryMetSally),
(MegR)-[:ACTED_IN {roles:['Sally Albright']}]->(WhenHarryMetSally),
(CarrieF)-[:ACTED_IN {roles:['Marie']}]->(WhenHarryMetSally),
(BrunoK)-[:ACTED_IN {roles:['Jess']}]->(WhenHarryMetSally),
(RobR)-[:DIRECTED]->(WhenHarryMetSally),
(RobR)-[:PRODUCED]->(WhenHarryMetSally),
(NoraE)-[:PRODUCED]->(WhenHarryMetSally),
(NoraE)-[:WROTE]->(WhenHarryMetSally)

CREATE (ThatThingYouDo:Movie {title:'That Thing You Do', released:1996, tagline:'In every life there comes a time when that thing you dream becomes that thing you do'})
CREATE (LivT:Person {name:'Liv Tyler', born:1977})
CREATE
(TomH)-[:ACTED_IN {roles:['Mr. White']}]->(ThatThingYouDo),
(LivT)-[:ACTED_IN {roles:['Faye Dolan']}]->(ThatThingYouDo),
(Charlize)-[:ACTED_IN {roles:['Tina']}]->(ThatThingYouDo),
(TomH)-[:DIRECTED]->(ThatThingYouDo)

CREATE (TheReplacements:Movie {title:'The Replacements', released:2000, tagline:'Pain heals, Chicks dig scars... Glory lasts forever'})
CREATE (Brooke:Person {name:'Brooke Langton', born:1970})
CREATE (Gene:Person {name:'Gene Hackman', born:1930})
CREATE (Orlando:Person {name:'Orlando Jones', born:1968})
CREATE (Howard:Person {name:'Howard Deutch', born:1950})
CREATE
(Keanu)-[:ACTED_IN {roles:['Shane Falco']}]->(TheReplacements),
(Brooke)-[:ACTED_IN {roles:['Annabelle Farrell']}]->(TheReplacements),
(Gene)-[:ACTED_IN {roles:['Jimmy McGinty']}]->(TheReplacements),
(Orlando)-[:ACTED_IN {roles:['Clifford Franklin']}]->(TheReplacements),
(Howard)-[:DIRECTED]->(TheReplacements)

CREATE (RescueDawn:Movie {title:'RescueDawn', released:2006, tagline:"Based on the extraordinary true story of one man's fight for freedom"})
CREATE (ChristianB:Person {name:'Christian Bale', born:1974})
CREATE (ZachG:Person {name:'Zach Grenier', born:1954})
CREATE
(MarshallB)-[:ACTED_IN {roles:['Admiral']}]->(RescueDawn),
(ChristianB)-[:ACTED_IN {roles:['Dieter Dengler']}]->(RescueDawn),
(ZachG)-[:ACTED_IN {roles:['Squad Leader']}]->(RescueDawn),
(SteveZ)-[:ACTED_IN {roles:['Duane']}]->(RescueDawn),
(WernerH)-[:DIRECTED]->(RescueDawn)

CREATE (TheBirdcage:Movie {title:'The Birdcage', released:1996, tagline:'Come as you are'})
CREATE (MikeN:Person {name:'Mike Nichols', born:1931})
CREATE
(Robin)-[:ACTED_IN {roles:['Armand Goldman']}]->(TheBirdcage),
(Nathan)-[:ACTED_IN {roles:['Albert Goldman']}]->(TheBirdcage),
(Gene)-[:ACTED_IN {roles:['Sen. Kevin Keeley']}]->(TheBirdcage),
(MikeN)-[:DIRECTED]->(TheBirdcage)

CREATE (Unforgiven:Movie {title:'Unforgiven', released:1992, tagline:"It's a hell of a thing, killing a man"})
CREATE (RichardH:Person {name:'Richard Harris', born:1930})
CREATE (ClintE:Person {name:'Clint Eastwood', born:1930})
CREATE
(RichardH)-[:ACTED_IN {roles:['English Bob']}]->(Unforgiven),
(ClintE)-[:ACTED_IN {roles:['Bill Munny']}]->(Unforgiven),
(Gene)-[:ACTED_IN {roles:['Little Bill Daggett']}]->(Unforgiven),
(ClintE)-[:DIRECTED]->(Unforgiven)

CREATE (JohnnyMnemonic:Movie {title:'Johnny Mnemonic', released:1995, tagline:'The hottest data on earth. In the coolest head in town'})
CREATE (Takeshi:Person {name:'Takeshi Kitano', born:1947})
CREATE (Dina:Person {name:'Dina Meyer', born:1968})
CREATE (IceT:Person {name:'Ice-T', born:1958})
CREATE (RobertL:Person {name:'Robert Longo', born:1953})
CREATE
(Keanu)-[:ACTED_IN {roles:['Johnny Mnemonic']}]->(JohnnyMnemonic),
(Takeshi)-[:ACTED_IN {roles:['Takahashi']}]->(JohnnyMnemonic),
(Dina)-[:ACTED_IN {roles:['Jane']}]->(JohnnyMnemonic),
(IceT)-[:ACTED_IN {roles:['J-Bone']}]->(JohnnyMnemonic),
(RobertL)-[:DIRECTED]->(JohnnyMnemonic)

CREATE (CloudAtlas:Movie {title:'Cloud Atlas', released:2012, tagline:'Everything is connected'})
CREATE (HalleB:Person {name:'Halle Berry', born:1966})
CREATE (JimB:Person {name:'Jim Broadbent', born:1949})
CREATE (TomT:Person {name:'Tom Tykwer', born:1965})
CREATE (DavidMitchell:Person {name:'David Mitchell', born:1969})
CREATE (StefanArndt:Person {name:'Stefan Arndt', born:1961})
CREATE
(TomH)-[:ACTED_IN {roles:['Zachry', 'Dr. Henry Goose', 'Isaac Sachs', 'Dermot Hoggins']}]->(CloudAtlas),
(Hugo)-[:ACTED_IN {roles:['Bill Smoke', 'Haskell Moore', 'Tadeusz Kesselring', 'Nurse Noakes', 'Boardman Mephi', 'Old Georgie']}]->(CloudAtlas),
(HalleB)-[:ACTED_IN {roles:['Luisa Rey', 'Jocasta Ayrs', 'Ovid', 'Meronym']}]->(CloudAtlas),
(JimB)-[:ACTED_IN {roles:['Vyvyan Ayrs', 'Captain Molyneux', 'Timothy Cavendish']}]->(CloudAtlas),
(TomT)-[:DIRECTED]->(CloudAtlas),
(LillyW)-[:DIRECTED]->(CloudAtlas),
(LanaW)-[:DIRECTED]->(CloudAtlas),
(DavidMitchell)-[:WROTE]->(CloudAtlas),
(StefanArndt)-[:PRODUCED]->(CloudAtlas)

CREATE (TheDaVinciCode:Movie {title:'The Da Vinci Code', released:2006, tagline:'Break The Codes'})
CREATE (IanM:Person {name:'Ian McKellen', born:1939})
CREATE (AudreyT:Person {name:'Audrey Tautou', born:1976})
CREATE (PaulB:Person {name:'Paul Bettany', born:1971})
CREATE (RonH:Person {name:'Ron Howard', born:1954})
CREATE
(TomH)-[:ACTED_IN {roles:['Dr. Robert Langdon']}]->(TheDaVinciCode),
(IanM)-[:ACTED_IN {roles:['Sir Leight Teabing']}]->(TheDaVinciCode),
(AudreyT)-[:ACTED_IN {roles:['Sophie Neveu']}]->(TheDaVinciCode),
(PaulB)-[:ACTED_IN {roles:['Silas']}]->(TheDaVinciCode),
(RonH)-[:DIRECTED]->(TheDaVinciCode)

CREATE (VforVendetta:Movie {title:'V for Vendetta', released:2006, tagline:'Freedom! Forever!'})
CREATE (NatalieP:Person {name:'Natalie Portman', born:1981})
CREATE (StephenR:Person {name:'Stephen Rea', born:1946})
CREATE (JohnH:Person {name:'John Hurt', born:1940})
CREATE (BenM:Person {name: 'Ben Miles', born:1967})
CREATE
(Hugo)-[:ACTED_IN {roles:['V']}]->(VforVendetta),
(NatalieP)-[:ACTED_IN {roles:['Evey Hammond']}]->(VforVendetta),
(StephenR)-[:ACTED_IN {roles:['Eric Finch']}]->(VforVendetta),
(JohnH)-[:ACTED_IN {roles:['High Chancellor Adam Sutler']}]->(VforVendetta),
(BenM)-[:ACTED_IN {roles:['Dascomb']}]->(VforVendetta),
(JamesM)-[:DIRECTED]->(VforVendetta),
(LillyW)-[:PRODUCED]->(VforVendetta),
(LanaW)-[:PRODUCED]->(VforVendetta),
(JoelS)-[:PRODUCED]->(VforVendetta),
(LillyW)-[:WROTE]->(VforVendetta),
(LanaW)-[:WROTE]->(VforVendetta)

CREATE (SpeedRacer:Movie {title:'Speed Racer', released:2008, tagline:'Speed has no limits'})
CREATE (EmileH:Person {name:'Emile Hirsch', born:1985})
CREATE (JohnG:Person {name:'John Goodman', born:1960})
CREATE (SusanS:Person {name:'Susan Sarandon', born:1946})
CREATE (MatthewF:Person {name:'Matthew Fox', born:1966})
CREATE (ChristinaR:Person {name:'Christina Ricci', born:1980})
CREATE (Rain:Person {name:'Rain', born:1982})
CREATE
(EmileH)-[:ACTED_IN {roles:['Speed Racer']}]->(SpeedRacer),
(JohnG)-[:ACTED_IN {roles:['Pops']}]->(SpeedRacer),
(SusanS)-[:ACTED_IN {roles:['Mom']}]->(SpeedRacer),
(MatthewF)-[:ACTED_IN {roles:['Racer X']}]->(SpeedRacer),
(ChristinaR)-[:ACTED_IN {roles:['Trixie']}]->(SpeedRacer),
(Rain)-[:ACTED_IN {roles:['Taejo Togokahn']}]->(SpeedRacer),
(BenM)-[:ACTED_IN {roles:['Cass Jones']}]->(SpeedRacer),
(LillyW)-[:DIRECTED]->(SpeedRacer),
(LanaW)-[:DIRECTED]->(SpeedRacer),
(LillyW)-[:WROTE]->(SpeedRacer),
(LanaW)-[:WROTE]->(SpeedRacer),
(JoelS)-[:PRODUCED]->(SpeedRacer)

CREATE (NinjaAssassin:Movie {title:'Ninja Assassin', released:2009, tagline:'Prepare to enter a secret world of assassins'})
CREATE (NaomieH:Person {name:'Naomie Harris'})
CREATE
(Rain)-[:ACTED_IN {roles:['Raizo']}]->(NinjaAssassin),
(NaomieH)-[:ACTED_IN {roles:['Mika Coretti']}]->(NinjaAssassin),
(RickY)-[:ACTED_IN {roles:['Takeshi']}]->(NinjaAssassin),
(BenM)-[:ACTED_IN {roles:['Ryan Maslow']}]->(NinjaAssassin),
(JamesM)-[:DIRECTED]->(NinjaAssassin),
(LillyW)-[:PRODUCED]->(NinjaAssassin),
(LanaW)-[:PRODUCED]->(NinjaAssassin),
(JoelS)-[:PRODUCED]->(NinjaAssassin)

CREATE (TheGreenMile:Movie {title:'The Green Mile', released:1999, tagline:"Walk a mile you'll never forget."})
CREATE (MichaelD:Person {name:'Michael Clarke Duncan', born:1957})
```

----------------------------------------

TITLE: Registering OpenTelemetry with @vercel/otel (TypeScript)
DESCRIPTION: Registers OpenTelemetry using the `@vercel/otel` package within the `instrumentation.ts` file. This function configures the service name for the OpenTelemetry instance, allowing for easy identification of the application within observability tools. The service name is set to 'next-app'.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/open-telemetry.mdx#_snippet_1

LANGUAGE: typescript
CODE:
```
import { registerOTel } from '@vercel/otel'

export function register() {
  registerOTel({ serviceName: 'next-app' })
}
```

----------------------------------------

TITLE: Reloading the current URL with router.reload
DESCRIPTION: This code snippet demonstrates how to use `router.reload` to refresh the current page, similar to clicking the browser's refresh button. It utilizes the `useRouter` hook to access the router instance and calls the `reload()` method on a button click.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/02-pages/04-api-reference/03-functions/use-router.mdx#_snippet_11

LANGUAGE: jsx
CODE:
```
import { useRouter } from 'next/router'

export default function Page() {
  const router = useRouter()

  return (
    <button type="button" onClick={() => router.reload()}>
      Click here to reload
    </button>
  )
}
```

----------------------------------------

TITLE: Defining Layout with Parallel Routes in Typescript
DESCRIPTION: This code snippet shows how to define a layout component that accepts parallel routes as props in Typescript. The layout component receives `children`, `team`, and `analytics` props, each representing a different slot, and renders them in parallel.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-building-your-application/01-routing/11-parallel-routes.mdx#2025-04-21_snippet_0

LANGUAGE: typescript
CODE:
```
export default function Layout({
  children,
  team,
  analytics,
}: {
  children: React.ReactNode
  analytics: React.ReactNode
  team: React.ReactNode
}) {
  return (
    <>
      {children}
      {team}
      {analytics}
    </>
  )
}
```

----------------------------------------

TITLE: Handling Fallback with getStaticPaths in pages directory
DESCRIPTION: This code snippet demonstrates how to use the `fallback` property in `getStaticPaths` within the `pages` directory. Setting `fallback` to `'blocking'` will generate the page at request time if it wasn't pre-rendered during build.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/migrating/app-router-migration.mdx#_snippet_36

LANGUAGE: jsx
CODE:
```
// `pages` directory

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking'
  };
}

export async function getStaticProps({ params }) {
  ...
}

export default function Post({ post }) {
  return ...
}
```

----------------------------------------

TITLE: Run Next.js Development Server
DESCRIPTION: Demonstrates how to run the Next.js development server using `npm run dev`.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/migrating/from-create-react-app.mdx#_snippet_23

LANGUAGE: Bash
CODE:
```
npm run dev
```

----------------------------------------

TITLE: Configuring Image Sizes for srcset Generation in Next.js
DESCRIPTION: This code snippet demonstrates how to configure image sizes in Next.js.  These sizes are concatenated with the device sizes to form the full array of sizes used to generate image `srcset` attributes. The image sizes should be smaller than the device sizes.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/02-pages/04-api-reference/01-components/image-legacy.mdx#_snippet_12

LANGUAGE: javascript
CODE:
```
module.exports = {
  images: {
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
}
```

----------------------------------------

TITLE: Executing Script with onLoad handler in Next.js (JSX)
DESCRIPTION: This code snippet demonstrates how to use the `next/script` component with the `onLoad` event handler to execute code after the script has finished loading. It is designed to be used within a client component, as indicated by the `'use client'` directive. The script tag is included from a provided URL.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/scripts.mdx#_snippet_13

LANGUAGE: jsx
CODE:
```
'use client'

import Script from 'next/script'

export default function Page() {
  return (
    <>
      <Script
        src="https://example.com/script.js"
        onLoad={() => {
          console.log('Script has loaded')
        }}
      />
    </>
  )
}
```

----------------------------------------

TITLE: Complete Blog Post Example with getStaticPaths
DESCRIPTION: Full example of implementing getStaticPaths and getStaticProps for a blog post page, including fetching posts from an API and generating static paths.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/02-pages/04-api-reference/03-functions/get-static-paths.mdx#2025-04-23_snippet_3

LANGUAGE: javascript
CODE:
```
function Post({ post }) {
  // Render post...
}

// This function gets called at build time
export async function getStaticPaths() {
  // Call an external API endpoint to get posts
  const res = await fetch('https://.../posts')
  const posts = await res.json()

  // Get the paths we want to pre-render based on posts
  const paths = posts.map((post) => ({
    params: { id: post.id },
  }))

  // We'll pre-render only these paths at build time.
  // { fallback: false } means other routes should 404.
  return { paths, fallback: false }
}

// This also gets called at build time
export async function getStaticProps({ params }) {
  // params contains the post `id`.
  // If the route is like /posts/1, then params.id is 1
  const res = await fetch(`https://.../posts/${params.id}`)
  const post = await res.json()

  // Pass post data to the page via props
  return { props: { post } }
}

export default Post
```

----------------------------------------

TITLE: Configuring i18n to Prefix Default Locale (Workaround)
DESCRIPTION: This `next.config.js` snippet sets up i18n configuration to allow prefixing the default locale, which requires a Middleware workaround. It defines a special 'default' locale as the `defaultLocale` and explicitly disables automatic locale detection (`localeDetection: false`). `trailingSlash` is also enabled.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/02-pages/03-building-your-application/01-routing/10-internationalization.mdx#_snippet_3

LANGUAGE: js
CODE:
```
module.exports = {
  i18n: {
    locales: ['default', 'en', 'de', 'fr'],
    defaultLocale: 'default',
    localeDetection: false,
  },
  trailingSlash: true,
}
```

----------------------------------------

TITLE: Disabling Draft Mode in Next.js Route Handler (JavaScript)
DESCRIPTION: This code snippet shows how to disable Draft Mode in a Next.js Route Handler using JavaScript. It imports `draftMode` from `next/headers`, calls `draft.disable()` to disable Draft Mode, and returns a response indicating that Draft Mode is disabled. It requires the `next` package.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/04-functions/draft-mode.mdx#_snippet_5

LANGUAGE: javascript
CODE:
```
import { draftMode } from 'next/headers'

export async function GET(request) {
  const draft = await draftMode()
  draft.disable()
  return new Response('Draft mode is disabled')
}
```

----------------------------------------

TITLE: Basic Next.js Configuration Setup
DESCRIPTION: Shows the basic structure of a Next.js configuration file using CommonJS module exports.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/05-config/01-next-config-js/index.mdx#2025-04-21_snippet_0

LANGUAGE: javascript
CODE:
```
// @ts-check

/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
}

module.exports = nextConfig
```

----------------------------------------

TITLE: Clearing Cookies with NextRequest
DESCRIPTION: This snippet demonstrates how to clear all cookies using the `clear` method of the `request.cookies` object in Next.js.  It removes the `Set-Cookie` header from the request.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/04-functions/next-request.mdx#2025-04-21_snippet_5

LANGUAGE: typescript
CODE:
```
request.cookies.clear()
```

----------------------------------------

TITLE: Creating a Next.js App with Firebase Example (pnpm)
DESCRIPTION: This command initializes a new Next.js application named `with-firebase-app` using the `with-firebase` example. It leverages the `create next-app` tool with the pnpm package manager. This command assumes pnpm is installed and configured.
SOURCE: https://github.com/vercel/next.js/blob/canary/examples/with-firebase/README.md#_snippet_2

LANGUAGE: bash
CODE:
```
pnpm create next-app --example with-firebase with-firebase-app
```

----------------------------------------

TITLE: Handling Web Vitals Metrics by Name (App Router, TSX)
DESCRIPTION: This TypeScript code snippet shows how to handle specific web vital metrics by their `name` property using a switch statement inside the `useReportWebVitals` hook within the App Router in Next.js. It handles First Contentful Paint (FCP) and Largest Contentful Paint (LCP) metrics as examples.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/analytics.mdx#_snippet_4

LANGUAGE: typescript
CODE:
```
'use client'

import { useReportWebVitals } from 'next/web-vitals'

export function WebVitals() {
  useReportWebVitals((metric) => {
    switch (metric.name) {
      case 'FCP': {
        // handle FCP results
      }
      case 'LCP': {
        // handle LCP results
      }
      // ...
    }
  })
}
```

----------------------------------------

TITLE: Using React Server/Client Directives
DESCRIPTION: Example of React directives for defining server and client boundaries in Next.js applications. The 'use client' directive marks code for client-side execution, while 'use server' specifies server-side computation.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-building-your-application/03-rendering/index.mdx#2025-04-23_snippet_0

LANGUAGE: javascript
CODE:
```
"use client"
"use server"
```

----------------------------------------

TITLE: Loading Scripts in Root Layout - TypeScript
DESCRIPTION: This code snippet shows how to load a third-party script in the root layout of a Next.js application using TypeScript. The script will load on every route. Requires `next/script` dependency.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/scripts.mdx#_snippet_2

LANGUAGE: tsx
CODE:
```
import Script from 'next/script'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
      <Script src="https://example.com/script.js" />
    </html>
  )
}
```

----------------------------------------

TITLE: generateMetadata with Segment Props in Next.js
DESCRIPTION: This code snippet shows how to use the `generateMetadata` function with segment props (params and searchParams) to generate metadata based on the current route segment. This allows you to create dynamic metadata that reflects the content of the page.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/04-functions/generate-metadata.mdx#_snippet_65

LANGUAGE: tsx
CODE:
```
import type { Metadata } from 'next'

type Props = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export function generateMetadata({ params, searchParams }: Props): Metadata {
  return {
    title: 'Next.js',
  }
}

export default function Page({ params, searchParams }: Props) {}
```

----------------------------------------

TITLE: HTML Output for Article Open Graph Metadata
DESCRIPTION: This HTML snippet shows the meta tags generated from the Open Graph metadata defined in the previous JSX snippet for an article. It includes properties for title, description, type, published time, and authors.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/04-functions/generate-metadata.mdx#_snippet_21

LANGUAGE: html
CODE:
```
<meta property="og:title" content="Next.js" />
<meta property="og:description" content="The React Framework for the Web" />
<meta property="og:type" content="article" />
<meta property="article:published_time" content="2023-01-01T00:00:00.000Z" />
<meta property="article:author" content="Seb" />
<meta property="article:author" content="Josh" />
```

----------------------------------------

TITLE: Conditional Redirects in Next.js
DESCRIPTION: This code shows how to conditionally apply redirects based on headers, cookies, or query parameters using `has` and `missing` fields. It ensures that all specified conditions in `has` match and none in `missing` are present for the redirect to take effect.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/05-config/01-next-config-js/redirects.mdx#2025-04-21_snippet_4

LANGUAGE: JavaScript
CODE:
```
module.exports = {
  async redirects() {
    return [
      {
        source: '/:path((?!another-page$).*)',
        has: [
          {
            type: 'header',
            key: 'x-redirect-me',
          },
        ],
        permanent: false,
        destination: '/another-page',
      }
    ]
  },
}
```

----------------------------------------

TITLE: Building and starting a Next.js app with pnpm
DESCRIPTION: These commands build and start the Next.js application in production using pnpm. `pnpm build` compiles the app for deployment, and `pnpm start` initiates the production server. A pre-existing Next.js project setup is expected.
SOURCE: https://github.com/vercel/next.js/blob/canary/examples/with-sass/README.md#_snippet_5

LANGUAGE: bash
CODE:
```
pnpm build
pnpm start
```

----------------------------------------

TITLE: Preloading Resources with ReactDOM (JavaScript)
DESCRIPTION: This JavaScript code snippet shows how to use ReactDOM methods to preload resources, preconnect to domains, and prefetch DNS for optimization. It uses the 'use client' directive to indicate client-side rendering.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/04-functions/generate-metadata.mdx#_snippet_69

LANGUAGE: javascript
CODE:
```
'use client'

import ReactDOM from 'react-dom'

export function PreloadResources() {
  ReactDOM.preload('...', { as: '...' })
  ReactDOM.preconnect('...', { crossOrigin: '...' })
  ReactDOM.prefetchDNS('...')

  return '...'
}
```

----------------------------------------

TITLE: Enabling Inline CSS in Next.js Configuration - TypeScript
DESCRIPTION: This TypeScript snippet configures a Next.js application to enable inline CSS by setting the 'inlineCss' flag to true within the 'experimental' configuration. The configuration ensures all CSS is inlined within <style> tags instead of using <link> tags, which optimizes loading times under certain conditions. This setup requires a Next.js environment where 'experimental.inlineCss' is an available option.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/05-config/01-next-config-js/inlineCss.mdx#2025-04-21_snippet_0

LANGUAGE: TypeScript
CODE:
```
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    inlineCss: true,
  },
}

export default nextConfig
```

----------------------------------------

TITLE: Dynamic MDX Imports with generateStaticParams (App Router - JSX)
DESCRIPTION: Demonstrates how to dynamically import MDX components in a Next.js app router page, using `generateStaticParams` for pre-rendering. It fetches MDX content based on the route slug.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/mdx.mdx#_snippet_14

LANGUAGE: jsx
CODE:
```
export default async function Page({ params }) {
  const { slug } = await params
  const { default: Post } = await import(`@/content/${slug}.mdx`)

  return <Post />
}

export function generateStaticParams() {
  return [{ slug: 'welcome' }, { slug: 'about' }]
}

export const dynamicParams = false
```

----------------------------------------

TITLE: MSW Initialization using yarn
DESCRIPTION: This command initializes Mock Service Worker in the public directory. It's used to generate the `mockServiceWorker.js` file, which is essential for MSW to intercept requests in the browser. This uses the yarn package manager.
SOURCE: https://github.com/vercel/next.js/blob/canary/examples/with-msw/README.md#_snippet_1

LANGUAGE: bash
CODE:
```
yarn msw init public/
```

----------------------------------------

TITLE: Installing next/env Package (Next.js)
DESCRIPTION: Install the `@next/env` package to programmatically load environment variables outside the Next.js runtime (e.g., in config files).
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/environment-variables.mdx#_snippet_4

LANGUAGE: bash
CODE:
```
npm install @next/env
```

----------------------------------------

TITLE: Initializing Google Tag Manager in App Router (TSX)
DESCRIPTION: This code snippet demonstrates how to include the `GoogleTagManager` component within the root layout of a Next.js application using the App Router with TypeScript.  It imports the component from `@next/third-parties/google` and passes the GTM container ID via the `gtmId` prop. This ensures GTM is loaded on all routes.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/third-party-libraries.mdx#_snippet_1

LANGUAGE: tsx
CODE:
```
import { GoogleTagManager } from '@next/third-parties/google'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <GoogleTagManager gtmId="GTM-XYZ" />
      <body>{children}</body>
    </html>
  )
}
```

----------------------------------------

TITLE: Handling Custom Next.js Metrics
DESCRIPTION: This code snippet demonstrates how to handle custom Next.js metrics such as hydration time, route change to render time, and render time using a switch statement. It uses the `reportWebVitals` function to access the metrics.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/analytics.mdx#_snippet_6

LANGUAGE: javascript
CODE:
```
export function reportWebVitals(metric) {
  switch (metric.name) {
    case 'Next.js-hydration':
      // handle hydration results
      break
    case 'Next.js-route-change-to-render':
      // handle route-change to render results
      break
    case 'Next.js-render':
      // handle render results
      break
    default:
      break
  }
}
```

----------------------------------------

TITLE: Styled-JSX Registry Component in TypeScript
DESCRIPTION: This component creates a style registry for styled-jsx and uses the `useServerInsertedHTML` hook to inject the styles into the document head during server-side rendering. It's a client component that wraps the application to ensure styles are properly applied. Requires `next/navigation` and `styled-jsx`.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/css-in-js.mdx#_snippet_0

LANGUAGE: tsx
CODE:
```
'use client'

import React, { useState } from 'react'
import { useServerInsertedHTML } from 'next/navigation'
import { StyleRegistry, createStyleRegistry } from 'styled-jsx'

export default function StyledJsxRegistry({
  children,
}: {
  children: React.ReactNode
}) {
  // Only create stylesheet once with lazy initial state
  // x-ref: https://reactjs.org/docs/hooks-reference.html#lazy-initial-state
  const [jsxStyleRegistry] = useState(() => createStyleRegistry())

  useServerInsertedHTML(() => {
    const styles = jsxStyleRegistry.styles()
    jsxStyleRegistry.flush()
    return <>{styles}</>
  })

  return <StyleRegistry registry={jsxStyleRegistry}>{children}</StyleRegistry>
}
```

----------------------------------------

TITLE: Configuring dynamicIO in Next.js Config
DESCRIPTION: Example configuration for enabling the dynamicIO experimental flag in a Next.js application's config file. This setting makes data fetching operations run at runtime by default unless explicitly cached.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/05-config/01-next-config-js/dynamicIO.mdx#2025-04-23_snippet_0

LANGUAGE: typescript
CODE:
```
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    dynamicIO: true,
  },
}

export default nextConfig
```

----------------------------------------

TITLE: Initializing Next.js project with npm
DESCRIPTION: This command uses npm to create a new Next.js application based on the with-route-as-modal example. It clones the example project into a new directory specified by 'with-route-as-modal-app'.
SOURCE: https://github.com/vercel/next.js/blob/canary/examples/with-route-as-modal/README.md#_snippet_0

LANGUAGE: bash
CODE:
```
npx create-next-app --example with-route-as-modal with-route-as-modal-app
```

----------------------------------------

TITLE: Initializing Google Analytics on a single route (App Router - JSX)
DESCRIPTION: This code snippet demonstrates how to include Google Analytics on a single route in a Next.js application using the App Router.  It imports the `GoogleAnalytics` component from `@next/third-parties/google` and initializes it with a Google Analytics ID.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/third-party-libraries.mdx#_snippet_11

LANGUAGE: jsx
CODE:
```
import { GoogleAnalytics } from '@next/third-parties/google'

export default function Page() {
  return <GoogleAnalytics gaId="G-XYZ" />
}
```

----------------------------------------

TITLE: Static Site Generation with getStaticProps (pages)
DESCRIPTION: Fetches data from an external API using `getStaticProps` in the `pages` directory. The fetched data is then passed as props to the page component for rendering at build time.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/migrating/app-router-migration.mdx#_snippet_32

LANGUAGE: jsx
CODE:
```
export async function getStaticProps() {
  const res = await fetch(`https://...`)
  const projects = await res.json()

  return { props: { projects } }
}

export default function Index({ projects }) {
  return projects.map((project) => <div>{project.name}</div>)
}
```

----------------------------------------

TITLE: Using onLoad Callback with Next.js Image Component
DESCRIPTION: Example of using the onLoad callback with Next.js Image component. This callback is triggered once the image is completely loaded and the placeholder is removed, providing access to the event object.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/02-components/image.mdx#2025-04-21_snippet_9

LANGUAGE: jsx
CODE:
```
<Image onLoad={(e) => console.log(e.target.naturalWidth)} />
```

----------------------------------------

TITLE: Revalidating Cache by Tag (Next.js)
DESCRIPTION: Provides an example of calling the `revalidateTag` function with a specific tag to purge all cache entries that were previously tagged with that identifier.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/04-deep-dive/caching.mdx#_snippet_8

LANGUAGE: JSX
CODE:
```
revalidateTag('a')
```

----------------------------------------

TITLE: Add Jest test scripts to package.json
DESCRIPTION: Adds `test` and `test:watch` scripts to the `package.json` file to run Jest tests. The `test` script executes all tests once, while `test:watch` re-runs tests whenever a file changes.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/testing/jest.mdx#_snippet_15

LANGUAGE: json
CODE:
```
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "test": "jest",
    "test:watch": "jest --watch"
  }
}
```

----------------------------------------

TITLE: Bootstrapping Next.js App with Yarn
DESCRIPTION: This snippet demonstrates how to bootstrap a Next.js application using the create-next-app command with Yarn. It sets up the app with the Docker Compose example provided.
SOURCE: https://github.com/vercel/next.js/blob/canary/examples/with-docker-compose/README.md#2025-04-21_snippet_1

LANGUAGE: bash
CODE:
```
yarn create next-app --example with-docker-compose with-docker-compose-app
```

----------------------------------------

TITLE: Securing Pages Router API Route (TS)
DESCRIPTION: Provides a TypeScript example for securing a Next.js Pages Router API Route (`pages/api/*`). The handler checks for an active user session using `getSession` and then verifies if the user has the 'admin' role, returning JSON error responses with 401 status for unauthorized access.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/authentication.mdx#_snippet_41

LANGUAGE: ts
CODE:
```
import { NextApiRequest, NextApiResponse } from 'next'\n\nexport default async function handler(\n  req: NextApiRequest,\n  res: NextApiResponse\n) {\n  const session = await getSession(req)\n\n  // Check if the user is authenticated\n  if (!session) {\n    res.status(401).json({\n      error: 'User is not authenticated',\n    })\n    return\n  }\n\n  // Check if the user has the 'admin' role\n  if (session.user.role !== 'admin') {\n    res.status(401).json({\n      error: 'Unauthorized access: User does not have admin privileges.',\n    })\n    return\n  }\n\n  // Proceed with the route for authorized users\n  // ... implementation of the API Route\n}
```

----------------------------------------

TITLE: Fetching Preview Data in getStaticProps - JavaScript
DESCRIPTION: This code snippet shows how to conditionally fetch data based on the preview mode. It checks `context.preview` and modifies the API endpoint URL accordingly.  The example shows a fetch call to an external API. It's a simplified demonstration; the actual implementation depends on the specific headless CMS or data source. The `context` object is provided by Next.js.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/02-pages/02-guides/preview-mode.mdx#_snippet_5

LANGUAGE: javascript
CODE:
```
export async function getStaticProps(context) {
  // If context.preview is true, append "/preview" to the API endpoint
  // to request draft data instead of published data. This will vary
  // based on which headless CMS you're using.
  const res = await fetch(`https://.../${context.preview ? 'preview' : ''}`)
  // ...
}
```

----------------------------------------

TITLE: Setting Loading Property on Next.js Image Component
DESCRIPTION: Example of setting the loading property on a Next.js Image component. This property determines the loading behavior, with options for lazy (default, deferred loading) or eager (immediate loading).
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/02-components/image.mdx#2025-04-21_snippet_11

LANGUAGE: js
CODE:
```
loading = 'lazy' // {lazy} | {eager}
```

----------------------------------------

TITLE: Accessing Cookies in generateViewport With Suspense (Next.js JSX)
DESCRIPTION: This snippet shows one way to fix the error when `generateViewport` must access dynamic Request data. By wrapping the main content (`children`) in a `<Suspense>` boundary in the root layout, you explicitly indicate that the route should be rendered dynamically, allowing access to request-specific data within `generateViewport`.
SOURCE: https://github.com/vercel/next.js/blob/canary/errors/next-prerender-dynamic-viewport.mdx#_snippet_1

LANGUAGE: jsx
CODE:
```
import { Suspense } from 'react'
import { cookies } from 'next/headers'

export async function generateViewport() {
  const cookieJar = await cookies()
  return {
    themeColor: cookieJar.get('theme-color'),
  }
}

export default function RootLayout({ children }) {
  return (
    <Suspense>
      <html>
        <body>{children}</body>
      </html>
    </Suspense>
  )
}
```

----------------------------------------

TITLE: Wrapping Root Layout with Styled-JSX Registry in JavaScript
DESCRIPTION: This code snippet demonstrates how to wrap the root layout of a Next.js application with the `StyledJsxRegistry` component. This ensures that the styled-jsx styles are properly injected into the page during server-side rendering. It imports the registry component and renders it within the root layout.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/css-in-js.mdx#_snippet_3

LANGUAGE: jsx
CODE:
```
import StyledJsxRegistry from './registry'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <StyledJsxRegistry>{children}</StyledJsxRegistry>
      </body>
    </html>
  )
}
```

----------------------------------------

TITLE: Running Next.js Development Server with Package Managers
DESCRIPTION: Commands to start the Next.js development server using different package managers (npm, yarn, pnpm, or bun). After running any of these commands, the development server will be available at http://localhost:3000.
SOURCE: https://github.com/vercel/next.js/blob/canary/packages/create-next-app/templates/default-tw/ts/README-template.md#2025-04-21_snippet_0

LANGUAGE: bash
CODE:
```
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

----------------------------------------

TITLE: Configuring Webpack Resolve Aliases in Next.js - JavaScript
DESCRIPTION: This snippet demonstrates how to safely override the webpack resolve alias configuration in a Next.js project by merging user-defined aliases with the existing configuration. The purpose is to prevent errors caused by improperly overriding internals. No additional dependencies are required. Key functionality involves spreading existing aliases and adding custom ones. This function is typically added inside the next.config.js file used in Next.js projects.
SOURCE: https://github.com/vercel/next.js/blob/canary/errors/invalid-resolve-alias.mdx#2025-04-21_snippet_0

LANGUAGE: JavaScript
CODE:
```
webpack(config) {
  config.resolve.alias = {
    ...config.resolve.alias,
    // your aliases
  }
}
```

----------------------------------------

TITLE: Rendering Responsive Images with Fill in Next.js
DESCRIPTION: This snippet shows how to use the `fill` prop to render a responsive image without knowing the aspect ratio. It requires the parent to have a relative position and allows for object-fit styles to adjust the image display.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/02-components/image.mdx#2025-04-21_snippet_30

LANGUAGE: jsx
CODE:
```
import Image from 'next/image'

export default function Page({ photoUrl }) {
  return (
    <div style={{ position: 'relative', width: '300px', height: '500px' }}>
      <Image
        src={photoUrl}
        alt="Picture of the author"
        sizes="300px"
        fill
        style={{
          objectFit: 'contain',
        }}
      />
    </div>
  )
}
```

----------------------------------------

TITLE: Handling User Login API Request - Next.js Pages Router - TypeScript/JavaScript
DESCRIPTION: A Next.js Pages Router API route handler designed to process POST requests for user login. It extracts email and password from the request body and uses a `signIn` function (likely from an authentication library) to authenticate the user. It responds with a success status or handles specific authentication errors.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/authentication.mdx#_snippet_2

LANGUAGE: TypeScript
CODE:
```
import type { NextApiRequest, NextApiResponse } from 'next'
import { signIn } from '@/auth'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { email, password } = req.body
    await signIn('credentials', { email, password })

    res.status(200).json({ success: true })
  } catch (error) {
    if (error.type === 'CredentialsSignin') {
      res.status(401).json({ error: 'Invalid credentials.' })
    } else {
      res.status(500).json({ error: 'Something went wrong.' })
    }
  }
}
```

LANGUAGE: JavaScript
CODE:
```
import { signIn } from '@/auth'

export default async function handler(req, res) {
  try {
    const { email, password } = req.body
    await signIn('credentials', { email, password })

    res.status(200).json({ success: true })
  } catch (error) {
    if (error.type === 'CredentialsSignin') {
      res.status(401).json({ error: 'Invalid credentials.' })
    } else {
      res.status(500).json({ error: 'Something went wrong.' })
    }
  }
}
```

----------------------------------------

TITLE: Accessing Browser APIs in Client Component
DESCRIPTION: This code illustrates how to safely access browser APIs like `window` in a Next.js Client Component.  It uses the `useEffect` hook to ensure that the code accessing the `window` object only runs on the client-side, after the component has mounted.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/static-exports.mdx#_snippet_13

LANGUAGE: jsx
CODE:
```
'use client';

import { useEffect } from 'react';

export default function ClientComponent() {
  useEffect(() => {
    // You now have access to `window`
    console.log(window.innerHeight);
  }, [])

  return ...;
}
```

----------------------------------------

TITLE: Invoking notFound() in Next.js
DESCRIPTION: This snippet demonstrates how to use the notFound function to handle user fetching errors in a Next.js application. If the user is not found, it calls the notFound() function to trigger a 404 error response. The fetchUser function handles fetching user data from an external API, and the Profile component orchestrates the logic and error handling.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/04-functions/not-found.mdx#2025-04-21_snippet_0

LANGUAGE: javascript
CODE:
```
import { notFound } from 'next/navigation'

async function fetchUser(id) {
  const res = await fetch('https://...')
  if (!res.ok) return undefined
  return res.json()
}

export default async function Profile({ params }) {
  const { id } = await params
  const user = await fetchUser(id)

  if (!user) {
    notFound()
  }

  // ...
}
```

----------------------------------------

TITLE: Using Sass Variable in Pages Router Component | JSX
DESCRIPTION: Imports the exported variables from a Sass module file and passes the `primaryColor` variable's value as a prop to a `Layout` component. This example demonstrates usage within the Next.js Pages Router (`pages` directory), typically shown in a custom `_app.js` file.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/sass.mdx#_snippet_5

LANGUAGE: jsx
CODE:
```
import variables from '../styles/variables.module.scss'

export default function MyApp({ Component, pageProps }) {
  return (
    <Layout color={variables.primaryColor}>
      <Component {...pageProps} />
    </Layout>
  )
}
```

----------------------------------------

TITLE: Initializing Next.js App with Cosmos DB Example using pnpm
DESCRIPTION: This command initializes a new Next.js application using the `with-azure-cosmos` example.  It uses `pnpm create next-app` to bootstrap the project, pre-configured for integration with Azure Cosmos DB. The created application is placed in the `with-azure-cosmos-app` directory.
SOURCE: https://github.com/vercel/next.js/blob/canary/examples/with-azure-cosmos/README.md#_snippet_2

LANGUAGE: bash
CODE:
```
pnpm create next-app --example with-azure-cosmos with-azure-cosmos-app
```

----------------------------------------

TITLE: Routing requests with rewrites in next.config.js
DESCRIPTION: This code snippet demonstrates how to use rewrites in `next.config.js` to route requests to different zones based on the path. It rewrites requests for `/blog` and its subpaths, as well as static assets under `/blog-static`, to the domain specified in the `BLOG_DOMAIN` environment variable. The destination should be a URL that is served by the zone, including scheme and domain.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/multi-zones.mdx#_snippet_2

LANGUAGE: javascript
CODE:
```
async rewrites() {
    return [
        {
            source: '/blog',
            destination: `${process.env.BLOG_DOMAIN}/blog`,
        },
        {
            source: '/blog/:path+',
            destination: `${process.env.BLOG_DOMAIN}/blog/:path+`,
        },
        {
            source: '/blog-static/:path+',
            destination: `${process.env.BLOG_DOMAIN}/blog-static/:path+`,
        }
    ];
}
```

----------------------------------------

TITLE: Using Unauthorized Function in Dashboard Page - TSX
DESCRIPTION: This code snippet demonstrates how to use the unauthorized function within a dashboard page to check user authentication and render the Unauthorized component if the session is invalid. It's tailored for TypeScript.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/03-file-conventions/unauthorized.mdx#2025-04-21_snippet_2

LANGUAGE: tsx
CODE:
```
import { verifySession } from '@/app/lib/dal'
import { unauthorized } from 'next/navigation'

export default async function DashboardPage() {
  const session = await verifySession()

  if (!session) {
    unauthorized()
  }

  return <div>Dashboard</div>
}

```

----------------------------------------

TITLE: Accessing Runtime Env Vars During Dynamic Rendering (App Router, Next.js)
DESCRIPTION: In the App Router, server-side environment variables can be accessed at runtime during dynamic rendering, typically triggered by using dynamic functions like `cookies()` or `headers()`, or other dynamic APIs.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/environment-variables.mdx#_snippet_10

LANGUAGE: typescript
CODE:
```
import { connection } from 'next/server'

export default async function Component() {
  await connection()
  // cookies, headers, and other Dynamic APIs
  // will also opt into dynamic rendering, meaning
  // this env variable is evaluated at runtime
  const value = process.env.MY_VALUE
  // ...
}
```

LANGUAGE: javascript
CODE:
```
import { connection } from 'next/server'

export default async function Component() {
  await connection()
  // cookies, headers, and other Dynamic APIs
  // will also opt into dynamic rendering, meaning
  // this env variable is evaluated at runtime
  const value = process.env.MY_VALUE
  // ...
}
```

----------------------------------------

TITLE: Embedding Google Maps with Next.js
DESCRIPTION: This code snippet demonstrates how to embed a Google Maps component in a Next.js page using the `@next/third-parties/google` package. It requires an API key and specifies the map mode, height, width, and query parameters. The `GoogleMapsEmbed` component is imported and rendered with the specified props.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/third-party-libraries.mdx#_snippet_15

LANGUAGE: jsx
CODE:
```
import { GoogleMapsEmbed } from '@next/third-parties/google'

export default function Page() {
  return (
    <GoogleMapsEmbed
      apiKey="XYZ"
      height={200}
      width="100%"
      mode="place"
      q="Brooklyn+Bridge,New+York,NY"
    />
  )
}
```

----------------------------------------

TITLE: Creating Background Effect with next/image fill (JSX)
DESCRIPTION: This snippet illustrates how to use the `next/image` component with the `fill` prop to achieve a background image effect that covers the entire viewport. It sets `fill`, uses `sizes="100vw"`, and applies `objectFit: 'cover'` via inline style to control the image's display behavior.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-building-your-application/06-optimizing/01-images.mdx#_snippet_10

LANGUAGE: JSX
CODE:
```
import Image from 'next/image'
import mountains from '../public/mountains.jpg'

export default function Background() {
  return (
    <Image
      alt="Mountains"
      src={mountains}
      placeholder="blur"
      quality={100}
      fill
      sizes="100vw"
      style={{
        objectFit: 'cover',
      }}
    />
  )
}
```

----------------------------------------

TITLE: Returning Image Metadata Array in TypeScript
DESCRIPTION: This code snippet demonstrates how to return an array of image metadata objects from the `generateImageMetadata` function in TypeScript. Each object contains metadata such as `contentType`, `size`, and a required `id`. The `id` is then passed as a prop to the image generating function.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/04-functions/generate-image-metadata.mdx#_snippet_2

LANGUAGE: TypeScript
CODE:
```
import { ImageResponse } from 'next/og'

export function generateImageMetadata() {
  return [
    {
      contentType: 'image/png',
      size: { width: 48, height: 48 },
      id: 'small',
    },
    {
      contentType: 'image/png',
      size: { width: 72, height: 72 },
      id: 'medium',
    },
  ]
}

export default function Icon({ id }: { id: string }) {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 88,
          background: '#000',
          color: '#fafafa',
        }}
      >
        Icon {id}
      </div>
    )
  )
}
```

----------------------------------------

TITLE: Deleting a Cookie in NextResponse - TypeScript
DESCRIPTION: Removes a cookie from the response based on the provided cookie name.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/04-functions/next-response.mdx#2025-04-21_snippet_3

LANGUAGE: typescript
CODE:
```
// Given incoming request /home
let response = NextResponse.next()
// Returns true for deleted, false is nothing is deleted
response.cookies.delete('experiments')
```

----------------------------------------

TITLE: Implementing Redirects in Next.js API Route
DESCRIPTION: Shows how to handle form submissions and redirect clients to a specified path using Next.js API routes. Includes error handling for failed operations.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/02-pages/03-building-your-application/01-routing/07-api-routes.mdx#2025-04-23_snippet_6

LANGUAGE: typescript
CODE:
```
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { name, message } = req.body

  try {
    await handleFormInputAsync({ name, message })
    res.redirect(307, '/')
  } catch (err) {
    res.status(500).send({ error: 'Failed to fetch data' })
  }
}
```

LANGUAGE: javascript
CODE:
```
export default async function handler(req, res) {
  const { name, message } = req.body

  try {
    await handleFormInputAsync({ name, message })
    res.redirect(307, '/')
  } catch (err) {
    res.status(500).send({ error: 'failed to fetch data' })
  }
}
```

----------------------------------------

TITLE: Initializing OpenTelemetry NodeSDK (JavaScript)
DESCRIPTION: Initializes the OpenTelemetry `NodeSDK` in `instrumentation.node.js`. This code configures the SDK with a resource containing the service name ('next-app') and a simple span processor that exports traces using OTLP over HTTP. The SDK is then started to begin collecting telemetry data.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/open-telemetry.mdx#_snippet_7

LANGUAGE: javascript
CODE:
```
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http'
import { Resource } from '@opentelemetry/resources'
import { NodeSDK } from '@opentelemetry/sdk-node'
import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-node'
import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions'

const sdk = new NodeSDK({
  resource: new Resource({
    [ATTR_SERVICE_NAME]: 'next-app',
  }),
  spanProcessor: new SimpleSpanProcessor(new OTLPTraceExporter()),
})
sdk.start()
```

----------------------------------------

TITLE: Setting a Cookie with NextRequest
DESCRIPTION: This snippet demonstrates how to set a cookie using the `set` method of the `request.cookies` object in Next.js. It sets a cookie named 'show-banner' with a value of 'false' and a path of '/home'.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/04-functions/next-request.mdx#2025-04-21_snippet_0

LANGUAGE: typescript
CODE:
```
// Given incoming request /home
// Set a cookie to hide the banner
// request will have a `Set-Cookie:show-banner=false;path=/home` header
request.cookies.set('show-banner', 'false')
```

----------------------------------------

TITLE: Configuring GitHub Actions Cache for Next.js Builds
DESCRIPTION: This YAML configuration for GitHub Actions uses the actions/cache action to cache npm packages and the Next.js cache. It generates a new cache when packages or source files change and can restore from a prior cache if only source files changed.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/ci-build-caching.mdx#2025-04-23_snippet_4

LANGUAGE: yaml
CODE:
```
uses: actions/cache@v4
with:
  # See here for caching with `yarn`, `bun` or other package managers https://github.com/actions/cache/blob/main/examples.md or you can leverage caching with actions/setup-node https://github.com/actions/setup-node
  path: |
    ~/.npm
    ${{ github.workspace }}/.next/cache
  # Generate a new cache whenever packages or source files change.
  key: ${{ runner.os }}-nextjs-${{ hashFiles('**/package-lock.json') }}-${{ hashFiles('**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx') }}
  # If source files changed but packages didn't, rebuild from a prior cache.
  restore-keys: |
    ${{ runner.os }}-nextjs-${{ hashFiles('**/package-lock.json') }}-
```

----------------------------------------

TITLE: Enabling React Compiler in Next.js Configuration (TypeScript)
DESCRIPTION: Configuration to enable the React Compiler in next.config.ts file. This sets the experimental.reactCompiler option to true.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/05-config/01-next-config-js/reactCompiler.mdx#2025-04-23_snippet_1

LANGUAGE: typescript
CODE:
```
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    reactCompiler: true,
  },
}

export default nextConfig
```

----------------------------------------

TITLE: Sending HTTP Response in Next.js API Route
DESCRIPTION: Demonstrates handling async operations and sending HTTP responses with status codes in a Next.js API route. Includes error handling with appropriate status codes.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/02-pages/03-building-your-application/01-routing/07-api-routes.mdx#2025-04-23_snippet_5

LANGUAGE: typescript
CODE:
```
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const result = await someAsyncOperation()
    res.status(200).send({ result })
  } catch (err) {
    res.status(500).send({ error: 'failed to fetch data' })
  }
}
```

LANGUAGE: javascript
CODE:
```
export default async function handler(req, res) {
  try {
    const result = await someAsyncOperation()
    res.status(200).send({ result })
  } catch (err) {
    res.status(500).send({ error: 'failed to fetch data' })
  }
}
```

----------------------------------------

TITLE: Creating Root Layout Component (TypeScript)
DESCRIPTION: This code creates a root layout component in TypeScript (`layout.tsx`) for a Next.js application. The root layout wraps all pages and includes the `<html>`, `<head>`, and `<body>` tags. The `children` prop is used to render the content of each page within the layout.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/migrating/from-create-react-app.mdx#_snippet_2

LANGUAGE: tsx
CODE:
```
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return '...'
}
```

----------------------------------------

TITLE: Server-Side Form Validation with Zod (JavaScript)
DESCRIPTION: Shows a Next.js Server Action (`'use server'`) that performs server-side validation of form data using the Zod library. It defines a Zod schema, parses the incoming `FormData`, and returns validation errors if the data is invalid. Requires the Zod library to be installed.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-building-your-application/02-data-fetching/03-server-actions-and-mutations.mdx#_snippet_10

LANGUAGE: JavaScript
CODE:
```
'use server'

import { z } from 'zod'

const schema = z.object({
  email: z.string({
    invalid_type_error: 'Invalid Email',
  }),
})

export default async function createsUser(formData) {
  const validatedFields = schema.safeParse({
    email: formData.get('email'),
  })

  // Return early if the form data is invalid
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  // Mutate data
}
```

----------------------------------------

TITLE: Importing the Next.js Image Component (JS)
DESCRIPTION: Imports the `Image` component from `next/image` to enable its use within your React components. This is the required first step before you can use the image optimization features.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-building-your-application/06-optimizing/01-images.mdx#_snippet_0

LANGUAGE: js
CODE:
```
import Image from 'next/image'
```

----------------------------------------

TITLE: Initializing Next.js app with Stripe TypeScript example (npm)
DESCRIPTION: This command initializes a new Next.js application using the `with-stripe-typescript` example from the Next.js repository. It uses `create-next-app` via `npx` to bootstrap the project.
SOURCE: https://github.com/vercel/next.js/blob/canary/examples/with-stripe-typescript/README.md#_snippet_0

LANGUAGE: bash
CODE:
```
npx create-next-app --example with-stripe-typescript with-stripe-typescript-app
```

----------------------------------------

TITLE: Initializing Web Vitals Reporting in Pages Router (Basic)
DESCRIPTION: This snippet demonstrates the basic usage of the `useReportWebVitals` hook within the `_app.js` file in a Next.js Pages Router application. It initializes the reporting mechanism and logs each collected performance metric to the console as it becomes available.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/04-functions/use-report-web-vitals.mdx#_snippet_0

LANGUAGE: jsx
CODE:
```
import { useReportWebVitals } from 'next/web-vitals'

function MyApp({ Component, pageProps }) {
  useReportWebVitals((metric) => {
    console.log(metric)
  })

  return <Component {...pageProps} />
}
```

----------------------------------------

TITLE: Creating Intercepted Login Modal Component
DESCRIPTION: Implements an intercepted login route that wraps the Login component inside a Modal for inline rendering
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-building-your-application/01-routing/11-parallel-routes.mdx#2025-04-21_snippet_10

LANGUAGE: tsx
CODE:
```
import { Modal } from '@\/app\/ui\/modal'
import { Login } from '@\/app\/ui\/login'

export default function Page() {
  return (
    <Modal>
      <Login \/>
    </Modal>
  )
}
```

LANGUAGE: jsx
CODE:
```
import { Modal } from '@\/app\/ui\/modal'
import { Login } from '@\/app\/ui\/login'

export default function Page() {
  return (
    <Modal>
      <Login \/>
    </Modal>
  )
}
```

----------------------------------------

TITLE: Clearing Preview Mode Cookies with Path - JavaScript
DESCRIPTION: This JavaScript code shows how to clear preview mode cookies for a specific path. If a path was set using `setPreviewData`, the same path must be passed to `clearPreviewData` when clearing the cookies.  It retrieves the path from the request query parameters and passes it to `res.clearPreviewData`.  Requires setting up an API endpoint.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/02-pages/02-guides/preview-mode.mdx#_snippet_9

LANGUAGE: javascript
CODE:
```
export default function handler(req, res) {
  const { path } = req.query

  res.clearPreviewData({ path })
}
```

----------------------------------------

TITLE: Defining CSS Styles with Font Variable
DESCRIPTION: This CSS snippet defines a style for a text element using a CSS variable for the font family. It also sets the font weight and style.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/02-components/font.mdx#_snippet_50

LANGUAGE: CSS
CODE:
```
.text {
  font-family: var(--font-inter);
  font-weight: 200;
  font-style: italic;
}
```

----------------------------------------

TITLE: Creating a Next.js Auth0 App with Yarn
DESCRIPTION: Command to bootstrap a Next.js application with Auth0 integration using Yarn and create-next-app.
SOURCE: https://github.com/vercel/next.js/blob/canary/examples/auth0/README.md#2025-04-21_snippet_1

LANGUAGE: bash
CODE:
```
yarn create next-app --example auth0 auth0-app
```

----------------------------------------

TITLE: CSS Module Definition
DESCRIPTION: This CSS Module defines the style for the 'dashboard' class, setting the padding to 24 pixels. This style is locally scoped and can be used without worrying about naming conflicts.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-building-your-application/05-styling/01-css.mdx#_snippet_2

LANGUAGE: css
CODE:
```
.dashboard {
  padding: 24px;
}
```

----------------------------------------

TITLE: Creating Next.js App with Yarn
DESCRIPTION: This command uses Yarn to create a new Next.js application based on the api-routes-middleware example. It initializes the project with the specified example and names the new application api-routes-middleware-app.
SOURCE: https://github.com/vercel/next.js/blob/canary/examples/api-routes-middleware/README.md#_snippet_1

LANGUAGE: bash
CODE:
```
yarn create next-app --example api-routes-middleware api-routes-middleware-app
```

----------------------------------------

TITLE: Disabling Server-Side Rendering with next/dynamic (Next.js)
DESCRIPTION: Illustrates how to prevent a React component from being server-rendered in Next.js using the `next/dynamic` import function with the `{ ssr: false }` option. This approach is useful for components that rely heavily on browser-specific APIs or are known to cause hydration mismatches, ensuring they are only executed and rendered client-side.
SOURCE: https://github.com/vercel/next.js/blob/canary/errors/react-hydration-error.mdx#_snippet_1

LANGUAGE: JSX
CODE:
```
import dynamic from 'next/dynamic';

const NoSSR = dynamic(() => import('../components/no-ssr'), { ssr: false });

export default function Page() {
  return (
    <div>
      <NoSSR />
    </div>
  );
}
```

----------------------------------------

TITLE: Creating Next.js App with ButterCMS Example - Bash
DESCRIPTION: This snippet provides commands to create a new Next.js application using the predefined ButterCMS example, applicable for npm, yarn, and pnpm users. The tools needed include npx, yarn, or pnpm. The commands bootstrap a Next.js app using the ButterCMS example template.
SOURCE: https://github.com/vercel/next.js/blob/canary/examples/cms-buttercms/README.md#2025-04-21_snippet_1

LANGUAGE: bash
CODE:
```
npx create-next-app --example cms-buttercms cms-buttercms-app
```

LANGUAGE: bash
CODE:
```
yarn create next-app --example cms-buttercms cms-buttercms-app
```

LANGUAGE: bash
CODE:
```
pnpm create next-app --example cms-buttercms cms-buttercms-app
```

----------------------------------------

TITLE: Creating a Next.js app with GraphQL example using Yarn
DESCRIPTION: This command uses Yarn to create a new Next.js application based on the api-routes-graphql example. It sets up a project configured for GraphQL, including installing dependencies. The new application will be named 'api-routes-graphql-app'.
SOURCE: https://github.com/vercel/next.js/blob/canary/examples/api-routes-graphql/README.md#_snippet_1

LANGUAGE: bash
CODE:
```
yarn create next-app --example api-routes-graphql api-routes-graphql-app
```

----------------------------------------

TITLE: Setting Quality Property on Next.js Image Component
DESCRIPTION: Example of setting the quality property on a Next.js Image component. The quality property accepts a number from 1 to 100 and determines the quality of the optimized image.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/02-components/image.mdx#2025-04-21_snippet_4

LANGUAGE: js
CODE:
```
quality={75} // {number 1-100}
```

----------------------------------------

TITLE: Loading Scripts in Root Layout - JavaScript
DESCRIPTION: This code snippet shows how to load a third-party script in the root layout of a Next.js application using JavaScript. The script will load on every route. Requires `next/script` dependency.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/scripts.mdx#_snippet_3

LANGUAGE: jsx
CODE:
```
import Script from 'next/script'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
      <Script src="https://example.com/script.js" />
    </html>
  )
}
```

----------------------------------------

TITLE: Setting theme color with media attribute (JSX)
DESCRIPTION: This code snippet demonstrates setting the theme color with media attributes for light and dark color schemes using JavaScript. It exports a viewport object with a themeColor array.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/04-functions/generate-viewport.mdx#_snippet_8

LANGUAGE: jsx
CODE:
```
export const viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'cyan' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}
```

----------------------------------------

TITLE: Caching External Data for generateViewport (Next.js JSX)
DESCRIPTION: This snippet demonstrates how to fix the error when using external data in `generateViewport` by leveraging caching. Adding the `"use cache"` directive to the data fetching logic within `generateViewport` allows Next.js to cache the result and prerender the viewport metadata, resolving the dependency on uncached data.
SOURCE: https://github.com/vercel/next.js/blob/canary/errors/next-prerender-dynamic-viewport.mdx#_snippet_3

LANGUAGE: jsx
CODE:
```
import { db } from './db'

export async function generateViewport() {
  "use cache"
  const { width, initialScale } = await db.query('viewport-size')
  return {
    width,
    initialScale,
  }
}

export default async function Layout({ children }) {
  return ...
}
```

----------------------------------------

TITLE: Setting up SuperTokens with Next.js using create-supertokens-app (PNPM)
DESCRIPTION: Command to create a Next.js application with SuperTokens authentication using the official SuperTokens CLI tool with PNPM, allowing further customization during setup.
SOURCE: https://github.com/vercel/next.js/blob/canary/examples/with-supertokens/README.md#2025-04-21_snippet_5

LANGUAGE: bash
CODE:
```
pnpm create-supertokens-app@latest --frontend=next
```

----------------------------------------

TITLE: Using notFound in getStaticProps (JavaScript)
DESCRIPTION: This code snippet shows how to use the `notFound` property in `getStaticProps` to return a 404 page if the data is not found. It fetches data from an API and, if the response is empty, returns `notFound: true`.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/02-pages/04-api-reference/03-functions/get-static-props.mdx#_snippet_4

LANGUAGE: JavaScript
CODE:
```
export async function getStaticProps(context) {
  const res = await fetch(`https://.../data`)
  const data = await res.json()

  if (!data) {
    return {
      notFound: true,
    }
  }

  return {
    props: { data }, // will be passed to the page component as props
  }
}
```

----------------------------------------

TITLE: TypeScript Configuration in next.config.ts
DESCRIPTION: Shows how to configure Next.js using TypeScript with proper type definitions and config options.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/05-config/02-typescript.mdx#2025-04-21_snippet_1

LANGUAGE: typescript
CODE:
```
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
}

export default nextConfig
```

----------------------------------------

TITLE: Configuring width, initialScale, maximumScale, and userScalable (TSX)
DESCRIPTION: This code snippet demonstrates configuring width, initialScale, maximumScale, and userScalable properties in the viewport using TypeScript. It exports a viewport object with these properties set.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/04-functions/generate-viewport.mdx#_snippet_10

LANGUAGE: tsx
CODE:
```
import type { Viewport } from 'next'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  // Also supported but less commonly used
  // interactiveWidget: 'resizes-visual',
}
```

----------------------------------------

TITLE: Rendering JSON-LD in Next.js Page (TSX)
DESCRIPTION: This code snippet demonstrates how to render JSON-LD data within a Next.js page component using TSX. It fetches product data and constructs a JSON-LD object, then injects it into a <script> tag with type="application/ld+json". The dangerouslySetInnerHTML prop is used to insert the JSON string into the script tag.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/json-ld.mdx#_snippet_0

LANGUAGE: tsx
CODE:
```
export default async function Page({ params }) {
  const { id } = await params
  const product = await getProduct(id)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.image,
    description: product.description,
  }

  return (
    <section>
      {/* Add JSON-LD to your page */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* ... */}
    </section>
  )
}
```

----------------------------------------

TITLE: Using Video Skeleton as Suspense Fallback - JSX
DESCRIPTION: This code demonstrates using a video skeleton component as the fallback UI within React Suspense, enhancing the loading experience.  It imports both `VideoComponent` and `VideoSkeleton` components and renders the `VideoSkeleton` while the `VideoComponent` is loading. This provides a more visually appealing and informative loading state.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/videos.mdx#_snippet_4

LANGUAGE: jsx
CODE:
```
import { Suspense } from 'react'
import VideoComponent from '../ui/VideoComponent.jsx'
import VideoSkeleton from '../ui/VideoSkeleton.jsx'

export default function Page() {
  return (
    <section>
      <Suspense fallback={<VideoSkeleton />}>
        <VideoComponent />
      </Suspense>
      {/* Other content of the page */}
    </section>
  )
}
```

----------------------------------------

TITLE: Enabling use cache in Next.js (TypeScript)
DESCRIPTION: Configures `next.config.ts` to enable the experimental `useCache` feature by adding `useCache: true` to the `experimental` object. This step is required before the `use cache` directive can be used in your application.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/01-directives/use-cache.mdx#_snippet_0

LANGUAGE: TypeScript
CODE:
```
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    useCache: true,
  },
}

export default nextConfig
```

----------------------------------------

TITLE: Handling Different HTTP Methods in Next.js API Routes
DESCRIPTION: This example demonstrates how to handle different HTTP methods (like POST) in an API route using req.method. It provides a template for method-specific logic.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/02-pages/03-building-your-application/01-routing/07-api-routes.mdx#2025-04-23_snippet_2

LANGUAGE: typescript
CODE:
```
import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    // Process a POST request
  } else {
    // Handle any other HTTP method
  }
}
```

----------------------------------------

TITLE: Running Next.js with Turbopack
DESCRIPTION: This bash command demonstrates how to run Next.js in development mode using Turbopack, which offers faster local development. This command replaces the standard `next dev` command.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/migrating/from-create-react-app.mdx#_snippet_28

LANGUAGE: bash
CODE:
```
next dev --turbopack
```

----------------------------------------

TITLE: Wrapping Root Layout with Style Registry (JavaScript)
DESCRIPTION: This code snippet shows how to wrap the children of the root layout with the `StyledComponentsRegistry` component. This ensures that styled-components are properly initialized and rendered within the Next.js application. The `RootLayout` component is a Server Component.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/css-in-js.mdx#_snippet_8

LANGUAGE: javascript
CODE:
```
import StyledComponentsRegistry from './lib/registry'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
      </body>
    </html>
  )
}
```

----------------------------------------

TITLE: Composing Server and Client Components in TypeScript
DESCRIPTION: Example showing how to nest client components within server components, demonstrating proper component composition patterns.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/01-directives/use-client.mdx#2025-04-21_snippet_2

LANGUAGE: tsx
CODE:
```
import Header from './header'
import Counter from './counter' // This is a Client Component

export default function Page() {
  return (
    <div>
      <Header />
      <Counter />
    </div>
  )
}
```

----------------------------------------

TITLE: Configuring Jenkins Pipeline Cache for Next.js Builds
DESCRIPTION: This YAML configuration for Jenkins Pipeline uses the Job Cacher plugin to cache both node_modules and the Next.js cache directory. It includes steps for restoring npm packages and building the Next.js application.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/ci-build-caching.mdx#2025-04-23_snippet_8

LANGUAGE: yaml
CODE:
```
stage("Restore npm packages") {
    steps {
        // Writes lock-file to cache based on the GIT_COMMIT hash
        writeFile file: "next-lock.cache", text: "$GIT_COMMIT"

        cache(caches: [
            arbitraryFileCache(
                path: "node_modules",
                includes: "**/*",
                cacheValidityDecidingFile: "package-lock.json"
            )
        ]) {
            sh "npm install"
        }
    }
}
stage("Build") {
    steps {
        // Writes lock-file to cache based on the GIT_COMMIT hash
        writeFile file: "next-lock.cache", text: "$GIT_COMMIT"

        cache(caches: [
            arbitraryFileCache(
                path: ".next/cache",
                includes: "**/*",
                cacheValidityDecidingFile: "next-lock.cache"
            )
        ]) {
            // aka `next build`
            sh "npm run build"
        }
    }
}
```

----------------------------------------

TITLE: Update package.json Scripts for Next.js
DESCRIPTION: Shows how to update the scripts in `package.json` to use Next.js commands.  This includes `dev`, `build`, and `start` scripts.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/migrating/from-create-react-app.mdx#_snippet_21

LANGUAGE: JSON
CODE:
```
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "npx serve@latest ./build"
  }
}
```

----------------------------------------

TITLE: Configuring Basic Custom Headers Next.js JavaScript
DESCRIPTION: This snippet shows the basic structure for adding custom HTTP headers in `next.config.js`. It defines an asynchronous `headers` function that returns an array of objects. Each object specifies a `source` path pattern and an array of `headers` to apply to matching requests. Headers are defined with `key` and `value` properties.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/05-config/01-next-config-js/headers.mdx#_snippet_0

LANGUAGE: JavaScript
CODE:
```
module.exports = {
  async headers() {
    return [
      {
        source: '/about',
        headers: [
          {
            key: 'x-custom-header',
            value: 'my custom header value',
          },
          {
            key: 'x-another-custom-header',
            value: 'my other custom header value',
          },
        ],
      },
    ]
  },
}
```

----------------------------------------

TITLE: Updating Search Form to Use SearchButton in Next.js TypeScript
DESCRIPTION: In this TypeScript snippet, the search form integrates the 'SearchButton' component to replace the submit button. The SearchButton provides dynamic feedback during the search process.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/02-components/form.mdx#2025-04-21_snippet_12

LANGUAGE: TypeScript
CODE:
```
import Form from 'next/form'
import { SearchButton } from '@/ui/search-button'

export default function Page() {
  return (
    <Form action="/search">
      <input name="query" />
      <SearchButton />
    </Form>
  )
}
```

----------------------------------------

TITLE: Defining Metadata in Root Layout with TypeScript
DESCRIPTION: This code snippet shows how to define metadata for a Next.js application using TypeScript. It imports the Metadata type from 'next' and exports a metadata object with title and description properties. This metadata is used for SEO purposes.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/migrating/app-router-migration.mdx#_snippet_7

LANGUAGE: tsx
CODE:
```
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Home',
  description: 'Welcome to Next.js',
}
```

----------------------------------------

TITLE: Incremental Static Regeneration with getStaticProps in pages
DESCRIPTION: This code snippet demonstrates how to use `getStaticProps` with the `revalidate` field in the `pages` directory to automatically regenerate a page after a specified time interval. It fetches posts from an API and passes them as props to the `Index` component.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/migrating/app-router-migration.mdx#_snippet_38

LANGUAGE: jsx
CODE:
```
export async function getStaticProps() {
  const res = await fetch(`https://.../posts`)
  const posts = await res.json()

  return {
    props: { posts },
    revalidate: 60,
  }
}

export default function Index({ posts }) {
  return (
    <Layout>
      <PostList posts={posts} />
    </Layout>
  )
}
```

----------------------------------------

TITLE: Defining Server Component Reading Cookies (TypeScript)
DESCRIPTION: Defines an asynchronous Server Component that accesses dynamic data from the incoming request using `next/headers.cookies()`. Accessing such dynamic APIs causes the component, and potentially its parent tree, to be rendered dynamically.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-building-your-application/03-rendering/04-partial-prerendering.mdx#_snippet_6

LANGUAGE: TypeScript
CODE:
```
import { cookies } from 'next/headers'

export async function User() {
  const session = (await cookies()).get('session')?.value
  return '...'
}
```

----------------------------------------

TITLE: Update .gitignore for Next.js
DESCRIPTION: This snippet shows how to update the .gitignore file to exclude Next.js related files and directories.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/migrating/from-vite.mdx#_snippet_25

LANGUAGE: txt
CODE:
```
# ...
.next
next-env.d.ts
dist
```

----------------------------------------

TITLE: Define NextResponse Class - Next.js - JS
DESCRIPTION: Defines the `NextResponse` class, inheriting from the standard Web `Response`. It provides Next.js-specific features including custom cookie management via a proxied `ResponseCookies` instance, integration with `NextURL` for response URLs, access to internal state via a `Symbol`, and static helper methods (`json`, `redirect`, `rewrite`, `next`) to easily create common response types for use in Next.js middleware.
SOURCE: https://github.com/vercel/next.js/blob/canary/turbopack/crates/turbopack-ecmascript/tests/tree-shaker/analyzer/next-response/output.md#_snippet_14

LANGUAGE: javascript
CODE:
```
export class NextResponse extends Response {
    constructor(body, init = {}){
        super(body, init);
        const headers = this.headers;
        const cookies = new ResponseCookies(headers);
        const cookiesProxy = new Proxy(cookies, {
            get (target, prop, receiver) {
                switch(prop){
                    case 'delete':
                    case 'set':
                        {
                            return (...args)=>{
                                const result = Reflect.apply(target[prop], target, args);
                                const newHeaders = new Headers(headers);
                                if (result instanceof ResponseCookies) {
                                    headers.set('x-middleware-set-cookie', result.getAll().map((cookie)=>stringifyCookie(cookie)).join(','));
                                }
                                handleMiddlewareField(init, newHeaders);
                                return result;
                            };
                        }
                    default:
                        return ReflectAdapter.get(target, prop, receiver);
                }
            }
        });
        this[INTERNALS] = {
            cookies: cookiesProxy,
            url: init.url ? new NextURL(init.url, {
                headers: toNodeOutgoingHttpHeaders(headers),
                nextConfig: init.nextConfig
            }) : undefined
        };
    }
    [Symbol.for('edge-runtime.inspect.custom')]() {
        return {
            cookies: this.cookies,
            url: this.url,
            body: this.body,
            bodyUsed: this.bodyUsed,
            headers: Object.fromEntries(this.headers),
            ok: this.ok,
            redirected: this.redirected,
            status: this.status,
            statusText: this.statusText,
            type: this.type
        };
    }
    get cookies() {
        return this[INTERNALS].cookies;
    }
    static json(body, init) {
        const response = Response.json(body, init);
        return new NextResponse(response.body, response);
    }
    static redirect(url, init) {
        const status = typeof init === 'number' ? init : (init == null ? void 0 : init.status) ?? 307;
        if (!REDIRECTS.has(status)) {
            throw new RangeError('Failed to execute "redirect" on "response": Invalid status code');
        }
        const initObj = typeof init === 'object' ? init : {};
        const headers = new Headers(initObj == null ? void 0 : initObj.headers);
        headers.set('Location', validateURL(url));
        return new NextResponse(null, {
            ...initObj,
            headers,
            status
        });
    }
    static rewrite(destination, init) {
        const headers = new Headers(init == null ? void 0 : init.headers);
        headers.set('x-middleware-rewrite', validateURL(destination));
        handleMiddlewareField(init, headers);
        return new NextResponse(null, {
            ...init,
            headers
        });
    }
    static next(init) {
        const headers = new Headers(init == null ? void 0 : init.headers);
        headers.set('x-middleware-next', '1');
        handleMiddlewareField(init, headers);
        return new NextResponse(null, {
            ...init,
            headers
        });
    }
}
```

----------------------------------------

TITLE: Generating Image with Local Assets JSX
DESCRIPTION: Illustrates using Node.js runtime APIs (`node:path`, `node:fs/promises`) to read a local image file (`logo.png`) and include it in an Open Graph image generated by `ImageResponse` in a JSX file. The image data is converted to an `ArrayBuffer` for use as the `src` attribute of an `<img>` element.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/03-file-conventions/01-metadata/opengraph-image.mdx#_snippet_23

LANGUAGE: jsx
CODE:
```
import { ImageResponse } from 'next/og'
import { join } from 'node:path'
import { readFile } from 'node:fs/promises'

export default async function Image() {
  const logoData = await readFile(join(process.cwd(), 'logo.png'))
  const logoSrc = Uint8Array.from(logoData).buffer

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <img src={logoSrc} height="100" />
      </div>
    )
  )
}
```

----------------------------------------

TITLE: Fetching Data with Disabled Cache in Next.js
DESCRIPTION: This snippet shows how to use the standard `fetch` API in Next.js with the `cache` option set to `no-store`. This configuration ensures that the data is always fetched from the source and not served from any cache layer, which is the default behavior for `fetch` in Next.js when the option is not specified. Useful for data that must always be fresh.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/04-deep-dive/caching.mdx#_snippet_4

LANGUAGE: javascript
CODE:
```
let data = await fetch('https://api.vercel.app/blog', { cache: 'no-store' })
```

----------------------------------------

TITLE: Defining Font Variables in TypeScript
DESCRIPTION: This code snippet demonstrates how to define font variables using `next/font/google` and `next/font/local` in a TypeScript file. It imports necessary modules, defines variable fonts (Inter, Lora), non-variable fonts (Source_Sans_3), and a custom local font (greatVibes).
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/02-components/font.mdx#_snippet_51

LANGUAGE: TypeScript
CODE:
```
import { Inter, Lora, Source_Sans_3 } from 'next/font/google'
import localFont from 'next/font/local'

// define your variable fonts
const inter = Inter()
const lora = Lora()
// define 2 weights of a non-variable font
const sourceCodePro400 = Source_Sans_3({ weight: '400' })
const sourceCodePro700 = Source_Sans_3({ weight: '700' })
// define a custom local font where GreatVibes-Regular.ttf is stored in the styles folder
const greatVibes = localFont({ src: './GreatVibes-Regular.ttf' })

export { inter, lora, sourceCodePro400, sourceCodePro700, greatVibes }
```

----------------------------------------

TITLE: Enabling use cache in Next.js (JavaScript)
DESCRIPTION: Configures `next.config.js` to enable the experimental `useCache` feature by adding `useCache: true` to the `experimental` object. This step is required before the `use cache` directive can be used in your application.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/01-directives/use-cache.mdx#_snippet_1

LANGUAGE: JavaScript
CODE:
```
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    useCache: true,
  },
}

module.exports = nextConfig
```

----------------------------------------

TITLE: Applying Inter font globally in Next.js layout (TypeScript)
DESCRIPTION: This code snippet demonstrates how to import and apply the Inter font globally in a Next.js layout component using TypeScript. It imports the inter font from a local './fonts' module and applies its className to the html element.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/02-components/font.mdx#_snippet_28

LANGUAGE: tsx
CODE:
```
import { inter } from './fonts'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <div>{children}</div>
      </body>
    </html>
  )
}
```

----------------------------------------

TITLE: Setting fetch Revalidation Period (Next.js)
DESCRIPTION: Shows how to specify a time-based revalidation period (in seconds) for a specific fetch request using the `next.revalidate` option, which affects both Data and Full Route Caches.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/04-deep-dive/caching.mdx#_snippet_6

LANGUAGE: JSX
CODE:
```
fetch(`https://...`, { next: { revalidate: 3600 } })
```

----------------------------------------

TITLE: Creating Next.js App with Turbopack using pnpm
DESCRIPTION: Command to create a new Next.js application with Turbopack using pnpm's create-next-app utility. This bootstraps a project based on the with-turbopack example.
SOURCE: https://github.com/vercel/next.js/blob/canary/examples/with-turbopack/README.md#2025-04-21_snippet_2

LANGUAGE: bash
CODE:
```
pnpm create next-app --example with-turbopack with-turbopack-app
```

----------------------------------------

TITLE: Handling Form Submission Errors - TypeScript
DESCRIPTION: This code snippet demonstrates how to handle form submission errors in a Next.js component using TypeScript. It uses React state to track loading and error states and displays an error message to the user if the submission fails.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/02-pages/03-building-your-application/03-data-fetching/03-forms-and-mutations.mdx#_snippet_6

LANGUAGE: typescript
CODE:
```
import React, { useState, FormEvent } from 'react'

export default function Page() {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    setError(null) // Clear previous errors when a new request starts

    try {
      const formData = new FormData(event.currentTarget)
      const response = await fetch('/api/submit', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to submit the data. Please try again.')
      }

      // Handle response if necessary
      const data = await response.json()
      // ...
    } catch (error) {
      // Capture the error message to display to the user
      setError(error.message)
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <form onSubmit={onSubmit}>
        <input type="text" name="name" />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Submit'}
        </button>
      </form>
    </div>
  )
}
```

----------------------------------------

TITLE: Static Metadata Definition in TypeScript
DESCRIPTION: This example demonstrates how to define static metadata using a `Metadata` object in a TypeScript `layout.tsx` or `page.tsx` file. It exports a `metadata` constant with `title` and `description` properties.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/01-getting-started/10-metadata-and-og-images.mdx#_snippet_1

LANGUAGE: TypeScript
CODE:
```
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My Blog',
  description: '...',
}

export default function Page() {}
```

----------------------------------------

TITLE: Local Font src Configuration
DESCRIPTION: Configuring the `src` property for local fonts in Next.js. The `src` property specifies the path to the font file, either as a string or an array of objects with path, weight, and style properties. This example shows how to define the `src` property with multiple font files, each with different weights and styles.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/02-components/font.mdx#_snippet_3

LANGUAGE: javascript
CODE:
```
src:[{path: './inter/Inter-Thin.ttf', weight: '100',},{path: './inter/Inter-Regular.ttf',weight: '400',},{path: './inter/Inter-Bold-Italic.ttf', weight: '700',style: 'italic',},]
```

----------------------------------------

TITLE: Setting an absolute title in Next.js with TypeScript
DESCRIPTION: This code snippet shows how to use `title.absolute` to provide a title that ignores `title.template` set in parent segments in a Next.js application with TypeScript.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/04-functions/generate-metadata.mdx#_snippet_8

LANGUAGE: tsx
CODE:
```
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    absolute: 'About',
  },
}
```

----------------------------------------

TITLE: Defining Child Component with Shorter Cache Profile
DESCRIPTION: Shows a child component using a shorter 'hours' cache lifecycle, which will override the parent's longer cache duration
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/04-functions/cacheLife.mdx#2025-04-21_snippet_5

LANGUAGE: tsx
CODE:
```
// Child component
import { unstable_cacheLife as cacheLife } from 'next/cache'

export async function ChildComponent() {
  'use cache'
  cacheLife('hours')
  return <div>Child Content</div>

  // This component's cache will respect the shorter 'hours' profile
}
```

----------------------------------------

TITLE: Implementing Form with Navigation Blocker (TSX/JS)
DESCRIPTION: A simple form component that uses the `useNavigationBlocker` hook to access the `setIsBlocked` function. It sets `isBlocked` to `true` when the form input changes (simulating unsaved changes) and sets it back to `false` when the form is submitted.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/02-components/link.mdx#_snippet_24

LANGUAGE: tsx
CODE:
```
'use client';

import { useNavigationBlocker } from '../contexts/navigation-blocker';

export default function Form() {
  const { setIsBlocked } = useNavigationBlocker();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setIsBlocked(false);
      }}
      onChange={() => setIsBlocked(true)}
    >
      <input type="text" name="name" />
      <button type="submit">Save</button>
    </form>
  );
}
```

LANGUAGE: jsx
CODE:
```
'use client';

import { useNavigationBlocker } from '../contexts/navigation-blocker';

export default function Form() {
  const { setIsBlocked } = useNavigationBlocker();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setIsBlocked(false);
      }}
      onChange={() => setIsBlocked(true)}
    >
      <input type="text" name="name" />
      <button type="submit">Save</button>
    </form>
  );
}
```

----------------------------------------

TITLE: Customizing the preview link in WordPress admin (PHP)
DESCRIPTION: This code snippet customizes the preview button in the WordPress admin panel to point to a headless client setup. It modifies the preview link for a post to point to the Next.js frontend by appending a secret and the post ID as query parameters. It uses the `preview_post_link` filter, `HEADLESS_URL` and `HEADLESS_SECRET` constants are required to be defined.
SOURCE: https://github.com/vercel/next.js/blob/canary/examples/cms-wordpress/README.md#_snippet_8

LANGUAGE: PHP
CODE:
```
<?php
/**
 * Customize the preview button in the WordPress admin.
 *
 * This function modifies the preview link for a post to point to a headless client setup.
 *
 * @param string  $link Original WordPress preview link.
 * @param WP_Post $post Current post object.
 * @return string Modified headless preview link.
 */
add_filter( 'preview_post_link', 'set_headless_preview_link', 10, 2 );
function set_headless_preview_link( string $link, WP_Post $post ): string {
	// Set the front-end preview route.
  $frontendUrl = HEADLESS_URL;

	// Update the preview link in WordPress.
  return add_query_arg(
    [
      'secret' => HEADLESS_SECRET,
      'id' => $post->ID,
    ],
    esc_url_raw( esc_url_raw( "$frontendUrl/api/preview" ))
  );
}

```

----------------------------------------

TITLE: Generating Custom Build ID in next.config.js (JavaScript)
DESCRIPTION: Configures the `generateBuildId` function in `next.config.js` to return a consistent build ID. This is crucial for ensuring the same build artifact is used across multiple containers in self-hosted environments, typically by using an environment variable like a Git hash. Requires access to the `process.env` object.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/self-hosting.mdx#_snippet_4

LANGUAGE: JavaScript
CODE:
```
module.exports = {
  generateBuildId: async () => {
    // This could be anything, using the latest git hash
    return process.env.GIT_HASH
  },
}
```

----------------------------------------

TITLE: Import Tailwind CSS directives in Global Stylesheet (Pages Router)
DESCRIPTION: Add Tailwind CSS directives to the global stylesheet (styles/globals.css) to inject Tailwind's generated styles when using the Pages Router.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/tailwind-css.mdx#_snippet_5

LANGUAGE: css
CODE:
```
@import 'tailwindcss';
```

----------------------------------------

TITLE: Generating Sitemaps in JavaScript with Next.js
DESCRIPTION: This JavaScript snippet mirrors the TypeScript version to generate multiple sitemaps for product entries. It also uses a generateSitemaps function to handle sitemap ID generation and fetches products to build a detailed sitemap object. Key aspects include URL construction and adherence to a URL count per sitemap limit.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/04-functions/generate-sitemaps.mdx#2025-04-21_snippet_1

LANGUAGE: JavaScript
CODE:
```
import { BASE_URL } from '@/app/lib/constants'

export async function generateSitemaps() {
  // Fetch the total number of products and calculate the number of sitemaps needed
  return [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }]
}

export default async function sitemap({ id }) {
  // Google's limit is 50,000 URLs per sitemap
  const start = id * 50000
  const end = start + 50000
  const products = await getProducts(
    `SELECT id, date FROM products WHERE id BETWEEN ${start} AND ${end}`
  )
  return products.map((product) => ({
    url: `${BASE_URL}/product/${id}`,
    lastModified: product.date,
  }))
}
```

----------------------------------------

TITLE: Importing and Applying CSS Module in React (TypeScript)
DESCRIPTION: Imports a CSS module and applies the `.blog` class to a `<main>` element. This example uses TypeScript and React.ReactNode for type safety.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/01-getting-started/05-css.mdx#_snippet_1

LANGUAGE: TypeScript
CODE:
```
import styles from './styles.module.css'

export default function Page({ children }: { children: React.ReactNode }) {
  return <main className={styles.blog}>{children}</main>
}
```

----------------------------------------

TITLE: Interactive Next.js App Creation
DESCRIPTION: These commands demonstrate how to start the interactive project creation process using `create-next-app`.  The user is prompted to answer questions about project settings, such as whether to use TypeScript. The commands use different package managers: npm, yarn, pnpm and bun.
SOURCE: https://github.com/vercel/next.js/blob/canary/packages/create-next-app/README.md#2025-04-21_snippet_0

LANGUAGE: bash
CODE:
```
npx create-next-app@latest
# or
yarn create next-app
# or
pnpm create next-app
# or
bunx create-next-app
```

----------------------------------------

TITLE: Updating the Entrypoint Page to Use the Client-Only Component (TSX)
DESCRIPTION: This code snippet updates the entrypoint page to use the newly created client-only component. It imports the `ClientOnly` component from `./client` and renders it within the `Page` component.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/migrating/from-create-react-app.mdx#_snippet_17

LANGUAGE: tsx
CODE:
```
import { ClientOnly } from './client'

export function generateStaticParams() {
  return [{ slug: [''] }]
}

export default function Page() {
  return <ClientOnly />
}
```

----------------------------------------

TITLE: Generating Multiple Sitemaps with generateSitemaps (TypeScript)
DESCRIPTION: This TypeScript snippet demonstrates using the `generateSitemaps` function to return an array of objects, each containing an 'id'. These IDs are then used by the default `sitemap` function to fetch a specific segment of data (e.g., products) and generate corresponding sitemap entries for that segment.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/03-file-conventions/01-metadata/sitemap.mdx#_snippet_5

LANGUAGE: typescript
CODE:
```
import type { MetadataRoute } from 'next';
import { BASE_URL } from '@/app/lib/constants';

export async function generateSitemaps() {
  // Fetch the total number of products and calculate the number of sitemaps needed
  return [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }];
}

export default async function sitemap({
  id,
}: {
  id: number
}): Promise<MetadataRoute.Sitemap> {
  // Google's limit is 50,000 URLs per sitemap
  const start = id * 50000;
  const end = start + 50000;
  const products = await getProducts(
    `SELECT id, date FROM products WHERE id BETWEEN ${start} AND ${end}`
  );
  return products.map((product) => ({
    url: `${BASE_URL}/product/${product.id}`,
    lastModified: product.date,
  }));
}
```

----------------------------------------

TITLE: Setting the colorScheme in the viewport (JSX)
DESCRIPTION: This code snippet demonstrates setting the colorScheme property in the viewport using JavaScript. It exports a viewport object with the colorScheme set to 'dark'.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/04-functions/generate-viewport.mdx#_snippet_14

LANGUAGE: jsx
CODE:
```
export const viewport = {
  colorScheme: 'dark',
}
```

----------------------------------------

TITLE: Enabling TypedRoutes in Next.js Configuration
DESCRIPTION: This configuration enables experimental support for statically typed links in Next.js projects. This feature requires using the App Router and TypeScript in your project.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/05-config/01-next-config-js/typedRoutes.mdx#2025-04-21_snippet_0

LANGUAGE: javascript
CODE:
```
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    typedRoutes: true,
  },
}

module.exports = nextConfig
```

----------------------------------------

TITLE: Using history.replaceState for Path Changes Next.js TSX
DESCRIPTION: Illustrates using the native window.history.replaceState method in a TypeScript Client Component to change the URL path. It uses the usePathname hook to get the current path and replaces the history entry with a new path that includes a locale segment, useful for locale switching without adding to history.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-building-your-application/01-routing/04-linking-and-navigating.mdx#_snippet_8

LANGUAGE: tsx
CODE:
```
'use client'

import { usePathname } from 'next/navigation'

export function LocaleSwitcher() {
  const pathname = usePathname()

  function switchLocale(locale: string) {
    // e.g. '/en/about' or '/fr/contact'
    const newPath = `/${locale}${pathname}`
    window.history.replaceState(null, '', newPath)
  }

  return (
    <>
      <button onClick={() => switchLocale('en')}>English</button>
      <button onClick={() => switchLocale('fr')}>French</button>
    </>
  )
}
```

----------------------------------------

TITLE: Revalidating Cache by Path (Next.js)
DESCRIPTION: Demonstrates using the `revalidatePath` function to manually revalidate data and trigger a re-render of route segments below a specified path, purging Data and Full Route Caches.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/04-deep-dive/caching.mdx#_snippet_9

LANGUAGE: JSX
CODE:
```
revalidatePath('/')
```

----------------------------------------

TITLE: Configuring distDir in next.config.js
DESCRIPTION: This snippet configures the `distDir` option in `next.config.js`. It sets the build directory to 'build' instead of the default '.next' folder. The `module.exports` object is used to export the configuration.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/05-config/01-next-config-js/distDir.mdx#2025-04-21_snippet_0

LANGUAGE: javascript
CODE:
```
module.exports = {
  distDir: 'build',
}
```

----------------------------------------

TITLE: Setting Custom Build Directory in Next.js - JavaScript
DESCRIPTION: This snippet configures the Next.js build process to use a custom directory for generated files instead of the default `.next`. The `distDir` option is set within the `next.config.js` file.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/02-pages/04-api-reference/04-config/01-next-config-js/distDir.mdx#2025-04-21_snippet_0

LANGUAGE: JavaScript
CODE:
```
module.exports = {
  distDir: 'build',
};
```

----------------------------------------

TITLE: Invoking Server Functions in Event Handlers with JavaScript
DESCRIPTION: Demonstrates calling a Server Function from an onClick event handler in a JavaScript Client Component. The component updates local state with the value returned from the Server Function.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/01-getting-started/07-updating-data.mdx#2025-04-21_snippet_13

LANGUAGE: javascript
CODE:
```
'use client'

import { incrementLike } from './actions'
import { useState } from 'react'

export default function LikeButton({ initialLikes }) {
  const [likes, setLikes] = useState(initialLikes)

  return (
    <>
      <p>Total Likes: {likes}</p>
      <button
        onClick={async () => {
          const updatedLikes = await incrementLike()
          setLikes(updatedLikes)
        }}
      >
        Like
      </button>
    </>
  )
}
```

----------------------------------------

TITLE: Using next/head in pages directory (JavaScript)
DESCRIPTION: This code snippet shows how to use the next/head component in the pages directory to manage HTML elements in the <head> section of a page. It imports the Head component from 'next/head' and uses it to set the title of the page.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/migrating/app-router-migration.mdx#_snippet_15

LANGUAGE: jsx
CODE:
```
import Head from 'next/head'

export default function Page() {
  return (
    <>
      <Head>
        <title>My page title</title>
      </Head>
    </>
  )
}
```

----------------------------------------

TITLE: Including Non-Page Files in Pages Directory (Pages Router)
DESCRIPTION: This code snippet demonstrates how to configure `pageExtensions` in `next.config.js` to allow colocating non-page files, like test files, in the `pages` directory in the Pages Router.  It requires renaming pages to include `.page` in the extension (e.g., `MyPage.tsx` becomes `MyPage.page.tsx`).  All relevant Next.js pages need to be renamed accordingly.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/05-config/01-next-config-js/pageExtensions.mdx#_snippet_2

LANGUAGE: javascript
CODE:
```
module.exports = {
  pageExtensions: ['page.tsx', 'page.ts', 'page.jsx', 'page.js'],
}
```

----------------------------------------

TITLE: Replacing `@next/font` Imports in JavaScript Applications
DESCRIPTION: This simple code change focuses on updating import paths from the deprecated `@next/font` to the new `next/font`, reflecting changes in the Next.js framework. This ensures continued functionality and access to the latest features provided by Next.js without breaking existing imports.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/upgrading/version-15.mdx#2025-04-21_snippet_13

LANGUAGE: js
CODE:
```
// Before\nimport { Inter } from '@next/font/google'\n\n// After\nimport { Inter } from 'next/font/google'
```

----------------------------------------

TITLE: Embedding YouTube Videos with Next.js
DESCRIPTION: This snippet shows how to embed a YouTube video in a Next.js page. It uses the `YouTubeEmbed` component from `@next/third-parties/google`, which utilizes `lite-youtube-embed` for faster loading. The `videoid` prop is required, and additional parameters like height and video player parameters can be specified.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/third-party-libraries.mdx#_snippet_16

LANGUAGE: jsx
CODE:
```
import { YouTubeEmbed } from '@next/third-parties/google'

export default function Page() {
  return <YouTubeEmbed videoid="ogfYd705cRs" height={400} params="controls=0" />
}
```

----------------------------------------

TITLE: Specifying Node.js Runtime in Next.js Middleware Config (TS)
DESCRIPTION: Specifies the Node.js runtime for the Next.js middleware by exporting a `config` object with the `runtime` property set to `'nodejs'` in the `middleware.ts` file. This must be used in conjunction with enabling `nodeMiddleware: true` in `next.config.js/ts`.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-building-your-application/01-routing/14-middleware.mdx#_snippet_22

LANGUAGE: typescript
CODE:
```
export const config = {
  runtime: 'nodejs',
}
```

----------------------------------------

TITLE: Applying React Taint APIs to Sensitive Data (TS)
DESCRIPTION: Demonstrates how to use `experimental_taintObjectReference` and `experimental_taintUniqueValue` within a server-side data fetching utility (`getUserData`). These functions mark data, or specific values within it, as 'tainted' with a message, causing an error if they are later passed to a client component.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/03-building-your-application/02-data-fetching/01-fetching.mdx#_snippet_13

LANGUAGE: TS
CODE:
```
import { queryDataFromDB } from './api'
import {
  experimental_taintObjectReference,
  experimental_taintUniqueValue,
} from 'react'

export async function getUserData() {
  const data = await queryDataFromDB()
  experimental_taintObjectReference(
    'Do not pass the whole user object to the client',
    data
  )
  experimental_taintUniqueValue(
    "Do not pass the user's address to the client",
    data,
    data.address
  )
  return data
}
```

LANGUAGE: JS
CODE:
```
import { queryDataFromDB } from './api'
import {
  experimental_taintObjectReference,
  experimental_taintUniqueValue,
} from 'react'

export async function getUserData() {
  const data = await queryDataFromDB()
  experimental_taintObjectReference(
    'Do not pass the whole user object to the client',
    data
  )
  experimental_taintUniqueValue(
    "Do not pass the user's address to the client",
    data,
    data.address
  )
  return data
}
```

----------------------------------------

TITLE: Form Component Usage in Pages Directory (TypeScript)
DESCRIPTION: Shows how to implement the Next.js Form component in the pages directory structure using TypeScript. The form redirects to a search page with query parameters on submission.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/02-components/form.mdx#2025-04-21_snippet_2

LANGUAGE: tsx
CODE:
```
import Form from 'next/form'

export default function Page() {
  return (
    <Form action="/search">
      {/* On submission, the input value will be appended to
          the URL, e.g. /search?query=abc */}
      <input name="query" />
      <button type="submit">Submit</button>
    </Form>
  )
}
```

----------------------------------------

TITLE: Mutations with Server Actions (typescript)
DESCRIPTION: This snippet demonstrates how to use the `forbidden` function to protect mutations in a Server Action based on user roles. It verifies the user's session, checks if they have the 'admin' role, and calls `forbidden()` if they don't, preventing unauthorized data updates. It assumes that `verifySession` retrieves the user's session and role information.
SOURCE: https://github.com/vercel/next.js/blob/canary/docs/01-app/05-api-reference/04-functions/forbidden.mdx#2025-04-21_snippet_6

LANGUAGE: typescript
CODE:
```
'use server'

import { verifySession } from '@/app/lib/dal'
import { forbidden } from 'next/navigation'
import db from '@/app/lib/db'

export async function updateRole(formData: FormData) {
  const session = await verifySession()

  // Ensure only admins can update roles
  if (session.role !== 'admin') {
    forbidden()
  }

  // Perform the role update for authorized users
  // ...
}
```