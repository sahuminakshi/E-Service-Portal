
import React, { useState, useEffect } from 'react';
import Icon from '../../components/ui/Icon';

const WelcomePage = ({ onNavigateToAuth }: { onNavigateToAuth: () => void }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    { icon: 'shield-check', title: 'Verified Professionals', description: 'Every technician is vetted, ensuring you get trusted and high-quality service every time.' },
    { icon: 'calendar', title: 'Seamless Scheduling', description: 'Pick your perfect time with our intuitive calendar. Reschedule or cancel with ease.' },
    { icon: 'bolt', title: 'Transparent Process', description: 'From request to completion, track your service status and communicate directly with your technician.' },
  ];
  
  const testimonials = [
      { quote: 'The easiest way I’ve ever booked a plumbing service. The technician was professional and on time. Highly recommend!', name: 'Sarah L.', role: 'Homeowner', avatar: 'https://picsum.photos/seed/sarah/100/100' },
      { quote: 'As a technician, this platform has been a game-changer for my business. I get a steady stream of jobs and manage them all in one place.', name: 'John W.', role: 'Plumbing Specialist', avatar: 'https://picsum.photos/seed/john/100/100' },
      { quote: 'I needed urgent IT support for my home office, and E-Service Pro delivered. I was connected with a tech in minutes. Fantastic service!', name: 'Michael B.', role: 'Remote Worker', avatar: 'https://picsum.photos/seed/michael/100/100' },
  ];
  
  const faqs = [
    { q: 'How do I request a service?', a: 'Once you sign up and log in as a customer, you can click on the "New Request" button from your dashboard to fill out service details and schedule a time.' },
    { q: 'How do I become a technician?', a: 'During signup, select the "Technician" role and choose your specialty. Once registered, your profile will be reviewed, and you can start accepting jobs.' },
    { q: 'What happens if I need to cancel?', a: 'You can cancel a request directly from your dashboard. Please refer to our cancellation policy for details regarding timing and potential fees.' },
  ];

  return (
    <div className="w-full min-h-screen bg-white text-brand-gray-dark font-sans antialiased">
      {/* Header */}
      <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/80 backdrop-blur-md shadow-sm' : 'bg-transparent'}`}>
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Icon name="shield-check" className="w-8 h-8 text-brand-blue" />
            <span className="ml-2 text-xl font-bold tracking-wide">E-Service Pro</span>
          </div>
          <button onClick={onNavigateToAuth} className="px-5 py-2 bg-brand-blue text-white rounded-lg font-semibold hover:bg-brand-blue-dark transition-colors shadow-sm hover:shadow-md">
            Login / Sign Up
          </button>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative text-center pt-24 pb-32 px-6 overflow-hidden">
             <div className="absolute top-0 left-0 -z-10 h-full w-full bg-white bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(14,165,233,0.15),rgba(255,255,255,0))]"></div>
            <div className="container mx-auto animate-fade-in-up">
                <h1 className="text-5xl lg:text-7xl font-black text-brand-gray-dark tracking-tight leading-tight">
                    Reliable Service, <br/>
                    <span className="text-brand-blue">Perfectly Scheduled.</span>
                </h1>
                <p className="mt-6 text-lg lg:text-xl text-brand-gray max-w-2xl mx-auto">
                    Your search for trusted, skilled technicians ends here. For every task, for every trade, we connect you with the best professionals, hassle-free.
                </p>
                <button
                onClick={onNavigateToAuth} 
                className="mt-10 px-10 py-4 bg-brand-blue text-white rounded-full font-bold text-lg shadow-lg hover:shadow-xl hover:scale-105 transform transition-all duration-300"
                >
                Get Started Now
                </button>
            </div>
        </section>

        {/* Features Section */}
        <section className="py-24 px-6 bg-brand-gray-light">
          <div className="container mx-auto">
            <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-brand-gray-dark">The Future of Service Management</h2>
                <p className="mt-3 text-lg text-brand-gray max-w-2xl mx-auto">An experience designed for your peace of mind and convenience.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature) => (
                <div key={feature.title} className="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  <div className="inline-block p-4 bg-brand-blue-light rounded-xl mb-5">
                    <Icon name={feature.icon} className="w-8 h-8 text-brand-blue" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-slate-800">{feature.title}</h3>
                  <p className="text-brand-gray">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Testimonials Section */}
        <section className="py-24 px-6 bg-white">
            <div className="container mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-brand-gray-dark">What Our Users Say</h2>
                    <p className="mt-3 text-lg text-brand-gray max-w-2xl mx-auto">Trusted by homeowners and technicians alike.</p>
                </div>
                <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8">
                   {testimonials.map((testimonial, i) => (
                       <div key={i} className="bg-slate-50 p-8 rounded-xl flex flex-col">
                           <Icon name="star" className="w-8 h-8 text-amber-400 mb-4"/>
                           <p className="text-slate-600 flex-grow">"{testimonial.quote}"</p>
                           <div className="flex items-center mt-6">
                               <img src={testimonial.avatar} alt={testimonial.name} className="w-12 h-12 rounded-full object-cover"/>
                               <div className="ml-4">
                                   <p className="font-semibold text-slate-800">{testimonial.name}</p>
                                   <p className="text-sm text-slate-500">{testimonial.role}</p>
                               </div>
                           </div>
                       </div>
                   ))}
                </div>
            </div>
        </section>


        {/* FAQ Section */}
        <section className="py-24 px-6 bg-brand-gray-light">
         <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-brand-gray-dark">Frequently Asked Questions</h2>
          </div>
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <details key={i} className="bg-white p-6 rounded-lg shadow-sm group" open={i === 0}>
                  <summary className="font-semibold text-lg flex justify-between items-center list-none cursor-pointer text-slate-800">
                    <span>{faq.q}</span>
                    <span className="relative ml-4 w-5 h-5 flex-shrink-0">
                      <Icon name="plus" className="h-5 w-5 transition-transform duration-300 transform group-open:rotate-45 group-open:opacity-0" />
                       <Icon name="minus" className="absolute top-0 left-0 h-5 w-5 transition-transform duration-300 opacity-0 group-open:opacity-100" />
                    </span>
                  </summary>
                  <p className="mt-4 text-slate-600 pr-4">{faq.a}</p>
                </details>
              ))}
            </div>
         </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="bg-brand-gray-dark text-white">
        <div className="container mx-auto px-6 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="col-span-1 md:col-span-2">
                    <h4 className="text-xl font-bold mb-2">E-Service Pro</h4>
                    <p className="text-slate-400 max-w-sm">The most reliable way to connect with professional service technicians for all your needs.</p>
                </div>
                <div>
                    <h5 className="font-semibold mb-3">Links</h5>
                    <ul className="space-y-2 text-slate-300">
                        <li><a href="#" className="hover:text-white">About Us</a></li>
                        <li><a href="#" className="hover:text-white">Careers</a></li>
                        <li><a href="#" className="hover:text-white">Press</a></li>
                    </ul>
                </div>
                 <div>
                    <h5 className="font-semibold mb-3">Legal</h5>
                    <ul className="space-y-2 text-slate-300">
                        <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                        <li><a href="#" className="hover:text-white">Terms of Service</a></li>
                        <li><a href="#" className="hover:text-white">Contact Us</a></li>
                    </ul>
                </div>
            </div>
            <div className="mt-10 pt-8 border-t border-slate-700 text-center text-slate-400 text-sm">
                <p>&copy; {new Date().getFullYear()} E-Service Pro Portal. All rights reserved.</p>
            </div>
        </div>
      </footer>
       <style>{`
          @keyframes fade-in-up {
              0% {
                  opacity: 0;
                  transform: translateY(20px);
              }
              100% {
                  opacity: 1;
                  transform: translateY(0);
              }
          }
          .animate-fade-in-up {
              animation: fade-in-up 0.8s ease-out forwards;
          }
          details > summary {
              list-style: none;
          }
          details > summary::-webkit-details-marker {
              display: none;
          }
          .group[open] .group-open\\:rotate-45 {
             transform: rotate(45deg);
          }
          .group[open] .group-open\\:opacity-0 {
              opacity: 0;
          }
          .group[open] .group-open\\:opacity-100 {
              opacity: 1;
          }
      `}</style>
    </div>
  );
};

export default WelcomePage;