import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, Shield, TrendingUp, Users, BarChart3, 
  CreditCard, FileText, CheckCircle, ArrowRight, 
  Sparkles, Zap, Star, Send, Bell, Lock, Cloud, 
  Clock, Target, MessageSquare, DollarSign, 
  Home, Settings, AlertCircle, TrendingDown, Menu, X
} from 'lucide-react';
import ChatbaseWidget from '../components/ChatbaseWidget';

export default function Landing() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    condominium: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formspreeEndpoint = 'https://formspree.io/f/xrbrzgjw';
    
    try {
      const response = await fetch(formspreeEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitted(true);
        setFormData({ name: '', email: '', phone: '', condominium: '', message: '' });
        setTimeout(() => setSubmitted(false), 5000);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const features = [
    {
      icon: <CreditCard className="w-8 h-8" />,
      title: 'Gestión de Pagos',
      description: 'Registra, organiza y consulta todos los pagos de administración',
      color: 'from-aqua-500 to-aqua-700'
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: 'Dashboard Inteligente',
      description: 'Visualiza indicadores, balances y estadísticas en tiempo real',
      color: 'from-neon-blue to-aqua-500'
    },
    {
      icon: <TrendingDown className="w-8 h-8" />,
      title: 'Control de Gastos',
      description: 'Clasifica y gestiona los egresos del condominio fácilmente',
      color: 'from-neon-cyan to-aqua-500'
    },
    {
      icon: <Building2 className="w-8 h-8" />,
      title: 'Administración de Unidades',
      description: 'Controla los datos de propietarios, saldos y estados financieros',
      color: 'from-aqua-600 to-aqua-800'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Gestión de Usuarios',
      description: 'Crea roles, asigna permisos y controla accesos',
      color: 'from-aqua-400 to-aqua-600'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Seguridad y Respaldo',
      description: 'Sistema en la nube con copias de seguridad automáticas',
      color: 'from-neon-green to-aqua-500'
    },
  ];

  const adminBenefits = [
    { icon: <DollarSign className="w-6 h-6" />, text: 'Control total sobre pagos, gastos y presupuestos' },
    { icon: <BarChart3 className="w-6 h-6" />, text: 'Reportes automáticos con estadísticas y gráficos inteligentes' },
    { icon: <Users className="w-6 h-6" />, text: 'Administración completa de usuarios, roles y permisos' },
    { icon: <Home className="w-6 h-6" />, text: 'Gestión de apartamentos y propietarios en tiempo real' },
    { icon: <Cloud className="w-6 h-6" />, text: 'Seguridad y respaldo de datos en la nube' },
    { icon: <Zap className="w-6 h-6" />, text: 'Mayor eficiencia, menor carga administrativa' },
  ];

  const ownerBenefits = [
    { icon: <CreditCard className="w-6 h-6" />, text: 'Consulta tus próximos pagos e historial financiero' },
    { icon: <MessageSquare className="w-6 h-6" />, text: 'Envía solicitudes y quejas directamente al administrador' },
    { icon: <Bell className="w-6 h-6" />, text: 'Recibe notificaciones automáticas sobre asambleas o mantenimientos' },
    { icon: <Settings className="w-6 h-6" />, text: 'Disfruta de una experiencia personalizada desde tu cuenta' },
  ];

  const problemsSolved = [
    { icon: <CheckCircle className="w-6 h-6" />, text: '¿Un propietario olvidó su fecha de pago? El sistema le enviará un recordatorio automático.' },
    { icon: <CheckCircle className="w-6 h-6" />, text: '¿Una queja por ruido o filtración? Regístrala, asígnala y hazle seguimiento en segundos.' },
    { icon: <CheckCircle className="w-6 h-6" />, text: '¿Necesitas el balance mensual? Obténlo en un clic, sin hojas de cálculo.' },
    { icon: <CheckCircle className="w-6 h-6" />, text: '¿Quieres evitar confusiones con los cobros? Cada residente puede consultar su estado en línea.' },
  ];

  return (
    <>
      <ChatbaseWidget />
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-aqua-900 to-gray-900 text-white">
        {/* Header de Navegación */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900/90 backdrop-blur-md border-b border-aqua-500/30">
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <Building2 className="w-8 h-8 text-aqua-400 mr-2" />
                <span className="text-xl font-bold text-aqua-300">CondominioApp</span>
              </div>
              
              {/* Desktop Menu */}
              <div className="hidden md:flex items-center space-x-6">
                <button onClick={() => scrollToSection('inicio')} className="text-gray-300 hover:text-aqua-400 transition-colors">
                  Inicio
                </button>
                <button onClick={() => scrollToSection('beneficios')} className="text-gray-300 hover:text-aqua-400 transition-colors">
                  Beneficios
                </button>
                <button onClick={() => scrollToSection('caracteristicas')} className="text-gray-300 hover:text-aqua-400 transition-colors">
                  Características
                </button>
                <button onClick={() => scrollToSection('casos')} className="text-gray-300 hover:text-aqua-400 transition-colors">
                  Casos Cotidianos
                </button>
                <button onClick={() => scrollToSection('cifras')} className="text-gray-300 hover:text-aqua-400 transition-colors">
                  Cifras
                </button>
                <button onClick={() => scrollToSection('contacto')} className="px-4 py-2 bg-aqua-500 text-white rounded-lg hover:bg-aqua-600 transition-colors">
                  Contáctanos
                </button>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden text-gray-300 hover:text-aqua-400"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
              <div className="md:hidden pb-4 space-y-2">
                <button onClick={() => scrollToSection('inicio')} className="block w-full text-left px-4 py-2 text-gray-300 hover:text-aqua-400 hover:bg-gray-800 rounded-lg transition-colors">
                  Inicio
                </button>
                <button onClick={() => scrollToSection('beneficios')} className="block w-full text-left px-4 py-2 text-gray-300 hover:text-aqua-400 hover:bg-gray-800 rounded-lg transition-colors">
                  Beneficios
                </button>
                <button onClick={() => scrollToSection('caracteristicas')} className="block w-full text-left px-4 py-2 text-gray-300 hover:text-aqua-400 hover:bg-gray-800 rounded-lg transition-colors">
                  Características
                </button>
                <button onClick={() => scrollToSection('casos')} className="block w-full text-left px-4 py-2 text-gray-300 hover:text-aqua-400 hover:bg-gray-800 rounded-lg transition-colors">
                  Casos Cotidianos
                </button>
                <button onClick={() => scrollToSection('cifras')} className="block w-full text-left px-4 py-2 text-gray-300 hover:text-aqua-400 hover:bg-gray-800 rounded-lg transition-colors">
                  Cifras
                </button>
                <button onClick={() => scrollToSection('contacto')} className="block w-full text-left px-4 py-2 bg-aqua-500 text-white rounded-lg hover:bg-aqua-600 transition-colors">
                  Contáctanos
                </button>
              </div>
            )}
          </nav>
        </header>

        {/* Hero Section - Mejorado */}
        <div id="inicio" className="relative overflow-hidden pt-16">
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2300a3a3' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}
          ></div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Contenido Izquierdo */}
              <div>
                {/* Icono del Condominio - Más Llamativo */}
                <div className="flex justify-start mb-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-aqua-500 via-neon-cyan to-aqua-400 rounded-full blur-2xl opacity-75 animate-pulse"></div>
                    <div className="relative p-4 bg-gradient-to-r from-aqua-500 to-neon-cyan rounded-full shadow-2xl transform hover:scale-110 transition-all duration-300">
                      <Building2 className="w-12 h-12 md:w-16 md:h-16 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-neon-green rounded-full animate-ping"></div>
                    <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-neon-cyan rounded-full animate-pulse"></div>
                  </div>
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-aqua-400 via-neon-cyan to-aqua-300 bg-clip-text text-transparent leading-tight">
                  Sistema de Gestión de Condominios
                </h1>
                
                <div className="mb-8">
                  <p className="text-lg md:text-xl text-gray-300 mb-4 leading-relaxed">
                    <span className="text-aqua-300 font-semibold">Vivir en tu propio condominio es una experiencia increíble.</span>
                  </p>
                  <p className="text-base md:text-lg text-gray-400 mb-4 leading-relaxed">
                    Sin embargo, todos sabemos que administrar pagos, resolver quejas o coordinar mantenimientos puede convertirse en un verdadero reto.
                  </p>
                  <p className="text-base md:text-lg text-aqua-200 font-medium leading-relaxed">
                    El Sistema de Gestión de Condominios fue creado para resolver esas dificultades del día a día, ayudándote a mantener el control total de tu comunidad, simplificar tus tareas y ofrecer una mejor experiencia a los residentes.
                  </p>
                </div>

                <div className="mb-8 p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-aqua-500/30">
                  <p className="text-base text-aqua-100">
                    💻 <strong>Una plataforma moderna, segura y 100% digital</strong>, diseñada para que la administración sea tan tranquila como la vida que deseas en tu hogar.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => navigate('/login')}
                    className="px-8 py-4 bg-gradient-to-r from-aqua-500 to-neon-cyan text-white rounded-xl font-bold text-lg shadow-2xl hover:shadow-neon-cyan/50 transition-all transform hover:scale-105 flex items-center justify-center gap-3 group"
                  >
                    <Sparkles className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                    Probar Sistema
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                  </button>
                  <button
                    onClick={() => scrollToSection('contacto')}
                    className="px-8 py-4 bg-transparent border-2 border-aqua-500 text-aqua-400 rounded-xl font-bold text-lg hover:bg-aqua-500/10 transition-all transform hover:scale-105"
                  >
                    Solicitar Información
                  </button>
                </div>
              </div>

              {/* Imagen Derecha */}
              <div className="flex justify-center lg:justify-end">
                <div className="relative w-full max-w-lg">
                  <div className="absolute inset-0 bg-gradient-to-r from-aqua-500/20 to-neon-cyan/20 rounded-3xl blur-2xl animate-pulse"></div>
                  <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-aqua-500/30 animate-breathe">
                    <img 
                      src="/assets/condomino.jpg" 
                      alt="Condominio moderno" 
                      className="w-full h-96 object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextElementSibling.style.display = 'flex';
                      }}
                    />
                    <div className="hidden w-full h-96 bg-gradient-to-br from-aqua-500/30 to-neon-cyan/30 items-center justify-center">
                      <Building2 className="w-32 h-32 text-white/50" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sección 2 - ¿Por qué necesitas un sistema? */}
        <div id="beneficios" className="py-20 bg-gradient-to-b from-transparent to-aqua-900/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-6">
              <span className="bg-gradient-to-r from-aqua-400 to-neon-cyan bg-clip-text text-transparent">
                ¿Por qué necesitas un sistema de gestión?
              </span>
            </h2>
            <p className="text-center text-gray-300 text-lg md:text-xl mb-12 max-w-4xl mx-auto">
              Administrar un condominio no es fácil: <span className="text-red-400 font-semibold">pagos atrasados, reportes manuales, quejas sin seguimiento y falta de comunicación</span> son problemas que afectan la convivencia y la transparencia.
            </p>
            <p className="text-center text-aqua-200 text-xl md:text-2xl font-semibold mb-12 max-w-3xl mx-auto">
              Con nuestro sistema, todo se centraliza en un solo lugar.
            </p>
            <p className="text-center text-gray-300 text-lg mb-12 max-w-4xl mx-auto">
              Controla ingresos, egresos y notificaciones en tiempo real, evita errores humanos y mantén la tranquilidad de tu comunidad.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
              {[
                'Evita confusiones con los pagos',
                'Centraliza toda la información en una sola plataforma',
                'Mejora la comunicación entre administración y residentes',
                'Aumenta la transparencia y confianza',
                'Genera reportes automáticos en segundos',
                'Accede desde cualquier dispositivo, en cualquier momento'
              ].map((benefit, index) => (
                <div
                  key={index}
                  className="p-6 bg-white/10 backdrop-blur-md rounded-xl border border-aqua-500/30 hover:border-neon-cyan transition-all transform hover:scale-105"
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-neon-green flex-shrink-0" />
                    <h3 className="text-lg font-semibold text-aqua-300">{benefit}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sección 3 - Beneficios para Administradores y Propietarios */}
        <div className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">
              <span className="bg-gradient-to-r from-neon-cyan to-aqua-400 bg-clip-text text-transparent">
                Beneficios para Administradores y Propietarios
              </span>
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
              {/* Para Administradores */}
              <div className="p-8 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-aqua-500/20">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-gradient-to-r from-aqua-500 to-aqua-600 rounded-lg">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-aqua-300">Para Administradores</h3>
                </div>
                <ul className="space-y-4">
                  {adminBenefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="p-2 bg-aqua-500/20 rounded-lg mt-0.5">
                        <div className="text-aqua-400">{benefit.icon}</div>
                      </div>
                      <span className="text-gray-300 text-lg">{benefit.text}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Para Propietarios */}
              <div className="p-8 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-aqua-500/20">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-gradient-to-r from-neon-cyan to-aqua-500 rounded-lg">
                    <Home className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-aqua-300">Para Propietarios</h3>
                </div>
                <ul className="space-y-4">
                  {ownerBenefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="p-2 bg-neon-cyan/20 rounded-lg mt-0.5">
                        <div className="text-neon-cyan">{benefit.icon}</div>
                      </div>
                      <span className="text-gray-300 text-lg">{benefit.text}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 p-4 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
                  <p className="text-yellow-200 text-sm">
                    💡 <strong>Nota:</strong> La versión Beta actualmente incluye la sección administrativa. Al contratar la versión completa, los residentes podrán acceder a su propio portal, mejorando su experiencia y la comunicación con la administración.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sección 4 - Características principales */}
        <div id="caracteristicas" className="py-20 bg-gradient-to-r from-aqua-900/50 to-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
              <span className="bg-gradient-to-r from-neon-cyan to-aqua-400 bg-clip-text text-transparent">
                Características Principales del Sistema
              </span>
            </h2>
            <p className="text-center text-gray-400 mb-12 text-lg max-w-3xl mx-auto">
              Nuestro sistema combina tecnología moderna, seguridad y usabilidad, garantizando un control total de la copropiedad sin complicaciones.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="group relative p-8 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-aqua-500/20 hover:border-neon-cyan transition-all transform hover:scale-105 hover:shadow-2xl hover:shadow-neon-cyan/20"
                >
                  <div className={`p-4 bg-gradient-to-r ${feature.color} rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform`}>
                    <div className="text-white">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-aqua-300">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-neon-cyan/10 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sección 5 - Casos cotidianos */}
        <div id="casos" className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-6">
              <span className="bg-gradient-to-r from-aqua-400 to-neon-cyan bg-clip-text text-transparent">
                Casos Cotidianos que Resolvemos
              </span>
            </h2>
            <p className="text-center text-gray-300 text-lg mb-12 max-w-4xl mx-auto">
              Nuestro sistema fue diseñado pensando en los problemas reales que enfrentan los administradores y residentes cada día.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {problemsSolved.map((problem, index) => (
                <div
                  key={index}
                  className="p-6 bg-white/10 backdrop-blur-md rounded-xl border border-aqua-500/30 hover:border-neon-cyan transition-all"
                >
                  <div className="flex items-start gap-3">
                    <div className="text-neon-green flex-shrink-0">{problem.icon}</div>
                    <p className="text-gray-300 text-lg">{problem.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sección 6 - Cifras y Ventajas */}
        <div id="cifras" className="py-20 bg-gradient-to-r from-aqua-900/50 to-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-6">
              <span className="bg-gradient-to-r from-neon-cyan to-aqua-400 bg-clip-text text-transparent">
                Más que un Software
              </span>
            </h2>
            <p className="text-center text-gray-300 text-lg mb-12 max-w-3xl mx-auto">
              Es una herramienta que impulsa la organización, la transparencia y la convivencia.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-center">
              {[
                { icon: <Zap className="w-12 h-12 mx-auto" />, value: '100%', label: 'Digital' },
                { icon: <Clock className="w-12 h-12 mx-auto" />, value: '24/7', label: 'Disponible' },
                { icon: <TrendingUp className="w-12 h-12 mx-auto" />, value: '∞', label: 'Escalable' },
                { icon: <Lock className="w-12 h-12 mx-auto" />, value: '', label: 'Seguro' },
                { icon: <Star className="w-12 h-12 mx-auto fill-neon-cyan" />, value: '', label: 'Premium' },
              ].map((stat, index) => (
                <div key={index} className="p-6 bg-white/10 backdrop-blur-md rounded-xl border border-aqua-500/30">
                  <div className="text-neon-cyan mb-3">{stat.icon}</div>
                  {stat.value && <div className="text-5xl font-bold text-neon-cyan mb-2">{stat.value}</div>}
                  <div className="text-gray-400 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div id="contacto" className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="bg-gradient-to-r from-aqua-400 to-neon-cyan bg-clip-text text-transparent">
                  ¿Interesado en el Sistema?
                </span>
              </h2>
              <p className="text-gray-400 text-lg">
                Completa el formulario y nos pondremos en contacto contigo
              </p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-aqua-500/30">
              {submitted && (
                <div className="mb-6 p-4 bg-green-500/20 border border-green-500 rounded-lg text-green-300">
                  ¡Formulario enviado exitosamente! Te contactaremos pronto.
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-aqua-300 mb-2">Nombre Completo</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-aqua-500/30 rounded-lg text-white focus:outline-none focus:border-neon-cyan focus:ring-2 focus:ring-neon-cyan/50"
                    placeholder="Juan Pérez"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-aqua-300 mb-2">Correo Electrónico</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-aqua-500/30 rounded-lg text-white focus:outline-none focus:border-neon-cyan focus:ring-2 focus:ring-neon-cyan/50"
                    placeholder="juan@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-aqua-300 mb-2">Teléfono</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-aqua-500/30 rounded-lg text-white focus:outline-none focus:border-neon-cyan focus:ring-2 focus:ring-neon-cyan/50"
                    placeholder="+57 300 123 4567"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-aqua-300 mb-2">Nombre del Condominio</label>
                  <input
                    type="text"
                    value={formData.condominium}
                    onChange={(e) => setFormData({...formData, condominium: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-aqua-500/30 rounded-lg text-white focus:outline-none focus:border-neon-cyan focus:ring-2 focus:ring-neon-cyan/50"
                    placeholder="Residencial Horizonte"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-aqua-300 mb-2">Mensaje</label>
                <textarea
                  rows="4"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-aqua-500/30 rounded-lg text-white focus:outline-none focus:border-neon-cyan focus:ring-2 focus:ring-neon-cyan/50"
                  placeholder="Cuéntanos sobre tus necesidades..."
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full px-8 py-4 bg-gradient-to-r from-aqua-500 to-neon-cyan text-white rounded-lg font-bold text-lg shadow-lg hover:shadow-neon-cyan/50 transition-all transform hover:scale-105 flex items-center justify-center gap-2"
              >
                <Send className="w-5 h-5" />
                Enviar Solicitud
              </button>
            </form>
          </div>
        </div>

        {/* Footer */}
        <footer className="py-12 border-t border-aqua-500/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-gray-400">
              © 2025 Sistema de Gestión de Condominios. Todos los derechos reservados.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
