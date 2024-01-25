
  // types for your environmental variables
  declare namespace NodeJS {
    export interface ProcessEnv {
      NODE_ENV : string;
			STRIPE_SECRETE_KEY : string;
			STRIPE_API_VERSION : string;
			JWT_SECRETE : string;

    }
  }
  