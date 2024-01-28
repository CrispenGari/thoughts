### thoughts

💭 this is a simple mobile social app for sharing thoughts with your contact friends.

<p align="center"><img src="logo.png" alt="logo" width="200"/></p>

### Core Screens UI

The following are the core screens UI for the app functionality.

<p align="center">
<img src="/images/0.jpeg" alt="logo" width="200"/>
<img src="/images/1.jpeg" alt="logo" width="200"/>
<img src="/images/2.jpeg" alt="logo" width="200"/>
<img src="/images/4.jpeg" alt="logo" width="200"/>
</p>

### Idea

Just like whatsapp statuses or to be more specific facebook messenger thoughts this app is implemented for users to share thoughts as statuses among their contacts. In this app users are able to perform the following actions:

1. Authenticate to use the service
2. Create profile for themselves
3. Delete their account when tired
4. Share thoughts with contacts
5. Delete and edit their thoughts
6. See the thoughts of their contacts
7. Comment, Respond and React to comments and comment replies
8. Delete and update comments
9. Block Contact on this app
10. Change settings
11. Report issues and bugs associated with this app.
12. Get notifications
13. Profile updates
14. Phone number updates
15. Pin Management
16. In App Payments

> Note: **The idea of this app is to improve user interactivity in the social-media space so that people won't get depressed or bored while they can be locked in on this social media platform.**

### Implementation

In this app a mobile application will be created that will be consuming a `trpc` api. Mono-repo approach is going to be used using `yarn-workspaces`. We are going to have `2` packages for this project located in the `packages/` folder which are:

1. `client` - react-native mobile app
2. `api` - `trpc` server api.

### Techs

The following technologies were used in this app:

1. `react-native (Expo)`
2. `tRPC`
3. `yarn-workspaces`
4. `fastify`
5. `stripe`

### Tools

The following tools were used to develop this app:

1. NodeJS

### Programming languages

In this project we are using `TypeScript` as a programming language

#### Authentication

In this project we are using `jwt` authentication tokens and store the `id` and the `tokenVersion` in the `jwt` token which will be passed to the server in the `authorization` header to check if the user is `authenticated`. We check if the user is logged in based on the `tokenVersion` which is generated everytime when the auth-state change, in operations like `login`, `register` and `logout`. This is done for security reasons which are:

1. The token can only be used once
2. The token can expire

> Note: This token is a random generated number between `1` and `10M` and it is generated using the `crypto` as follows:

```ts
const newToken = crypto.randomInt(1, 10_000_000);
```

So for security reasons we authorize the user if only their `id` and `tokenVersion` that we have in the database matches the one that are in the `jwt-token`. Here is the snippet of code that checks if the user is logged in by returning the `user-object` or `null`

```ts
const getMe = async (jwt: string | undefined): Promise<UserType | null> => {
  if (!!!jwt) return null;
  try {
    const { id, tokenVersion } = await verifyJwt(jwt);
    const me = await User.findByPk(id, { include: ["country"] });
    if (!!!me) return null;
    const _me = me.toJSON();
    if (_me.tokenVersion !== tokenVersion) return null;
    return _me;
  } catch (error) {
    return null;
  }
};
```

The users are authenticated using `pin` and `phoneNumber`. The `pin` is a `5` digit security code that the user sets on his/her account when registering with his/her phone number. We store the `country` object in the `user` this allows us to track which country is our user registering from also helps us to validate the phone number based on `country-codes`.

Optionally upon registration users can set their `avatar`, in the profile `page`. They are required to set their name which is not required to be `unique`. The name must contain at least `3` characters.

> Note that the users that have their account setup they can login with any device at any time. Now this is where the tokenVersion come to play. When you login on another version of phone we will have to update the `tokenVersion` meaning that the only device that will have access to your account is the current device.

#### Database and Associations

In this project the `postgres` database is used to store all the data of the app. The following models were created and their associations were mapped.

1. `User`
   - A user has 1 `thought`
   - A user has many `notifications`
   - A user has many `votes`
   - A user can make many `payments`
   - A user has many `comments`
   - A user has many `replies`
   - A user has many `blocked` contacts
   - A user belongs to 1 `country`
   - A user has a single instance of `settings`
2. `Thought`
   - A thought has a `1` to `1` relationship with the user
   - A thought has many comments
3. `Vote`
   - A vote has a `N` to `1` relationship with the user
   - 1 vote belongs to a single instance of a `reply`
   - 1 vote belongs to a single instance of a `comment`
4. `Comment`
   - A comment has a `N` to `1` relationship with the user
   - A comment has many `votes`
   - A comment has many `replies`
5. `Reply`
   - A reply have a `N` to `1` relationship with the `user`.
   - A reply belongs to a single `comment`
   - A reply has many `votes`
   -
6. `Payment`
   - A payment have a `1` to `N` relationship with the `user`.
7. `Notification`
   - A notification have a `1` to `N` relationship with the `user`.
   -
8. `Setting`
   - A setting model have a `1` to `1` relationship with the `user`.
9. `Country`
   - A country have a `1` to `1` relationship with the `user`.
10. `Blocked`
    - A blocked have a `1` to `N` relationship with the `user`.

### Storage

In this project we are storing the images which are the profile avatar to the server in the `packages/api/storage/image` folder. These images are uploaded to the server by sending a `POST` request at `/api/upload/images` with an image file. We are not storing the whole image path in the database we are storing the relative path to the server for example if the image url is `http://localhost:3001/api/storage/images/0f5feb01-8a2b-469f-b613-999886ad95bd.jpg` in the database we are going to store the path `/api/storage/images/0f5feb01-8a2b-469f-b613-999886ad95bd.jpg` in the `avatar` field.

### Real time

In this simple app we are using realtime websocket for:

1. notifications
2. real-time updates on:
   1. reactions
   2. comments
   3. profile updates
   4. replies
   5. e.t.c

### What if the user forgot his/her pin?

Upon authentication when you try to login with invalid pin number for `4` times you get blocked for that operation. However if you remember your `passkey` which is the backup plan for restoring pin codes you can change it by clicking the `Forgot Pin?` link in the login.

### Testing the App

> Make sure that you have the following softwares before testing this app locally:

1. `Nodejs`
2. `Git`
3. `Postgres`

To test the app locally first you need to clone this repository by running the following command:

```shell
git clone https://github.com/CrispenGari/thoughts
# then
cd thoughts
```

Navigate to each package in a different terminal by running the following commands:

```shell
cd packages/api

# on another on
cd packages/client
```

Install the packages for the `client` and `api` packages by running the following commands:

```shell
yarn
# on another one
yarn
```

You can then start the `client` and the `api` development server by running the following separate commands:

```shell
yarn start
# on another one
yarn start
```

OR you can run the concurrently by navigating back to the root folder of the project and run:

```shell
yarn start
```

When the api server starts you will see the logs that looks as follows:

```shell
Local: http://127.0.0.1:3001/
Network: http://192.168.0.29:3001/
```

> Copy the part that says: `192.168.0.29:3001` navigate to the `packages/client/src/constants/index.ts` and change the domain to that value

```ts
export const domain = "192.168.0.29:3001" as const;
```

However you will need some environmental variables for this to work, navigate to the `packages/api/.env` file and make sure that you have the following environmental variables in place:

```shell
#postgres
PG_USER = YOURS
PG_PASS = YOURS

# node
NODE_ENV = "production"

# stripe
STRIPE_SECRETE_KEY = YOURS
STRIPE_API_VERSION = YOURS

# jwt
JWT_SECRETE = YOURS
```

With all this in place you are good to go you can download `Expo Go` and test the app locally or you can start the app on an emulator.

### LICENSE

THIS PROJECT IS USING THE [`MIT`](/LICENSE) WHICH READS AS FOLLOWS:

```txt
MIT License

Copyright (c) 2024 crispengari

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

```
