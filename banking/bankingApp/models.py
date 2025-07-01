from django.db import models
from mongoengine import (
    Document, 
    StringField, 
    EmailField, 
    DecimalField, 
    IntField, 
    ReferenceField, 
    DateField,
    CASCADE
)
from django.contrib.auth.hashers import make_password, check_password
import random


class User(Document):
    username = StringField(required=True, unique=True)
    email = EmailField(required=True, unique=True)
    password = StringField(required=True)
    firstname = StringField(required=True)
    lastname = StringField(required=True)

    #store password hashes
    def set_password(self, raw_password):
        self.password = make_password(raw_password)

    def check_password(self, raw_password):
        return check_password(raw_password, self.password)
    
    @property
    def is_authenticated(self):
        return True

    @property
    def is_anonymous(self):
        return False

class Account(Document):
    SAVINGS = 'Savings'
    CURRENT = 'Current'

    ACCOUNT_TYPES = [CURRENT, SAVINGS]

    user = ReferenceField(User, required=True, reverse_delete_rule=CASCADE)
    account_type = StringField(required=True, choices=ACCOUNT_TYPES)
    balance = DecimalField(max_digits=19, precision=2)
    account_number = IntField(required=True, unique=True)
    sort_code = IntField(required=True)

    meta = {
        'indexes': [
            {
                'fields': ['user', 'account_type'],
                'unique': True
            }
        ]
    }

class Transaction(Document):
    SENDING = "Sending"
    RECEIVING = "Receiving"

    ACTION = [SENDING, RECEIVING]

    user = ReferenceField(Account, required=True)
    account= ReferenceField(Account, required=True)
    action = StringField(required=True, choices=ACTION )
    amount = DecimalField(max_digits=19, precision=2, required=True)
    new_balance = DecimalField(max_digits=19, precision=2, required=True)

class Card(Document):
    user = ReferenceField(User, required=True)
    account = ReferenceField(Account, required=True)
    card_number = StringField(max_length=16, min_length=16, unique=True, required=True)
    cvv = StringField(max_length=3, unique=True, required=True)
    expiry_date = DateField(required=True)
    pin = StringField(max_length=4, required=True)

    def create_card_number(self):
        bin = "423156"
        num = ''.join(str(random.randint(0, 9)) for _ in range(10))
        self.card_number = bin + num