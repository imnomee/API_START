#### Setup Server

npm init -y
node index

-   to make the server use import instead of require
-   in the package.json add

"type": "module",

-   don't forget about .js extension
-   for named imports, names must match

#### Source Control

-   create .gitignore
-   create Github Repo (optional)

#### Setup Basic Express

```sh
npm i express
```

-   install express
-   setup a basic server which listening on PORT=5100
-   create a basic home route which sends back "hello world"

[Express Docs](https://expressjs.com/)

```js
import express from 'express';
const app = express();

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.listen(5100, () => {
    console.log('server running....');
});
```

package.json

```json
"scripts": {
    "dev": "nodemon index.js"
  },
```

#### Accept JSON

Setup express middleware to accept json

index.js

```js
app.use(express.json());
```

#### Thunder Client

[Thunder Client](https://www.thunderclient.com/)

-   install and test home route

index.js

```js
app.post('/', (req, res) => {
    console.log(req);

    res.json({ message: 'Data received', data: req.body });
});
```

#### Morgan and Dotenv

[Morgan](https://www.npmjs.com/package/morgan)

HTTP request logger middleware for node.js

[Dotenv](https://www.npmjs.com/package/dotenv)

Dotenv is a zero-dependency module that loads environment variables from a .env file into process.env.

```sh
npm i morgan@1.10.0 dotenv@16.0.3
```

```js
import morgan from 'morgan';

app.use(morgan('dev'));
```

-   create .env file in the root
-   add PORT and NODE_ENV
-   add .env to .gitignore

index.js

```js
import * as dotenv from 'dotenv';
dotenv.config();

const port = process.env.PORT || 5100;
app.listen(port, () => {
    console.log(`server running on PORT ${port}....`);
});
```

#### Basic CRUD

-   create jobs array where each item is an object with following properties
    id, company, position
-   create routes to handle - create, read, update and delete functionalities

#### Get All Jobs

[Nanoid](https://www.npmjs.com/package/nanoid)

The nanoid package is a software library used for generating unique and compact identifiers in web applications or databases. It creates short and URL-safe IDs by combining random characters from a set of 64 characters. Nanoid is a popular choice due to its simplicity, efficiency, and collision-resistant nature.

```sh
npm i nanoid@4.0.2
```

index.js

```js
import { nanoid } from 'nanoid';

let jobs = [
    { id: nanoid(), company: 'apple', position: 'front-end' },
    { id: nanoid(), company: 'google', position: 'back-end' },
];

app.get('/api/v1/jobs', (req, res) => {
    res.status(200).json({ jobs });
});
```

#### Create, FindOne, Modify and Delete

```js
// CREATE JOB

app.post('/api/v1/jobs', (req, res) => {
    const { company, position } = req.body;
    if (!company || !position) {
        return res
            .status(400)
            .json({ msg: 'please provide company and position' });
    }
    const id = nanoid(10);
    // console.log(id);
    const job = { id, company, position };
    jobs.push(job);
    res.status(200).json({ job });
});

// GET SINGLE JOB

app.get('/api/v1/jobs/:id', (req, res) => {
    const { id } = req.params;
    const job = jobs.find((job) => job.id === id);
    if (!job) {
        return res.status(404).json({ msg: `no job with id ${id}` });
    }
    res.status(200).json({ job });
});

// EDIT JOB

app.patch('/api/v1/jobs/:id', (req, res) => {
    const { company, position } = req.body;
    if (!company || !position) {
        return res
            .status(400)
            .json({ msg: 'please provide company and position' });
    }
    const { id } = req.params;
    const job = jobs.find((job) => job.id === id);
    if (!job) {
        return res.status(404).json({ msg: `no job with id ${id}` });
    }

    job.company = company;
    job.position = position;
    res.status(200).json({ msg: 'job modified', job });
});

// DELETE JOB

app.delete('/api/v1/jobs/:id', (req, res) => {
    const { id } = req.params;
    const job = jobs.find((job) => job.id === id);
    if (!job) {
        return res.status(404).json({ msg: `no job with id ${id}` });
    }
    const newJobs = jobs.filter((job) => job.id !== id);
    jobs = newJobs;

    res.status(200).json({ msg: 'job deleted' });
});
```

#### Filteration

```js
//first we build the query
//1. filtering
//the params passed in url for query
const queryObj = { ...req.query };
const excludedFields = ['page', 'sort', 'limit', 'fields']; //we don't want these fields
excludedFields.forEach((el) => delete queryObj(el));

//2. advance filtering
const queryString = JSON.stringify(queryObj);

const query = Job.find(queryObj);

//execute the query
const jobs = await query;

//send response
```

#### Not Found Middleware

```js
app.use('*', (req, res) => {
    res.status(404).json({ msg: 'not found' });
});
```

#### Error Middleware

```js
app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).json({ msg: 'something went wrong' });
});
```

#### Not Found and Error Middleware

The "not found" middleware in Express.js is used when a request is made to a route that does not exist. It catches these requests and responds with a 404 status code, indicating that the requested resource was not found.

On the other hand, the "error" middleware in Express.js is used to handle any errors that occur during the processing of a request. It is typically used to catch unexpected errors or exceptions that are not explicitly handled in the application code. It logs the error and sends a 500 status code, indicating an internal server error.

In summary, the "not found" middleware is specifically designed to handle requests for non-existent routes, while the "error" middleware is a catch-all for handling unexpected errors that occur during request processing.

-   make a request to "/jobss"

```js
// GET ALL JOBS
app.get('/api/v1/jobs', (req, res) => {
    // console.log(jobss);
    res.status(200).json({ jobs });
});

// GET SINGLE JOB
app.get('/api/v1/jobs/:id', (req, res) => {
    const { id } = req.params;
    const job = jobs.find((job) => job.id === id);
    if (!job) {
        throw new Error('no job with that id');
        return res.status(404).json({ msg: `no job with id ${id}` });
    }
    res.status(200).json({ job });
});
```

#### Controller and Router

setup controllers and router

controllers/jobController.js

```js
import { nanoid } from 'nanoid';

export const getAllJobs = async (req, res) => {
    res.status(200).json({ jobs });
};
```

routes/jobRouter.js

```js
import { Router } from 'express';
const router = Router();

export default router;
```

index.js

```js
import jobRouter from './routers/jobRouter.js';
app.use('/api/v1/jobs', jobRouter);
```

#### MongoDB

[MongoDb](https://www.mongodb.com/)

#### Mongoosejs

[Mongoose](https://mongoosejs.com/)

Mongoose is an Object Data Modeling (ODM) library for Node.js that provides a straightforward and elegant way to interact with MongoDB. It allows developers to define schemas and models for their data, providing structure and validation. Mongoose also offers features like data querying, middleware, and support for data relationships, making it a powerful tool for building MongoDB-based applications.

```sh
npm i mongoose@7.0.5
```

index.js

```js
import mongoose from 'mongoose';

try {
    await mongoose.connect(process.env.MONGO_URL);
    app.listen(port, () => {
        console.log(`server running on PORT ${port}....`);
    });
} catch (error) {
    console.log(error);
    process.exit(1);
}
```

#### Job Model

models/JobModel.js

enum - data type represents a field with a predefined set of values

```js
import mongoose from 'mongoose';

const JobSchema = new mongoose.Schema(
    {
        company: String,
        position: String,
        jobStatus: {
            type: String,
            enum: ['interview', 'declined', 'pending'],
            default: 'pending',
        },
        jobType: {
            type: String,
            enum: ['full-time', 'part-time', 'internship'],
            default: 'full-time',
        },
        jobLocation: {
            type: String,
            default: 'my city',
        },
    },
    { timestamps: true }
);

export default mongoose.model('Job', JobSchema);
```

#### Create Job

jobController.js

```js
import Job from '../models/JobModel.js';

export const createJob = async (req, res) => {
    const { company, position } = req.body;
    const job = await Job.create({ company, position });
    res.status(201).json({ job });
};
```

#### Try / Catch

jobController.js

```js
export const createJob = async (req, res) => {
    const { company, position } = req.body;
    try {
        const job = await Job.create('something');
        res.status(201).json({ job });
    } catch (error) {
        res.status(500).json({ msg: 'server error' });
    }
};
```

#### express-async-errors

The "express-async-errors" package is an Express.js middleware that helps handle errors that occur within asynchronous functions. It catches unhandled errors inside async/await functions and forwards them to Express.js's error handling middleware, preventing the Node.js process from crashing. It simplifies error handling in Express.js applications by allowing you to write asynchronous code without worrying about manually catching and forwarding errors.

[Express Async Errors](https://www.npmjs.com/package/express-async-errors)

```sh
npm i express-async-errors@3.1.1
```

-   setup import at the top !!!

    server.js

```js
import 'express-async-errors';
```

jobController.js

```js
export const createJob = async (req, res) => {
    const { company, position } = req.body;

    const job = await Job.create({ company, position });
    res.status(201).json({ job });
};
```

#### Get All Jobs

jobController.js

```js
export const getAllJobs = async (req, res) => {
    const jobs = await Job.find({});
    res.status(200).json({ jobs });
};
```

#### Get Single Job

```js
export const getJob = async (req, res) => {
    const { id } = req.params;
    const job = await Job.findById(id);
    if (!job) {
        return res.status(404).json({ msg: `no job with id ${id}` });
    }
    res.status(200).json({ job });
};
```

#### Delete Job

jobController.js

```js
export const deleteJob = async (req, res) => {
    const { id } = req.params;
    const removedJob = await Job.findByIdAndDelete(id);

    if (!removedJob) {
        return res.status(404).json({ msg: `no job with id ${id}` });
    }
    res.status(200).json({ job: removedJob });
};
```

#### Update Job

```js
export const updateJob = async (req, res) => {
    const { id } = req.params;

    const updatedJob = await Job.findByIdAndUpdate(id, req.body, {
        new: true,
    });

    if (!updatedJob) {
        return res.status(404).json({ msg: `no job with id ${id}` });
    }

    res.status(200).json({ job: updatedJob });
};
```

#### Status Codes

[Http Status Codes](https://www.npmjs.com/package/http-status-codes)

```sh
npm i http-status-codes@2.2.0

```

200 OK OK
201 CREATED Created

400 BAD_REQUEST Bad Request
401 UNAUTHORIZED Unauthorized

403 FORBIDDEN Forbidden
404 NOT_FOUND Not Found

500 INTERNAL_SERVER_ERROR Internal Server Error

-   refactor 200 response in all controllers

jobController.js

```js
res.status(StatusCodes.OK).json({ jobs });
```

createJob

```js
res.status(StatusCodes.CREATED).json({ job });
```

#### Custom Error Class

jobController

```js
export const getJob = async (req, res) => {
  ....
  if (!job) {
    throw new Error('no job with that id');
    // return res.status(404).json({ msg: `no job with id ${id}` });
  }
  ...
};

```

errors/customErrors.js

```js
import { StatusCodes } from 'http-status-codes';
export class NotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = 'NotFoundError';
        this.statusCode = StatusCodes.NOT_FOUND;
    }
}
```

#### Custom Error

jobController.js

```js
import { NotFoundError } from '../customErrors.js';

if (!job) throw new NotFoundError(`no job with id : ${id}`);
```

middleware/errorHandlerMiddleware.js

```js
import { StatusCodes } from 'http-status-codes';
const errorHandlerMiddleware = (err, req, res, next) => {
    console.log(err);
    const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
    const msg = err.message || 'Something went wrong, try again later';

    res.status(statusCode).json({ msg });
};

export default errorHandlerMiddleware;
```

index.js

```js
import errorHandlerMiddleware from './middleware/errorHandlerMiddleware.js';

app.use(errorHandlerMiddleware);
```

#### Bad Request Error

400 BAD_REQUEST Bad Request
401 UNAUTHORIZED Unauthorized
403 FORBIDDEN Forbidden
404 NOT_FOUND Not Found

customErrors.js

```js
export class BadRequestError extends Error {
    constructor(message) {
        super(message);
        this.name = 'BadRequestError';
        this.statusCode = StatusCodes.BAD_REQUEST;
    }
}
export class UnauthenticatedError extends Error {
    constructor(message) {
        super(message);
        this.name = 'UnauthenticatedError';
        this.statusCode = StatusCodes.UNAUTHORIZED;
    }
}
export class UnauthorizedError extends Error {
    constructor(message) {
        super(message);
        this.name = 'UnauthorizedError';
        this.statusCode = StatusCodes.FORBIDDEN;
    }
}
```

#### Validation Layer

[Express Validator](https://express-validator.github.io/docs/)

```sh
npm i express-validator@7.0.1
```

#### Test Route

server.js

```js
app.post('/api/v1/test', (req, res) => {
    const { name } = req.body;
    res.json({ msg: `hello ${name}` });
});
```

#### Express Validator

```js
import { body, validationResult } from 'express-validator';

app.post(
    '/api/v1/test',
    [body('name').notEmpty().withMessage('name is required')],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorMessages = errors.array().map((error) => error.msg);
            return res.status(400).json({ errors: errorMessages });
        }
        next();
    },
    (req, res) => {
        const { name } = req.body;
        res.json({ msg: `hello ${name}` });
    }
);
```

#### Validation Middleware

middleware/validationMiddleware.js

```js
import { body, validationResult } from 'express-validator';
import { BadRequestError } from '../errors/customErrors';
const withValidationErrors = (validateValues) => {
    return [
        validateValues,
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                const errorMessages = errors.array().map((error) => error.msg);
                throw new BadRequestError(errorMessages);
            }
            next();
        },
    ];
};

export const validateTest = withValidationErrors([
    body('name')
        .notEmpty()
        .withMessage('name is required')
        .isLength({ min: 3, max: 50 })
        .withMessage('name must be between 3 and 50 characters long')
        .trim(),
]);
```

#### Remove Test Case From Server

#### Setup Constants

utils/constants.js

```js
export const JOB_STATUS = {
    PENDING: 'pending',
    INTERVIEW: 'interview',
    DECLINED: 'declined',
};

export const JOB_TYPE = {
    FULL_TIME: 'full-time',
    PART_TIME: 'part-time',
    INTERNSHIP: 'internship',
};

export const JOB_SORT_BY = {
    NEWEST_FIRST: 'newest',
    OLDEST_FIRST: 'oldest',
    ASCENDING: 'a-z',
    DESCENDING: 'z-a',
};
```

models/JobModel.js

```js
import mongoose from 'mongoose';
import { JOB_STATUS, JOB_TYPE } from '../utils/constants';
const JobSchema = new mongoose.Schema(
    {
        company: String,
        position: String,
        jobStatus: {
            type: String,
            enum: Object.values(JOB_STATUS),
            default: JOB_STATUS.PENDING,
        },
        jobType: {
            type: String,
            enum: Object.values(JOB_TYPE),
            default: JOB_TYPE.FULL_TIME,
        },
        jobLocation: {
            type: String,
            default: 'my city',
        },
    },
    { timestamps: true }
);
```

#### Validate Create Job

validationMiddleware.js

```js
import { JOB_STATUS, JOB_TYPE } from '../utils/constants.js';

export const validateJobInput = withValidationErrors([
    body('company').notEmpty().withMessage('company is required'),
    body('position').notEmpty().withMessage('position is required'),
    body('jobLocation').notEmpty().withMessage('job location is required'),
    body('jobStatus')
        .isIn(Object.values(JOB_STATUS))
        .withMessage('invalid status value'),
    body('jobType')
        .isIn(Object.values(JOB_TYPE))
        .withMessage('invalid job type'),
]);
```

```js
import { validateJobInput } from '../middleware/validationMiddleware.js';

router.route('/').get(getAllJobs).post(validateJobInput, createJob);
router
    .route('/:id')
    .get(getJob)
    .patch(validateJobInput, updateJob)
    .delete(deleteJob);
```

-   create job request

```json
{
    "company": "coding addict",
    "position": "backend-end",
    "jobStatus": "pending",
    "jobType": "full-time",
    "jobLocation": "florida"
}
```

#### Validate ID Parameter

validationMiddleware.js

```js
import mongoose from 'mongoose';

import { param } from 'express-validator';

export const validateIdParam = withValidationErrors([
    param('id')
        .custom((value) => mongoose.Types.ObjectId.isValid(value))
        .withMessage('invalid MongoDB id'),
]);
```

```js
export const validateIdParam = withValidationErrors([
    param('id').custom(async (value) => {
        const isValidId = mongoose.Types.ObjectId.isValid(value);
        if (!isValidId) throw new BadRequestError('invalid MongoDB id');
        const job = await Job.findById(value);
        if (!job) throw new NotFoundError(`no job with id : ${value}`);
    }),
]);
```

```js
import { body, param, validationResult } from 'express-validator';
import { BadRequestError, NotFoundError } from '../errors/customErrors.js';
import { JOB_STATUS, JOB_TYPE } from '../utils/constants.js';
import mongoose from 'mongoose';
import Job from '../models/JobModel.js';

const withValidationErrors = (validateValues) => {
    return [
        validateValues,
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                const errorMessages = errors.array().map((error) => error.msg);
                if (errorMessages[0].startsWith('no job')) {
                    throw new NotFoundError(errorMessages);
                }
                throw new BadRequestError(errorMessages);
            }
            next();
        },
    ];
};
```

-   remove NotFoundError from getJob, updateJob, deleteJob controllers

#### Clean DB

#### User Model

models/UserModel.js

```js
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    lastName: {
        type: String,
        default: 'lastName',
    },
    location: {
        type: String,
        default: 'my city',
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
});

export default mongoose.model('User', UserSchema);
```

#### User Controller and Router

controllers/authController.js

```js
export const register = async (req, res) => {
    res.send('register');
};
export const login = async (req, res) => {
    res.send('register');
};
```

routers/authRouter.js

```js
import { Router } from 'express';
import { register, login } from '../controllers/authController.js';
const router = Router();

router.post('/register', register);
router.post('/login', login);

export default router;
```

server.js

```js
import authRouter from './routers/authRouter.js';

app.use('/api/v1/auth', authRouter);
```

#### Create User - Initial Setup

authController.js

```js
import { StatusCodes } from 'http-status-codes';
import User from '../models/UserModel.js';

export const register = async (req, res) => {
    const user = await User.create(req.body);
    res.status(StatusCodes.CREATED).json({ user });
};
```

-   register user request

```json
{
    "name": "john",
    "email": "john@gmail.com",
    "password": "secret123",
    "lastName": "smith",
    "location": "my city"
}
```

#### Validate User

validationMiddleware.js

```js
import User from '../models/UserModel.js';

export const validateRegisterInput = withValidationErrors([
    body('name').notEmpty().withMessage('name is required'),
    body('email')
        .notEmpty()
        .withMessage('email is required')
        .isEmail()
        .withMessage('invalid email format')
        .custom(async (email) => {
            const user = await User.findOne({ email });
            if (user) {
                throw new BadRequestError('email already exists');
            }
        }),
    body('password')
        .notEmpty()
        .withMessage('password is required')
        .isLength({ min: 8 })
        .withMessage('password must be at least 8 characters long'),
    body('location').notEmpty().withMessage('location is required'),
    body('lastName').notEmpty().withMessage('last name is required'),
]);
```

authRouter.js

```js
import { validateRegisterInput } from '../middleware/validationMiddleware.js';

router.post('/register', validateRegisterInput, register);
```

#### Admin Role

authController.js

```js
// first registered user is an admin
const isFirstAccount = (await User.countDocuments()) === 0;
req.body.role = isFirstAccount ? 'admin' : 'user';

const user = await User.create(req.body);
```

#### Hash Passwords

[bcryptjs](https://www.npmjs.com/package/bcryptjs)

```sh
npm i bcryptjs@2.4.3

```

authController.js

```js
import bcrypt from 'bcryptjs';

const register = async (req, res) => {
    // a random value that is added to the password before hashing
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashedPassword;

    const user = await User.create(req.body);
};
```

const salt = await bcrypt.genSalt(10);
This line generates a random "salt" value that will be used to hash the password. A salt is a random value that is added to the password before hashing, which helps to make the resulting hash more resistant to attacks like dictionary attacks and rainbow table attacks. The genSalt() function in bcrypt generates a random salt value using a specified "cost" value. The cost value determines how much CPU time is needed to calculate the hash, and higher cost values result in stronger hashes that are more resistant to attacks.

In this example, a cost value of 10 is used to generate the salt. This is a good default value that provides a good balance between security and performance. However, you may need to adjust the cost value based on the specific needs of your application.

const hashedPassword = await bcrypt.hash(password, salt);
This line uses the generated salt value to hash the password. The hash() function in bcrypt takes two arguments: the password to be hashed, and the salt value to use for the hash. It then calculates the hash value using a one-way hash function and the specified salt value.

The resulting hash value is a string that represents the hashed password. This string can then be stored in a database or other storage mechanism to be compared against the user's password when they log in.

By using a salt value and a one-way hash function, bcrypt helps to ensure that user passwords are stored securely and are resistant to attacks like password cracking and brute-force attacks.

##### BCRYPT VS BCRYPTJS

bcrypt and bcryptjs are both popular libraries for hashing passwords in Node.js applications. However, bcryptjs is considered to be a better choice for a few reasons:

Cross-platform compatibility: bcrypt is a native Node.js module that uses C++ bindings, which can make it difficult to install and use on some platforms. bcryptjs, on the other hand, is a pure JavaScript implementation that works on any platform.

Security: While both bcrypt and bcryptjs use the same underlying algorithm for hashing passwords, bcryptjs is designed to be more resistant to certain types of attacks, such as side-channel attacks.

Ease of use: bcryptjs has a simpler and more intuitive API than bcrypt, which can make it easier to use and integrate into your application.

Overall, while bcrypt and bcryptjs are both good choices for hashing passwords in Node.js applications, bcryptjs is considered to be a better choice for its cross-platform compatibility, improved security, ease of use, and ongoing maintenance.

#### Setup Password Utils

utils/passwordUtils.js

```js
import bcrypt from 'bcryptjs';

export async function hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
}
```

authController.js

```js
import { hashPassword } from '../utils/passwordUtils.js';

const register = async (req, res) => {
    const hashedPassword = await hashPassword(req.body.password);
    req.body.password = hashedPassword;

    const user = await User.create(req.body);
    res.status(StatusCodes.CREATED).json({ msg: 'user created' });
};
```

#### Login User

-   login user request

```json
{
    "email": "john@gmail.com",
    "password": "secret123"
}
```

validationMiddleware.js

```js
export const validateLoginInput = withValidationErrors([
    body('email')
        .notEmpty()
        .withMessage('email is required')
        .isEmail()
        .withMessage('invalid email format'),
    body('password').notEmpty().withMessage('password is required'),
]);
```

authRouter.js

```js
import { validateLoginInput } from '../middleware/validationMiddleware.js';

router.post('/login', validateLoginInput, login);
```

#### Unauthenticated Error

authController.js

```js
import { UnauthenticatedError } from '../errors/customErrors.js';

const login = async (req, res) => {
    // check if user exists
    // check if password is correct

    const user = await User.findOne({ email: req.body.email });
    if (!user) throw new UnauthenticatedError('invalid credentials');

    res.send('login route');
};
```

#### Compare Password

passwordUtils.js

```js
export async function comparePassword(password, hashedPassword) {
    const isMatch = await bcrypt.compare(password, hashedPassword);
    return isMatch;
}
```

authController.js

```js
import { hashPassword, comparePassword } from '../utils/passwordUtils.js';

const login = async (req, res) => {
    // check if user exists
    // check if password is correct

    const user = await User.findOne({ email: req.body.email });

    if (!user) throw new UnauthenticatedError('invalid credentials');

    const isPasswordCorrect = await comparePassword(
        req.body.password,
        user.password
    );

    if (!isPasswordCorrect)
        throw new UnauthenticatedError('invalid credentials');
    res.send('login route');
};
```

Refactor

```js
const isValidUser = user && (await comparePassword(password, user.password));
if (!isValidUser) throw new UnauthenticatedError('invalid credentials');
```

#### JSON Web Token

A JSON Web Token (JWT) is a compact and secure way of transmitting data between parties. It is often used to authenticate and authorize users in web applications and APIs. JWTs contain information about the user and additional metadata, and can be used to securely transmit this information

[Useful Resource](https://jwt.io/introduction)

```sh
npm i jsonwebtoken@9.0.0
```

utils/tokenUtils.js

```js
import jwt from 'jsonwebtoken';

export const createJWT = (payload) => {
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
    return token;
};
```

JWT_SECRET represents the secret key used to sign the JWT. When creating a JWT, the payload (data) is signed with this secret key to generate a unique token. The secret key should be kept secure and should not be disclosed to unauthorized parties.

JWT_EXPIRES_IN specifies the expiration time for the JWT. It determines how long the token remains valid before it expires. The value of JWT_EXPIRES_IN is typically provided as a duration, such as "1h" for one hour or "7d" for seven days. Once the token expires, it is no longer considered valid and can't be used for authentication or authorization purposes.

These environment variables (JWT_SECRET and JWT_EXPIRES_IN) are read from the system environment during runtime, allowing for flexibility in configuration without modifying the code.

authController.js

```js
import { createJWT } from '../utils/tokenUtils.js';

const token = createJWT({ userId: user._id, role: user.role });
console.log(token);
```

#### Test JWT (optional)

[JWT](https://jwt.io/)

#### ENV Variables

-   RESTART SERVER!!!!

.env

```js
JWT_SECRET=
JWT_EXPIRES_IN=
```

#### HTTP Only Cookie

An HTTP-only cookie is a cookie that can't be accessed by JavaScript running in the browser. It is designed to help prevent cross-site scripting (XSS) attacks, which can be used to steal cookies and other sensitive information.

##### HTTP Only Cookie VS Local Storage

An HTTP-only cookie is a type of cookie that is designed to be inaccessible to JavaScript running in the browser. It is primarily used for authentication purposes and is a more secure way of storing sensitive information like user tokens. Local storage, on the other hand, is a browser-based storage mechanism that is accessible to JavaScript, and is used to store application data like preferences or user-generated content. While local storage is convenient, it is not a secure way of storing sensitive information as it can be accessed and modified by JavaScript running in the browser.

authControllers.js

```js
const oneDay = 1000 * 60 * 60 * 24;

res.cookie('token', token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === 'production',
});

res.status(StatusCodes.CREATED).json({ msg: 'user logged in' });
```

```js
const oneDay = 1000 * 60 * 60 * 24;
```

This line defines a constant oneDay that represents the number of milliseconds in a day. This value is used later to set the expiration time for the cookie.

```js
res.cookie('token', token, {...});:
```

This line sets a cookie with the name "token" and a value of token, which is the JWT that was generated for the user. The ... represents an object containing additional options for the cookie.

httpOnly: true: This option makes the cookie inaccessible to JavaScript running in the browser. This helps to prevent cross-site scripting (XSS) attacks, which can be used to steal cookies and other sensitive information.

expires: new Date(Date.now() + oneDay): This option sets the expiration time for the cookie. In this case, the cookie will expire one day from the current time (as represented by Date.now() + oneDay).

secure: process.env.NODE_ENV === 'production': This option determines whether the cookie should be marked as secure or not. If the NODE_ENV environment variable is set to "production", then the cookie is marked as secure, which means it can only be transmitted over HTTPS. This helps to prevent man-in-the-middle (MITM) attacks, which can intercept and modify cookies that are transmitted over unsecured connections.

jobsController.js

```js
export const getAllJobs = async (req, res) => {
    console.log(req);
    const jobs = await Job.find({});
    res.status(StatusCodes.OK).json({ jobs });
};
```

#### Clean DB

#### Connect User and Job

models/User.js

```js
const JobSchema = new mongoose.Schema(
  {
    ....
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);
```

#### Auth Middleware

middleware/authMiddleware.js

```js
export const authenticateUser = async (req, res, next) => {
    console.log('auth middleware');
    next();
};
```

index.js

```js
import { authenticateUser } from './middleware/authMiddleware.js';

app.use('/api/v1/jobs', authenticateUser, jobRouter);
```

##### Cookie Parser

[Cookie Parser](https://www.npmjs.com/package/cookie-parser)

```sh
npm i cookie-parser@1.4.6
```

index.js

```js
import cookieParser from 'cookie-parser';
app.use(cookieParser());
```

#### Access Token

authMiddleware.js

```js
import { UnauthenticatedError } from '../customErrors.js';

export const authenticateUser = async (req, res, next) => {
    const { token } = req.cookies;
    if (!token) {
        throw new UnauthenticatedError('authentication invalid');
    }
    next();
};
```

#### Verify Token

utils/tokenUtils.js

```js
export const verifyJWT = (token) => {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
};
```

authMiddleware.js

```js
import { UnauthenticatedError } from '../customErrors.js';
import { verifyJWT } from '../utils/tokenUtils.js';

export const authenticateUser = async (req, res, next) => {
    const { token } = req.cookies;
    if (!token) {
        throw new UnauthenticatedError('authentication invalid');
    }

    try {
        const { userId, role } = verifyJWT(token);
        req.user = { userId, role };
        next();
    } catch (error) {
        throw new UnauthenticatedError('authentication invalid');
    }
};
```

jobController.js

```js
export const getAllJobs = async (req, res) => {
    console.log(req.user);
    const jobs = await Job.find({ createdBy: req.user.userId });
    res.status(StatusCodes.OK).json({ jobs });
};
```

#### Refactor Create Job

jobController.js

```js
export const createJob = async (req, res) => {
    req.body.createdBy = req.user.userId;
    const job = await Job.create(req.body);
    res.status(StatusCodes.CREATED).json({ job });
};
```

#### Check Permissions

validationMiddleware.js

```js
const withValidationErrors = (validateValues) => {
  return [
    validateValues,
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
       ...
        if (errorMessages[0].startsWith('not authorized')) {
          throw new UnauthorizedError('not authorized to access this route');
        }

        throw new BadRequestError(errorMessages);
      }
      next();
    },
  ];
};
```

```js
import {
    BadRequestError,
    NotFoundError,
    UnauthorizedError,
} from '../errors/customErrors.js';

export const validateIdParam = withValidationErrors([
    param('id').custom(async (value, { req }) => {
        const isValidMongoId = mongoose.Types.ObjectId.isValid(value);
        if (!isValidMongoId) throw new BadRequestError('invalid MongoDB id');
        const job = await Job.findById(value);
        if (!job) throw new NotFoundError(`no job with id ${value}`);
        const isAdmin = req.user.role === 'admin';
        const isOwner = req.user.userId === job.createdBy.toString();
        if (!isAdmin && !isOwner)
            throw UnauthorizedError('not authorized to access this route');
    }),
]);
```

#### Logout User

controllers/authController.js

```js
const logout = (req, res) => {
    res.cookie('token', 'logout', {
        httpOnly: true,
        expires: new Date(Date.now()),
    });
    res.status(StatusCodes.OK).json({ msg: 'user logged out!' });
};
```

routes/authRouter.js

```js
import { Router } from 'express';
const router = Router();
import { logout } from '../controllers/authController.js';

router.get('/logout', logout);

export default router;
```

#### User Routes

controllers/userController.js

```js
import { StatusCodes } from 'http-status-codes';
import User from '../models/User.js';
import Job from '../models/Job.js';

export const getCurrentUser = async (req, res) => {
    res.status(StatusCodes.OK).json({ msg: 'get current user' });
};

export const getApplicationStats = async (req, res) => {
    res.status(StatusCodes.OK).json({ msg: 'application stats' });
};

export const updateUser = async (req, res) => {
    res.status(StatusCodes.OK).json({ msg: 'update user' });
};
```

routes/userRouter.js

```js
import { Router } from 'express';
const router = Router();

import {
    getCurrentUser,
    getApplicationStats,
    updateUser,
} from '../controllers/userController.js';

router.get('/current-user', getCurrentUser);
router.get('/admin/app-stats', getApplicationStats);
router.patch('/update-user', updateUser);
export default router;
```

server.js

```js
import userRouter from './routers/userRouter.js';

app.use('/api/v1/users', authenticateUser, userRouter);
```

#### Get Current User

```js
export const getCurrentUser = async (req, res) => {
    const user = await User.findOne({ _id: req.user.userId });
    res.status(StatusCodes.OK).json({ user });
};
```

<!--
#### Remove Password

models/UserModel.js

```js
UserSchema.methods.toJSON = function () {
    var obj = this.toObject();
    delete obj.password;
    return obj;
};
```

```js
export const getCurrentUser = async (req, res) => {
    const user = await User.findOne({ _id: req.user.userId });
    const userWithoutPassword = user.toJSON();
    res.status(StatusCodes.OK).json({ user: userWithoutPassword });
};
``` -->

#### Update User

middleware/validationMiddleware.js

```js
const validateUpdateUserInput = withValidationErrors([
    body('name').notEmpty().withMessage('name is required'),
    body('email')
        .notEmpty()
        .withMessage('email is required')
        .isEmail()
        .withMessage('invalid email format')
        .custom(async (email, { req }) => {
            const user = await User.findOne({ email });
            if (user && user._id.toString() !== req.user.userId) {
                throw new Error('email already exists');
            }
        }),
    body('lastName').notEmpty().withMessage('last name is required'),
    body('location').notEmpty().withMessage('location is required'),
]);
```

```js
export const updateUser = async (req, res) => {
    const updatedUser = await User.findByIdAndUpdate(req.user.userId, req.body);
    res.status(StatusCodes.OK).json({ msg: 'user updated' });
};
```

```json
{
    "name": "john",
    "email": "john@gmail.com",
    "lastName": "smith",
    "location": "florida"
}
```

#### Application Stats

```js
export const getApplicationStats = async (req, res) => {
    const users = await User.countDocuments();
    const jobs = await Job.countDocuments();
    res.status(StatusCodes.OK).json({ users, jobs });
};
```

```js
export const authorizePermissions = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            throw new UnauthorizedError('Unauthorized to access this route');
        }
        next();
    };
};
```

```js
import { authorizePermissions } from '../middleware/authMiddleware.js';

router.get('/admin/app-stats', [
    authorizePermissions('admin'),
    getApplicationStats,
]);
```
