# create-svelte

Everything you need to do to hookup a Sveltekit demo app todo page to AWS Amplify-AppSync-GraphQL CRUD backend.

Not using Amplify authentication to keep it as simple as possible.

Contains a few tips to get beyond some errors en route.

Original implementation of Amplify and Svelte todo by swyx.

https://www.youtube.com/watch?v=hCoRYc_FzK0&t=769s&ab_channel=swyx

## Create demo Sveltekit app

npm init svelte@next my-app

select 'demo app' not 'skeleton'

no typescript
yes eslint
yes prettier

cd my-app
npm install
npm install aws-amplify
npm run dev

update app.html (important. avoid sveltekit & amplify errors!)
update svelte.config.js (adding handy aliases)

## Create Amplify-Appsync-GraphQL backend

You need to do some prelimary setting up, namely install amplify cli, configure profile following official amplify guide.

then in project root

amplify init (select all the defaults)

amplify add api (mainly defaults)

? Select from one of the below mentioned services: GraphQL
? Choose a schema template: Single object with fields (e.g., “Todo” with ID, name, description)
? Do you want to edit the schema now? Yes

You need to update field to schema here to:

type Todo @model {
id: ID!
description: String!
done: Boolean!
}

then...

amplify push

You may encounter an error at this stage.

An error occurred during the push operation: require() of ES Module /Users/s/code/src/github/svelte/amp-project/src/aws-exports.js not supported.
Instead change the require of aws-exports.js in null to a dynamic import() which is available in all CommonJS modules.

To get beyond this error...

amplify pull

rename aws-exports.js to aws-exports.cjs

amplify pull (again)

delete aws-exports.cjs

keep aws-exports.js

Once sorted aws-exports.js should contain something similar to ..

const awsmobile = {
"aws_project_region": "eu-west-1",
"aws_appsync_graphqlEndpoint": "https://qwertyqwertyqwertyqwerty.appsync-api.eu-west-1.amazonaws.com/graphql",
"aws_appsync_region": "eu-west-1",
"aws_appsync_authenticationType": "API_KEY",
"aws_appsync_apiKey": "qwertyqwertyqwertyqwerty"
};

npm run dev (just to make sure all is okay).

## Code to connect frontend to backend

The todos page on the Sveltekit demo showcases api usage with cookies, hooks.js etc.., We need something slightly simpler so I copied over the 'todo' page from the official svelte example page.

Update /src/routes/todos/index.svelte to https://svelte.dev/examples#animate.

Try adding the GraphQL CRUD calls yourself.

The /src/routes/todos/index.svelte is a working edition of this page with GraphQL calls added.

## To be added

I haven't deployed the frontend to amplify yet. Only tested with 'npm run dev so far.
