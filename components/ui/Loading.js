import { Heart } from 'lucide-react';
import React from 'react'

function Loading() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
            <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-6">
                    <Heart className="h-8 w-8 text-white animate-pulse" />
                </div>
                <div className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Loading HeartGuard...
                </div>
                
                <div className="mt-4 flex justify-center space-x-1">
                    {[0, 1, 2].map((i) => (
                        <div
                            key={i}
                            className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                            style={{ animationDelay: `${i * 0.1}s` }}
                        ></div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Loading
