"use client"

import { useState } from "react"
import { initializeApp } from "firebase/app"
import { getAuth, signInWithEmailAndPassword } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyDhiNSrOsWNtTyLyAF_iRMfzg0ecUr2TVY",
  authDomain: "chemically-14e58.firebaseapp.com",
  projectId: "chemically-14e58",
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [idToken, setIdToken] = useState("")

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      )
      const token = await userCredential.user.getIdToken()
      setIdToken(token)
      console.log("JWT Token:", token)
    } catch (err) {
      console.error("Login failed:", err)
    }
  }

  return (
    <div className="text-white">
      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin} className="cursor-pointer">
        Login & Get JWT
      </button>
      {idToken && (
        <div>
          ID Token: <code>{idToken}</code>
        </div>
      )}
    </div>
  )
}
