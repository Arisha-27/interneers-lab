from django.apps import AppConfig


class ProductsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.products'

    def ready(self):
        try:
            from apps.products.seeds.seed_categories import seed_categories
            seed_categories()
        except Exception as e:
            print("Seed error:", e)