import { useState, useEffect } from 'react';

export default function Home() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [bg, setBg] = useState('default');

  function getBackground(id) {
    if (id >= 200 && id < 300) return 'stormy';
    if (id >= 300 && id < 600) return 'rainy';
    if (id >= 600 && id < 700) return 'snowy';
    if (id >= 700 && id < 800) return 'foggy';
    if (id === 800) return 'sunny';
    return 'cloudy';
  }

  const backgrounds = {
    default: 'linear-gradient(135deg, #1a1a2e, #16213e, #0f3460)',
    sunny:   'linear-gradient(135deg, #f9c74f, #f8961e, #f3722c)',
    cloudy:  'linear-gradient(135deg, #74b9ff, #a29bfe, #6c5ce7)',
    rainy:   'linear-gradient(135deg, #2d3436, #636e72, #4a6fa5)',
    stormy:  'linear-gradient(135deg, #0d0d0d, #1a1a2e, #2d3436)',
    snowy:   'linear-gradient(135deg, #d6e4f0, #a8d8ea, #74b9ff)',
    foggy:   'linear-gradient(135deg, #b2bec3, #636e72, #2d3436)',
  };

  function weatherEmoji(id) {
    if (id >= 200 && id < 300) return '⛈️';
    if (id >= 300 && id < 400) return '🌦️';
    if (id >= 500 && id < 600) return '🌧️';
    if (id >= 600 && id < 700) return '❄️';
    if (id >= 700 && id < 800) return '🌫️';
    if (id === 800)             return '☀️';
    if (id === 801)             return '🌤️';
    if (id <= 804)              return '☁️';
    return '🌡️';
  }

  function renderParticles(type) {
    if (type === 'rainy' || type === 'stormy') {
      return Array.from({ length: 60 }).map((_, i) => (
        <div key={i} style={{
          position: 'fixed',
          left: `${Math.random() * 100}vw`,
          top: '-20px',
          width: '2px',
          height: `${Math.random() * 20 + 10}px`,
          background: 'rgba(255,255,255,0.4)',
          borderRadius: '2px',
          animation: `fall ${Math.random() * 0.6 + 0.6}s linear ${Math.random() * 2}s infinite`,
          pointerEvents: 'none',
          zIndex: 0,
        }} />
      ));
    }
    if (type === 'snowy') {
      return Array.from({ length: 40 }).map((_, i) => {
        const size = Math.random() * 8 + 4;
        return (
          <div key={i} style={{
            position: 'fixed',
            left: `${Math.random() * 100}vw`,
            top: '-10px',
            width: `${size}px`,
            height: `${size}px`,
            background: 'rgba(255,255,255,0.8)',
            borderRadius: '50%',
            animation: `snowfall ${Math.random() * 4 + 4}s linear ${Math.random() * 5}s infinite`,
            pointerEvents: 'none',
            zIndex: 0,
          }} />
        );
      });
    }
    if (type === 'sunny') {
      return (
        <div style={{
          position: 'fixed',
          top: '-150px', right: '-150px',
          width: '400px', height: '400px',
          pointerEvents: 'none',
          zIndex: 0,
        }}>
          <div style={{
            position: 'absolute',
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '120px', height: '120px',
            background: 'rgba(255,255,255,0.3)',
            borderRadius: '50%',
          }} />
          <div style={{
            position: 'absolute',
            top: '50%', left: '50%',
            width: '400px', height: '400px',
            animation: 'rotateSun 10s linear infinite',
            transform: 'translate(-50%, -50%)',
          }}>
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} style={{
                position: 'absolute',
                top: '50%', left: '50%',
                width: '180px', height: '3px',
                background: 'linear-gradient(to right, rgba(255,255,255,0.4), transparent)',
                transformOrigin: 'left center',
                transform: `rotate(${(360 / 12) * i}deg)`,
                borderRadius: '2px',
              }} />
            ))}
          </div>
        </div>
      );
    }
    return null;
  }

  async function getWeather() {
    if (!city) return;
    setLoading(true);
    setError('');
    setWeather(null);

    const res = await fetch(`/api/weather?city=${city}`);
    const data = await res.json();

    if (data.error) {
      setError(data.error);
    } else {
      setWeather(data);
      setBg(getBackground(data.weatherId));
    }
    setLoading(false);
  }

  return (
    <>
      <style>{`
        @keyframes fall {
          to { transform: translateY(110vh); }
        }
        @keyframes snowfall {
          to { transform: translateY(110vh) rotate(360deg); }
        }
        @keyframes rotateSun {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to   { transform: translate(-50%, -50%) rotate(360deg); }
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { overflow-x: hidden; }
      `}</style>

      <div style={{
        minHeight: '100vh',
        background: backgrounds[bg],
        transition: 'background 2s ease',
        padding: '2rem 1rem',
        display: 'flex',
        justifyContent: 'center',
        fontFamily: 'Segoe UI, sans-serif',
        position: 'relative',
        overflow: 'hidden',
      }}>

        {renderParticles(bg)}

        <div style={{ width: '100%', maxWidth: '560px', position: 'relative', zIndex: 1 }}>
          <h1 style={{ color: '#fff', fontSize: '28px', fontWeight: 700, marginBottom: '1.5rem' }}>
            🌤️ Weather App
          </h1>

          <div style={{ display: 'flex', gap: '8px', marginBottom: '1.5rem' }}>
            <input
              value={city}
              onChange={e => setCity(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && getWeather()}
              placeholder="Search city — e.g. Kathmandu"
              style={{
                flex: 1, padding: '14px 18px', border: 'none',
                borderRadius: '14px', fontSize: '15px', outline: 'none',
                background: 'rgba(255,255,255,0.2)', color: '#fff',
              }}
            />
            <button onClick={getWeather} style={{
              padding: '14px 22px', background: 'rgba(255,255,255,0.25)',
              color: '#fff', border: 'none', borderRadius: '14px',
              fontSize: '15px', cursor: 'pointer', fontWeight: 600,
            }}>
              Search
            </button>
          </div>

          {loading && <p style={{ color: 'rgba(255,255,255,0.8)' }}>Fetching weather...</p>}
          {error && <p style={{ color: '#ff7675' }}>⚠️ {error}</p>}

          {weather && (
            <>
              <div style={{
                background: 'rgba(255,255,255,0.15)',
                borderRadius: '24px', padding: '2rem',
                marginBottom: '1rem',
                border: '1px solid rgba(255,255,255,0.25)',
              }}>
                <div style={{ fontSize: '30px', fontWeight: 700, color: '#fff' }}>{weather.name}</div>
                <div style={{ fontSize: '15px', color: 'rgba(255,255,255,0.7)', marginBottom: '1rem' }}>{weather.country}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '64px' }}>{weatherEmoji(weather.weatherId)}</span>
                  <span style={{ fontSize: '64px', fontWeight: 700, color: '#fff' }}>{Math.round(weather.temp)}°C</span>
                </div>
                <div style={{ fontSize: '18px', color: 'rgba(255,255,255,0.8)', textTransform: 'capitalize', marginBottom: '1.5rem' }}>
                  {weather.description}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                  {[
                    { label: '💧 Humidity', value: weather.humidity + '%' },
                    { label: '💨 Wind', value: weather.wind + ' m/s' },
                    { label: '🌡️ Feels like', value: Math.round(weather.feels_like) + '°C' },
                  ].map(stat => (
                    <div key={stat.label} style={{
                      background: 'rgba(255,255,255,0.12)',
                      borderRadius: '14px', padding: '14px',
                      border: '1px solid rgba(255,255,255,0.15)',
                      textAlign: 'center',
                    }}>
                      <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '6px' }}>{stat.label}</div>
                      <div style={{ fontSize: '20px', fontWeight: 700, color: '#fff' }}>{stat.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}