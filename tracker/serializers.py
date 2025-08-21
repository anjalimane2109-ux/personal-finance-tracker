# tracker/serializers.py
from rest_framework import serializers
from .models import Transaction, Subscription, Goal, Bill, SmartShoppingReminder, Reminder
from django.contrib.auth.models import User
from datetime import datetime, date


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


class TransactionSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.username')

    class Meta:
        model = Transaction
        fields = ['id', 'user', 'title', 'amount', 'transaction_type', 'category', 'date', 'created_at']
        read_only_fields = ['user', 'created_at']

    def validate_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError("Amount must be a positive number.")
        return value

    def validate_transaction_type(self, value):
        if value not in ['income', 'expense']:
            raise serializers.ValidationError("Transaction type must be 'income' or 'expense'.")
        return value

    def validate_date(self, value):
        if isinstance(value, str):
            try:
                return datetime.strptime(value, '%Y-%m-%d').date()
            except ValueError:
                raise serializers.ValidationError("Date has wrong format. Use YYYY-MM-DD.")
        elif isinstance(value, (datetime, date)):
            return value
        raise serializers.ValidationError("Invalid date format.")


class SubscriptionSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.username')

    class Meta:
        model = Subscription
        fields = ['id', 'user', 'title', 'amount', 'category', 'due_date', 'created_at']
        read_only_fields = ['user', 'created_at']

    def validate_due_date(self, value):
        if isinstance(value, str):
            try:
                return datetime.strptime(value, '%Y-%m-%d').date()
            except ValueError:
                raise serializers.ValidationError("Due date has wrong format. Use YYYY-MM-DD.")
        elif isinstance(value, (datetime, date)):
            return value
        raise serializers.ValidationError("Invalid due date format.")


class GoalSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.username')

    class Meta:
        model = Goal
        fields = ['id', 'user', 'name', 'target_amount', 'saved_amount', 'end_date', 'created_at']
        read_only_fields = ['user', 'created_at']

    def validate_end_date(self, value):
        if isinstance(value, str):
            try:
                return datetime.strptime(value, '%Y-%m-%d').date()
            except ValueError:
                raise serializers.ValidationError("End date has wrong format. Use YYYY-MM-DD.")
        elif isinstance(value, (datetime, date)):
            return value
        raise serializers.ValidationError("Invalid end date format.")


class BillSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.username')

    class Meta:
        model = Bill
        fields = ['id', 'user', 'title', 'amount', 'due_date', 'created_at']
        read_only_fields = ['user', 'created_at']

    def validate_due_date(self, value):
        if isinstance(value, str):
            try:
                return datetime.strptime(value, '%Y-%m-%d').date()
            except ValueError:
                raise serializers.ValidationError("Due date has wrong format. Use YYYY-MM-DD.")
        elif isinstance(value, (datetime, date)):
            return value
        raise serializers.ValidationError("Invalid due date format.")


class SmartShoppingReminderSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.username')

    class Meta:
        model = SmartShoppingReminder
        fields = ['id', 'user', 'item', 'suggested_amount', 'created_at']
        read_only_fields = ['user', 'created_at']


class ReminderSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.username')

    class Meta:
        model = Reminder
        fields = ['id', 'user', 'title', 'description', 'due_date', 'is_completed', 'created_at']
        read_only_fields = ['user', 'created_at']

    def validate_due_date(self, value):
        if isinstance(value, str):
            try:
                return datetime.strptime(value, '%Y-%m-%d').date()
            except ValueError:
                raise serializers.ValidationError("Due date has wrong format. Use YYYY-MM-DD.")
        elif isinstance(value, (datetime, date)):
            return value
        raise serializers.ValidationError("Invalid due date format.")
