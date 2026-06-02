import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { auth } from './firebase';

export async function login(email: string, pass: string) {
  return await signInWithEmailAndPassword(auth, email, pass);
}

export async function signup(email: string, pass: string) {
  return await createUserWithEmailAndPassword(auth, email, pass);
}

export async function logout() {
  return await signOut(auth);
}

export function subscribeToAuthChanges(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}
