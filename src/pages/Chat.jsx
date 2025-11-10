import React from 'react';
import { MessageCircle, Bot, Sparkles, HelpCircle, Zap } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import ChatbaseWidget from '../components/ChatbaseWidget';

export default function Chat() {
    const { darkMode } = useTheme();

    return (
        <>
            <ChatbaseWidget />
            <div className={`p-6 flex flex-col h-full ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} transition-colors duration-300`}>
                <div className="max-w-4xl mx-auto w-full">
                <div className="flex items-center gap-3 mb-6">
                    <div className={`p-3 rounded-full ${darkMode ? 'bg-aqua-900/30' : 'bg-aqua-100'}`}>
                        <Bot className={`w-8 h-8 ${darkMode ? 'text-aqua-400' : 'text-aqua-600'}`} />
                    </div>
                    <div>
                        <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                            Asistente Virtual IA
                        </h1>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Powered by Chatbase
                        </p>
                    </div>
                </div>

                <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 mb-8`}>
                    {/* Información del Bot */}
                    <div className={`p-6 rounded-xl shadow-lg ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'}`}>
                        <div className="flex items-center gap-3 mb-4">
                            <MessageCircle className={`w-6 h-6 ${darkMode ? 'text-aqua-400' : 'text-aqua-600'}`} />
                            <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                                Sobre el Asistente
                            </h2>
                        </div>
                        <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-4`}>
                            Nuestro asistente virtual está potenciado por <strong className={darkMode ? 'text-aqua-400' : 'text-aqua-600'}>Chatbase</strong>, 
                            una plataforma avanzada de IA conversacional que utiliza modelos de lenguaje de última generación.
                        </p>
                        <div className={`p-3 rounded-lg ${darkMode ? 'bg-aqua-900/20' : 'bg-aqua-50'}`}>
                            <p className={`text-sm ${darkMode ? 'text-aqua-300' : 'text-aqua-700'}`}>
                                <strong>Chatbase</strong> permite crear asistentes inteligentes que pueden ayudar con consultas, 
                                resolver problemas y proporcionar información en tiempo real.
                            </p>
                        </div>
                    </div>

                    {/* Capacidades */}
                    <div className={`p-6 rounded-xl shadow-lg ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'}`}>
                        <div className="flex items-center gap-3 mb-4">
                            <Zap className={`w-6 h-6 ${darkMode ? 'text-neon-cyan' : 'text-aqua-600'}`} />
                            <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                                ¿Cómo puede ayudarte?
                            </h2>
                        </div>
                        <ul className={`space-y-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            <li className="flex items-start gap-2">
                                <Sparkles className={`w-5 h-5 mt-0.5 ${darkMode ? 'text-neon-cyan' : 'text-aqua-500'}`} />
                                <span>Responder preguntas sobre el sistema de gestión</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <Sparkles className={`w-5 h-5 mt-0.5 ${darkMode ? 'text-neon-cyan' : 'text-aqua-500'}`} />
                                <span>Ayudar con el registro de pagos y gastos</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <Sparkles className={`w-5 h-5 mt-0.5 ${darkMode ? 'text-neon-cyan' : 'text-aqua-500'}`} />
                                <span>Explicar funcionalidades del dashboard</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <Sparkles className={`w-5 h-5 mt-0.5 ${darkMode ? 'text-neon-cyan' : 'text-aqua-500'}`} />
                                <span>Proporcionar información sobre apartamentos</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <Sparkles className={`w-5 h-5 mt-0.5 ${darkMode ? 'text-neon-cyan' : 'text-aqua-500'}`} />
                                <span>Asistir con reportes y estadísticas</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Widget de Chatbase */}
                <div className={`p-6 rounded-xl shadow-lg ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'}`}>
                    <div className="flex items-center gap-3 mb-4">
                        <HelpCircle className={`w-6 h-6 ${darkMode ? 'text-aqua-400' : 'text-aqua-600'}`} />
                        <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                            Iniciar Conversación
                        </h2>
                    </div>
                    <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-4`}>
                        El widget de Chatbase aparecerá en la esquina inferior derecha de la pantalla. 
                        Haz clic en él para comenzar una conversación con nuestro asistente virtual.
                    </p>
                    <div className={`p-4 rounded-lg ${darkMode ? 'bg-aqua-900/20 border border-aqua-800' : 'bg-aqua-50 border border-aqua-200'}`}>
                        <p className={`text-sm ${darkMode ? 'text-aqua-300' : 'text-aqua-700'}`}>
                            <strong>Nota:</strong> Si el widget no aparece, verifica que la API key y Chat ID de Chatbase 
                            estén correctamente configurados en el código.
                        </p>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}
