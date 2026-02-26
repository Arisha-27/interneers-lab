from rest_framework.test import APITestCase
from rest_framework import status
from .views import IN_MEMORY_PRODUCTS

class ProductAPITests(APITestCase):
    
    def setUp(self):
        IN_MEMORY_PRODUCTS.clear()
        
        self.base_url = '/api/products/'
        self.valid_payload = {
            "name": "Test Mouse",
            "description": "A wireless testing mouse.",
            "category": "Electronics",
            "brand": "Logi",
            "price": "49.99",
            "quantity": 100
        }

    def test_1_create_product(self):
        response = self.client.post(self.base_url, self.valid_payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(len(IN_MEMORY_PRODUCTS), 1)
        self.assertEqual(response.data['name'], "Test Mouse")
        self.assertIn('id', response.data)

    def test_2_fetch_all_products(self):
        self.client.post(self.base_url, self.valid_payload, format='json')
        
        response = self.client.get(self.base_url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('results', response.data)
        self.assertEqual(len(response.data['results']), 1)

    def test_3_fetch_single_product(self):

        create_response = self.client.post(self.base_url, self.valid_payload, format='json')
        product_id = create_response.data['id']

        url = f"{self.base_url}{product_id}/"
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['id'], product_id)
        self.assertEqual(response.data['name'], "Test Mouse")

    def test_4_update_product(self):
        create_response = self.client.post(self.base_url, self.valid_payload, format='json')
        product_id = create_response.data['id']
        
        updated_payload = self.valid_payload.copy()
        updated_payload['price'] = "35.00"
        updated_payload['quantity'] = 80

        url = f"{self.base_url}{product_id}/"
        response = self.client.put(url, updated_payload, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.assertEqual(str(response.data['price']), "35.00")
        self.assertEqual(str(IN_MEMORY_PRODUCTS[product_id]['price']), "35.00")

    def test_5_delete_product(self):
        create_response = self.client.post(self.base_url, self.valid_payload, format='json')
        product_id = create_response.data['id']

        self.assertEqual(len(IN_MEMORY_PRODUCTS), 1)

        url = f"{self.base_url}{product_id}/"
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(len(IN_MEMORY_PRODUCTS), 0)
    
    def test_6_dynamic_price_check(self):
   
        response = self.client.post(self.base_url, self.valid_payload, format='json')
    
        actual_price = float(self.valid_payload['price'])

        if actual_price < 0:
            print("\n=== VALIDATION ERROR CAUGHT ===")
            print(f"Status Code: {response.status_code}")
            print(f"Error Data: {response.data}")
            print("================================\n")
            
            self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
            self.assertIn('price', response.data['details'])
        else:
            self.assertEqual(response.status_code, status.HTTP_201_CREATED)