from django.db import models
from django.core.validators import MinValueValidator
from decimal import Decimal

class Product(models.Model):
    name = models.CharField(
        max_length=255, 
        db_index=True, 
        help_text="The official name of the product."
    )
    description = models.TextField(
        blank=True, 
        help_text="Detailed description of the product."
    )
    category = models.CharField(
        max_length=100, 
        db_index=True, 
        help_text="Product category (e.g., Electronics, Apparel)."
    )
    brand = models.CharField(
        max_length=100, 
        help_text="The manufacturer or brand of the product."
    )
    price = models.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        validators=[MinValueValidator(Decimal('0.00'))],
        help_text="Price of the product in USD."
    )
    quantity = models.PositiveIntegerField(
        default=0, 
        help_text="Current quantity available in the warehouse."
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Product'
        verbose_name_plural = 'Products'

    def __str__(self):
        return f"{self.name} ({self.brand}) - ${self.price}"