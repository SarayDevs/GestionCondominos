// src/pages/Login.jsx
import Scene3D from "../components/Scene3D";
import LoginForm from "../components/LoginForm";

function LoginPage({ onLoginSuccess }) {
  return (
    <div className="flex h-screen w-full relative overflow-hidden">
      {/* Lado izquierdo: formulario */}
      <div className="w-full md:w-1/2 flex justify-center items-center relative z-30">
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-10 w-[85%] max-w-md z-40 border border-gray-200">
          <LoginForm />
        </div>
      </div>

      {/* Lado derecho: animación 3D */}
      <div className="hidden md:flex w-1/2 items-center justify-center bg-sky-600 relative z-0">
        <div className="w-full h-full">
          <Scene3D />
        </div>
      </div>

      {/* Gradiente */}
      <div className="absolute right-1/2 top-0 w-[35%] h-full bg-gradient-to-l from-sky-600 via-sky-300/70 to-transparent pointer-events-none z-20"></div>
    </div>
  );
}

export default LoginPage;