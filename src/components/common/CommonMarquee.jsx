import React from 'react';

const CommonMarquee = ({ 
    data, 
    CardComponent, 
    direction = 'normal', 
    duration = '40s',     
    className = "" 
}) => {
    
    const marqueeData = [...data, ...data, ...data, ...data];

    return (
        <div className={`relative w-full overflow-hidden pause-on-hover py-2 ${className}`}>
            <div 
                className="animate-marquee flex"
                style={{ 
                    animationDuration: duration,
                    animationDirection: direction
                }}
            >
                {marqueeData.map((item, index) => (
                    <div key={`${item.id}-${index}`} className="mx-0 flex-shrink-0">
                        <CardComponent data={item} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CommonMarquee;