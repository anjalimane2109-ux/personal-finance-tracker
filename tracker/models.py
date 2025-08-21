# tracker/models.py
from django.db import models
from django.contrib.auth.models import User
from decimal import Decimal 

class Transaction(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    amount = models.DecimalField(max_digits=10, decimal_places=2) 
    transaction_type = models.CharField(max_length=10, choices=[('income', 'Income'), ('expense', 'Expense')])
    category = models.CharField(max_length=100)
    date = models.DateField() 
    created_at = models.DateTimeField(auto_now_add=True) # Essential for created_at errors

    def __str__(self):
        return f"{self.user.username} - {self.title} ({self.amount})"

class Subscription(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.CharField(max_length=100) 
    due_date = models.DateField() 
    created_at = models.DateTimeField(auto_now_add=True) # Essential for created_at errors

    def __str__(self):
        return f"{self.user.username} - {self.title} (${self.amount}) due {self.due_date}"

class Goal(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=255) # Essential for 'name' field errors
    target_amount = models.DecimalField(max_digits=10, decimal_places=2)
    saved_amount = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00')) 
    end_date = models.DateField(null=True, blank=True) 
    created_at = models.DateTimeField(auto_now_add=True) # Essential for created_at errors

    def __str__(self):
        return f"{self.user.username} - {self.name} (${self.saved_amount}/{self.target_amount})"

class Bill(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    due_date = models.DateField() 
    created_at = models.DateTimeField(auto_now_add=True) # Essential for created_at errors

    def __str__(self):
        return f"{self.user.username} - {self.title} (${self.amount}) due {self.due_date}"

class SmartShoppingReminder(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    item = models.CharField(max_length=255)
    suggested_amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True) # Essential for suggested_amount errors
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - Buy {self.item}"

class Reminder(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    due_date = models.DateField()
    is_completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True) # Essential for created_at errors

    def __str__(self):
        return f"{self.user.username} - {self.title} (Due: {self.due_date})"