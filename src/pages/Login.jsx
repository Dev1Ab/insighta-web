export default function Login() {
  const apiBaseUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

  function loginWithGitHub() {
    const state = `web:${crypto.randomUUID()}`;
    const codeVerifier = crypto.randomUUID() + crypto.randomUUID();

    async function sha256(text) {
        const data = new TextEncoder().encode(text);
        return await crypto.subtle.digest("SHA-256", data);
    }

    function base64UrlEncode(buffer) {
        return btoa(String.fromCharCode(...new Uint8Array(buffer)))
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
    }

    sha256(codeVerifier).then((hashed) => {
        const codeChallenge = base64UrlEncode(hashed);


        window.location.href =
            `${apiBaseUrl}/auth/github` +
            `?state=${encodeURIComponent(state)}` +
            `&code_challenge=${encodeURIComponent(codeChallenge)}` +
            `&code_verifier=${encodeURIComponent(codeVerifier)}`;
    });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow w-full max-w-md">
        <h1 className="text-2xl font-bold mb-2">Insighta Labs+</h1>
        <p className="text-gray-600 mb-6">Login to continue.</p>

        <button
          onClick={loginWithGitHub}
          className="w-full bg-black text-white py-3 rounded-lg"
        >
          Continue with GitHub
        </button>
      </div>
    </div>
  );
}
