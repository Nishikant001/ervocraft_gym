const request =
require("supertest");

const app =
require("../src/app");

describe(
"Auth",
()=>{

 test(
 "login",
 async()=>{

  const res =
  await request(app)
  .post(
   "/api/auth/login"
  )
  .send({

   email:
   "admin@test.com",

   password:
   "123456"

  });

  expect(
   res.statusCode
  )
  .toBe(200);

 });

});