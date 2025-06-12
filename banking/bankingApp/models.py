from django.db import models
from mongoengine import (
    Document, 
    StringField, 
    EmailField, 
    DecimalField, 
    IntField, 
    ReferenceField, 
    CASCADE
)
from django.contrib.auth.hashers import make_password, check_password

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
    SAVINGS = 'savings'
    CURRENT = 'current'

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