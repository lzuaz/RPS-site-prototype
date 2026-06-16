import { signup } from './src/app/actions/auth.actions';

async function test() {
  try {
    const res = await signup('test_user', 'password123');
    console.log("Response:", res);
  } catch (e) {
    console.error("Error:", e);
  }
}
test();
