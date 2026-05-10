from flask import Blueprint, jsonify, request
from sqlalchemy import or_
from db import db
from models.job import Job
from scraper.scraper import scrape_jobs  # enable scraper import

job_bp = Blueprint("job_bp", __name__)

# Get all jobs (with optional filters)
@job_bp.route("/", methods=["GET"])
def get_jobs():
    keyword = request.args.get("keyword", "")
    job_type = request.args.get("type", "")
    location = request.args.get("location", "")
    tags = request.args.get("tags", "")

    query = Job.query

    if keyword:
        query = query.filter(
            (Job.title.ilike(f"%{keyword}%")) | (Job.company.ilike(f"%{keyword}%"))
        )

    # Skip "All"
    if job_type and job_type.lower() != "all":
        query = query.filter(Job.type.ilike(f"%{job_type}%"))

    if location and location.lower() != "all":
        query = query.filter(Job.location.ilike(f"%{location}%"))

    if tags:
        tag_list = tags.split(",")
        query = query.filter(or_(*[Job.description.ilike(f"%{t}%") for t in tag_list]))

    jobs = query.order_by(Job.id.desc()).all()
    return jsonify([job.to_dict() for job in jobs])



# Add new job manually
@job_bp.route("/", methods=["POST"])
def add_job():
    data = request.get_json()
    new_job = Job(
        title=data.get("title"),
        company=data.get("company"),
        location=data.get("location"),
        date_posted=data.get("date_posted"),
        link=data.get("link"),
        description=data.get("description"),
        type=data.get("type")
    )
    db.session.add(new_job)
    db.session.commit()
    return jsonify(new_job.to_dict()), 201


# Update job
@job_bp.route("/<int:id>", methods=["PUT"])
def update_job(id):
    job = Job.query.get(id)
    if not job:
        return jsonify({"error": "Job not found"}), 404

    data = request.get_json()
    job.title = data.get("title", job.title)
    job.company = data.get("company", job.company)
    job.location = data.get("location", job.location)
    job.date_posted = data.get("date_posted", job.date_posted)
    job.link = data.get("link", job.link)
    job.description = data.get("description", job.description)
    job.type = data.get("type", job.type)

    db.session.commit()
    return jsonify(job.to_dict())


# Delete job
@job_bp.route("/<int:id>", methods=["DELETE"])
def delete_job(id):
    job = Job.query.get(id)
    if not job:
        return jsonify({"error": "Job not found"}), 404

    db.session.delete(job)
    db.session.commit()
    return jsonify({"message": "Job deleted successfully"})


# Scrape & save jobs automatically
@job_bp.route("/scrape", methods=["GET"])
def scrape_and_save_jobs():
    scraped_jobs = scrape_jobs()
    print('scraped_jobs count:', len(scraped_jobs))

    saved_count = 0
    for job_data in scraped_jobs:
        # Avoid duplicates based on unique link
        existing = Job.query.filter_by(link=job_data["link"]).first()
        if not existing:
            job = Job(**job_data)
            db.session.add(job)
            saved_count += 1

    db.session.commit()
    return jsonify({"message": f"{saved_count} new jobs scraped and saved successfully."})

