import React, { useState, useEffect } from 'react';
import {
  Sun,
  Moon,
  Sunrise,
  Sunset,
  Layers,
  Sparkles,
  CloudRain,
  Wind,
  Sparkle,
  Zap,
  Volume2,
  VolumeX,
  RotateCcw,
  Pause,
  Play,
} from 'lucide-react';
import { WorldState, WeatherType } from '../../types';
import { resolveEffectiveWeather } from '../../three/WeatherSystem';
import { weatherAudio } from '../../lib/audio/weatherAudio';

interface WorldControlsProps {
  worldState: WorldState;
  weather?: WeatherType;
  activeDaysThisWeek?: number;
  hasLearnedToday?: boolean;
  autoRotate?: boolean;
  onChangeTimeOfDay: (time: WorldState['timeOfDay']) => void;
  onChangeWeather: (weather: WeatherType) => void;
  onToggleAutoRotate?: (autoRotate: boolean) => void;
  lowPowerMode: boolean;
  onToggleLowPower: () => void;
  onTriggerBloom: () => void;
  onResetView?: () => void;
}

export const WorldControls: React.FC<WorldControlsProps> = ({
  worldState,
  weather = 'auto',
  activeDaysThisWeek = 3,
  hasLearnedToday = false,
  autoRotate = false,
  onChangeTimeOfDay,
  onChangeWeather,
  onToggleAutoRotate,
  lowPowerMode,
  onToggleLowPower,
  onTriggerBloom,
  onResetView,
}) => {
  const [showWeatherMenu, setShowWeatherMenu] = useState(false);
  const [isSoundOn, setIsSoundOn] = useState(false);

  const { type: currentEffectiveWeather, reason } = resolveEffectiveWeather(
    weather,
    worldState.timeOfDay,
    activeDaysThisWeek,
    hasLearnedToday
  );

  // Sync audio mode whenever weather or time shifts
  useEffect(() => {
    if (isSoundOn) {
      weatherAudio.setMode(currentEffectiveWeather);
    }
  }, [currentEffectiveWeather, isSoundOn]);

  const toggleSound = async () => {
    await weatherAudio.init();
    const newState = weatherAudio.toggle(currentEffectiveWeather);
    setIsSoundOn(newState);
  };

  const weatherIcons: Record<string, string> = {
    sunny: '☀️',
    gentle_rain: '🌧️',
    breezy_mist: '🍃',
    twilight_aurora: '🌌',
  };

  return (
    <div className="absolute top-4 right-4 z-20 flex flex-col items-end gap-2">
      <div className="flex flex-wrap items-center justify-end gap-2">
        {/* Ambient Garden Music & Weather Sound Toggle */}
        <button
          type="button"
          onClick={toggleSound}
          className={`px-3 py-2 rounded-2xl backdrop-blur border text-xs font-bold flex items-center gap-1.5 transition active:scale-95 cursor-pointer shadow-sm ${
            isSoundOn
              ? 'bg-emerald-600 text-white border-emerald-500 shadow-emerald-600/25 ring-2 ring-emerald-400/40'
              : 'bg-white/90 border-stone-200/80 text-stone-700 hover:text-stone-900 hover:bg-white'
          }`}
          title={isSoundOn ? 'Pause Garden Music & Ambiance' : `Play Tranquil Garden Music & ${currentEffectiveWeather.replace('_', ' ')} Soundscape`}
        >
          {isSoundOn ? (
            <>
              <Volume2 className="w-3.5 h-3.5 text-white animate-pulse" />
              <span>Music: Playing 🎵</span>
            </>
          ) : (
            <>
              <VolumeX className="w-3.5 h-3.5 text-stone-500" />
              <span>Play Music 🎵</span>
            </>
          )}
        </button>

        {/* Stop Spinning / Spin World Toggle */}
        {onToggleAutoRotate && (
          <button
            type="button"
            onClick={() => onToggleAutoRotate(!autoRotate)}
            className={`px-3 py-2 rounded-2xl backdrop-blur border text-xs font-bold flex items-center gap-1.5 transition active:scale-95 cursor-pointer shadow-sm ${
              autoRotate
                ? 'bg-amber-100 text-amber-950 border-amber-300'
                : 'bg-white/90 border-stone-200/80 text-stone-700 hover:text-stone-900 hover:bg-white'
            }`}
            title={autoRotate ? 'Stop world spinning (prevents dizziness)' : 'Start gentle world rotation'}
          >
            {autoRotate ? (
              <>
                <Pause className="w-3.5 h-3.5 text-amber-800" />
                <span>Stop Spinning</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-stone-500 fill-stone-500" />
                <span>Spin World</span>
              </>
            )}
          </button>
        )}

        {/* Reset Camera / View */}
        {onResetView && (
          <button
            type="button"
            onClick={onResetView}
            className="px-3 py-2 rounded-2xl bg-white/90 hover:bg-white backdrop-blur border border-stone-200/80 shadow-sm text-xs font-semibold text-stone-700 flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
            title="Reset 3D World Camera View"
          >
            <RotateCcw className="w-3.5 h-3.5 text-stone-500" />
            <span className="hidden sm:inline">Reset View</span>
          </button>
        )}

        {/* Active Weather Badge */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowWeatherMenu(!showWeatherMenu)}
            className="px-3 py-2 rounded-2xl bg-white/90 hover:bg-white backdrop-blur border border-stone-200/80 shadow-sm text-xs font-bold text-stone-800 flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
            title="Dynamic Weather System (Adapts to streak and time)"
          >
            <span>{weatherIcons[currentEffectiveWeather] || '☀️'}</span>
            <span className="capitalize">{currentEffectiveWeather.replace('_', ' ')}</span>
            {weather === 'auto' && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold uppercase">
                Auto
              </span>
            )}
          </button>

          {/* Weather Dropdown */}
          {showWeatherMenu && (
            <div className="absolute right-0 top-11 z-30 w-64 p-3 bg-white/95 backdrop-blur-lg rounded-2xl border border-stone-200 shadow-xl space-y-2 animate-fade-in text-xs">
              <div className="font-extrabold text-stone-900 flex items-center justify-between pb-1 border-b border-stone-100">
                <span>Garden Weather</span>
                <span className="text-[10px] text-stone-500 font-normal">Streak-responsive</span>
              </div>

              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => {
                    onChangeWeather('auto');
                    setShowWeatherMenu(false);
                  }}
                  className={`w-full p-2 rounded-xl text-left font-medium transition flex items-center justify-between ${
                    weather === 'auto'
                      ? 'bg-emerald-50 text-emerald-900 font-bold border border-emerald-200'
                      : 'hover:bg-stone-50 text-stone-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Zap className="w-3.5 h-3.5 text-amber-500" />
                    <span>Auto (Dynamic Streak)</span>
                  </div>
                  {weather === 'auto' && <span className="text-emerald-600 font-bold">✓</span>}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onChangeWeather('sunny');
                    setShowWeatherMenu(false);
                  }}
                  className={`w-full p-2 rounded-xl text-left font-medium transition flex items-center justify-between ${
                    weather === 'sunny'
                      ? 'bg-amber-50 text-amber-900 font-bold border border-amber-200'
                      : 'hover:bg-stone-50 text-stone-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>☀️</span>
                    <span>Sunny (High Activity)</span>
                  </div>
                  {weather === 'sunny' && <span className="text-amber-600 font-bold">✓</span>}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onChangeWeather('gentle_rain');
                    setShowWeatherMenu(false);
                  }}
                  className={`w-full p-2 rounded-xl text-left font-medium transition flex items-center justify-between ${
                    weather === 'gentle_rain'
                      ? 'bg-blue-50 text-blue-900 font-bold border border-blue-200'
                      : 'hover:bg-stone-50 text-stone-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>🌧️</span>
                    <span>Gentle Rain (Rest Day)</span>
                  </div>
                  {weather === 'gentle_rain' && <span className="text-blue-600 font-bold">✓</span>}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onChangeWeather('breezy_mist');
                    setShowWeatherMenu(false);
                  }}
                  className={`w-full p-2 rounded-xl text-left font-medium transition flex items-center justify-between ${
                    weather === 'breezy_mist'
                      ? 'bg-emerald-50 text-emerald-900 font-bold border border-emerald-200'
                      : 'hover:bg-stone-50 text-stone-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>🍃</span>
                    <span>Breezy Mist</span>
                  </div>
                  {weather === 'breezy_mist' && <span className="text-emerald-600 font-bold">✓</span>}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onChangeWeather('twilight_aurora');
                    setShowWeatherMenu(false);
                  }}
                  className={`w-full p-2 rounded-xl text-left font-medium transition flex items-center justify-between ${
                    weather === 'twilight_aurora'
                      ? 'bg-purple-50 text-purple-900 font-bold border border-purple-200'
                      : 'hover:bg-stone-50 text-stone-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>🌌</span>
                    <span>Twilight Aurora</span>
                  </div>
                  {weather === 'twilight_aurora' && <span className="text-purple-600 font-bold">✓</span>}
                </button>
              </div>

              <div className="pt-1 border-t border-stone-100 text-[10px] text-stone-500 italic">
                "{reason}"
              </div>
            </div>
          )}
        </div>

        {/* Time of Day Switcher */}
        <div className="flex items-center gap-1 bg-white/90 backdrop-blur p-1 rounded-2xl border border-stone-200/80 shadow-sm">
          <button
            type="button"
            onClick={() => onChangeTimeOfDay('morning')}
            className={`p-1.5 rounded-xl text-xs transition cursor-pointer ${
              worldState.timeOfDay === 'morning'
                ? 'bg-amber-100 text-amber-900 font-bold'
                : 'text-stone-500 hover:text-stone-800'
            }`}
            title="Morning Dawn"
          >
            <Sunrise className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onChangeTimeOfDay('afternoon')}
            className={`p-1.5 rounded-xl text-xs transition cursor-pointer ${
              worldState.timeOfDay === 'afternoon'
                ? 'bg-amber-100 text-amber-900 font-bold'
                : 'text-stone-500 hover:text-stone-800'
            }`}
            title="Afternoon Sun"
          >
            <Sun className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onChangeTimeOfDay('dusk')}
            className={`p-1.5 rounded-xl text-xs transition cursor-pointer ${
              worldState.timeOfDay === 'dusk'
                ? 'bg-purple-100 text-purple-900 font-bold'
                : 'text-stone-500 hover:text-stone-800'
            }`}
            title="Dusk Twilight"
          >
            <Sunset className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onChangeTimeOfDay('night')}
            className={`p-1.5 rounded-xl text-xs transition cursor-pointer ${
              worldState.timeOfDay === 'night'
                ? 'bg-indigo-100 text-indigo-900 font-bold'
                : 'text-stone-500 hover:text-stone-800'
            }`}
            title="Night Stars"
          >
            <Moon className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onChangeTimeOfDay('auto')}
            className={`px-2 py-1 rounded-xl text-[11px] font-medium transition cursor-pointer ${
              worldState.timeOfDay === 'auto'
                ? 'bg-emerald-100 text-emerald-900 font-bold'
                : 'text-stone-500 hover:text-stone-800'
            }`}
            title="Match Local Time"
          >
            Auto
          </button>
        </div>

        {/* Bloom Button */}
        <button
          type="button"
          onClick={onTriggerBloom}
          className="px-3 py-2 rounded-2xl bg-white/90 hover:bg-white backdrop-blur border border-emerald-200/80 shadow-sm text-xs font-semibold text-emerald-800 flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
          title="Trigger sprout blossom"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span className="hidden sm:inline">Bloom</span>
        </button>

        {/* 2D / 3D Toggle */}
        <button
          type="button"
          onClick={onToggleLowPower}
          className={`px-3 py-2 rounded-2xl backdrop-blur border text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
            lowPowerMode
              ? 'bg-amber-100 border-amber-300 text-amber-900'
              : 'bg-white/90 border-stone-200/80 text-stone-700 hover:bg-white'
          }`}
          title="Toggle lightweight 2D world view"
        >
          <Layers className="w-3.5 h-3.5" />
          <span>{lowPowerMode ? '2D View' : '3D World'}</span>
        </button>
      </div>

      {/* Weather Subtitle Callout Pill */}
      <div className="bg-white/80 backdrop-blur px-3 py-1 rounded-full text-[11px] text-stone-600 border border-stone-200/70 shadow-sm pointer-events-none">
        {reason}
      </div>
    </div>
  );
};
