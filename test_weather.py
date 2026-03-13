import unittest
from weather import fetch_weather

class TestRealWeatherAPI(unittest.TestCase):
    
    def test_fetch_weather_valid_city(self):
        city_name = "Delhi"  
        data = fetch_weather(city_name)
        
        print('\n------------------- GET CURRENT WEATHER CONDITIONS ----------------\n')

        if str(data.get("cod")) != "200":
            print(f"Error: {data.get('message', 'Could not fetch weather data.')}\n")
            self.fail(f"Test failed because '{city_name}' did not return a 200 OK status.")
        else:
            print(f'\nCurrent weather for {data["name"]}')
            print(f'\nThe temp is {data["main"]["temp"]}')
            print(f'\nFeels like {data["main"]["feels_like"]} and {data["weather"][0]["description"]}\n')
            
            self.assertEqual(data.get("cod"), 200)
            self.assertEqual(data.get("name"), city_name)
            self.assertIn("main", data)
            self.assertIn("temp", data["main"])
            self.assertIn("weather", data)

    def test_fetch_weather_invalid_city(self):
        data = fetch_weather("FakeCityThatDoesNotExist")
        
        self.assertEqual(str(data.get("cod")), "404")
        self.assertEqual(data.get("message"), "city not found")

if __name__ == '__main__':
    unittest.main()