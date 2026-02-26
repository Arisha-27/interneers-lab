import requests
from dotenv import load_dotenv
import os

load_dotenv()

def fetch_weather(city):
    
    request_url = f'https://api.openweathermap.org/data/2.5/weather?appid={os.getenv("API_KEY")}&q={city}&units=imperial'
    return requests.get(request_url).json()

def get_current_weather():
    print('\n------------------- GET CURRENT WEATHER CONDITIONS ----------------\n')
    
    city = input("\nEnter City Name :::::::: ")
    
    weather_data = fetch_weather(city)

    if str(weather_data.get("cod")) != "200":
        print(f"\nError: {weather_data.get('message', 'Could not fetch weather data.')}\n")
        return

    print(f'\nCurrent weather for {weather_data["name"]}')
    print(f'\nThe temp is {weather_data["main"]["temp"]}')
    print(f'\nFeels like {weather_data["main"]["feels_like"]} and {weather_data["weather"][0]["description"]}\n')

if __name__ == "__main__":
    get_current_weather()