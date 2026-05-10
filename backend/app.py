from flask import Flask
from flask_cors import CORS
from config import Config
from db import db
from routes.job_routes import job_bp
import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__))))


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    CORS(app)

    app.register_blueprint(job_bp, url_prefix="/api/jobs")

    with app.app_context():
        db.create_all()

    return app


if __name__ == "__main__":
    app = create_app()
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)
