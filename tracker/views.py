# tracker/views.py

from django.http import HttpResponse 
import csv 
from reportlab.lib.pagesizes import letter 
from reportlab.pdfgen import canvas 
from reportlab.lib import colors 
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer 
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle 
from reportlab.lib.units import inch 

from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes 

from datetime import datetime, timedelta
from collections import defaultdict
from decimal import Decimal, InvalidOperation 
import calendar
from django.utils import timezone 

from .models import Transaction, Subscription, Goal, Bill, SmartShoppingReminder, Reminder
from .serializers import (
    TransactionSerializer, SubscriptionSerializer, GoalSerializer, BillSerializer, 
    SmartShoppingReminderSerializer, ReminderSerializer
)


class TransactionList(generics.ListCreateAPIView):
    """
    API view to list all transactions or create a new transaction.
    """
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Transaction.objects.filter(user=self.request.user).order_by('-date')
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class TransactionDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    API view to retrieve, update, or delete a single transaction.
    """
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Transaction.objects.filter(user=self.request.user)


class MonthlySummary(APIView):
    """
    API view to get a monthly summary of income vs. expenses.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = self.request.user
        
        today = datetime.today()
        labels = []
        income_data = []
        expense_data = []

        for i in range(6): 
            target_month_date = today.replace(day=1) 
            for _ in range(i):
                target_month_date = (target_month_date - timedelta(days=1)).replace(day=1)
            
            start_date = target_month_date
            year = target_month_date.year
            month = target_month_date.month
            if month == 12:
                end_date = datetime(year + 1, 1, 1) - timedelta(days=1)
            else:
                end_date = datetime(year, month + 1, 1) - timedelta(days=1)


            monthly_transactions = Transaction.objects.filter(
                user=user,
                date__range=(start_date.date(), end_date.date()) 
            )

            # Use sum with a start value of Decimal(0) to ensure Decimal type for empty results
            monthly_income = sum((t.amount for t in monthly_transactions if t.transaction_type == 'income'), Decimal('0'))
            monthly_expense = sum((t.amount for t in monthly_transactions if t.transaction_type == 'expense'), Decimal('0'))

            labels.insert(0, target_month_date.strftime('%b %Y')) 
            income_data.insert(0, monthly_income)
            expense_data.insert(0, monthly_expense)

        return Response({
            'labels': labels,
            'income': income_data,
            'expense': expense_data
        })


class CategoryAnalysis(APIView):
    """
    API view to get a breakdown of spending by category for the current month.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = self.request.user
        today = datetime.today()
        current_month_start = today.replace(day=1).date() 

        monthly_expenses = Transaction.objects.filter(
            user=user,
            transaction_type='expense',
            date__gte=current_month_start
        )

        category_totals = defaultdict(Decimal)
        for expense in monthly_expenses:
            category_totals[expense.category] += expense.amount 
        
        return Response({k: float(v) for k, v in category_totals.items()})


class SmartInsights(APIView):
    """
    API view for smart financial insights and anomaly detection.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = self.request.user
        today = datetime.today()
        current_month_start = today.replace(day=1).date()
        
        last_month_end = current_month_start - timedelta(days=1)
        last_month_start = last_month_end.replace(day=1) 

        current_month_expenses = sum(
            (t.amount for t in Transaction.objects.filter(
                user=user, transaction_type='expense', date__gte=current_month_start
            )), Decimal('0')
        )
        
        last_month_expenses = sum(
            (t.amount for t in Transaction.objects.filter(
                user=user, transaction_type='expense', date__gte=last_month_start, date__lt=current_month_start
            )), Decimal('0')
        )
        
        saving_tip = "You're on track to meet your goals!"
        if last_month_expenses > Decimal('0') and current_month_expenses > last_month_expenses * Decimal('1.2'):
            saving_tip = "Your spending is increasing! Try to cut back on discretionary expenses this month."
        elif last_month_expenses <= Decimal('0') and current_month_expenses > Decimal('0'):
             saving_tip = "You've started spending this month. Keep an eye on your budget!"


        anomalies = []
        anomalous_transactions = Transaction.objects.filter(
            user=user,
            transaction_type='expense',
            amount__gt=Decimal('200'), 
            date__gte=current_month_start
        ).exclude(category__in=['rent', 'mortgage', 'loan repayment', 'salary']) 

        for t in anomalous_transactions:
            transaction_title = t.title if t.title is not None else "Unknown Expense"
            anomalies.append({
                'id': t.id,
                'title': transaction_title,
                'message': f"Unusually high expense detected: ${t.amount} for {transaction_title} ({t.category})."
            })

        return Response({
            'saving_tip': saving_tip,
            'anomalies': anomalies
        })


class ExpensePrediction(APIView):
    """
    API view to predict next month's total expense based on average historical spending.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = self.request.user
        today = datetime.today()
        
        end_lookback_date = today.replace(day=1).date() 
        start_lookback_date = (end_lookback_date - timedelta(days=90)).replace(day=1) 

        recent_expenses = Transaction.objects.filter(
            user=user,
            transaction_type='expense',
            date__gte=start_lookback_date,
            date__lt=end_lookback_date 
        )

        total_expense = sum((t.amount for t in recent_expenses), Decimal('0')) 
        
        distinct_months = Transaction.objects.filter(
            user=user,
            transaction_type='expense',
            date__gte=start_lookback_date,
            date__lt=end_lookback_date
        ).values('date__year', 'date__month').distinct().count()

        num_months_data = distinct_months if distinct_months > 0 else 1 

        if total_expense == Decimal('0'): 
            prediction = Decimal(0)
        else:
            prediction = total_expense / Decimal(str(num_months_data)) 

        return Response({'prediction': prediction.quantize(Decimal('0.01'))})


class SubscriptionList(generics.ListCreateAPIView):
    """
    API view to list all subscriptions or create a new subscription.
    """
    serializer_class = SubscriptionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Subscription.objects.filter(user=self.request.user).order_by('due_date')
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class GoalList(generics.ListCreateAPIView):
    """
    API view to list all saving goals or create a new goal.
    """
    serializer_class = GoalSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Goal.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class BillList(generics.ListCreateAPIView):
    """
    API view to list all bills or create a new bill.
    """
    serializer_class = BillSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Bill.objects.filter(user=self.request.user).order_by('due_date')
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class SmartShoppingReminderList(generics.ListCreateAPIView):
    """
    API view to list or create smart shopping reminders.
    """
    serializer_class = SmartShoppingReminderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return SmartShoppingReminder.objects.filter(user=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class MissingRecurringExpenses(APIView):
    """
    API view to identify recurring expenses that are missing in the current month.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = self.request.user
        
        today = datetime.today()
        current_month_start = today.replace(day=1).date() 
        
        lookback_window_start = (current_month_start - timedelta(days=90)).replace(day=1) 

        transactions_in_lookback = Transaction.objects.filter(
            user=user,
            transaction_type='expense',
            date__gte=lookback_window_start,
            date__lt=current_month_start 
        ).order_by('category', 'date')

        category_recent_transactions = defaultdict(list)
        for t in transactions_in_lookback:
            category_recent_transactions[t.category].append(t)

        missing_reminders = []
        for category, trans_list in category_recent_transactions.items():
            two_months_ago = (current_month_start - timedelta(days=60)).replace(day=1) 
            recent_occurrences_in_lookback = [t for t in trans_list if t.date >= two_months_ago]

            if len(recent_occurrences_in_lookback) >= 1: 
                last_known_transaction = recent_occurrences_in_lookback[-1]
                
                has_occurred_this_month = Transaction.objects.filter(
                    user=user,
                    transaction_type='expense',
                    category=category,
                    date__gte=current_month_start
                ).exists()

                if not has_occurred_this_month:
                    transaction_title = last_known_transaction.title if last_known_transaction.title is not None else category
                    
                    missing_reminders.append({
                        'id': f"missing-{category}-{last_known_transaction.id}", 
                        'message': (
                            f"It looks like you haven't recorded an expense for "
                            f"**{transaction_title}** ({category}) "
                            f"yet this month. Your last recorded expense for this was "
                            f"${float(last_known_transaction.amount)} on {last_known_transaction.date.strftime('%Y-%m-%d')}."
                        ),
                        'category': category,
                        'title': transaction_title,
                        'amount': float(last_known_transaction.amount) 
                    })
        
        return Response(missing_reminders)


class ReminderList(generics.ListCreateAPIView):
    """
    API view to list all personal reminders or create a new reminder.
    """
    serializer_class = ReminderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Reminder.objects.filter(user=self.request.user, is_completed=False).order_by('due_date')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ReminderDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    API view to retrieve, update, or delete a single reminder.
    """
    serializer_class = ReminderSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Reminder.objects.filter(user=self.request.user)


class SavingReminderSuggestion(APIView):
    """
    API view to generate proactive saving reminders based on goals.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = self.request.user
        goals = Goal.objects.filter(user=user)

        suggestions = []
        for goal in goals:
            try:
                target_amount = Decimal(str(goal.target_amount))
                
                goal_title = getattr(goal, 'title', None)
                if goal_title is None: 
                    goal_title = getattr(goal, 'name', 'Untitled Goal') 

                saved_amount = Decimal(str(getattr(goal, 'saved_amount', Decimal('0.00')))) 
            except InvalidOperation:
                continue 

            if target_amount > saved_amount: 
                remaining_amount = target_amount - saved_amount
                today = datetime.now().date()
                
                goal_end_date = goal.end_date 

                if goal_end_date and goal_end_date > today: 
                    remaining_days = (goal_end_date - today).days
                    if remaining_days > 0:
                        remaining_weeks = Decimal(str(remaining_days)) / Decimal('7') 
                        if remaining_weeks > Decimal('0'): 
                            required_weekly_save = remaining_amount / remaining_weeks
                            
                            suggestions.append({
                                'id': goal.id,
                                'title': goal_title, 
                                'message': (
                                    f"To reach your goal of ${target_amount.quantize(Decimal('0.01'))} "
                                    f"('{goal_title}') by {goal.end_date.strftime('%Y-%m-%d')}, try to save "
                                    f"${required_weekly_save.quantize(Decimal('0.01'))} per week."
                                )
                            })
                        else: 
                            suggestions.append({
                                'id': goal.id,
                                'title': goal_title,
                                'message': (
                                    f"Almost there! You need to save ${remaining_amount.quantize(Decimal('0.01'))} "
                                    f"to reach your goal of '{goal_title}' by {goal.end_date.strftime('%Y-%m-%d')}."
                                )
                            })
                    else: 
                        suggestions.append({
                            'id': goal.id,
                            'title': goal_title,
                            'message': (
                                f"Your goal of ${target_amount.quantize(Decimal('0.01'))} ('{goal_title}') "
                                f"was due on {goal.end_date.strftime('%Y-%m-%d')}. You still need to save "
                                f"${remaining_amount.quantize(Decimal('0.01'))}."
                            )
                        })
                elif goal_end_date: 
                    suggestions.append({
                        'id': goal.id,
                        'title': goal_title,
                        'message': (
                            f"Your goal of ${target_amount.quantize(Decimal('0.01'))} ('{goal_title}') "
                            f"was due on {goal.end_date.strftime('%Y-%m-%d')}. You still need to save "
                            f"${remaining_amount.quantize(Decimal('0.01'))}."
                        )
                    })
        return Response(suggestions)


# --- EXPORT FUNCTIONS ---

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def export_transactions(request):
    """
    Exports user's transactions to a CSV file.
    """
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = f'attachment; filename="transactions_export_{timezone.now().strftime("%Y%m%d_%H%M%S")}.csv"'

    writer = csv.writer(response)
    writer.writerow(['Date', 'Title', 'Amount', 'Type', 'Category']) # CSV Header

    transactions = Transaction.objects.filter(user=request.user).order_by('date') 

    for transaction in transactions:
        writer.writerow([
            transaction.date.strftime("%Y-%m-%d"), 
            transaction.title if transaction.title is not None else "N/A", 
            str(transaction.amount), 
            transaction.transaction_type,
            transaction.category
        ])
    
    return response

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def export_transactions_pdf(request):
    """
    Exports user's transactions to a PDF file.
    """
    response = HttpResponse(content_type='application/pdf')
    response['Content-Disposition'] = f'attachment; filename="transactions_export_{timezone.now().strftime("%Y%m%d_%H%M%S")}.pdf"'

    doc = SimpleDocTemplate(response, pagesize=letter)
    elements = []

    styles = getSampleStyleSheet()
    elements.append(Paragraph(f"Transaction Report for {request.user.username}", 
                              styles['h1'])) 
    elements.append(Paragraph(f"Generated on: {timezone.now().strftime('%Y-%m-%d %H:%M:%S')}", 
                              styles['Normal']))
    elements.append(Spacer(1, 0.2 * inch))

    data = [["Date", "Title", "Amount", "Type", "Category"]] 

    transactions = Transaction.objects.filter(user=request.user).order_by('date')

    for transaction in transactions:
        transaction_title_str = str(transaction.title) if transaction.title is not None else "N/A"
        data.append([
            transaction.date.strftime("%Y-%m-%d"),
            transaction_title_str, 
            f"${transaction.amount.quantize(Decimal('0.01'))}", 
            transaction.transaction_type,
            transaction.category
        ])

    table_style = TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
        ('GRID', (0, 0), (-1, -1), 1, colors.black),
        ('BOX', (0, 0), (-1, -1), 1, colors.black)
    ])

    col_widths = [1.0*inch, 2.5*inch, 0.8*inch, 0.8*inch, 1.0*inch]
    table = Table(data, colWidths=col_widths)
    table.setStyle(table_style)
    elements.append(table)

    doc.build(elements)

    return response