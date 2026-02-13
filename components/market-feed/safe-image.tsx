import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { ImageOff } from 'lucide-react';

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    fallbackSrc?: string;
}

export function SafeImage({ src, alt, className, fallbackSrc, ...props }: SafeImageProps) {
    const [error, setError] = useState(false);

    if (error || !src) {
        if (fallbackSrc) {
            return (
                <img
                    src={fallbackSrc}
                    alt={alt}
                    className={className}
                    {...props}
                    onError={(e) => {
                        // Prevent infinite loop if fallback also fails
                        e.currentTarget.src = '';
                        e.currentTarget.style.display = 'none';
                    }}
                />
            );
        }
        return (
            <div className={cn("flex items-center justify-center bg-slate-800 text-slate-500", className)}>
                <span className="sr-only">{alt}</span>
                <ImageOff className="h-4 w-4" />
            </div>
        );
    }

    return (
        <img
            src={src}
            alt={alt}
            className={className}
            onError={() => setError(true)}
            {...props}
        />
    );
}
