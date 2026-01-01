import React, { useState, useEffect } from 'react';
import { Check, Shield, HelpCircle, ChevronDown, ChevronUp, Sparkles, BookOpen, Headphones, Brain, PenLine, MessageCircle, Star, Heart, Zap, Clock } from 'lucide-react';

interface FAQItem {
    question: string;
    answer: string;
}

export const SalesLanding: React.FC = () => {
    const [openFAQ, setOpenFAQ] = useState<number | null>(null);
    const [currentSlide, setCurrentSlide] = useState(0);

    const testimonialImages = [
        '/images/testimonials/customer-1.jpg',
        '/images/testimonials/customer-2.jpg',
        '/images/testimonials/customer-3.jpg',
        '/images/testimonials/customer-4.jpg',
        '/images/testimonials/customer-5.jpg',
        '/images/testimonials/customer-6.jpg',
        '/images/testimonials/customer-7.jpg',
        '/images/testimonials/customer-8.jpg'
    ];

    // Auto-play do carrossel
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % testimonialImages.length);
        }, 3500); // Muda a cada 3.5 segundos

        return () => clearInterval(interval);
    }, [testimonialImages.length]);

    const faqs: FAQItem[] = [
        {
            question: "Como funciona o acesso ao devocional?",
            answer: "Após a compra, você receberá acesso imediato ao aplicativo web. Basta fazer login com seu email e começar a usar em qualquer dispositivo (celular, tablet ou computador)."
        },
        {
            question: "O pagamento é único ou mensal?",
            answer: "O pagamento é ÚNICO! Você paga apenas uma vez e tem acesso vitalício ao devocional. Sem mensalidades, sem renovações."
        },
        {
            question: "Posso começar em qualquer época do ano?",
            answer: "Sim! O devocional não tem datas fixas. Você pode iniciar sua jornada com Deus em qualquer momento do ano, no seu próprio ritmo."
        },
        {
            question: "Como funciona a garantia de 7 dias?",
            answer: "Se você não ficar satisfeita com o devocional, pode solicitar o reembolso total dentro de 7 dias após a compra, sem burocracia."
        },
        {
            question: "Qual a diferença entre os planos?",
            answer: "O Plano Padrão (R$9,90) inclui devocional diário, anotações e versículo do dia. O Plano Completo (R$19,90) inclui tudo isso MAIS áudio narrado e o ChatGPT Bíblico (IA que responde suas dúvidas)."
        },
        {
            question: "Funciona offline?",
            answer: "O app funciona melhor com internet, mas você pode salvar seus devocionais favoritos para ler offline posteriormente."
        },
        {
            question: "Posso usar em mais de um dispositivo?",
            answer: "Sim! Você pode acessar sua conta em qualquer dispositivo (celular, tablet, computador) e seus dados ficam sincronizados."
        }
    ];

    const features = [
        {
            icon: <BookOpen className="text-amber-500" size={36} />,
            title: "Compatível com Todos os Dispositivos",
            description: "Aplicativo web que funciona em celular, tablet e computador. Leia onde e quando quiser!",
            gradient: "from-amber-50 to-orange-50"
        },
        {
            icon: <Headphones className="text-purple-500" size={36} />,
            title: "Áudio Gerado na Hora",
            description: "Ouça o devocional diário como um podcast. Perfeito para momentos de deslocamento ou descanso.",
            gradient: "from-purple-50 to-pink-50"
        },
        {
            icon: <Brain className="text-blue-500" size={36} />,
            title: "Inteligência Artificial Personalizada",
            description: "Escolha uma categoria (Ansiedade, Fé, Esperança...) e nossa IA gera um devocional específico para você.",
            gradient: "from-blue-50 to-cyan-50"
        },
        {
            icon: <PenLine className="text-green-500" size={36} />,
            title: "Espaço para Anotações",
            description: "Registre seus sentimentos, aprendizados e conversas com Deus em um diário pessoal.",
            gradient: "from-green-50 to-emerald-50"
        },
        {
            icon: <Star className="text-yellow-500" size={36} />,
            title: "Versículo-Chave do Dia",
            description: "Destaques bíblicos diários que aprofundam sua compreensão da Palavra de Deus.",
            gradient: "from-yellow-50 to-amber-50"
        },
        {
            icon: <MessageCircle className="text-indigo-500" size={36} />,
            title: "ChatGPT Bíblico",
            description: "IA que responde qualquer pergunta com base na Bíblia. Como ter um conselheiro espiritual no bolso!",
            gradient: "from-indigo-50 to-purple-50"
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-amber-50">
            {/* Hero Section - REDESIGNED */}
            <section className="relative bg-gradient-to-br from-amber-900 via-orange-800 to-amber-900 text-white py-24 px-6 overflow-hidden">
                {/* Animated Background */}
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(251,191,36,0.3),transparent_50%)] animate-pulse"></div>
                    <div className="absolute top-0 left-0 w-96 h-96 bg-yellow-400/20 rounded-full blur-3xl animate-float"></div>
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-400/20 rounded-full blur-3xl animate-float-delayed"></div>
                </div>

                <div className="max-w-5xl mx-auto relative z-10">
                    {/* Badge */}
                    <div className="text-center mb-8 animate-fade-in-down">
                        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400/30 to-amber-400/30 backdrop-blur-xl px-6 py-3 rounded-full border border-yellow-300/50 shadow-xl">
                            <Sparkles className="text-yellow-200 animate-pulse" size={20} />
                            <span className="text-yellow-100 font-bold text-sm uppercase tracking-wider">✨ Versão 2026 - Edição Premium</span>
                        </div>
                    </div>

                    {/* Title */}
                    <h1 className="font-serif text-5xl md:text-7xl font-black mb-6 leading-tight text-center animate-fade-in-up bg-gradient-to-b from-white via-yellow-100 to-amber-200 bg-clip-text text-transparent drop-shadow-2xl">
                        Terapia com Deus
                    </h1>

                    {/* Subtitle */}
                    <p className="text-2xl md:text-3xl text-yellow-50 mb-4 font-light text-center animate-fade-in-up animation-delay-200 leading-relaxed">
                        O Devocional que torna sua Leitura da Bíblia <span className="font-bold text-yellow-200">Simples e Organizada!</span>
                    </p>

                    <p className="text-lg md:text-xl text-yellow-100/90 mb-12 text-center animate-fade-in-up animation-delay-300">
                        Começe sua Jornada de 2026 com Deus e Aprofunde sua fé este ano.
                    </p>

                    {/* Single Product Image - CENTERED */}
                    <div className="max-w-md mx-auto mb-12 animate-fade-in-up animation-delay-400">
                        <div className="relative group">
                            <div className="absolute -inset-4 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-3xl blur-2xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
                            <img
                                src="/images/devocional-cover.jpg"
                                alt="Capa do Devocional"
                                className="relative rounded-3xl shadow-2xl w-full transform hover:scale-105 transition-transform duration-500"
                            />
                        </div>
                    </div>

                    {/* CTA Button */}
                    <div className="text-center animate-fade-in-up animation-delay-500">
                        <a
                            href="#planos"
                            className="inline-flex items-center gap-3 bg-white text-amber-900 px-10 py-5 rounded-full font-bold text-xl hover:bg-yellow-50 transition-all shadow-2xl hover:shadow-yellow-400/50 hover:scale-105 transform group"
                        >
                            <span>Começar Agora</span>
                            <Zap className="group-hover:animate-pulse" size={24} />
                        </a>
                    </div>
                </div>
            </section>

            {/* Subtitle Section */}
            <section className="py-20 px-6 bg-gradient-to-b from-white to-orange-50">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="font-serif text-4xl md:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-amber-900 via-orange-700 to-amber-900 font-black mb-6 leading-tight">
                        O Guia diário para transformar a sua vida com Deus
                    </h2>
                    <p className="text-xl text-gray-700 leading-relaxed">
                        Cada Dia é um convite para uma conversa íntima e inspiradora com ELE, trazendo <span className="font-bold text-amber-600 bg-amber-100 px-2 py-1 rounded">Paz, Clareza e Propósito</span> para sua vida.
                    </p>
                </div>
            </section>

            {/* Social Proof */}
            <section className="py-16 px-6 bg-gradient-to-r from-amber-900 via-orange-800 to-amber-900 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iI0ZGRiIgc3Ryb2tlLXdpZHRoPSIyIiBvcGFjaXR5PSIwLjEiLz48L2c+PC9zdmc+')] opacity-10"></div>
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <div className="flex items-center justify-center gap-4 mb-4">
                        <Heart className="text-pink-300 animate-pulse" size={40} fill="currentColor" />
                        <Sparkles className="text-yellow-300 animate-pulse animation-delay-200" size={40} />
                        <Heart className="text-pink-300 animate-pulse animation-delay-400" size={40} fill="currentColor" />
                    </div>
                    <p className="text-3xl md:text-4xl font-bold leading-relaxed">
                        Mais de <span className="text-yellow-300 text-5xl">100 mil</span> pessoas fazem terapia com Deus todos os dias
                    </p>
                </div>
            </section>

            {/* Customer Testimonials Carousel - NEW */}
            <section className="py-20 px-6 bg-gradient-to-b from-orange-50 to-white">
                <div className="max-w-5xl mx-auto">
                    <h2 className="font-serif text-4xl md:text-5xl text-center text-transparent bg-clip-text bg-gradient-to-r from-amber-900 to-orange-700 font-black mb-4">
                        Veja quem já está transformando a vida com Deus
                    </h2>
                    <p className="text-center text-gray-600 text-lg mb-12">Milhares de pessoas já começaram sua jornada espiritual</p>

                    {/* Carousel */}
                    <div className="relative max-w-2xl mx-auto">
                        <div className="relative h-[500px] md:h-[600px] rounded-3xl overflow-hidden shadow-2xl">
                            {testimonialImages.map((image, index) => (
                                <div
                                    key={index}
                                    className={`absolute inset-0 transition-all duration-1000 ease-in-out ${index === currentSlide
                                        ? 'opacity-100 scale-100'
                                        : 'opacity-0 scale-95'
                                        }`}
                                >
                                    <img
                                        src={image}
                                        alt={`Cliente satisfeita ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                                </div>
                            ))}
                        </div>

                        {/* Carousel Indicators */}
                        <div className="flex justify-center gap-2 mt-6">
                            {testimonialImages.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentSlide(index)}
                                    className={`h-2 rounded-full transition-all duration-300 ${index === currentSlide
                                        ? 'w-8 bg-amber-600'
                                        : 'w-2 bg-amber-300 hover:bg-amber-400'
                                        }`}
                                    aria-label={`Ir para slide ${index + 1}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Flexibility Section */}
            <section className="py-20 px-6 bg-white">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-gradient-to-br from-orange-100 via-amber-50 to-yellow-100 p-10 md:p-12 rounded-3xl border-2 border-amber-200 shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-yellow-300/30 to-orange-300/30 rounded-full blur-3xl"></div>
                        <div className="relative z-10">
                            <div className="flex items-center justify-center mb-6">
                                <Clock className="text-amber-600" size={56} />
                            </div>
                            <h3 className="font-serif text-3xl md:text-4xl text-amber-900 font-bold mb-6 text-center">
                                📅 Sem Pressão, No Seu Ritmo
                            </h3>
                            <p className="text-gray-700 text-lg leading-relaxed text-center">
                                Este devocional <span className="font-bold text-amber-900 bg-white px-2 py-1 rounded">não tem datas fixas</span> – você pode iniciar sua jornada com Deus em qualquer momento do ano. Ele permite que você personalize sua leitura conforme sua rotina, <span className="font-bold text-amber-600 bg-white px-2 py-1 rounded">sem pressões ou culpa</span>.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section - ENHANCED */}
            <section className="py-24 px-6 bg-gradient-to-b from-white via-orange-50 to-amber-50">
                <div className="max-w-7xl mx-auto">
                    <h2 className="font-serif text-4xl md:text-5xl text-center text-transparent bg-clip-text bg-gradient-to-r from-amber-900 via-orange-700 to-amber-900 font-black mb-4">
                        Por que esse devocional foi feito pra você
                    </h2>
                    <div className="text-center mb-16">
                        <span className="inline-block bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-xl md:text-2xl px-8 py-3 rounded-full shadow-lg">
                            ⭐ É considerado o MELHOR DEVOCIONAL DE 2026
                        </span>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className={`bg-gradient-to-br ${feature.gradient} p-8 rounded-2xl border-2 border-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group relative overflow-hidden`}
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/50 rounded-full blur-2xl transform translate-x-16 -translate-y-16 group-hover:scale-150 transition-transform duration-500"></div>
                                <div className="relative z-10">
                                    <div className="mb-6 transform group-hover:scale-110 transition-transform duration-300">
                                        {feature.icon}
                                    </div>
                                    <h3 className="font-serif text-2xl text-gray-900 font-bold mb-4 leading-tight">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-700 leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-16">
                        <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600 animate-pulse">
                            E MUITO MAIS...
                        </p>
                    </div>
                </div>
            </section>

            {/* Pricing Section - ENHANCED WITH MOCKUP */}
            <section id="planos" className="py-24 px-6 bg-gradient-to-br from-amber-900 via-orange-800 to-amber-900 text-white relative overflow-hidden">
                {/* Animated Background */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 left-20 w-96 h-96 bg-yellow-400 rounded-full blur-3xl animate-float"></div>
                    <div className="absolute bottom-20 right-20 w-96 h-96 bg-orange-400 rounded-full blur-3xl animate-float-delayed"></div>
                </div>

                <div className="max-w-7xl mx-auto relative z-10">
                    <h2 className="font-serif text-4xl md:text-5xl text-center font-black mb-4">
                        Escolha seu plano e comece
                    </h2>
                    <p className="text-center text-yellow-100 text-xl mb-16">
                        Prepare-se para fazer de 2026 o melhor ano da sua vida mais próxima de Deus
                    </p>

                    <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
                        {/* Mockup Image - NOW IN PRICING SECTION */}
                        <div className="order-2 lg:order-1">
                            <div className="relative group">
                                <div className="absolute -inset-4 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-3xl blur-2xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
                                <img
                                    src="/images/devocional-tablet.jpg"
                                    alt="Devocional no Tablet"
                                    className="relative rounded-3xl shadow-2xl w-full transform hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                            <div className="mt-8 text-center">
                                <p className="text-yellow-100 text-lg font-light italic">
                                    "Acesse de qualquer dispositivo, a qualquer hora"
                                </p>
                            </div>
                        </div>

                        {/* Pricing Cards */}
                        <div className="space-y-8 order-1 lg:order-2">
                            {/* Plano Padrão */}
                            <div className="bg-white text-gray-900 rounded-3xl p-8 shadow-2xl border-4 border-amber-200 transform hover:scale-105 transition-all duration-300">
                                <h3 className="font-serif text-3xl font-bold mb-2">Plano Padrão</h3>
                                <div className="mb-6">
                                    <span className="text-5xl font-black text-amber-900">R$ 9,90</span>
                                    <span className="text-gray-600 ml-2">(pagamento único)</span>
                                </div>

                                <ul className="space-y-4 mb-8">
                                    <li className="flex items-start gap-3">
                                        <Check className="text-green-600 flex-shrink-0 mt-1" size={24} strokeWidth={3} />
                                        <span className="text-lg">Acesso ao devocional Diário</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <Check className="text-green-600 flex-shrink-0 mt-1" size={24} strokeWidth={3} />
                                        <span className="text-lg">Espaço de anotações</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <Check className="text-green-600 flex-shrink-0 mt-1" size={24} strokeWidth={3} />
                                        <span className="text-lg">Versículo chave do Dia</span>
                                    </li>
                                </ul>

                                <a
                                    href="https://pay.lowify.com.br/go.php?offer=k7y5v1g"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block w-full bg-gradient-to-r from-amber-900 to-orange-800 text-white text-center py-5 rounded-full font-bold text-xl hover:from-amber-800 hover:to-orange-700 transition-all shadow-xl hover:shadow-2xl transform hover:scale-105"
                                >
                                    Começar Agora →
                                </a>
                            </div>

                            {/* Plano Completo */}
                            <div className="bg-gradient-to-br from-yellow-400 via-amber-400 to-orange-400 text-gray-900 rounded-3xl p-8 shadow-2xl border-4 border-yellow-300 relative overflow-hidden transform hover:scale-105 transition-all duration-300">
                                <div className="absolute top-6 right-6 bg-amber-900 text-yellow-100 px-4 py-2 rounded-full text-sm font-bold shadow-lg animate-pulse">
                                    ⭐ MAIS POPULAR
                                </div>

                                <h3 className="font-serif text-3xl font-bold mb-2 text-amber-900">Plano Completo</h3>
                                <div className="mb-6">
                                    <span className="text-5xl font-black text-amber-900">R$ 19,90</span>
                                    <span className="text-amber-800 ml-2">(pagamento único)</span>
                                </div>

                                <ul className="space-y-4 mb-8">
                                    <li className="flex items-start gap-3">
                                        <Check className="text-amber-900 flex-shrink-0 mt-1" size={24} strokeWidth={3} />
                                        <span className="text-lg text-amber-900">Acesso ao devocional Diário</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <Check className="text-amber-900 flex-shrink-0 mt-1" size={24} strokeWidth={3} />
                                        <span className="text-lg text-amber-900">Espaço de anotações</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <Check className="text-amber-900 flex-shrink-0 mt-1" size={24} strokeWidth={3} />
                                        <span className="text-lg text-amber-900">Versículo chave do Dia</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <Check className="text-amber-900 flex-shrink-0 mt-1" size={24} strokeWidth={3} />
                                        <span className="text-lg font-bold text-amber-900">✨ Devocional em Áudio</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <Check className="text-amber-900 flex-shrink-0 mt-1" size={24} strokeWidth={3} />
                                        <span className="text-lg font-bold text-amber-900">🤖 ChatGPT Bíblico (I.A que responde com base na Bíblia)</span>
                                    </li>
                                </ul>

                                <a
                                    href="https://pay.lowify.com.br/go.php?offer=kcl2y7a"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block w-full bg-amber-900 text-yellow-100 text-center py-5 rounded-full font-bold text-xl hover:bg-amber-800 transition-all shadow-xl hover:shadow-2xl transform hover:scale-105"
                                >
                                    Começar Agora →
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Guarantee Section - ENHANCED */}
            <section className="py-20 px-6 bg-gradient-to-br from-green-50 to-emerald-50">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white p-10 md:p-12 rounded-3xl border-4 border-green-200 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-green-200/30 rounded-full blur-3xl"></div>
                        <div className="relative z-10">
                            <div className="text-center mb-8">
                                <div className="inline-block p-4 bg-green-100 rounded-full mb-6">
                                    <Shield className="text-green-600" size={72} strokeWidth={2} />
                                </div>
                                <h3 className="font-serif text-3xl md:text-4xl text-gray-900 font-black mb-4">
                                    Compra 100% Segura – Garantia de Satisfação!
                                </h3>
                            </div>

                            <p className="text-gray-700 text-lg leading-relaxed mb-6 text-center">
                                Sua tranquilidade é nossa prioridade! Se por qualquer motivo você não ficar satisfeita com o devocional, pode solicitar o <span className="font-bold text-green-700 bg-green-100 px-2 py-1 rounded">reembolso total do valor investido</span>, sem burocracia, dentro de <span className="font-bold text-green-700 bg-green-100 px-2 py-1 rounded">7 dias após a compra</span>.
                            </p>

                            <div className="bg-gradient-to-r from-green-100 to-emerald-100 p-6 rounded-2xl text-center border-2 border-green-200">
                                <p className="text-green-800 font-bold text-xl">
                                    ✅ Teste sem risco! Você tem 7 dias para conhecer o material e decidir se ele é ideal para você!
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section - ENHANCED */}
            <section className="py-24 px-6 bg-white">
                <div className="max-w-4xl mx-auto">
                    <h2 className="font-serif text-4xl md:text-5xl text-center text-transparent bg-clip-text bg-gradient-to-r from-amber-900 to-orange-700 font-black mb-16">
                        Perguntas Frequentes
                    </h2>

                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <div
                                key={index}
                                className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl border-2 border-amber-200 shadow-md overflow-hidden hover:shadow-xl transition-all"
                            >
                                <button
                                    onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                                    className="w-full p-6 text-left flex items-center justify-between hover:bg-amber-100/50 transition-colors"
                                >
                                    <span className="font-bold text-gray-900 pr-4 text-lg">{faq.question}</span>
                                    <div className={`flex-shrink-0 transform transition-transform duration-300 ${openFAQ === index ? 'rotate-180' : ''}`}>
                                        <ChevronDown className="text-amber-600" size={28} strokeWidth={3} />
                                    </div>
                                </button>

                                <div className={`transition-all duration-300 ease-in-out ${openFAQ === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
                                    <div className="px-6 pb-6 text-gray-700 leading-relaxed text-lg">
                                        {faq.answer}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA - ENHANCED */}
            <section className="py-24 px-6 bg-gradient-to-br from-amber-900 via-orange-800 to-amber-900 text-white text-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(251,191,36,0.4),transparent_70%)] animate-pulse"></div>
                </div>
                <div className="max-w-5xl mx-auto relative z-10">
                    <h2 className="font-serif text-4xl md:text-6xl font-black mb-8 leading-tight">
                        Pronta para transformar 2026?
                    </h2>
                    <p className="text-2xl text-yellow-100 mb-12 leading-relaxed">
                        Escolha seu plano e comece sua jornada com Deus hoje mesmo
                    </p>

                    <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                        <a
                            href="https://pay.lowify.com.br/go.php?offer=k7y5v1g"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-white text-amber-900 px-10 py-5 rounded-full font-bold text-xl hover:bg-yellow-50 transition-all shadow-2xl hover:shadow-yellow-400/50 transform hover:scale-110"
                        >
                            Plano Padrão - R$ 9,90
                        </a>
                        <a
                            href="https://pay.lowify.com.br/go.php?offer=kcl2y7a"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-gradient-to-r from-yellow-400 to-amber-400 text-amber-900 px-10 py-5 rounded-full font-bold text-xl hover:from-yellow-300 hover:to-amber-300 transition-all shadow-2xl hover:shadow-yellow-400/50 transform hover:scale-110 animate-pulse"
                        >
                            Plano Completo - R$ 19,90 ⭐
                        </a>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 px-6 bg-gray-900 text-white/80 text-center">
                <p className="text-base mb-2">
                    © 2026 Terapia com Deus - Autora: Talita Paixão
                </p>
                <p className="text-sm">
                    Todos os direitos reservados
                </p>
            </footer>

            {/* Custom Animations */}
            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-20px); }
                }
                @keyframes float-delayed {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-30px); }
                }
                @keyframes scroll-infinite {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(calc(-100% / 3)); }
                }
                @keyframes fade-in-down {
                    from {
                        opacity: 0;
                        transform: translateY(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                @keyframes fade-in-up {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-float {
                    animation: float 6s ease-in-out infinite;
                }
                .animate-float-delayed {
                    animation: float-delayed 8s ease-in-out infinite;
                }
                .animate-scroll-infinite {
                    animation: scroll-infinite 30s linear infinite;
                }
                .animate-fade-in-down {
                    animation: fade-in-down 0.8s ease-out;
                }
                .animate-fade-in-up {
                    animation: fade-in-up 0.8s ease-out;
                }
                .animation-delay-200 {
                    animation-delay: 0.2s;
                    animation-fill-mode: both;
                }
                .animation-delay-300 {
                    animation-delay: 0.3s;
                    animation-fill-mode: both;
                }
                .animation-delay-400 {
                    animation-delay: 0.4s;
                    animation-fill-mode: both;
                }
                .animation-delay-500 {
                    animation-delay: 0.5s;
                    animation-fill-mode: both;
                }
            `}</style>
        </div>
    );
};
