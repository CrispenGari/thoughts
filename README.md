# thoughts

💭 this is a simple mobile social app for sharing thoughts with your contact friends.

### Idea

### Implementation

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

### Storage

In this project we are storing the images which are the profile avatar to the server in the `packages/api/storage/image` folder. These images are uploaded to the server by sending a `POST` request at `/api/upload/images` with an image file. We are not storing the whole image path in the database we are storing the relative path to the server for example if the image url is `http://localhost:3001/api/storage/images/0f5feb01-8a2b-469f-b613-999886ad95bd.jpg` in the database we are going to store the path `/api/storage/images/0f5feb01-8a2b-469f-b613-999886ad95bd.jpg` in the `avatar` field.
