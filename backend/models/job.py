from db import db
from datetime import datetime

class Job(db.Model):
    __tablename__ = 'jobs'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(120), nullable=False)
    company = db.Column(db.String(120), nullable=True)
    location = db.Column(db.String(120), nullable=True)
    type = db.Column(db.String(50), nullable=True)         
    description = db.Column(db.Text, nullable=True)         
    date_posted = db.Column(db.String(50), nullable=True)
    link = db.Column(db.String(255), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "company": self.company,
            "location": self.location,
            "type": self.type,                       
            "description": self.description,         
            "date_posted": self.date_posted,
            "link": self.link,
            "created_at": self.created_at.isoformat()
        }
