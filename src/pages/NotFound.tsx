import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const CUSTOM_IMAGE_URL = '/img/404.png'; 

const NotFound: React.FC = () => {
    const bgColor = "bg-emerald-50"; 
    
    const slowSpinClass = "animate-[spin_5s_linear_infinite]";

    return (
        <div className={`min-h-screen flex items-center justify-center p-4 text-center relative overflow-hidden ${bgColor}`}>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="z-10 w-full max-w-5xl"
            >
                
                <div className="flex items-center justify-center my-6  sm:my-10 sm:gap-4">
                    
                    <motion.span
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-[150px] sm:text-[250px] md:text-[350px] font-extrabold text-green-600/80 leading-none"
                    >
                        4
                    </motion.span>

                
                    <div className="w-48 h-48 sm:w-64 sm:h-64 mt-[-40px] mb-[-40px] sm:my-0"> 
                        <img 
                            src={CUSTOM_IMAGE_URL} 
                            alt="No Produce Zone Illustration" 
                            className={`w-full h-full object-contain opacity-80 rounded-full ${slowSpinClass}`} 
                        />
                    </div>

                    <motion.span
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-[150px] sm:text-[250px] md:text-[350px] font-extrabold text-green-700/80 leading-none"
                    >
                        4
                    </motion.span>
                </div>
                
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="mt-6 text-lg sm:text-xl text-gray-700 font-medium px-4"
                >
                    Halaman ini hilang, jangan biarkan kesehatan lingkungan ikut hilang juga.
                </motion.p>
                
                <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        to="/"
                        className="flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-green-600 hover:bg-green-700 transition-colors shadow-lg w-full sm:w-auto"
                    >
                        <Home className="w-5 h-5 mr-2" />
                        Go to Home
                    </Link>
                    <button
                        onClick={() => window.history.back()}
                        className="flex items-center justify-center px-8 py-3 border border-gray-300 text-base font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-100 transition-colors shadow-sm w-full sm:w-auto"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Go Back
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default NotFound;