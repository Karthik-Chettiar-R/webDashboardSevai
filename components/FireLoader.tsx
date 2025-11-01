import React from "react";
import "./FireLoader.css";

export interface FireLoaderProps {
  /** Overall size of the component in pixels (default: 120) */
  size?: number;
  /** Growth stage of the fire from 0 (pre-ignition) to 4 (full) */
  stage?: 0 | 1 | 2 | 3 | 4;
  /** Primary flame color (default: #ef5a00) */
  flameColor?: string;
  /** Glow color for the flame (default: #d43322) */
  glowColor?: string;
  /** Ember color (default: #ff4500) */
  emberColor?: string;
  /** Additional CSS class for the container */
  className?: string;
}

/**
 * FireLoader - Campfire animated loader (pure CSS)
 * 
 * A customizable campfire loading animation with adjustable colors and growth stages
 * 
 * @example
 * // Basic usage
 * <FireLoader />
 * 
 * // Custom size
 * <FireLoader size={160} />
 * 
 * // Custom flame colors
 * <FireLoader flameColor="#4286f4" glowColor="#2a5298" />
 * 
 * // Growth stages (0-4)
 * <FireLoader stage={2} />
 * 
 * // Pre-ignition stage (just embers, no flames)
 * <FireLoader stage={0} />
 */
export const FireLoader: React.FC<FireLoaderProps> = ({ 
  size = 120, 
  stage = 4,
  flameColor = "#ef5a00",
  glowColor = "#d43322",
  emberColor = "#ff4500",
  className = "" 
}) => {
  // Generate custom styles for colors
  const colorStyles = {
    "--flame-color": flameColor,
    "--flame-glow": glowColor,
    "--ember-color": emberColor,
  } as React.CSSProperties;

  return (
    <div
      className={className}
      style={{ width: size, height: size, display: "inline-block" }}
    >
      <div 
        className={`campfire ${stage === 0 ? "pre-ignition" : ""}`}
        style={colorStyles}
      >
        <div className="fire">
          {stage >= 4 && (
            <div className="fire-left">
              <div className="main-fire" />
              <div className="particle-fire" />
            </div>
          )}
          {stage >= 1 && (
            <div className="fire-center">
              <div className="main-fire" />
              <div className="particle-fire" />
            </div>
          )}
          {stage >= 3 && (
            <div className="fire-right">
              <div className="main-fire" />
              <div className="particle-fire" />
            </div>
          )}
          {stage >= 2 && (
            <div className="fire-bottom">
              <div className="main-fire" />
            </div>
          )}
        </div>
        <div className="wood">
          <div className="wood-piece wood-1" />
          <div className="wood-piece wood-2" />
          <div className="wood-piece wood-3" />
          <div className={`ember ember-1 ${stage === 0 ? "pre-ignition-ember" : ""}`} />
          <div className={`ember ember-2 ${stage === 0 ? "pre-ignition-ember" : ""}`} />
          <div className={`ember ember-3 ${stage === 0 ? "pre-ignition-ember" : ""}`} />
          {stage === 0 && (
            <>
              <div className="ember pre-ignition-ember ember-4" />
              <div className="ember pre-ignition-ember ember-5" />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FireLoader;
