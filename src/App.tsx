import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { css } from '@emotion/css'

function App() {
  const [weatherData, setWeatherData] = useState<WheaterData>()
  const [plz, setPlz] = useState(6003)
  const [search, setSearch] = useState(false)
  const [errorMessage, setErrorMessage] = useState()

  useEffect(() => {
    axios
      .get<WheaterData>(
        `https://api.openweathermap.org/data/2.5/weather?zip=${plz},ch&units=metric&appid=cda2a17e18a88d1ffceb8aeff99c405d`
      )
      .then((response) => {
        setWeatherData(response.data)
      })
      .catch((err) => {
        setErrorMessage(err.message)
      })
  }, [search])

  const correctPlzLength = plz.toString().length === 4

  return !errorMessage ? (
    <div
      className={css({
        textAlign: 'center',
        color: 'white',
        fontSize: '18px',
      })}
    >
      <Header />
      <div
        className={css({
          padding: '35px',
          background: '#6C5B7B',
        })}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault()
            setSearch(!search)
          }}
        >
          <p>Bitte gültige Schweizer Postleitzahl eingeben:</p>
          <input
            type="number"
            value={plz}
            onChange={(ev: React.ChangeEvent<HTMLInputElement>): void => {
              setPlz(parseInt(ev.target.value, 10))
            }}
            placeholder="Postleitzahl"
          />
          {correctPlzLength ? (
            <button type="submit">Suchen</button>
          ) : (
            <p
              className={css({
                fontSize: '14px',
                color: '#ff4040',
              })}
            >
              Postleitzahl ist zu kurz oder zu lang
            </p>
          )}
        </form>
      </div>
      <div
        className={css({
          padding: '35px',
          background: '#C06C84',
        })}
      >
        {weatherData ? (
          <>
            {' '}
            <h2>{weatherData.name} </h2>
            <p>Temperatur: {Math.round(weatherData.main.temp)} °C</p>
            <p>Luftdruck: {weatherData.main.pressure} hPa</p>
            <p>Luftfeuchtigkeit: {weatherData.main.humidity} %</p>
            <p>
              Sonnenaufgang: {timeStampToLocalTime(weatherData.sys.sunrise)}
            </p>
            <p>
              Sonnenuntergang: {timeStampToLocalTime(weatherData.sys.sunset)}
            </p>
          </>
        ) : (
          <p>Keine Daten, Bitte versuchen Sie es später erneut</p>
        )}
      </div>
    </div>
  ) : (
    <>
      <div
        className={css({
          padding: '60px',
          textAlign: 'center',
          background: '#FF0000',
          color: 'white',
          fontSize: '18px',
        })}
      >
        <p>Fehler: {errorMessage}</p>
      </div>
    </>
  )
}

export default App

function timeStampToLocalTime(timeStamp: number) {
  return new Date(timeStamp * 1000).toLocaleTimeString([], {
    timeStyle: 'short',
  })
}

function Header() {
  return (
    <div
      className={css({
        padding: '25px',
        background: '#355C7D',
      })}
    >
      <h1>Herzlich Willkommen</h1>
      <p>Wir präsentieren die Wetterdaten der Schweiz</p>
    </div>
  )
}

interface WheaterData {
  coord: {
    lon: number
    lat: number
  }
  main: {
    temp: number
    feels_like: number
    temp_min: number
    temp_max: number
    pressure: number
    humidity: number
  }

  base: string
  visibility: number
  wind: {
    speed: number
    deg: number
    gust: number
  }
  clouds: {
    all: number
  }
  dt: number
  sys: {
    type: number
    id: number
    country: string
    sunrise: number
    sunset: number
  }
  timezone: number
  id: number
  name: string
  cod: number
}
