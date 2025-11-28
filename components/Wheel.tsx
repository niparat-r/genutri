import React, { useEffect, useRef, useState } from 'react';
import { MenuItem } from '../types';

interface WheelProps {
  items: MenuItem[];
  onSpinEnd: (selectedItem: MenuItem) => void;
  isSpinning: boolean;
}

const Wheel: React.FC<WheelProps> = ({ items, onSpinEnd, isSpinning }) => {
  // Limit wheel items to display to prevent overcrowding (e.g., random 10 or first 10)
  // For this demo, we'll take a subset if the list is huge, or just render all if < 20.
  // 50 items is too small for a wheel, so let's pick 12 random items to show on the wheel each round
  // or just use 12 fixed segments representing "potential" choices if we want visual clarity.
  // BUT, to be "real", let's pick 12 items from the list to populate the wheel.
  
  const [displayItems, setDisplayItems] = useState<MenuItem[]>([]);
  const [rotation, setRotation] = useState(0);
  
  useEffect(() => {
    // Shuffle and pick 12 items for the wheel visual
    const shuffled = [...items].sort(() => 0.5 - Math.random());
    setDisplayItems(shuffled.slice(0, 12));
  }, [items]);

  const wheelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isSpinning && displayItems.length > 0) {
      // Calculate a new rotation
      const newRotation = rotation + 1440 + Math.random() * 360; // Spin at least 4 times
      setRotation(newRotation);

      // Determine winning item based on rotation
      // The wheel pointer is usually at 0 degrees (top) or 90 degrees (right).
      // Let's assume pointer is at Top (0 deg).
      // The segment at 0 deg is the one that "wins".
      // Rotation moves the wheel CLOCKWISE.
      // So the Winning Index is calculated by:
      // Modulo 360 gives the final angle.
      // 360 - (finalAngle % 360) gives the counter-clockwise position relative to 0.
      
      const segmentAngle = 360 / displayItems.length;
      const finalAngle = newRotation % 360;
      const winningIndex = Math.floor(((360 - finalAngle) % 360) / segmentAngle);
      
      // Wait for animation to finish
      const timeout = setTimeout(() => {
        onSpinEnd(displayItems[winningIndex]);
      }, 4000); // Matches CSS transition time

      return () => clearTimeout(timeout);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSpinning]);

  const colors = [
    '#EF4444', '#F97316', '#F59E0B', '#EAB308', 
    '#84CC16', '#22C55E', '#10B981', '#14B8A6', 
    '#06B6D4', '#0EA5E9', '#3B82F6', '#6366F1'
  ];

  return (
    <div className="relative w-full max-w-md mx-auto aspect-square">
      {/* Pointer */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 z-20">
        <div className="w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-t-[40px] border-t-slate-800 drop-shadow-lg"></div>
      </div>

      {/* Wheel */}
      <div 
        ref={wheelRef}
        className="wheel-container w-full h-full border-4 border-slate-800 bg-white"
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        {displayItems.map((item, index) => {
          const rotationAngle = (360 / displayItems.length) * index;
          return (
            <div
              key={item.id}
              className="wheel-segment origin-bottom-right"
              style={{
                transform: `rotate(${rotationAngle}deg) skewY(-${90 - (360 / displayItems.length)}deg)`,
                backgroundColor: colors[index % colors.length],
              }}
            >
              <div 
                  className="wheel-text"
                  style={{
                      transform: `skewY(${90 - (360 / displayItems.length)}deg) rotate(${360 / displayItems.length / 2}deg)`
                  }}
              >
                  <span className="truncate w-3/4 text-right pr-4 drop-shadow-md">
                    {item.name_th}
                  </span>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Center Cap */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-slate-800 rounded-full border-4 border-white shadow-xl flex items-center justify-center z-10">
        <span className="text-white font-bold text-xs">SPIN</span>
      </div>
    </div>
  );
};

export default Wheel;