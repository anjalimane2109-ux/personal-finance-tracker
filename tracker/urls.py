# tracker/urls.py
from django.urls import path
from .views import (
    TransactionList, TransactionDetail, MonthlySummary, CategoryAnalysis,
    SmartInsights, ExpensePrediction, SubscriptionList, GoalList, BillList,
    SmartShoppingReminderList, MissingRecurringExpenses,
    ReminderList, ReminderDetail, SavingReminderSuggestion,
    export_transactions, # <--- NEW: Import export_transactions view
    export_transactions_pdf, # <--- NEW: Import export_transactions_pdf view
)

urlpatterns = [
    # General endpoints
    path('transactions/', TransactionList.as_view(), name='transaction-list'),
    path('transactions/<int:pk>/', TransactionDetail.as_view(), name='transaction-detail'),
    
    # Insights and analysis
    path('monthly-summary/', MonthlySummary.as_view(), name='monthly-summary'),
    path('category-analysis/', CategoryAnalysis.as_view(), name='category-analysis'),
    path('smart-insights/', SmartInsights.as_view(), name='smart-insights'),
    path('predict-expense/', ExpensePrediction.as_view(), name='predict-expense'),
    
    # Reminders and trackers
    path('subscriptions/', SubscriptionList.as_view(), name='subscription-list'),
    path('goals/', GoalList.as_view(), name='goal-list'),
    path('bills/', BillList.as_view(), name='bill-list'),
    path('smart-shopping-reminders/', SmartShoppingReminderList.as_view(), name='smart-shopping-reminders'),
    path('reminders/', ReminderList.as_view(), name='reminder-list'),
    path('reminders/<int:pk>/', ReminderDetail.as_view(), name='reminder-detail'),
    
    # New feature endpoints
    path('missing-expenses/', MissingRecurringExpenses.as_view(), name='missing-expenses'),
    path('saving-suggestion/', SavingReminderSuggestion.as_view(), name='saving-suggestion'),

    # <--- NEW: Add these two lines for the export functionality ---
    path('export-transactions/', export_transactions, name='export_transactions'),
    path('export-transactions-pdf/', export_transactions_pdf, name='export_transactions_pdf'),
     
]