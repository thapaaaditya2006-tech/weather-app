export default async function handler(req, res) {
  const { city } = req.query;
  const API_KEY = process.env.WEATHER_API_KEY;

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );

    if (!response.ok) {
      return res.status(404).json({ error: 'City not found' });
    }

    const data = await response.json();

    res.status(200).json({
      name: data.name,
      country: data.sys.country,
      temp: data.main.temp,
      feels_like: data.main.feels_like,
      humidity: data.main.humidity,
      wind: data.wind.speed,
      description: data.weather[0].description,
      weatherId: data.weather[0].id,
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}   